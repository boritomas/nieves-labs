(() => {
  const PORTAL_HOSTS = new Set(['nieves-labs.com', 'www.nieves-labs.com']);
  const isPortal = PORTAL_HOSTS.has(window.location.hostname);
  const isCfpb = window.location.hostname === 'www.consumerfinance.gov';

  if (isPortal) {
    window.addEventListener('message', (event) => {
      if (event.source !== window || event.data?.source !== 'NIEVES_CFPB_PORTAL') return;
      if (event.data?.type === 'SAVE_AND_OPEN_CFPB') {
        chrome.runtime.sendMessage({ type: 'NIEVES_CFPB_SAVE_DRAFT', payload: event.data.payload }, (response) => {
          window.postMessage({ source: 'NIEVES_CFPB_EXTENSION', type: 'DRAFT_SAVED', ok: Boolean(response?.ok) }, '*');
          if (response?.ok) window.open('https://www.consumerfinance.gov/complaint/', '_blank', 'noopener,noreferrer');
        });
      }
    });
    window.postMessage({ source: 'NIEVES_CFPB_EXTENSION', type: 'EXTENSION_READY' }, '*');
    return;
  }

  if (!isCfpb) return;

  const normalize = (value) => String(value || '').trim();
  const lower = (value) => normalize(value).toLowerCase();

  function setNativeValue(element, value) {
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');
    descriptor?.set?.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function findControlByText(words) {
    const wanted = words.map(lower);
    const labels = Array.from(document.querySelectorAll('label'));
    for (const label of labels) {
      const text = lower(label.innerText || label.textContent);
      if (!wanted.some((word) => text.includes(word))) continue;
      const forId = label.getAttribute('for');
      if (forId) {
        const linked = document.getElementById(forId);
        if (linked) return linked;
      }
      const nested = label.querySelector('input, textarea, select');
      if (nested) return nested;
    }

    const controls = Array.from(document.querySelectorAll('input, textarea, select'));
    return controls.find((control) => {
      const text = lower(`${control.getAttribute('aria-label') || ''} ${control.getAttribute('placeholder') || ''} ${control.name || ''} ${control.id || ''}`);
      return wanted.some((word) => text.includes(word));
    }) || null;
  }

  function fillControl(words, value) {
    if (!normalize(value)) return false;
    const control = findControlByText(words);
    if (!control) return false;
    if (control.tagName === 'SELECT') {
      const option = Array.from(control.options).find((item) => lower(item.textContent).includes(lower(value)) || lower(item.value).includes(lower(value)));
      if (option) setNativeValue(control, option.value);
      return Boolean(option);
    }
    setNativeValue(control, value);
    return true;
  }

  function clickByText(words) {
    const wanted = words.map(lower);
    const candidates = Array.from(document.querySelectorAll('button, [role="button"], a, label'));
    const target = candidates.find((element) => wanted.some((word) => lower(element.innerText || element.textContent).includes(word)));
    if (!target) return false;
    target.click();
    return true;
  }

  function buildNarrative(draft) {
    return [
      `Company: ${draft.furnisher || ''}`,
      `Account: ${draft.accountNumber || ''}`,
      `Credit bureau: ${draft.bureau || ''}`,
      `Issue: ${draft.issueType || ''}`,
      '',
      `What is being reported: ${draft.currentReporting || ''}`,
      '',
      `What is accurate: ${draft.correctReporting || ''}`,
      '',
      `Supporting facts: ${draft.facts || ''}`,
      '',
      `Requested resolution: ${draft.requestedResolution || ''}`,
      draft.disputeDate ? `I disputed this directly on ${draft.disputeDate}.` : '',
    ].filter(Boolean).join('\n');
  }

  async function autofill() {
    const response = await chrome.runtime.sendMessage({ type: 'NIEVES_CFPB_GET_DRAFT' });
    const draft = response?.draft;
    if (!draft) return;

    const filled = [];
    const narrative = buildNarrative(draft);

    if (fillControl(['first name', 'full name', 'your name'], draft.consumerName)) filled.push('name');
    if (fillControl(['street address', 'address line 1', 'mailing address'], draft.address)) filled.push('address');
    if (fillControl(['city, state, zip', 'city state zip'], draft.cityStateZip)) filled.push('location');
    if (fillControl(['company', 'who is your complaint about'], draft.furnisher)) filled.push('company');
    if (fillControl(['account number', 'last four'], draft.accountNumber)) filled.push('account');
    if (fillControl(['what happened', 'describe what happened', 'tell us what happened', 'complaint details'], narrative)) filled.push('narrative');
    if (fillControl(['what would be a fair resolution', 'desired resolution', 'resolution'], draft.requestedResolution)) filled.push('resolution');

    if (draft.issueType) clickByText([draft.issueType]);
    if (draft.bureau) clickByText([draft.bureau]);
    clickByText(['credit reporting', 'credit report']);

    const bannerId = 'nieves-cfpb-autofill-banner';
    document.getElementById(bannerId)?.remove();
    const banner = document.createElement('div');
    banner.id = bannerId;
    banner.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:2147483647;max-width:360px;background:#111827;color:white;padding:16px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.35);font:14px/1.4 system-ui';
    banner.innerHTML = `<strong>CFPB complaint draft loaded</strong><br>${filled.length ? `Filled: ${filled.join(', ')}.` : 'The form layout did not expose recognized fields on this screen.'}<br><span style="opacity:.8">Continue through the CFPB steps. Review every answer and complete the final truth attestation yourself.</span>`;
    document.body.appendChild(banner);
  }

  setTimeout(autofill, 1200);
  const observer = new MutationObserver(() => {
    clearTimeout(window.__nievesCfpbTimer);
    window.__nievesCfpbTimer = setTimeout(autofill, 700);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
