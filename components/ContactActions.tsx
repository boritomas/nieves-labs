'use client';

import { useEffect, useState } from 'react';

type ContactActionsProps = {
  domain: string;
  subject?: string;
  user: string;
};

export default function ContactActions({ domain, subject = 'Nieves Labs Inquiry', user }: ContactActionsProps) {
  const [email, setEmail] = useState('');
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  useEffect(() => {
    setEmail(`${user}@${domain}`);
  }, [domain, user]);

  async function copyEmail() {
    if (!email) return;
    await navigator.clipboard?.writeText(email).catch(() => undefined);
  }

  return (
    <div className="contact-actions">
      <button className="button-primary" type="button" disabled={!email} onClick={() => { window.location.href = mailto; }}>
        Open email
      </button>
      <button className="button-secondary" type="button" disabled={!email} onClick={copyEmail}>
        Copy email
      </button>
      <p className="contact-email">{email || 'Contact options loading...'}</p>
    </div>
  );
}
