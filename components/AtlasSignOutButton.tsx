'use client';

import { useState } from 'react';

export default function AtlasSignOutButton() {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await fetch('/api/atlas/auth/logout', { method: 'POST' }).catch(() => null);
    window.location.assign('/atlas/login');
  }

  return (
    <button className="button-secondary nav-logout" type="button" onClick={signOut} disabled={loading}>
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
