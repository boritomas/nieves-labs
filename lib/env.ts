export const env = {
  appBaseUrl: process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000',
  supportEmail: process.env.SUPPORT_EMAIL || 'hello@nieves-labs.com',
  adminToken: process.env.ADMIN_TOKEN || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN || '',
  googleDriveRootId: process.env.GOOGLE_DRIVE_FOLDER_ROOT_ID || '',
  googleAppsScriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL || '',
  gmailClientId: process.env.GMAIL_CLIENT_ID || '',
  gmailClientSecret: process.env.GMAIL_CLIENT_SECRET || '',
  gmailRefreshToken: process.env.GMAIL_REFRESH_TOKEN || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
};

export function requiredCredentialStatus() {
  return {
    stripe: Boolean(env.stripeSecretKey && env.stripeWebhookSecret),
    googleDrive: Boolean(env.googleClientId && env.googleClientSecret && env.googleRefreshToken && env.googleDriveRootId),
    gmail: Boolean(env.gmailClientId && env.gmailClientSecret && env.gmailRefreshToken),
    appsScript: Boolean(env.googleAppsScriptUrl),
    openai: Boolean(env.openaiApiKey),
    admin: Boolean(env.adminToken),
  };
}
