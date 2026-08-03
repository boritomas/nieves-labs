import Link from 'next/link';
import { cookies } from 'next/headers';
import { BrandLogo } from '@/components/BrandLogo';
import AdminAccessForm from '@/components/AdminAccessForm';
import ConsumerDefenseWizard from '@/components/ConsumerDefenseWizard';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Consumer Defense Lab | Nieves Labs',
};

export default async function ConsumerDefensePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; access?: string }>;
}) {
  const { token = '', access = '' } = await searchParams;
  const cookieStore = await cookies();
  const remembered = cookieStore.get('nieves_founder_access')?.value === 'consumer-defense-v1';
  const tokenAuthorized = Boolean(env.adminToken && token === env.adminToken);
  const authorized = remembered || tokenAuthorized;
  const invalid = Boolean((token && !tokenAuthorized) || access === 'invalid');

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Nieves Labs home">
          <BrandLogo size="sm" />
        </Link>
        <nav className="nav-links">
          <Link href={authorized ? '/admin' : '/'}>{authorized ? 'Admin' : 'Home'}</Link>
        </nav>
      </header>

      {!authorized ? (
        <AdminAccessForm title="Founder Access" invalid={invalid} />
      ) : (
        <ConsumerDefenseWizard />
      )}
    </main>
  );
}
