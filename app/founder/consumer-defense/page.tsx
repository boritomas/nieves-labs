import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import AdminAccessForm from '@/components/AdminAccessForm';
import CFPBOnlineAutofill from '@/components/CFPBOnlineAutofill';
import ConsumerDefenseLab from '@/components/ConsumerDefenseLab';
import { env } from '@/lib/env';

export const metadata = {
  title: 'Consumer Defense Lab | Nieves Labs',
};

export default async function ConsumerDefensePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Nieves Labs home">
          <BrandLogo size="sm" />
        </Link>
        <nav className="nav-links">
          <Link href={`/admin?token=${encodeURIComponent(token)}`}>Admin</Link>
        </nav>
      </header>

      {!authorized ? (
        <AdminAccessForm title="Founder Access" />
      ) : (
        <>
          <section className="product-hero">
            <p className="eyebrow">Founder-only prototype</p>
            <h1>Consumer Defense Lab</h1>
            <p>
              Build documented credit-report disputes, enforce CFPB escalation gates,
              analyze Citibank collection claims, and research current case law.
            </p>
          </section>
          <CFPBOnlineAutofill />
          <ConsumerDefenseLab />
        </>
      )}
    </main>
  );
}
