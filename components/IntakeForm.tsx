'use client';

import { useState } from 'react';
import type { Product } from '@/lib/products';
import type { Order } from '@/lib/types';

export default function IntakeForm({ order, product }: { order: Order; product: Product }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/intake', {
      method: 'POST',
      body: form,
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus('error');
      setMessage(data.error || 'Intake failed');
      return;
    }
    setStatus('done');
    setMessage('Intake received. Your workflow has started.');
  }

  return (
    <form className="intake-form" onSubmit={submit}>
      <input type="hidden" name="token" value={order.intakeToken} />
      {product.requiredQuestions.map((question) => (
        <label key={question.id}>
          {question.label}{question.required ? ' *' : ''}
          {question.type === 'textarea' ? (
            <textarea name={question.id} required={question.required} defaultValue={order.intakeAnswers[question.id] || ''} />
          ) : question.type === 'select' ? (
            <select name={question.id} required={question.required} defaultValue={order.intakeAnswers[question.id] || ''}>
              <option value="">Select one</option>
              {question.options?.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          ) : (
            <input name={question.id} required={question.required} defaultValue={order.intakeAnswers[question.id] || ''} />
          )}
        </label>
      ))}
      <label>
        Upload files
        <input name="files" type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.csv,.xlsx" />
      </label>
      <button className="button-primary" type="submit" disabled={status === 'loading' || status === 'done'}>
        {status === 'loading' ? 'Submitting...' : status === 'done' ? 'Submitted' : 'Submit Intake'}
      </button>
      {message && <p className={status === 'error' ? 'form-error' : 'form-success'}>{message}</p>}
    </form>
  );
}
