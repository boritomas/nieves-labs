'use client';

import { useEffect, useState } from 'react';

export default function CFPBOnlineAutofill() {
  const [extensionReady, setExtensionReady] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.source !== 'NIEVES_CFPB_EXTENSION') return;
      if (event.data?.type === 'EXTENSION_READY') setExtensionReady(true);
      if (event.data?.type === 'DRAFT_SAVED') {
        setStatus(event.data.ok ? 'Complaint transferred. The official CFPB form is opening.' : 'The browser companion could not save the complaint.');
      }
    }
    window.addEventListener('message', onMessage);
    window.postMessage({ source: 'NIEVES_CFPB_PORTAL', type: 'PING_EXTENSION' }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function startOnlineComplaint() {
    const raw = window.localStorage.getItem('consumer-defense-dispute');
    if (!raw) {
      setStatus('Complete and save the dispute intake before starting the online complaint.');
      return;
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      setStatus('The saved dispute could not be read. Reset the workspace and enter the complaint again.');
      return;
    }

    const required = ['consumerName', 'address', 'cityStateZip', 'bureau', 'furnisher', 'accountNumber', 'facts', 'currentReporting', 'correctReporting'];
    const missing = required.filter((field) => !String(payload[field] || '').trim());
    if (missing.length) {
      setStatus(`Complete the required intake fields first: ${missing.join(', ')}.`);
      return;
    }

    if (!extensionReady) {
      setStatus('The CFPB browser companion is not active. Complete the one-time companion installation, then reload this page.');
      return;
    }

    window.postMessage({ source: 'NIEVES_CFPB_PORTAL', type: 'SAVE_AND_OPEN_CFPB', payload }, '*');
    setStatus('Transferring your complaint to the official CFPB form…');
  }

  return (
    <section className="mx-auto mb-5 max-w-6xl px-4">
      <div className="rounded-2xl border border-emerald-800 bg-emerald-950/40 p-5">
        <p className="eyebrow">Online filing</p>
        <h2 className="text-2xl font-semibold text-white">Fill the CFPB complaint online</h2>
        <p className="mt-2 text-sm text-slate-300">
          Transfers the saved founder workspace into the official CFPB complaint form. No dispute package download is required. The companion fills recognized fields and complaint narrative, then leaves login, identity checks, evidence selection, truth attestation, and final submission under your control.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="button-secondary" onClick={startOnlineComplaint}>Fill CFPB Online</button>
          <span className={`text-sm ${extensionReady ? 'text-emerald-400' : 'text-amber-400'}`}>
            Browser companion: {extensionReady ? 'connected' : 'not detected'}
          </span>
        </div>
        {status && <p className="mt-3 text-sm text-slate-300">{status}</p>}
        <details className="mt-4 text-sm text-slate-300">
          <summary className="cursor-pointer font-semibold text-white">One-time browser companion setup</summary>
          <ol className="mt-2 space-y-1 pl-5">
            <li>1. Obtain the `browser-companion/cfpb-autofill` folder from the private Nieves Labs repository.</li>
            <li>2. Open `chrome://extensions`, enable Developer mode, and choose Load unpacked.</li>
            <li>3. Select that folder, return here, and reload the page.</li>
          </ol>
          <p className="mt-2 text-xs text-slate-500">This is a one-time browser installation. Future complaints are transferred online without generating or downloading a dispute package.</p>
        </details>
      </div>
    </section>
  );
}
