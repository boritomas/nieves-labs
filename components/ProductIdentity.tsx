import type { CSSProperties } from 'react';
import { brandProducts, productBrandByKey, type BrandProductKey } from '@/lib/brand';

type ProductIdentityProps = {
  productKey: BrandProductKey;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export function ProductIdentity({ productKey, showName = true, size = 'md' }: ProductIdentityProps) {
  const product = productBrandByKey[productKey];

  return (
    <span
      className={`product-identity product-identity-${size}`}
      style={{ '--product-accent': product.accent, '--product-soft': product.accentSoft } as CSSProperties}
    >
      <ProductIcon productKey={productKey} />
      {showName ? (
        <span>
          <strong>{product.name}</strong>
          <small>{product.category}</small>
        </span>
      ) : null}
    </span>
  );
}

export function ProductIcon({ productKey }: { productKey: BrandProductKey }) {
  const product = productBrandByKey[productKey];

  return (
    <span
      className="product-icon"
      style={{ '--product-accent': product.accent, '--product-soft': product.accentSoft } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" focusable="false">
        <ProductIconGlyph icon={product.icon} />
      </svg>
    </span>
  );
}

function ProductIconGlyph({ icon }: { icon: string }) {
  switch (icon) {
    case 'message':
      return (
        <>
          <path d="M16 18h32a8 8 0 0 1 8 8v10a8 8 0 0 1-8 8H32l-12 8v-8h-4a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8Z" />
          <circle cx="24" cy="31" r="3" />
          <circle cx="32" cy="31" r="3" />
          <circle cx="40" cy="31" r="3" />
        </>
      );
    case 'flask':
      return (
        <>
          <path d="M25 10h14M28 10v14L15 48a6 6 0 0 0 5 9h24a6 6 0 0 0 5-9L36 24V10" />
          <path d="M21 44h22" />
          <circle cx="27" cy="50" r="2" />
          <circle cx="38" cy="47" r="3" />
        </>
      );
    case 'document':
      return (
        <>
          <path d="M18 10h22l8 8v36H18z" />
          <path d="M40 10v10h10M25 29h18M25 38h18M25 47h10" />
          <path d="m42 45 4 4 8-10" />
        </>
      );
    case 'columns':
      return (
        <>
          <path d="M12 24h40L32 12zM16 28h32M18 32v18M30 32v18M42 32v18M14 54h36" />
        </>
      );
    case 'person':
      return (
        <>
          <circle cx="32" cy="20" r="8" />
          <path d="M18 52a14 14 0 0 1 28 0M14 30l8 5M50 30l-8 5" />
          <path d="M32 35v10" />
        </>
      );
    case 'chart':
      return (
        <>
          <path d="M14 50h38M20 50V34M32 50V24M44 50V16" />
          <path d="m16 28 10-8 8 6 14-14" />
          <path d="M45 12h7v7" />
        </>
      );
    case 'network':
      return (
        <>
          <circle cx="32" cy="32" r="6" />
          <circle cx="16" cy="18" r="5" />
          <circle cx="50" cy="18" r="5" />
          <circle cx="17" cy="48" r="5" />
          <circle cx="50" cy="48" r="5" />
          <path d="M21 22 28 29M37 28l9-7M21 45l7-9M37 36l9 9" />
        </>
      );
    default:
      return <path d="M16 16h32v32H16z" />;
  }
}

export function ProductEcosystemStrip() {
  return (
    <div className="ecosystem-strip" aria-label="Nieves AI product ecosystem">
      {brandProducts.map((product) => (
        <ProductIdentity key={product.key} productKey={product.key} size="sm" />
      ))}
    </div>
  );
}
