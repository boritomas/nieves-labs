import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasFinancialModel from '@/components/AtlasFinancialModel';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Financial Model | Atlas',
};

export default async function FinancialModelPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Financial Model Access" />
      ) : (
        <>
          <AtlasHero token={token} title="Financial Model" subtitle="Editable 12-month MRR, expense, cash-flow, and repayment model for lender conversations." />
          <AtlasFinancialModel initialAssumptions={data.financialAssumptions} token={token} />
        </>
      )}
    </main>
  );
}
