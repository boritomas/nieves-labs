# Nieves Labs

NievesLabs.com is the central product hub for Nieves Labs applications. It includes public product pages, package checkout, tokenized intake, file uploads, workflow automation, structured deliverable generation, Gmail/Google Drive integration points, and an admin console.

Production site: https://nieveslabs.com

## Products

- AnswerBrief AI
- Tax Buddy
- Tax Appeal Buddy
- Interview Coach
- Workforce Study
- Nieves AI Platform

## Architecture

- `app/page.tsx`: public product hub
- `app/products/[slug]/page.tsx`: product landing, pricing, checkout CTAs
- `app/intake/[token]/page.tsx`: secure order intake and uploads
- `app/admin/page.tsx`: order, workflow, credential, log, and review dashboard
- `app/api/checkout`: order creation and Stripe Checkout session creation
- `app/api/webhooks/stripe`: Stripe webhook validation and payment updates
- `app/api/intake`: intake answers, file uploads, and workflow start
- `app/api/workflows/run`: admin workflow rerun endpoint
- `lib/workflows.ts`: shared `runWorkflow(productKey, orderId)` engine
- `lib/google.ts` and `lib/email.ts`: Google Drive, Apps Script, and Gmail adapters
- `lib/store.ts`: local JSON storage adapter for orders, customers, uploads, deliverables, logs, and workflow status

The local JSON adapter is useful for development and preview verification. Before high-volume production use, replace it with durable storage such as Postgres, Supabase, Neon, or another managed database.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Required Production Variables

See `.env.local.example` and `/docs/operations`.

Critical variables:

- `APP_BASE_URL`
- `SUPPORT_EMAIL`
- `ADMIN_TOKEN`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Stripe price IDs for every product package
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_DRIVE_FOLDER_ROOT_ID`
- `GOOGLE_APPS_SCRIPT_URL`
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`
- `OPENAI_API_KEY`

## Deployment

The repository is configured for Vercel with `vercel.json`.

1. Configure environment variables in Vercel.
2. Deploy `main`.
3. Set `ADMIN_TOKEN`; production admin APIs fail closed without it.
4. Configure the Stripe webhook endpoint: `/api/webhooks/stripe`.
5. Run a test purchase for each product.
6. Confirm admin console statuses and logs at `/admin`.

## Credential Behavior

If Stripe credentials are missing, checkout creates a traceable manual-review order and redirects to secure intake. If Google Drive, Gmail, Apps Script, or OpenAI credentials are missing, the workflow logs the skipped step and generates structured templates instead of failing.
