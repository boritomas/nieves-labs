import { nievesBrand } from '@/lib/brand';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  tone?: 'gold' | 'light' | 'mono';
};

export function BrandLogo({ size = 'md', showWordmark = true, tone = 'gold' }: BrandLogoProps) {
  const src = showWordmark
    ? '/brand/master/nieves-labs-approved-horizontal-lockup.png'
    : '/brand/master/nieves-labs-approved-monogram.png';

  return (
    <span className={`nl-logo nl-logo-${size} nl-logo-${tone}`} aria-label={nievesBrand.name}>
      <img className="nl-logo-asset" src={src} alt={showWordmark ? nievesBrand.name : ''} aria-hidden={showWordmark ? undefined : true} />
    </span>
  );
}
