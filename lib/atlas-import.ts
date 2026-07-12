import { createHash, randomUUID } from 'crypto';
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';
import { inflateRawSync } from 'zlib';
import {
  type AtlasData,
  type AtlasEvidenceGap,
  type AtlasExtractedSection,
  type AtlasFieldConflict,
  type AtlasFounderReviewItem,
  type AtlasImportedField,
  type AtlasImportedFieldClassification,
  type AtlasImportError,
  type AtlasImportRun,
  type AtlasImportState,
  type AtlasSourceDocument,
  type AtlasSourceDocumentClassification,
  type AtlasStalenessFlag,
} from './atlas';
import { emptyAtlasImportState } from './atlas-store';

type ImportMode = 'scan' | 'preview' | 'import';

const supportedExtensions = new Set(['.docx', '.pdf', '.xlsx', '.csv', '.md', '.txt', '.json']);
const excludedDirs = new Set(['.git', '.next', 'node_modules', '.vercel', 'coverage']);
const excludedRuntimeFiles = new Set(['atlas.json', 'orders.json']);
const deniedPathTerms = ['employer', 'bank-statement-private', 'tax-return-private', 'ssn', 'social-security', 'identification', 'driver-license'];
const relevantTerms = [
  'atlas',
  'capital',
  'funding',
  'sba',
  'cdfi',
  'loan',
  'lender',
  'business plan',
  'financial model',
  'cash flow',
  'revenue',
  'nieves',
  'use of funds',
  'chapter 7',
  'repayment',
  'due diligence',
  'market research',
  'competitive analysis',
];

export async function runAtlasImport(data: AtlasData, mode: ImportMode): Promise<AtlasImportState> {
  const startedAt = new Date().toISOString();
  const errors: AtlasImportError[] = [];
  const sourceDocuments = await discoverAtlasSourceDocuments(errors);
  const importedSources = sourceDocuments.filter((document) => ['discovered', 'imported'].includes(document.status) && document.classification !== 'Unrelated');
  const extractedSections: AtlasExtractedSection[] = [];

  if (mode !== 'scan') {
    for (const document of importedSources.slice(0, 80)) {
      try {
        const text = await extractDocumentText(document.path, document.fileType);
        extractedSections.push(...extractSections(document, text));
      } catch (error) {
        errors.push({
          id: randomUUID(),
          path: document.path,
          message: error instanceof Error ? error.message : 'Unable to parse document',
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  const importedFields = mode === 'scan' ? [] : mapFieldsFromSections(data, extractedSections, sourceDocuments);
  const fieldConflicts = findConflicts(data, importedFields);
  const stalenessFlags = findStalenessFlags(importedFields);
  const evidenceGaps = buildEvidenceGaps(data, importedFields, fieldConflicts);
  const founderReviewQueue = buildReviewQueue(importedFields, fieldConflicts);
  const completedAt = new Date().toISOString();
  const importedCount = mode === 'import' ? importedSources.length : 0;
  const run: AtlasImportRun = {
    id: randomUUID(),
    startedAt,
    completedAt,
    mode,
    discoveredCount: sourceDocuments.length,
    importedCount,
    skippedCount: sourceDocuments.filter((document) => document.status === 'skipped').length,
    duplicateCount: sourceDocuments.filter((document) => document.status === 'duplicate').length,
    errorCount: errors.length,
    fieldsPopulated: importedFields.filter((field) => !field.sensitive && field.conflictStatus === 'none').length,
    conflictsFound: fieldConflicts.length,
    evidenceGapsFound: evidenceGaps.length,
  };

  return {
    ...emptyAtlasImportState,
    sourceDocuments: sourceDocuments.map((document) => ({
      ...document,
      status: mode === 'import' && document.status === 'discovered' ? 'imported' : document.status,
    })),
    extractedSections,
    importedFields: importedFields.map((field) => ({
      ...field,
      conflictStatus: fieldConflicts.some((conflict) => conflict.fieldPath === field.fieldPath)
        ? 'conflict'
        : field.conflictStatus,
    })),
    fieldConflicts,
    fieldVersions: data.importState.fieldVersions || [],
    importRuns: [run, ...(data.importState.importRuns || [])].slice(0, 25),
    importErrors: errors,
    founderReviewQueue,
    stalenessFlags,
    evidenceGaps,
    lastScanAt: completedAt,
    lastImportAt: mode === 'import' ? completedAt : data.importState.lastImportAt || '',
  };
}

async function discoverAtlasSourceDocuments(errors: AtlasImportError[]) {
  const cwd = process.cwd();
  const roots = [
    path.join(cwd, 'docs'),
    path.join(cwd, 'outputs'),
    path.join(cwd, 'seed_assets'),
    path.join(cwd, 'public'),
    path.join(cwd, 'data'),
    path.join(cwd, '.data'),
    path.join(cwd, 'work'),
    path.resolve(cwd, '..', '..', 'outputs'),
  ];
  const files: string[] = [];

  for (const root of roots) {
    await collectFiles(root, files, errors);
  }

  const seenPaths = new Set<string>();
  const seenHashes = new Map<string, string>();
  const documents: AtlasSourceDocument[] = [];
  for (const filePath of files.sort()) {
    if (seenPaths.has(filePath)) continue;
    seenPaths.add(filePath);
    const extension = path.extname(filePath).toLowerCase();
    if (!supportedExtensions.has(extension)) continue;

    try {
      const stats = await stat(filePath);
      if (stats.size > 20 * 1024 * 1024) {
        documents.push(sourceDocument(filePath, extension, stats, 'Unknown', 0, 'skipped', 'File exceeds 20MB import safety limit.'));
        continue;
      }
      const buffer = await readFile(filePath);
      const hash = createHash('sha256').update(buffer).digest('hex');
      const duplicateOf = seenHashes.get(hash);
      const textHint = ['.md', '.txt', '.json', '.csv'].includes(extension) ? buffer.toString('utf8', 0, Math.min(buffer.length, 12000)) : '';
      const classification = classifyDocument(filePath, textHint);
      const relevanceScore = scoreRelevance(filePath, textHint, classification);
      const denied = deniedPathTerms.some((term) => filePath.toLowerCase().includes(term));
      const status: AtlasSourceDocument['status'] = denied || classification === 'Unrelated' ? 'skipped' : duplicateOf ? 'duplicate' : 'discovered';
      if (!duplicateOf) seenHashes.set(hash, filePath);
      documents.push({
        ...sourceDocument(filePath, extension, stats, classification, relevanceScore, status, denied ? 'Path contains a protected or unrelated sensitive term.' : classification === 'Unrelated' ? 'No Atlas funding relevance detected.' : undefined),
        contentHash: hash,
        duplicateOf,
      });
    } catch (error) {
      errors.push({
        id: randomUUID(),
        path: filePath,
        message: error instanceof Error ? error.message : 'Unable to inspect file',
        createdAt: new Date().toISOString(),
      });
    }
  }

  return documents;
}

async function collectFiles(root: string, files: string[], errors: AtlasImportError[], depth = 0) {
  if (depth > 6) return;
  try {
    const entries = await readdir(root, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(root, entry.name);
      if (entry.isDirectory()) {
        if (excludedDirs.has(entry.name) || deniedPathTerms.some((term) => fullPath.toLowerCase().includes(term))) continue;
        await collectFiles(fullPath, files, errors, depth + 1);
      } else if (entry.isFile()) {
        if (excludedRuntimeFiles.has(entry.name)) continue;
        files.push(fullPath);
      }
    }
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
    if (depth === 0 && code !== 'ENOENT') {
      errors.push({
        id: randomUUID(),
        path: root,
        message: error instanceof Error ? error.message : 'Unable to read import root',
        createdAt: new Date().toISOString(),
      });
    }
  }
}

function sourceDocument(filePath: string, extension: string, stats: { mtime: Date; size: number }, classification: AtlasSourceDocumentClassification, relevanceScore: number, status: AtlasSourceDocument['status'], skipReason?: string): AtlasSourceDocument {
  return {
    id: createHash('sha1').update(filePath).digest('hex').slice(0, 16),
    path: filePath,
    filename: path.basename(filePath),
    fileType: extension.replace('.', ''),
    modifiedAt: stats.mtime.toISOString(),
    contentHash: '',
    size: stats.size,
    classification,
    relevanceScore,
    status,
    skipReason,
  };
}

function classifyDocument(filePath: string, text: string): AtlasSourceDocumentClassification {
  const haystack = `${filePath} ${text}`.toLowerCase();
  if (!relevantTerms.some((term) => haystack.includes(term))) return 'Unrelated';
  if (haystack.includes('chapter 7') || haystack.includes('bankruptcy')) return 'Risk assessment';
  if (haystack.includes('financial model') || haystack.includes('mrr') || haystack.includes('cash flow')) return 'Financial model';
  if (haystack.includes('loan') || haystack.includes('sba') || haystack.includes('cdfi') || haystack.includes('lender')) return 'Loan package';
  if (haystack.includes('use of funds')) return 'Loan package';
  if (haystack.includes('market research')) return 'Market research';
  if (haystack.includes('competitive')) return 'Competitive analysis';
  if (haystack.includes('founder')) return 'Founder profile';
  if (haystack.includes('business plan') || haystack.includes('executive summary')) return 'Business plan';
  if (haystack.includes('nieves')) return 'Company profile';
  return 'Unknown';
}

function scoreRelevance(filePath: string, text: string, classification: AtlasSourceDocumentClassification) {
  if (classification === 'Unrelated') return 0;
  const haystack = `${filePath} ${text}`.toLowerCase();
  const hits = relevantTerms.filter((term) => haystack.includes(term)).length;
  return Math.min(100, 35 + hits * 7);
}

async function extractDocumentText(filePath: string, fileType: string) {
  const buffer = await readFile(filePath);
  if (['md', 'txt', 'json', 'csv'].includes(fileType)) return buffer.toString('utf8').slice(0, 180000);
  if (fileType === 'docx') return extractDocxText(buffer).slice(0, 180000);
  if (fileType === 'xlsx') return extractXlsxText(buffer).slice(0, 180000);
  if (fileType === 'pdf') return extractPdfText(buffer).slice(0, 120000);
  return '';
}

function extractDocxText(buffer: Buffer) {
  const entries = readZipEntries(buffer);
  const documentXml = entries.get('word/document.xml') || '';
  return xmlToText(documentXml);
}

function extractXlsxText(buffer: Buffer) {
  const entries = readZipEntries(buffer);
  const sharedStrings = parseSharedStrings(entries.get('xl/sharedStrings.xml') || '');
  const sheets = Array.from(entries.entries())
    .filter(([name]) => name.startsWith('xl/worksheets/sheet') && name.endsWith('.xml'))
    .map(([name, xml]) => `## ${name}\n${worksheetToText(xml, sharedStrings)}`);
  return sheets.join('\n\n');
}

function extractPdfText(buffer: Buffer) {
  return buffer
    .toString('latin1')
    .replace(/\\[rn]/g, ' ')
    .replace(/[^\x20-\x7E\n]+/g, ' ')
    .replace(/\s+/g, ' ');
}

function readZipEntries(buffer: Buffer) {
  const entries = new Map<string, string>();
  let offset = 0;
  while (offset < buffer.length - 30) {
    if (buffer.readUInt32LE(offset) !== 0x04034b50) {
      offset += 1;
      continue;
    }
    const compression = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const filenameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const filename = buffer.toString('utf8', offset + 30, offset + 30 + filenameLength);
    const dataStart = offset + 30 + filenameLength + extraLength;
    const dataEnd = dataStart + compressedSize;
    if (compressedSize <= 0 || dataEnd > buffer.length) {
      offset += 30 + filenameLength + extraLength;
      continue;
    }
    const compressed = buffer.subarray(dataStart, dataEnd);
    let content: Buffer;
    if (compression === 0) content = compressed;
    else if (compression === 8) content = inflateRawSync(compressed);
    else {
      offset = dataEnd;
      continue;
    }
    entries.set(filename, content.toString('utf8'));
    offset = dataEnd;
  }
  return entries;
}

function parseSharedStrings(xml: string) {
  return Array.from(xml.matchAll(/<si[^>]*>([\s\S]*?)<\/si>/g)).map((match) => xmlToText(match[1]));
}

function worksheetToText(xml: string, sharedStrings: string[]) {
  const rows = Array.from(xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)).map((rowMatch) => {
    const cells = Array.from(rowMatch[1].matchAll(/<c([^>]*)>([\s\S]*?)<\/c>/g)).map((cellMatch) => {
      const attrs = cellMatch[1];
      const body = cellMatch[2];
      const formula = body.match(/<f[^>]*>([\s\S]*?)<\/f>/)?.[1];
      const rawValue = body.match(/<v[^>]*>([\s\S]*?)<\/v>/)?.[1] || '';
      const value = attrs.includes(' t="s"') ? sharedStrings[Number(rawValue)] || rawValue : rawValue;
      return formula ? `${xmlToText(value)} (formula: ${xmlToText(formula)})` : xmlToText(value);
    }).filter(Boolean);
    return cells.join(' | ');
  });
  return rows.filter(Boolean).join('\n');
}

function xmlToText(xml: string) {
  return xml
    .replace(/<\/(w:p|p|row|tr)>/g, '\n')
    .replace(/<\/(w:tc|c|td)>/g, ' | ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function extractSections(document: AtlasSourceDocument, text: string) {
  const clean = text.replace(/\r/g, '').trim();
  if (!clean) return [];
  const chunks = clean.split(/\n(?=#{1,4}\s|[A-Z][A-Z0-9 /&-]{6,}$)/).slice(0, 60);
  return chunks.map((chunk, index): AtlasExtractedSection => {
    const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean);
    const first = lines[0] || document.filename;
    const heading = first.replace(/^#{1,4}\s*/, '').slice(0, 120);
    return {
      id: `${document.id}-${index}`,
      documentId: document.id,
      heading,
      text: lines.join('\n').slice(0, 9000),
      sourceSection: `${document.filename} :: ${heading}`,
      confidence: Math.min(95, document.relevanceScore + 5),
    };
  });
}

function mapFieldsFromSections(data: AtlasData, sections: AtlasExtractedSection[], sourceDocuments: AtlasSourceDocument[]) {
  const fields: AtlasImportedField[] = [];
  const joined = sections.map((section) => section.text).join('\n\n');
  const sourceByText = (needle: string) => sections.find((section) => section.text.toLowerCase().includes(needle.toLowerCase())) || sections[0];
  const add = (
    fieldPath: string,
    label: string,
    value: string | number | string[],
    needle: string,
    classification: AtlasImportedFieldClassification,
    confidence = 78,
    sensitive = false,
  ) => {
    const section = sourceByText(needle);
    if (!section) return;
    const sourceDocument = sourceDocuments.find((document) => document.id === section.documentId);
    fields.push({
      id: randomUUID(),
      fieldPath,
      label,
      sourceDocumentId: section.documentId,
      sourceFilename: sourceDocument?.filename || 'Imported source',
      sourcePath: sourceDocument?.path || '',
      sourceDocumentType: sourceDocument?.fileType || '',
      sourceSection: section.sourceSection,
      importTimestamp: new Date().toISOString(),
      originalValue: Array.isArray(value) ? value.join(', ') : String(value),
      normalizedValue: value,
      classification,
      confidence,
      verificationStatus: sensitive ? 'deferred' : 'pending_review',
      founderApproved: false,
      conflictStatus: sensitive ? 'sensitive_excluded' : 'none',
      sensitive,
    });
  };

  if (/nieves labs/i.test(joined)) add('companyProfile.companyName', 'Company name', 'Nieves Labs', 'Nieves Labs', 'Verified document value', 92);
  else if (/nieves ai/i.test(joined)) add('companyProfile.companyName', 'Company name', 'Nieves AI', 'Nieves AI', 'Requires verification', 62);
  if (/nieves ai platform/i.test(joined)) add('companyProfile.productName', 'Product name', 'Nieves AI Platform', 'Nieves AI Platform', 'Verified document value', 88);
  if (/pre-launch|near-launch/i.test(joined)) {
    add('companyProfile.businessStage', 'Business stage', 'pre-launch / near-launch', 'near-launch', 'Planning assumption', 82);
    add('companyProfile.revenueStage', 'Revenue stage', 'pre-launch / near-launch', 'near-launch', 'Planning assumption', 82);
  }
  if (/\$25,?000/i.test(joined)) add('companyProfile.fundingTargetMin', 'Minimum funding target', 25000, '$25,000', 'Planning assumption', 84);
  if (/\$50,?000/i.test(joined)) {
    add('companyProfile.fundingTargetMax', 'Maximum funding target', 50000, '$50,000', 'Planning assumption', 84);
    add('financialAssumptions.loanAmount', 'Modeled loan amount', 50000, '$50,000', 'Planning assumption', 72);
  }
  if (/sba microloan|cdfi/i.test(joined)) add('companyProfile.preferredFundingTypes', 'Preferred funding types', ['SBA Microloan', 'CDFI'], 'SBA', 'Verified document value', 86);
  if (/\$1,?500.*\$5,?000|\$5,?000.*90/i.test(joined)) {
    add('companyProfile.firstNinetyDayMrrEstimate', 'First 90-day MRR estimate', '$1,500 to $5,000', '$1,500', 'Planning assumption', 82);
    add('financialAssumptions.startingMrr', 'Starting MRR', 2500, '$1,500', 'Planning assumption', 70);
  }
  if (/\$10,?000.*\$20,?000/i.test(joined)) add('companyProfile.sixMonthMrrTarget', 'Six-month MRR target', '$10,000 to $20,000', '$10,000', 'Planning assumption', 82);
  if (/\$20,?000.*\$50,?000|12-month/i.test(joined)) add('companyProfile.revenueAssumptions', 'Revenue assumptions', 'Planning assumptions include first 90-day MRR of $1,500 to $5,000, a six-month target of $10,000 to $20,000, and a 12-month planning range of $20,000 to $50,000+ as products mature.', '12-month', 'Planning assumption', 78);
  if (/subscription price|implementation|setup packages/i.test(joined)) add('financialAssumptions.averageSubscriptionPrice', 'Average subscription price', 49, 'subscription', 'Planning assumption', 62);
  if (/production readiness|app store|cloud|api|marketing|legal|contractor|working capital/i.test(joined)) {
    add('companyProfile.primaryUseOfFunds', 'Primary use of funds', ['Production readiness', 'App Store launch', 'Cloud/API costs', 'Marketing', 'Legal/admin', 'Contractor support', 'Working capital'], 'production readiness', 'Verified document value', 86);
  }
  if (/recurring|repayment/i.test(joined)) add('companyProfile.repaymentStrategy', 'Repayment strategy', 'Repayment is planned from recurring SaaS/productized-service revenue, conservative burn control, disciplined fund use, and founder oversight through Atlas.', 'repayment', 'AI-derived summary', 74);
  if (/chapter 7|bankruptcy/i.test(joined)) {
    add('companyProfile.chapterSevenExplanation', 'Chapter 7 explanation', 'A recent Chapter 7 bankruptcy may affect underwriting and should be addressed transparently through a conservative request, stable professional background, launch traction, recurring revenue planning, and disciplined use of funds.', 'Chapter 7', 'Requires verification', 78);
    add('companyProfile.riskMitigation', 'Risk mitigation', 'Mitigation includes a conservative funding request, stable professional background, launch traction, recurring revenue model, business plan, and disciplined use of funds.', 'Mitigation', 'AI-derived summary', 76);
  }
  if (/ein|tax id|social security|ssn|bank account|routing|bankruptcy case/i.test(joined)) {
    add('sensitive.excluded', 'Sensitive values excluded', 'Sensitive values were detected and intentionally excluded from automatic import.', 'ssn', 'Requires verification', 90, true);
  }

  for (const document of data.documents) {
    const needle = document.name.toLowerCase();
    if (joined.toLowerCase().includes(needle)) {
      add(`documents.${document.id}`, `${document.name} evidence`, document.id, document.name, 'Verified document value', 74);
    }
  }

  return fields;
}

function findConflicts(data: AtlasData, fields: AtlasImportedField[]) {
  const conflicts: AtlasFieldConflict[] = [];
  const currentValues: Record<string, string> = {
    'companyProfile.companyName': data.companyProfile.companyName,
    'companyProfile.productName': data.companyProfile.productName,
    'companyProfile.businessStage': data.companyProfile.businessStage,
    'companyProfile.revenueStage': data.companyProfile.revenueStage,
    'companyProfile.fundingTargetMin': String(data.companyProfile.fundingTargetMin),
    'companyProfile.fundingTargetMax': String(data.companyProfile.fundingTargetMax),
    'financialAssumptions.loanAmount': String(data.financialAssumptions.loanAmount),
    'financialAssumptions.startingMrr': String(data.financialAssumptions.startingMrr),
  };
  for (const field of fields) {
    const current = currentValues[field.fieldPath];
    if (!current || field.sensitive) continue;
    const next = Array.isArray(field.normalizedValue) ? field.normalizedValue.join(', ') : String(field.normalizedValue);
    if (normalizeComparable(current) && normalizeComparable(next) && normalizeComparable(current) !== normalizeComparable(next)) {
      conflicts.push({
        id: randomUUID(),
        fieldPath: field.fieldPath,
        label: field.label,
        valueA: current,
        sourceA: 'Current Atlas profile',
        valueB: next,
        sourceB: field.sourceFilename,
        documentDates: [field.importTimestamp],
        recommendedResolution: 'Founder should review the current Atlas value and imported source value before package use.',
        founderDecisionRequired: true,
      });
    }
  }
  return conflicts;
}

function normalizeComparable(value: string) {
  return value.toLowerCase().replace(/[$,\s+/]/g, '').trim();
}

function findStalenessFlags(fields: AtlasImportedField[]) {
  const currentYear = new Date().getFullYear();
  return fields
    .filter((field) => /20\d{2}/.test(field.originalValue))
    .map((field): AtlasStalenessFlag | null => {
      const years = Array.from(field.originalValue.matchAll(/20\d{2}/g)).map((match) => Number(match[0]));
      const oldest = Math.min(...years);
      if (oldest >= currentYear - 1) return null;
      return {
        id: randomUUID(),
        fieldPath: field.fieldPath,
        value: field.originalValue,
        source: field.sourceFilename,
        status: 'Possibly stale',
        reason: `Source references ${oldest}; founder should confirm it is still current.`,
      };
    })
    .filter(Boolean) as AtlasStalenessFlag[];
}

function buildEvidenceGaps(data: AtlasData, fields: AtlasImportedField[], conflicts: AtlasFieldConflict[]) {
  const gaps: AtlasEvidenceGap[] = [];
  for (const document of data.documents.filter((item) => item.required && !item.completed)) {
    if (!fields.some((field) => field.fieldPath === `documents.${document.id}`)) {
      gaps.push({
        id: randomUUID(),
        category: 'Missing document',
        label: document.name,
        detail: `${document.name} remains missing or not evidenced by imported source documents.`,
        severity: document.category === 'financial' || document.category === 'legal' ? 'high' : 'medium',
      });
    }
  }
  if (conflicts.length) {
    gaps.push(...conflicts.map((conflict) => ({
      id: randomUUID(),
      category: 'Conflict' as const,
      label: conflict.label,
      detail: `${conflict.valueA} conflicts with imported source value ${conflict.valueB}.`,
      severity: 'high' as const,
    })));
  }
  if (!fields.some((field) => field.fieldPath === 'companyProfile.repaymentStrategy')) {
    gaps.push({
      id: randomUUID(),
      category: 'Founder decision',
      label: 'Repayment strategy evidence',
      detail: 'Repayment strategy needs founder verification before lender use.',
      severity: 'medium',
    });
  }
  if (fields.some((field) => field.sensitive)) {
    gaps.push({
      id: randomUUID(),
      category: 'Sensitive field',
      label: 'Sensitive data excluded',
      detail: 'Sensitive personal or banking values were detected and excluded from automatic import.',
      severity: 'high',
    });
  }
  return gaps;
}

function buildReviewQueue(fields: AtlasImportedField[], conflicts: AtlasFieldConflict[]) {
  const conflictPaths = new Set(conflicts.map((conflict) => conflict.fieldPath));
  const highRiskPaths = new Set([
    'companyProfile.fundingTargetMin',
    'companyProfile.fundingTargetMax',
    'financialAssumptions.loanAmount',
    'financialAssumptions.startingMrr',
    'companyProfile.revenueAssumptions',
    'companyProfile.primaryUseOfFunds',
    'companyProfile.repaymentStrategy',
    'companyProfile.chapterSevenExplanation',
    'companyProfile.riskMitigation',
  ]);
  return fields.map((field): AtlasFounderReviewItem => {
    const riskLevel = field.sensitive || conflictPaths.has(field.fieldPath) || highRiskPaths.has(field.fieldPath)
      ? 'high'
      : field.confidence < 75
        ? 'medium'
        : 'low';
    return {
      id: randomUUID(),
      importedFieldId: field.id,
      fieldPath: field.fieldPath,
      label: field.label,
      importedValue: field.originalValue,
      source: `${field.sourceFilename} / ${field.sourceSection}`,
      classification: field.classification,
      confidence: field.confidence,
      conflictStatus: conflictPaths.has(field.fieldPath) ? 'conflict' : field.conflictStatus,
      recommendedAction: riskLevel === 'low' ? 'May be bulk approved after source review.' : 'Review individually before lender-facing use.',
      riskLevel,
      status: field.sensitive ? 'deferred' : 'pending_review',
    };
  });
}
