import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasCompanyProfileForm } from '@/components/AtlasProfileForm';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Company Profile | Atlas' };

export default async function CompanyProfilePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Company Profile Access" /> : (
        <>
          <AtlasHero token={token} title="Master Company Profile" subtitle="One reusable source of truth for company, product, business, revenue, funding request, risks, and version history." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} />
          <AtlasCompanyProfileForm
            token={token}
            title="Company, business, and funding profile"
            initialProfile={data.companyProfile}
            fields={[
              { key: 'companyName', label: 'Company name' },
              { key: 'ein', label: 'EIN' },
              { key: 'state', label: 'State' },
              { key: 'industry', label: 'Industry' },
              { key: 'timeInBusiness', label: 'Time in business' },
              { key: 'currentRevenue', label: 'Current revenue', type: 'number' },
              { key: 'currentMrr', label: 'Current MRR', type: 'number' },
              { key: 'customers', label: 'Customers', type: 'number' },
              { key: 'businessStage', label: 'Business stage' },
              { key: 'businessSummary', label: 'Business summary', type: 'textarea' },
              { key: 'revenueAssumptions', label: 'Revenue model', type: 'textarea' },
              { key: 'fundingRequest', label: 'Funding request', type: 'textarea' },
              { key: 'useOfFunds', label: 'Use of funds summary', type: 'textarea' },
              { key: 'repaymentStrategy', label: 'Repayment strategy', type: 'textarea' },
              { key: 'riskMitigation', label: 'Risk mitigation', type: 'textarea' },
            ]}
          />
          <section className="panel"><p className="eyebrow">Version history</p><ul className="atlas-list">{data.companyProfile.versionHistory.map((item) => <li key={item}>{item}</li>)}</ul></section>
        </>
      )}
    </main>
  );
}
