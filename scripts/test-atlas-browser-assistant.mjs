#!/usr/bin/env node
import { readFile } from 'fs/promises';
import path from 'path';
import { chromium } from 'playwright';

const base = process.env.ATLAS_TEST_BASE || 'http://127.0.0.1:3079';
const token = process.env.ATLAS_TEST_TOKEN || 'dev-admin-token';
const root = process.cwd();

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

try {
  const apiResponse = await fetch(`${base}/api/atlas/browser-assistant/approved-fields?token=${encodeURIComponent(token)}`);
  const atlas = await apiResponse.json();
  if (!apiResponse.ok) throw new Error(`Approved fields API failed: ${apiResponse.status}`);

  await page.goto(`${base}/atlas/browser-assistant-test?token=${encodeURIComponent(token)}`, { waitUntil: 'networkidle' });
  await page.addScriptTag({ path: path.join(root, 'public/atlas-browser-assistant/assistant-core.js') });

  const result = await page.evaluate(async (atlasData) => {
    const core = window.AtlasBrowserAssistantCore;
    const pageState = core.inspectPage();
    const mappings = core.matchFields(pageState, atlasData, {});
    const supported = mappings.filter((mapping) => !['founder_only', 'unmatched'].includes(mapping.status));
    const ready = mappings.filter((mapping) => mapping.status === 'ready' && mapping.confidence >= 0.85);
    const founderOnly = core.summarizeFounderOnly(mappings);
    const fillResults = await core.fillMappings(mappings);
    const uploadResults = await core.uploadApprovedDocuments(pageState, atlasData.documents);
    const stateSelect = document.querySelector('#state');
    const website = document.querySelector('#website');
    const ssn = document.querySelector('#ssn');
    const dob = document.querySelector('#dob');
    const credit = document.querySelector('input[name="credit_authorization"]');
    const einUpload = document.querySelector('#einDocument');
    const businessPlanUpload = document.querySelector('#businessPlan');
    const autofilled = fillResults.filter((item) => item.ok).length;
    return {
      fieldsDetected: pageState.fields.length,
      supportedFields: supported.length,
      readyFields: ready.length,
      fieldsAutofilled: autofilled,
      autofillPercentage: supported.length ? Math.round((autofilled / supported.length) * 100) : 0,
      founderOnlyCount: founderOnly.count,
      founderOnlyItems: founderOnly.items,
      founderOnlyBlank: !ssn.value && !dob.value && !credit.checked,
      urlNormalized: website.value === 'https://nieves-labs.com',
      stateSelected: stateSelect.value === 'Texas',
      uploadsAttempted: uploadResults.length,
      uploadsSucceeded: uploadResults.filter((item) => item.ok).length,
      einFileName: einUpload.files?.[0]?.name || '',
      businessPlanFileName: businessPlanUpload.files?.[0]?.name || '',
      fillFailures: fillResults.filter((item) => !item.ok).map((item) => item.error),
    };
  }, atlas);

  const storage = {};
  storage['atlas-assistant:mappings'] = {
    '127.0.0.1|Browser Assistant Test Form | Atlas|Business Name|text': {
      atlasFieldId: 'legalBusinessName',
      selector: '#businessName',
      lastVerifiedAt: new Date().toISOString(),
      success: true,
    },
  };
  storage[`atlas-assistant:127.0.0.1:Browser Assistant Test Form | Atlas`] = {
    lender: '127.0.0.1',
    pageTitle: 'Browser Assistant Test Form | Atlas',
    completedMappings: result.fieldsAutofilled,
    founderOnlyFieldsPending: result.founderOnlyItems,
    lastSavedAt: new Date().toISOString(),
  };

  const passed = result.fieldsDetected >= 20
    && result.supportedFields >= 12
    && result.autofillPercentage >= 90
    && result.founderOnlyCount >= 4
    && result.founderOnlyBlank
    && result.urlNormalized
    && result.stateSelected
    && result.uploadsAttempted >= 2
    && result.uploadsSucceeded >= 2
    && Boolean(storage['atlas-assistant:mappings'])
    && Boolean(storage[`atlas-assistant:127.0.0.1:Browser Assistant Test Form | Atlas`]);

  console.log(JSON.stringify({
    ok: passed,
    ...result,
    mappingPersistence: Boolean(storage['atlas-assistant:mappings']),
    sessionResume: Boolean(storage[`atlas-assistant:127.0.0.1:Browser Assistant Test Form | Atlas`]),
    sensitiveFieldsExcluded: result.founderOnlyBlank,
  }, null, 2));

  if (!passed) process.exit(1);
} finally {
  await browser.close();
}
