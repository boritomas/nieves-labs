# Nieves Labs Environment Matrix

This file documents the normalized Nieves Labs environment schema and the approved source projects where equivalent variable names were found. It intentionally contains variable names only, never secret values.

## Configured in `nieves-labs`

| Variable | Origin | Status |
|---|---|---|
| `ADMIN_TOKEN` | Generated for `nieves-labs` production | Configured |
| `APP_BASE_URL` | `nieves-labs` production | Configured |
| `NEXT_PUBLIC_APP_BASE_URL` | `nieves-labs` production | Configured |

## Canonical Schema

| Canonical variable | Accepted source aliases | Source projects where aliases were found |
|---|---|---|
| `APP_BASE_URL` | `NEXT_PUBLIC_APP_BASE_URL`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_SITE_URL` | `nieves-labs`, `answerbrief-ai-automation-riwu`, `tomas-founder-ai-portfolio` |
| `SUPPORT_EMAIL` | `ANSWERBRIEF_NOTIFY_EMAIL`, `LAB_NOTIFY_EMAIL`, `BLOG_DRAFT_NOTIFY_EMAIL`, `GMAIL_FROM_EMAIL` | `answerbrief-ai-automation-riwu`, `tomas-founder-ai-portfolio` |
| `ADMIN_TOKEN` | `ADMIN_DASHBOARD_PASSWORD` | `nieves-labs`; alias listed in legacy examples |
| `STRIPE_SECRET_KEY` | none | not found in inspected Vercel projects |
| `STRIPE_WEBHOOK_SECRET` | none | not found in inspected Vercel projects |
| `STRIPE_PRICE_ANSWERBRIEF_BRIEF` | none | not found in inspected Vercel projects |
| `STRIPE_PRICE_ANSWERBRIEF_PREMIUM` | none | not found in inspected Vercel projects |
| `STRIPE_PRICE_TAX_BUDDY_ORGANIZE` | none | not found in inspected Vercel projects |
| `STRIPE_PRICE_TAX_APPEAL_PACKET` | none | not found in inspected Vercel projects |
| `STRIPE_PRICE_INTERVIEW_COACH_PLAN` | none | not found in inspected Vercel projects |
| `STRIPE_PRICE_WORKFORCE_STUDY_REPORT` | none | not found in inspected Vercel projects |
| `STRIPE_PRICE_PLATFORM_CONSULTATION` | none | not found in inspected Vercel projects |
| `STRIPE_PRICE_MIXPILOT_FREE_BETA` | none | not found in inspected Vercel projects; optional while MixPilot AI is Free Beta |
| `NEXT_PUBLIC_MIXPILOT_AI_URL` | `MIXPILOT_AI_URL` | standalone product app; defaults to existing `automix-pro` Vercel deployment |
| `PAYMENT_LINK_ANSWERBRIEF_QUICK_PREP` | `NEXT_PUBLIC_STRIPE_QUICK_PREP_LINK` | `answerbrief-ai-automation-riwu` |
| `PAYMENT_LINK_ANSWERBRIEF_FULL_BRIEF` | `NEXT_PUBLIC_STRIPE_FULL_INTERVIEW_BRIEF_LINK` | `answerbrief-ai-automation-riwu` |
| `PAYMENT_LINK_ANSWERBRIEF_PREMIUM_PREP` | `NEXT_PUBLIC_STRIPE_PREMIUM_PREP_LINK` | `answerbrief-ai-automation-riwu` |
| `GOOGLE_CLIENT_ID` | none | not found in inspected Vercel projects |
| `GOOGLE_CLIENT_SECRET` | none | not found in inspected Vercel projects |
| `GOOGLE_REFRESH_TOKEN` | none | not found in inspected Vercel projects |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | none | `answerbrief-ai-automation-riwu`, `tomas-founder-ai-portfolio` |
| `GOOGLE_PRIVATE_KEY` | none | `answerbrief-ai-automation-riwu`, `tomas-founder-ai-portfolio` |
| `GOOGLE_DRIVE_FOLDER_ROOT_ID` | `GOOGLE_DRIVE_ROOT_FOLDER_ID` | legacy examples only; not found in inspected Vercel projects |
| `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` | `GOOGLE_APPS_SCRIPT_URL` | not found in inspected Vercel projects |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | none | `answerbrief-ai-automation-riwu`, `tomas-founder-ai-portfolio` |
| `GOOGLE_SHEETS_ORDERS_SHEET_NAME` | `GOOGLE_SHEETS_SHEET_NAME` | `answerbrief-ai-automation-riwu`, `tomas-founder-ai-portfolio` |
| `GOOGLE_SHEETS_INTAKE_SHEET_NAME` | `GOOGLE_SHEETS_SHEET_NAME` | `answerbrief-ai-automation-riwu`, `tomas-founder-ai-portfolio` |
| `GMAIL_CLIENT_ID` | none | `answerbrief-ai-automation-riwu`, `tomas-founder-ai-portfolio` |
| `GMAIL_CLIENT_SECRET` | none | `answerbrief-ai-automation-riwu`, `tomas-founder-ai-portfolio` |
| `GMAIL_REFRESH_TOKEN` | none | `answerbrief-ai-automation-riwu`, `tomas-founder-ai-portfolio` |
| `GMAIL_FROM_EMAIL` | `GMAIL_SENDER_EMAIL` | `answerbrief-ai-automation-riwu`, `tomas-founder-ai-portfolio` |
| `OPENAI_API_KEY` | none | not found in inspected Vercel projects |
| `DATABASE_URL` | `POSTGRES_URL`, `NEON_DATABASE_URL`, `SUPABASE_DB_URL` | not found in inspected Vercel projects |
| `BLOB_READ_WRITE_TOKEN` | none | not found in inspected Vercel projects |

## Inspection Result

Vercel listed encrypted environment variable names for `answerbrief-ai-automation-riwu` and `tomas-founder-ai-portfolio`, but `vercel env pull` returned empty placeholders for user-managed encrypted values in this Codex session. Because the actual secret values were not retrievable, they were not copied into `nieves-labs`.

## Projects Inspected

- `nieves-labs`
- `answerbrief-ai-automation-riwu`
- `answerbrief-ai-automation`
- `tomas-founder-ai-portfolio`
- `automix-pro`
