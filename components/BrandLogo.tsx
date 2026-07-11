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
            <linearGradient id="nl-metal" x1="9" y1="8" x2="55" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFF1AE" />
              <stop offset="0.18" stopColor="#D4AF37" />
              <stop offset="0.42" stopColor="#9B6A18" />
              <stop offset="0.7" stopColor="#F2C14E" />
              <stop offset="1" stopColor="#6F4712" />
            </linearGradient>
            <linearGradient id="nl-highlight" x1="18" y1="12" x2="48" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFF4B7" />
              <stop offset="1" stopColor="#E2B645" />
            </linearGradient>
          </defs>
          <path className="nl-frame-shadow" d="M12 54V10h40v44" />
          <path className="nl-frame" d="M12 54V10h40v44" />
          <path className="nl-stroke-shadow" d="M18 52V14l28 38V14" />
          <path className="nl-stroke" d="M18 52V14l28 38V14" />
          <path className="nl-cut" d="M27 15h13l8 11" />
          <path className="nl-shine" d="M14 12h13" />
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
