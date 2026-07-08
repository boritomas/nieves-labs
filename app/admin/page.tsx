import Link from 'next/link';
import AdminAccessForm from '@/components/AdminAccessForm';
import AdminConsole from '@/components/AdminConsole';
import { env } from '@/lib/env';

export const metadata = {
  title: 'Admin | Nieves Labs',
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">NL</span><span>Nieves Labs</span></Link>
        <nav className="nav-links"><Link href="/">Home</Link></nav>
      </header>
      {!authorized ? (
        <AdminAccessForm title="Admin Access" />
      ) : (
        <>
          <section className="product-hero">
            <p className="eyebrow">Internal</p>
            <h1>Admin Console</h1>
            <p>Order status, fulfillment queue, and product operations.</p>
            <div className="hero-actions">
              <Link className="button-secondary" href={`/admin/orders?token=${encodeURIComponent(token)}`}>Orders</Link>
              <Link className="button-secondary" href={`/admin/operations?token=${encodeURIComponent(token)}`}>Operations</Link>
              <Link className="button-secondary" href={`/admin/product-excellence?token=${encodeURIComponent(token)}`}>Product Excellence</Link>
            </div>
          </section>
          <AdminConsole initialToken={token} />
        </>
      )}
    </main>
  );
}
