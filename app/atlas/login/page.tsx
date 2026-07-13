import { redirect } from 'next/navigation';
import AtlasLoginForm from '@/components/AtlasLoginForm';
import { BrandLogo } from '@/components/BrandLogo';
import { getAtlasSession, isSafeAtlasReturnTo } from '@/lib/atlas-auth';

export const metadata = {
  title: 'Sign in | Atlas',
};

export default async function AtlasLoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo = '/atlas' } = await searchParams;
  const safeReturnTo = isSafeAtlasReturnTo(returnTo) ? returnTo : '/atlas';
  const session = await getAtlasSession();
  if (session) redirect(safeReturnTo);

  return (
    <main className="founder-shell atlas-login-shell">
      <section className="admin-access panel atlas-login-panel">
        <BrandLogo size="md" />
        <p className="eyebrow">Atlas Capital Office</p>
        <h1>Sign in once. Keep moving.</h1>
        <p>Access the Nieves Labs funding workspace, campaign tracker, lender packages, and follow-up loop without URL tokens.</p>
        <AtlasLoginForm returnTo={safeReturnTo} />
      </section>
    </main>
  );
}
