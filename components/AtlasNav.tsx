import Link from 'next/link';

const atlasNavItems = [
  ['Executive Dashboard', '/atlas'],
  ['Capital Office', '/atlas/capital-office'],
  ['SBA Loan Package', '/atlas/sba-loan-package'],
  ['Financial Model', '/atlas/financial-model'],
  ['Document Vault', '/atlas/document-vault'],
  ['Funding Tracker', '/atlas/funding-tracker'],
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

