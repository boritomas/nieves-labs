import { createHash, randomUUID } from 'crypto';

export type AtlasParsedTransaction = {
  postedDate: string;
  description: string;
  amount: number;
  category: 'likely_business' | 'likely_personal' | 'transfer' | 'founder_contribution' | 'revenue' | 'refund' | 'loan_proceeds' | 'unknown' | 'requires_founder_review';
  confidence: number;
  flags: string[];
};

export type AtlasParsedStatement = {
  statementStartDate: string | null;
  statementEndDate: string | null;
  beginningBalance: number | null;
  endingBalance: number | null;
  totalDeposits: number;
  totalWithdrawals: number;
  fees: number;
  transfers: number;
  recurringExpenses: string[];
  founderContributions: number;
  potentialRevenue: number;
  potentialPersonalExpenses: number;
  transactions: AtlasParsedTransaction[];
};

type CsvRow = Record<string, string>;

export function parseAtlasStatement(filename: string, buffer: Buffer): AtlasParsedStatement {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  const text = buffer.toString('utf8');
  const transactions = extension === 'ofx' || extension === 'qfx'
    ? parseOfxTransactions(text)
    : parseCsvTransactions(text);
  return summarizeTransactions(transactions);
}

export function statementContentHash(buffer: Buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function parseCsvTransactions(text: string): AtlasParsedTransaction[] {
  const rows = parseCsv(text);
  return rows.map((row) => {
    const lower = Object.fromEntries(Object.entries(row).map(([key, value]) => [normalizeKey(key), value]));
    const date = lower.date || lower.posteddate || lower.transactiondate || lower.processeddate || lower.postingdate || '';
    const description = lower.description || lower.memo || lower.name || lower.payee || lower.details || 'Unlabeled transaction';
    const amount = toNumber(lower.amount || lower.netamount || lower.transactionamount || '');
    const debit = toNumber(lower.debit || lower.withdrawal || lower.withdrawals || lower.outflow || '');
    const credit = toNumber(lower.credit || lower.deposit || lower.deposits || lower.inflow || '');
    const signedAmount = amount || credit || (debit ? -Math.abs(debit) : 0);
    return classifyTransaction({
      postedDate: normalizeDate(date),
      description: description.trim(),
      amount: signedAmount,
    });
  }).filter((transaction) => transaction.postedDate || transaction.amount || transaction.description !== 'Unlabeled transaction');
}

function parseOfxTransactions(text: string): AtlasParsedTransaction[] {
  const blocks = Array.from(text.matchAll(/<STMTTRN>([\s\S]*?)(?=<STMTTRN>|<\/BANKTRANLIST>|$)/gi)).map((match) => match[1]);
  return blocks.map((block) => {
    const postedDate = block.match(/<DTPOSTED>([^<\r\n]+)/i)?.[1] || '';
    const amount = block.match(/<TRNAMT>([^<\r\n]+)/i)?.[1] || '';
    const name = block.match(/<NAME>([^<\r\n]+)/i)?.[1] || '';
    const memo = block.match(/<MEMO>([^<\r\n]+)/i)?.[1] || '';
    return classifyTransaction({
      postedDate: normalizeDate(postedDate.slice(0, 8)),
      description: `${name} ${memo}`.trim() || 'OFX transaction',
      amount: toNumber(amount),
    });
  });
}

function summarizeTransactions(transactions: AtlasParsedTransaction[]): AtlasParsedStatement {
  const sortedDates = transactions.map((transaction) => transaction.postedDate).filter(Boolean).sort();
  const deposits = transactions.filter((transaction) => transaction.amount > 0);
  const withdrawals = transactions.filter((transaction) => transaction.amount < 0);
  const fees = withdrawals
    .filter((transaction) => /fee|service charge|maintenance/i.test(transaction.description))
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const transfers = transactions
    .filter((transaction) => transaction.category === 'transfer')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const founderContributions = deposits
    .filter((transaction) => transaction.category === 'founder_contribution')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const potentialRevenue = deposits
    .filter((transaction) => transaction.category === 'revenue')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const potentialPersonalExpenses = withdrawals
    .filter((transaction) => transaction.category === 'likely_personal' || transaction.category === 'requires_founder_review')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  return {
    statementStartDate: sortedDates[0] || null,
    statementEndDate: sortedDates[sortedDates.length - 1] || null,
    beginningBalance: null,
    endingBalance: null,
    totalDeposits: roundMoney(deposits.reduce((sum, transaction) => sum + transaction.amount, 0)),
    totalWithdrawals: roundMoney(withdrawals.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)),
    fees: roundMoney(fees),
    transfers: roundMoney(transfers),
    recurringExpenses: inferRecurringExpenses(transactions),
    founderContributions: roundMoney(founderContributions),
    potentialRevenue: roundMoney(potentialRevenue),
    potentialPersonalExpenses: roundMoney(potentialPersonalExpenses),
    transactions,
  };
}

function classifyTransaction(input: Pick<AtlasParsedTransaction, 'postedDate' | 'description' | 'amount'>): AtlasParsedTransaction {
  const description = input.description.toLowerCase();
  const flags: string[] = [];
  let category: AtlasParsedTransaction['category'] = 'unknown';
  let confidence = 55;

  if (/transfer|xfer|ach.*transfer|online transfer/i.test(description)) {
    category = 'transfer';
    confidence = 78;
  } else if (/owner|founder|capital contribution|member contribution|tomas/i.test(description) && input.amount > 0) {
    category = 'founder_contribution';
    confidence = 80;
  } else if (/stripe|customer|invoice|payment|deposit|merchant|sales/i.test(description) && input.amount > 0) {
    category = 'revenue';
    confidence = 76;
  } else if (/refund|reversal/i.test(description)) {
    category = 'refund';
    confidence = 72;
  } else if (/loan|sba|cdfi|proceeds/i.test(description) && input.amount > 0) {
    category = 'loan_proceeds';
    confidence = 80;
  } else if (/aws|vercel|openai|google|supabase|github|domain|legal|insurance|software|cloud|api/i.test(description)) {
    category = 'likely_business';
    confidence = 72;
  } else if (/grocery|restaurant|atm|cash app|zelle|personal|entertainment|gas station/i.test(description)) {
    category = 'likely_personal';
    confidence = 70;
    flags.push('Potential personal spending from business account.');
  } else if (Math.abs(input.amount) >= 1000) {
    category = 'requires_founder_review';
    confidence = 50;
    flags.push('Large or ambiguous transaction requires founder review.');
  } else {
    category = 'requires_founder_review';
    flags.push('Transaction category requires founder confirmation.');
  }

  if (!input.postedDate) flags.push('Missing transaction date.');
  if (!input.amount) flags.push('Missing or zero transaction amount.');

  return {
    id: randomUUID(),
    postedDate: input.postedDate,
    description: input.description.slice(0, 240),
    amount: roundMoney(input.amount),
    category,
    confidence,
    flags,
  } as AtlasParsedTransaction & { id: string };
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

function splitCsvLine(line: string) {
  const values: string[] = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function inferRecurringExpenses(transactions: AtlasParsedTransaction[]) {
  const counts = new Map<string, number>();
  for (const transaction of transactions.filter((item) => item.amount < 0)) {
    const key = transaction.description.toLowerCase().replace(/\d+/g, '').replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim().slice(0, 42);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([name]) => name)
    .slice(0, 12);
}

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeDate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{8}$/.test(trimmed)) return `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`;
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
}

function toNumber(value: string) {
  if (!value) return 0;
  const normalized = value.replace(/[$,\s]/g, '').replace(/^\((.*)\)$/, '-$1');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
