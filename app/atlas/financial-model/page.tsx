import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasFinancialModel from '@/components/AtlasFinancialModel';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Financial Model | Atlas',
};

export default async function FinancialModelPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/financial-model');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Financial Model Access" />
      ) : (
        <>
          <AtlasHero token={atlasToken} title="Financial Model" subtitle="Editable 12-month MRR, expense, cash-flow, and repayment model for lender conversations." />
          <AtlasFinancialModel initialAssumptions={data.financialAssumptions} token={atlasToken} />
        </>
      )}
    </main>
  );
}
