chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'NIEVES_CFPB_SAVE_DRAFT') {
    chrome.storage.local.set({ nievesCfpbDraft: message.payload, nievesCfpbSavedAt: Date.now() }, () => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message?.type === 'NIEVES_CFPB_GET_DRAFT') {
    chrome.storage.local.get(['nievesCfpbDraft', 'nievesCfpbSavedAt'], (result) => {
      sendResponse({ ok: true, draft: result.nievesCfpbDraft || null, savedAt: result.nievesCfpbSavedAt || null });
    });
    return true;
  }

  if (message?.type === 'NIEVES_CFPB_CLEAR_DRAFT') {
    chrome.storage.local.remove(['nievesCfpbDraft', 'nievesCfpbSavedAt'], () => sendResponse({ ok: true }));
    return true;
  }
});
