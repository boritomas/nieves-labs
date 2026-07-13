(function () {
  if (window.__atlasBrowserAssistantLoaded) return;
  window.__atlasBrowserAssistantLoaded = true;

  const allowedDomains = [/nieves-labs\.com$/i, /dreamspring\.org$/i, /peoplefund\.org$/i, /liftfund\.com$/i, /sba\.gov$/i, /bcloftexas\.org$/i];
  let state = { open: false, page: null, atlas: null, mappings: [], saved: {}, fillResults: [], uploadResults: [], founderOnly: { count: 0, items: [] } };

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === 'ATLAS_ASSISTANT_TOGGLE') toggle();
  });

  async function toggle() {
    if (!allowedDomains.some((pattern) => pattern.test(location.hostname))) {
      alert('Atlas Browser Assistant only runs on approved Atlas/lender domains.');
      return;
    }
    state.open = !state.open;
    if (state.open) await activate();
    render();
  }

  async function activate() {
    const storageKey = window.AtlasBrowserAssistantCore.getStorageKey();
    const stored = await send({ type: 'ATLAS_STORAGE_GET', keys: [storageKey, 'atlas-assistant:mappings'] });
    const atlasResponse = await send({ type: 'ATLAS_FETCH_APPROVED_FIELDS' });
    if (!atlasResponse.ok) {
      state.error = atlasResponse.status === 401 ? 'Sign in to Atlas first, then click the extension again.' : `Atlas API unavailable (${atlasResponse.status}).`;
      return;
    }
    state.atlas = atlasResponse.payload;
    state.saved = stored[storageKey] || {};
    const savedMappings = stored['atlas-assistant:mappings'] || {};
    state.page = window.AtlasBrowserAssistantCore.inspectPage();
    state.mappings = window.AtlasBrowserAssistantCore.matchFields(state.page, state.atlas, savedMappings);
    state.founderOnly = window.AtlasBrowserAssistantCore.summarizeFounderOnly(state.mappings);
    state.error = '';
    await persistState();
  }

  async function fillPage() {
    state.fillResults = await window.AtlasBrowserAssistantCore.fillMappings(state.mappings);
    await persistMappings();
    await persistState();
    render();
  }

  async function uploadDocs() {
    state.uploadResults = await window.AtlasBrowserAssistantCore.uploadApprovedDocuments(state.page, state.atlas.documents);
    await persistState();
    render();
  }

  async function persistMappings() {
    const current = await send({ type: 'ATLAS_STORAGE_GET', keys: ['atlas-assistant:mappings'] });
    const mappings = current['atlas-assistant:mappings'] || {};
    for (const result of state.fillResults) {
      if (!result.ok || !result.mapping?.atlasField) continue;
      const key = `${state.page.domain}|${state.page.pageTitle}|${result.mapping.lenderField.label}|${result.mapping.lenderField.type}`;
      mappings[key] = {
        atlasFieldId: result.mapping.atlasField.id,
        selector: result.mapping.lenderField.selector,
        lastVerifiedAt: new Date().toISOString(),
        success: true,
      };
    }
    await send({ type: 'ATLAS_STORAGE_SET', value: { 'atlas-assistant:mappings': mappings } });
  }

  async function persistState() {
    const storageKey = window.AtlasBrowserAssistantCore.getStorageKey();
    const completed = state.fillResults.filter((result) => result.ok).length;
    const failures = state.fillResults.filter((result) => !result.ok).length;
    const uploaded = state.uploadResults.filter((result) => result.ok).length;
    await send({
      type: 'ATLAS_STORAGE_SET',
      value: {
        [storageKey]: {
          lender: state.page?.domain,
          domain: state.page?.domain,
          pageTitle: state.page?.pageTitle,
          applicationPage: state.page?.url,
          completedMappings: completed,
          autofillSuccesses: completed,
          autofillFailures: failures,
          documentsUploaded: uploaded,
          founderOnlyFieldsPending: state.founderOnly.items,
          lastSavedAt: new Date().toISOString(),
        },
      },
    });
  }

  function render() {
    let panel = document.getElementById('atlas-browser-assistant');
    if (!state.open) {
      panel?.remove();
      return;
    }
    if (!panel) {
      panel = document.createElement('aside');
      panel.id = 'atlas-browser-assistant';
      document.documentElement.appendChild(panel);
    }

    if (state.error) {
      panel.innerHTML = shell(`<p class="aba-error">${escapeHtml(state.error)}</p><button data-aba-close>Close</button>`);
      bind(panel);
      return;
    }

    const ready = state.mappings.filter((mapping) => mapping.status === 'ready' && mapping.confidence >= 0.85);
    const supported = state.mappings.filter((mapping) => !['founder_only', 'unmatched'].includes(mapping.status));
    const filled = state.fillResults.filter((result) => result.ok).length;
    const autofillRate = supported.length ? Math.round((ready.length / supported.length) * 100) : 0;
    const uploads = (state.page?.fields || []).filter((field) => field.type === 'file').length;
    const resume = state.saved?.lastSavedAt ? `Resume ${state.page.domain} from ${state.page.pageTitle || 'this page'}. ${state.saved.completedMappings || 0} fields completed. ${(state.saved.founderOnlyFieldsPending || []).length} founder-only items remain.` : 'Ready to inspect this page.';

    panel.innerHTML = shell(`
      <p class="aba-resume">${escapeHtml(resume)}</p>
      <div class="aba-metrics">
        <span>${state.page.fields.length} fields found</span>
        <span>${ready.length} ready</span>
        <span>${autofillRate}% match rate</span>
        <span>${state.founderOnly.count} founder-only</span>
      </div>
      <h3>Review mappings</h3>
      <div class="aba-list">
        ${state.mappings.slice(0, 18).map(mappingRow).join('')}
      </div>
      <h3>Tomas action required</h3>
      <p>${state.founderOnly.count ? `Estimated time: ${state.founderOnly.estimatedMinutes} minutes` : 'No founder-only fields detected on this page.'}</p>
      <ol>${state.founderOnly.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>
      <h3>Documents</h3>
      <p>${uploads} upload controls found. ${state.atlas.documents.length} approved Atlas document records available.</p>
      <div class="aba-actions">
        <button data-aba-fill>Fill this page</button>
        <button data-aba-upload>Upload approved documents</button>
        <button data-aba-refresh>Refresh inspection</button>
        <button data-aba-close>Close</button>
      </div>
      <p class="aba-foot">${filled ? `${filled} fields filled and saved to mapping memory.` : 'No fields filled yet.'}</p>
    `);
    bind(panel);
  }

  function mappingRow(mapping) {
    const label = mapping.lenderField.label || mapping.lenderField.name || 'Unnamed field';
    const atlas = mapping.atlasField ? `${mapping.atlasField.label}: ${truncate(mapping.atlasField.value, 68)}` : mapping.reason;
    return `<div class="aba-row ${mapping.status}">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(atlas)}</span>
      <em>${mapping.status.replace('_', ' ')} · ${Math.round(mapping.confidence * 100)}%</em>
    </div>`;
  }

  function shell(body) {
    return `<div class="aba-head"><strong>Atlas Browser Assistant</strong><button data-aba-close aria-label="Close">×</button></div>${body}`;
  }

  function bind(panel) {
    panel.querySelector('[data-aba-close]')?.addEventListener('click', () => { state.open = false; render(); });
    panel.querySelector('[data-aba-fill]')?.addEventListener('click', fillPage);
    panel.querySelector('[data-aba-upload]')?.addEventListener('click', uploadDocs);
    panel.querySelector('[data-aba-refresh]')?.addEventListener('click', activate);
  }

  function send(message) {
    return chrome.runtime.sendMessage(message);
  }

  function truncate(value, length) {
    const text = String(value || '');
    return text.length > length ? `${text.slice(0, length)}...` : text;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
})();
