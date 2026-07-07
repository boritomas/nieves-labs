'use client';

import { useState } from 'react';
import type { Product, ProductPackage } from '@/lib/products';

export default function CheckoutForm({ product, selectedPackage }: { product: Product; selectedPackage: ProductPackage }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function startCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productKey: product.key,
        packageId: selectedPackage.id,
        customerEmail: email,
        customerName: name,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus('error');
      setMessage(data.error || 'Checkout failed');
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  return (
    <form className="checkout-form" onSubmit={startCheckout}>
      <label>
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
      </label>
      <label>
        Email
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
      </label>
      <button className="button-primary" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Starting checkout...' : `Buy ${selectedPackage.name}`}
      </button>
      {message && <p className="form-error">{message}</p>}
    </form>
  );
}
