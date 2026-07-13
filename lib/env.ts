export const env = {
  appBaseUrl: process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000',
  supportEmail: process.env.SUPPORT_EMAIL || 'hello@nieves-labs.com',
  adminToken: process.env.ADMIN_TOKEN || '',
  atlasSessionSecret: process.env.ATLAS_SESSION_SECRET || '',
  atlasFounderEmail: process.env.ATLAS_FOUNDER_EMAIL || '',
  atlasFounderPasswordHash: process.env.ATLAS_FOUNDER_PASSWORD_HASH || '',
  atlasFounderName: process.env.ATLAS_FOUNDER_NAME || 'Tomas Nieves',
};
