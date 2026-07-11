import { nievesBrand } from '@/lib/brand';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  tone?: 'gold' | 'light' | 'mono';
};

export function BrandLogo({ size = 'md', showWordmark = true, tone = 'gold' }: BrandLogoProps) {
  return (
    <span className={`nl-logo nl-logo-${size} nl-logo-${tone}`} aria-label={nievesBrand.name}>
      <span className="nl-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img" focusable="false">
          <defs>
            <linearGradient id="nl-metal" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFE18D" />
              <stop offset="0.22" stopColor="#D4AF37" />
              <stop offset="0.5" stopColor="#A9771C" />
              <stop offset="0.72" stopColor="#F2C14E" />
              <stop offset="1" stopColor="#7A5415" />
            </linearGradient>
            <linearGradient id="nl-highlight" x1="16" y1="8" x2="46" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFF4B7" />
              <stop offset="1" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
          <path className="nl-frame" d="M10 10h44v44H10z" />
          <path className="nl-stroke-shadow" d="M18 48V16l28 32V16" />
          <path className="nl-stroke" d="M18 48V16l28 32V16" />
          <path className="nl-cut" d="M24 16h8l14 16" />
          <path className="nl-shine" d="M13 13h17" />
        </svg>
      </span>
      {showWordmark ? (
        <span className="nl-wordmark">
          <strong>Nieves Labs</strong>
          <small>{nievesBrand.promise}</small>
        </span>
      ) : null}
    </span>
  );
}
