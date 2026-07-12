import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasCompanyProfileForm } from '@/components/AtlasProfileForm';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Founder Profile | Atlas' };

export default async function FounderProfilePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Founder Profile Access" /> : (
        <>
          <AtlasHero token={token} title="Founder Profile" subtitle="Founder ownership, employment, background, credit range, stable income, and underwriting context." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} />
          <AtlasCompanyProfileForm
            token={token}
            title="Founder information"
            initialProfile={data.companyProfile}
            fields={[
              { key: 'founderName', label: 'Founder name' },
              { key: 'ownershipPercent', label: 'Ownership %', type: 'number' },
              { key: 'founderEmployment', label: 'Employment' },
              { key: 'personalCreditRange', label: 'Personal credit range' },
              { key: 'bankruptcyStatus', label: 'Bankruptcy' },
              { key: 'existingDebt', label: 'Existing debt', type: 'number' },
              { key: 'stableIncome', label: 'Stable income', type: 'textarea' },
              { key: 'founderBackground', label: 'Founder background', type: 'textarea' },
              { key: 'timeline', label: 'Funding timeline', type: 'textarea' },
            ]}
          />
        </>
      )}
    </main>
  );
}
