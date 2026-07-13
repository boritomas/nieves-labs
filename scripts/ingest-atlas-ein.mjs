#!/usr/bin/env node
import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import path from 'path';

function arg(name, fallback = '') {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

function maskEin(value) {
  const clean = String(value || '').trim();
  if (!clean) return '';
  const digits = clean.replace(/\D/g, '');
  if (digits.length === 9) return `**-***${digits.slice(-4)}`;
  if (/^\*{2}-\*{3}\d{4}$/.test(clean) || /^\*{2}-\*{7}$/.test(clean)) return clean;
  return 'EIN masked';
}

const filePath = arg('file', '/Users/tomasnieves/Downloads/CP_575_B.pdf');
const baseUrl = arg('base-url', process.env.ATLAS_BASE_URL || 'http://localhost:3000');
const token = arg('token', process.env.ADMIN_TOKEN || process.env.ATLAS_DIAGNOSTICS_TOKEN || '');

if (!token) {
  console.error('Missing ADMIN_TOKEN or --token. Refusing to call protected Atlas ingestion endpoint.');
  process.exit(1);
}

const buffer = await readFile(filePath);
const contentHash = createHash('sha256').update(buffer).digest('hex');
const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/atlas/ein-ingestion`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-token': token,
  },
  body: JSON.stringify({
    filename: path.basename(filePath),
    contentHash,
    size: buffer.byteLength,
    noticeType: arg('notice-type', 'IRS Notice CP575B'),
    noticeDate: arg('notice-date', ''),
    maskedEin: maskEin(arg('masked-ein', '')),
    businessName: arg('business-name', 'Nieves Labs'),
    sourcePath: '[private-source-redacted]',
  }),
});

const text = await response.text();
if (!response.ok) {
  console.error(`Atlas EIN ingestion failed: HTTP ${response.status}`);
  console.error(text.slice(0, 500));
  process.exit(1);
}

const result = text ? JSON.parse(text) : {};
console.log(JSON.stringify({
  ok: Boolean(result.ok),
  einVerificationStatus: result.einVerificationStatus,
  einMasked: result.einMasked || '',
  sourceDocumentName: result.sourceDocumentName,
  sourceDocumentHashPresent: Boolean(result.sourceDocumentHashPresent),
  fullEinExposed: false,
}, null, 2));
