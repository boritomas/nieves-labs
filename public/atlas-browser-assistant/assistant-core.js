(function () {
  const founderOnlyPatterns = [
    /(^|[^a-z])s\.?\s*s\.?\s*n([^a-z]|$)|social security|(^|[^a-z])itin([^a-z]|$)/i,
    /date of birth|\bdob\b|birth date/i,
    /driver.?s? license|state id|government id/i,
    /password|mfa|verification code|security question/i,
    /credit authorization|authorize credit|credit review/i,
    /personal guarantee|collateral|certification|certify|e-?signature|signature/i,
    /captcha|final submit|submit application/i,
  ];

  const synonyms = [
    ['legalBusinessName', /business name|company name|legal name|applicant business/i],
    ['dba', /\bdba\b|trade name/i],
    ['businessEmail', /business email|company email|email address/i],
    ['businessPhone', /business phone|company phone|phone number/i],
    ['website', /website|web site|url/i],
    ['businessAddress', /business address|company address|street address|address line 1/i],
    ['businessZip', /business zip|business postal|company zip|zip code|postal code/i],
    ['industry', /industry|business type|sector/i],
    ['stateOfFormation', /state of formation|formation state|business state|\bstate\b/i],
    ['entityType', /entity type|legal structure|business structure/i],
    ['formationDate', /formation date|date formed|entity date/i],
    ['businessStartDate', /business start|start date|started/i],
    ['ownershipPercentage', /ownership|owner percent|ownership %|percentage owned/i],
    ['founderFirstName', /first name|owner first/i],
    ['founderLastName', /last name|owner last/i],
    ['founderTitle', /title|role|position/i],
    ['businessDescription', /business description|describe your business|company description|business narrative/i],
    ['managementExperience', /management experience|owner experience|leadership experience/i],
    ['industryExperience', /industry experience/i],
    ['requestedAmount', /requested amount|loan amount|funding amount|amount requested|how much funding|funding.*need/i],
    ['fundingPurpose', /funding purpose|loan purpose|purpose of funds/i],
    ['useOfFunds', /use of funds|funds will be used|how.*funds/i],
    ['repaymentNarrative', /repayment|repay/i],
    ['revenueStage', /revenue stage|business stage/i],
    ['planningAssumptions', /assumptions|projection|forecast/i],
    ['chapterSevenExplanationApproved', /chapter 7|bankruptcy explanation/i],
  ];

  const assistant = {
    inspectPage,
    matchFields,
    fillMappings,
    uploadApprovedDocuments,
    summarizeFounderOnly,
    normalizeValue,
    getStorageKey,
  };

  window.AtlasBrowserAssistantCore = assistant;

  function inspectPage() {
    const controls = Array.from(document.querySelectorAll('input, textarea, select')).filter((control) => !isHidden(control));
    const fields = controls.map((control, index) => {
      const label = getLabel(control);
      const type = getType(control);
      const founderOnly = isFounderOnlyField(`${label} ${control.name || ''} ${control.id || ''} ${control.placeholder || ''}`);
      return {
        index,
        label,
        type,
        tag: control.tagName.toLowerCase(),
        name: control.getAttribute('name') || '',
        id: control.id || '',
        placeholder: control.getAttribute('placeholder') || '',
        required: Boolean(control.required || control.getAttribute('aria-required') === 'true'),
        founderOnly,
        selector: selectorFor(control),
        value: control.type === 'password' ? '' : control.value || '',
        options: control.tagName.toLowerCase() === 'select' ? Array.from(control.options).map((option) => option.textContent.trim()).filter(Boolean) : [],
      };
    });
    return {
      domain: location.hostname,
      url: location.href,
      pageTitle: document.title,
      fields,
      saveButtons: findButtons(/save|continue|next/i).map((button) => button.textContent.trim()).filter(Boolean),
      finalSubmitDetected: findButtons(/submit|final/i).length > 0,
    };
  }

  function matchFields(page, atlasData, savedMappings = {}) {
    const fields = atlasData.fields || [];
    const byId = new Map(fields.map((field) => [field.id, field]));
    return page.fields.map((field) => {
      if (field.founderOnly) {
        return { lenderField: field, atlasField: null, confidence: 1, status: 'founder_only', reason: 'Founder-only identity, consent, certification, or final submit field.' };
      }
      const saved = savedMappings[fieldKey(page, field)];
      if (saved && byId.has(saved.atlasFieldId)) {
        return { lenderField: field, atlasField: byId.get(saved.atlasFieldId), confidence: 0.98, status: 'ready', reason: 'Saved lender mapping.' };
      }
      const haystack = `${field.label} ${field.name} ${field.id} ${field.placeholder}`;
      for (const [atlasFieldId, pattern] of synonyms) {
        if (pattern.test(haystack) && byId.has(atlasFieldId)) {
          const atlasField = byId.get(atlasFieldId);
          return { lenderField: field, atlasField, confidence: pattern.source.length > 10 ? 0.92 : 0.86, status: atlasField.status === 'approved' ? 'ready' : 'review', reason: 'Semantic label match.' };
        }
      }
      return { lenderField: field, atlasField: null, confidence: 0.2, status: 'unmatched', reason: 'No approved Atlas field matched.' };
    });
  }

  async function fillMappings(mappings) {
    const results = [];
    for (const mapping of mappings) {
      if (mapping.status !== 'ready' || !mapping.atlasField || mapping.confidence < 0.85) continue;
      const control = document.querySelector(mapping.lenderField.selector);
      if (!control) {
        results.push({ mapping, ok: false, error: 'Field not found' });
        continue;
      }
      const value = normalizeValue(mapping.atlasField.value, mapping.lenderField);
      const ok = await setControlValue(control, value, mapping.lenderField);
      results.push({ mapping, ok, error: ok ? '' : 'Could not set field value' });
    }
    return results;
  }

  async function uploadApprovedDocuments(page, documents) {
    const uploads = page.fields.filter((field) => field.type === 'file' && !field.founderOnly);
    const results = [];
    for (const field of uploads) {
      const doc = pickDocument(field, documents || []);
      if (!doc) {
        results.push({ field, ok: false, error: 'No approved document match' });
        continue;
      }
      const control = document.querySelector(field.selector);
      if (!control) {
        results.push({ field, ok: false, error: 'Upload control not found' });
        continue;
      }
      const file = new File([doc.content || doc.label], doc.fileName || `${doc.id}.txt`, { type: doc.mimeType || 'text/plain' });
      const transfer = new DataTransfer();
      transfer.items.add(file);
      control.files = transfer.files;
      dispatchAll(control);
      results.push({ field, document: doc, ok: control.files.length > 0, error: control.files.length ? '' : 'File assignment failed' });
    }
    return results;
  }

  function summarizeFounderOnly(mappings) {
    const items = mappings.filter((mapping) => mapping.status === 'founder_only').map((mapping) => mapping.lenderField.label || mapping.lenderField.name).filter(Boolean);
    return { count: items.length, estimatedMinutes: Math.max(3, Math.ceil(items.length * 1.5)), items };
  }

  function normalizeValue(value, field) {
    if (field.type === 'url' || /website|url/i.test(`${field.label} ${field.name}`)) return 'https://nieves-labs.com';
    if (field.type === 'number') return String(value).replace(/[^\d.]/g, '');
    if (field.type === 'date' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
      const [m, d, y] = value.split('/');
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    return String(value || '');
  }

  async function setControlValue(control, value, field) {
    if (control.tagName.toLowerCase() === 'select') {
      return setSelectValue(control, value, field);
    }
    if (control.type === 'radio') {
      const group = Array.from(document.querySelectorAll(`input[type="radio"][name="${cssEscape(control.name)}"]`));
      const match = group.find((item) => fuzzyMatch(`${item.value} ${getLabel(item)}`, value));
      if (match) {
        match.checked = true;
        dispatchAll(match);
        return true;
      }
      return false;
    }
    if (control.type === 'checkbox') return false;
    control.focus();
    control.value = value;
    dispatchAll(control);
    control.blur();
    return control.value === value || Boolean(control.value);
  }

  function setSelectValue(control, value, field) {
    const options = Array.from(control.options);
    const exact = options.find((option) => option.textContent.trim().toLowerCase() === String(value).trim().toLowerCase());
    const fuzzy = exact || options.find((option) => fuzzyMatch(option.textContent, value)) || options.find((option) => fuzzyMatch(value, option.textContent));
    if (!fuzzy && field.options?.length) return false;
    if (fuzzy) {
      control.value = fuzzy.value;
      dispatchAll(control);
      return control.value === fuzzy.value;
    }
    return false;
  }

  function pickDocument(field, documents) {
    const haystack = `${field.label} ${field.name} ${field.id}`;
    return documents.find((document) => new RegExp(document.id.replace(/-/g, '.*'), 'i').test(haystack))
      || documents.find((document) => fuzzyMatch(haystack, document.label))
      || documents[0];
  }

  function fieldKey(page, field) {
    return `${page.domain}|${page.pageTitle}|${field.label}|${field.type}`;
  }

  function getStorageKey() {
    return `atlas-assistant:${location.hostname}:${document.title}`;
  }

  function getLabel(control) {
    const id = control.id;
    const explicit = id ? document.querySelector(`label[for="${cssEscape(id)}"]`) : null;
    const wrapped = control.closest('label');
    const aria = control.getAttribute('aria-label');
    const placeholder = control.getAttribute('placeholder');
    const nearby = control.closest('div,section,fieldset,form')?.querySelector('legend,h1,h2,h3,p')?.textContent;
    return cleanup(aria || labelOwnText(explicit) || labelOwnText(wrapped) || placeholder || nearby || control.name || control.id || control.type || 'Unnamed field');
  }

  function labelOwnText(label) {
    if (!label) return '';
    const clone = label.cloneNode(true);
    clone.querySelectorAll('input,select,textarea,button,option').forEach((node) => node.remove());
    return clone.textContent;
  }

  function getType(control) {
    if (control.tagName.toLowerCase() === 'textarea') return 'textarea';
    if (control.tagName.toLowerCase() === 'select') return 'select';
    return control.type || 'text';
  }

  function isHidden(element) {
    return element.type === 'hidden' || element.hidden || getComputedStyle(element).display === 'none' || getComputedStyle(element).visibility === 'hidden';
  }

  function selectorFor(control) {
    if (control.id) return `#${cssEscape(control.id)}`;
    if (control.name) return `${control.tagName.toLowerCase()}[name="${cssEscape(control.name)}"]`;
    const all = Array.from(document.querySelectorAll(control.tagName.toLowerCase()));
    return `${control.tagName.toLowerCase()}:nth-of-type(${all.indexOf(control) + 1})`;
  }

  function findButtons(pattern) {
    return Array.from(document.querySelectorAll('button,input[type="button"],input[type="submit"],a')).filter((button) => pattern.test(`${button.textContent || button.value || ''} ${button.getAttribute('aria-label') || ''}`));
  }

  function isFounderOnlyField(value) {
    const haystack = cleanup(value).replace(/[_-]+/g, ' ');
    return founderOnlyPatterns.some((pattern) => pattern.test(haystack));
  }

  function dispatchAll(control) {
    control.dispatchEvent(new Event('input', { bubbles: true }));
    control.dispatchEvent(new Event('change', { bubbles: true }));
    control.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  function fuzzyMatch(a, b) {
    const left = cleanup(a).toLowerCase();
    const right = cleanup(b).toLowerCase();
    return Boolean(left && right && (left.includes(right) || right.includes(left)));
  }

  function cleanup(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function cssEscape(value) {
    return String(value || '').replace(/["\\]/g, '\\$&');
  }
})();
