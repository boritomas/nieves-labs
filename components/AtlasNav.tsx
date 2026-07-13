import Link from 'next/link';

const atlasNavItems = [
  ['Executive Dashboard', '/atlas'],
  ['Funding Campaign OS', '/atlas/funding-campaign'],
  ['Capital Office', '/atlas/capital-office'],
  ['Readiness', '/atlas/readiness-assessment'],
  ['Founder Intake', '/atlas/founder-intake'],
  ['Import Center', '/atlas/import-center'],
  ['Company Profile', '/atlas/company-profile'],
  ['Founder Profile', '/atlas/founder-profile'],
  ['Personal Financials', '/atlas/personal-financial-profile'],
  ['Use of Funds', '/atlas/use-of-funds'],
  ['Chapter 7', '/atlas/chapter-7'],
  ['Application Builder', '/atlas/application-builder'],
  ['Package Generator', '/atlas/package-generator'],
  ['SBA Loan Package', '/atlas/sba-loan-package'],
  ['Financial Model', '/atlas/financial-model'],
  ['Document Vault', '/atlas/document-vault'],
  ['Lender Research', '/atlas/lender-research'],
  ['Lender Comparison', '/atlas/lender-comparison'],
  ['Requirement Mapping', '/atlas/requirement-mapping'],
  ['Funding Tracker', '/atlas/funding-tracker'],
  ['Founder Review', '/atlas/founder-review'],
  ['Manual Submission', '/atlas/manual-submission'],
  ['Follow-up Tracker', '/atlas/follow-up-tracker'],
  ['Due Diligence Checklist', '/atlas/due-diligence-checklist'],
];

export default function AtlasNav({ token }: { token: string }) {
  const tokenQuery = `?token=${encodeURIComponent(token)}`;

  return (
    <nav className="atlas-nav" aria-label="Atlas Capital Office navigation">
      {atlasNavItems.map(([label, href]) => (
        <Link key={href} href={`${href}${tokenQuery}`}>{label}</Link>
      ))}
    </nav>
  );
}
