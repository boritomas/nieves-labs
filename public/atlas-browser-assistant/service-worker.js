const ATLAS_BASE_URL = 'https://nieves-labs.com';

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.tabs.sendMessage(tab.id, { type: 'ATLAS_ASSISTANT_TOGGLE' }).catch(async () => {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['assistant-core.js', 'content-script.js'],
    });
    await chrome.tabs.sendMessage(tab.id, { type: 'ATLAS_ASSISTANT_TOGGLE' });
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'ATLAS_FETCH_APPROVED_FIELDS') {
    fetch(`${ATLAS_BASE_URL}/api/atlas/browser-assistant/approved-fields`, { credentials: 'include' })
      .then(async (response) => ({ ok: response.ok, status: response.status, payload: await response.json().catch(() => ({})) }))
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, status: 0, payload: { error: String(error?.message || error) } }));
    return true;
  }

  if (message?.type === 'ATLAS_STORAGE_GET') {
    chrome.storage.local.get(message.keys || null).then(sendResponse);
    return true;
  }

  if (message?.type === 'ATLAS_STORAGE_SET') {
    chrome.storage.local.set(message.value || {}).then(() => sendResponse({ ok: true }));
    return true;
  }

  return false;
});
