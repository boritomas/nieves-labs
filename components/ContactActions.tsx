'use client';

type ContactActionsProps = {
  domain: string;
  subject?: string;
  user: string;
};

export default function ContactActions({ domain, subject = 'Nieves Labs Inquiry', user }: ContactActionsProps) {
  const email = `${user}@${domain}`;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  async function copyEmail() {
    await navigator.clipboard?.writeText(email).catch(() => undefined);
  }

  return (
    <div className="contact-actions">
      <button className="button-primary" type="button" onClick={() => { window.location.href = mailto; }}>
        Open email
      </button>
      <button className="button-secondary" type="button" onClick={copyEmail}>
        Copy email
      </button>
      <p className="contact-email">{email}</p>
    </div>
  );
}
