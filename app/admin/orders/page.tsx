import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import AdminAccessForm from '@/components/AdminAccessForm';
import AdminConsole from '@/components/AdminConsole';
import { env } from '@/lib/env';

export const metadata = {
  title: 'Orders | Nieves Labs Admin',
};

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Nieves Labs home"><BrandLogo size="sm" /></Link>
        <nav className="nav-links"><Link href="/">Home</Link><Link href={`/admin?token=${encodeURIComponent(token)}`}>Admin</Link></nav>
      </header>
      {!authorized ? (
        <AdminAccessForm title="Orders Access" />
      ) : (
        <>
          <section className="product-hero">
            <p className="eyebrow">Internal</p>
            <h1>Orders</h1>
            <p>Review order status, fulfillment progress, and recent activity.</p>
          </section>
          <AdminConsole initialToken={token} />
        </>
      )}
    </main>
  );
}
