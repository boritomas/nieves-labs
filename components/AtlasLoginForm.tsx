'use client';

import { FormEvent, useState } from 'react';

export default function AtlasLoginForm({ returnTo }: { returnTo: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const response = await fetch('/api/atlas/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnTo }),
    });
    const payload = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || 'Unable to sign in.');
      return;
    }

    window.location.assign(payload.returnTo || '/atlas');
  }

  return (
    <form className="checkout-form" onSubmit={submit}>
      <label>
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
      </label>
      {error ? <p className="form-message error">{error}</p> : null}
      <button className="button-primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in to Atlas'}</button>
      <p className="atlas-note">Secure founder session. Atlas uses an HTTP-only cookie and does not place access tokens in URLs or browser storage.</p>
      <a className="button-secondary" href="mailto:hello@nieves-labs.com?subject=Atlas%20password%20help">Forgot password</a>
    </form>
  );
}
