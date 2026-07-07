import Link from 'next/link';
import AdminConsole from '@/components/AdminConsole';

export const metadata = {
  title: 'Admin Console | Nieves Labs',
};

export default function AdminPage() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">NL</span><span>Nieves Labs</span></Link>
        <nav className="nav-links"><Link href="/">Home</Link><Link href="/#products">Products</Link></nav>
      </header>
      <section className="product-hero">
        <p className="eyebrow">Operations</p>
        <h1>Admin Console</h1>
        <p>Track orders, customers, payments, Drive folders, workflow status, email status, logs, errors, needs review, and completed work.</p>
      </section>
      <AdminConsole />
    </main>
  );
}
