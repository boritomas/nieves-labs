'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/products';
import type { Order, WorkflowLog } from '@/lib/types';

type AdminData = {
  products: Product[];
  orders: Order[];
  logs: WorkflowLog[];
  credentials: Record<string, boolean>;
};

export default function AdminConsole() {
  const [token, setToken] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const response = await fetch(`/api/admin/orders${token ? `?token=${encodeURIComponent(token)}` : ''}`);
    const body = await response.json();
    if (!response.ok) {
      setError(body.error || 'Unable to load admin data');
      return;
    }
    setError('');
    setData(body);
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredOrders = useMemo(() => {
    if (!data) return [];
    return data.orders.filter((order) => {
      const matchesQuery = [order.id, order.customerEmail, order.productKey].some((value) => value.toLowerCase().includes(query.toLowerCase()));
      const matchesStatus = status ? order.status === status : true;
      return matchesQuery && matchesStatus;
    });
  }, [data, query, status]);

  return (
    <div className="admin-console">
      <section className="admin-controls">
        <label>
          Admin token
          <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="Required when ADMIN_TOKEN is set" />
        </label>
        <label>
          Search
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Order, email, product" />
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All</option>
            <option value="checkout_pending">Checkout pending</option>
            <option value="intake_pending">Intake pending</option>
            <option value="processing">Processing</option>
            <option value="needs_review">Needs review</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </label>
        <button className="button-secondary" onClick={load}>Refresh</button>
      </section>

      {error && <p className="form-error">{error}</p>}

      {data && (
        <>
          <section className="metrics-grid">
            <Metric label="Orders" value={String(data.orders.length)} />
            <Metric label="Products" value={String(data.products.length)} />
            <Metric label="Needs Review" value={String(data.orders.filter((order) => order.status === 'needs_review' || order.paymentStatus === 'manual_review').length)} />
            <Metric label="Completed" value={String(data.orders.filter((order) => order.status === 'completed').length)} />
          </section>

          <section className="panel">
            <h2>Integration Status</h2>
            <div className="status-list">
              {Object.entries(data.credentials).map(([key, ready]) => (
                <span key={key} className={ready ? 'status-pill ready' : 'status-pill missing'}>{key}: {ready ? 'ready' : 'missing'}</span>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>Orders</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Drive</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id.slice(0, 8)}</td>
                      <td>{order.customerEmail}</td>
                      <td>{order.productKey}</td>
                      <td>{order.paymentStatus}</td>
                      <td>{order.status}</td>
                      <td>{order.driveFolderId || 'pending'}</td>
                      <td>{new Date(order.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2>Recent Logs</h2>
            <div className="log-list">
              {data.logs.slice(-30).reverse().map((log) => (
                <div key={log.id} className={`log-row ${log.level}`}>
                  <span>{log.level}</span>
                  <p>{log.message}</p>
                  <time>{new Date(log.createdAt).toLocaleString()}</time>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
