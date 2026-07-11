import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductByKey } from '@/lib/products';
import { getOrderByIntakeToken, listLogs } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function CustomerPortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await getOrderByIntakeToken(token);
  if (!order) notFound();

  const product = getProductByKey(order.productKey);
  if (!product) notFound();

  const logs = (await listLogs(order.id)).slice(-12).reverse();

  return (
    <main className="site-shell compact">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">NL</span><span>Nieves Labs</span></Link>
      </header>

      <section className="product-hero">
        <p className="eyebrow">Customer portal</p>
        <h1>{product.title}</h1>
        <p>Order {order.id.slice(0, 8)} for {order.customerEmail}</p>
      </section>

      <section className="section trust-grid">
        <div className="trust-item"><strong>Payment</strong><span>{order.paymentStatus}</span></div>
        <div className="trust-item"><strong>Status</strong><span>{order.status}</span></div>
        <div className="trust-item"><strong>Uploads</strong><span>{order.uploads.length}</span></div>
        <div className="trust-item"><strong>Deliverables</strong><span>{order.deliverables.length}</span></div>
      </section>

      <section className="section two-column">
        <article className="panel">
          <h2>Next step</h2>
          {order.intakeSubmittedAt ? (
            <p>Your intake was received on {new Date(order.intakeSubmittedAt).toLocaleString()}. The workflow status below updates as automation runs.</p>
          ) : (
            <>
              <p>Your intake is still needed before fulfillment can run.</p>
              <Link className="button-primary" href={`/intake/${order.intakeToken}`}>Complete intake</Link>
            </>
          )}
        </article>

        <article className="panel">
          <h2>Workflow status</h2>
          <div className="status-list">
            {Object.entries(order.workflowStatus).length ? Object.entries(order.workflowStatus).map(([key, value]) => (
              <span key={key} className={value === 'completed' ? 'status-pill ready' : value === 'failed' ? 'status-pill missing' : 'status-pill'}>{key}: {value}</span>
            )) : <span className="status-pill">Not started</span>}
          </div>
          {order.lastWorkflowError && <p className="form-error">Workflow needs review: {order.lastWorkflowError}</p>}
        </article>
      </section>

      <section className="section two-column">
        <article className="panel">
          <h2>Uploads</h2>
          {order.uploads.length ? (
            <ul>{order.uploads.map((upload) => <li key={upload.id}>{upload.fileName}</li>)}</ul>
          ) : (
            <p>No files uploaded yet.</p>
          )}
        </article>

        <article className="panel">
          <h2>Deliverables</h2>
          {order.deliverables.length ? (
            <div className="workflow-list">
              {order.deliverables.map((deliverable) => (
                <details key={deliverable.id} className="workflow-item">
                  <summary>{deliverable.title}</summary>
                  <pre className="deliverable-preview">{deliverable.content}</pre>
                </details>
              ))}
            </div>
          ) : (
            <p>Your deliverable will appear here after the workflow completes.</p>
          )}
        </article>
      </section>

      <section className="section panel">
        <h2>Recent activity</h2>
        <div className="log-list">
          {logs.length ? logs.map((log) => (
            <div key={log.id} className={`log-row ${log.level}`}>
              <span>{log.level}</span>
              <p>{log.message}</p>
              <time>{new Date(log.createdAt).toLocaleString()}</time>
            </div>
          )) : <p>No activity has been logged yet.</p>}
        </div>
      </section>
    </main>
  );
}
