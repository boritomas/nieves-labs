# Nieves Labs Environment Matrix

**Architecture**: Nieves Labs is the portfolio and marketplace website. Operational product secrets belong to each operational product application, not to the Nieves Labs Vercel project.

## Required for Nieves Labs Production

| Variable | Purpose |
|----------|---------|
| `APP_BASE_URL` | Canonical production base URL |
| `NEXT_PUBLIC_APP_BASE_URL` | Public base URL for links and tests |
| `ADMIN_TOKEN` | Protected admin/operations access |

## Not Required in Nieves Labs

The following are intentionally not required for Nieves Labs because operational products own their own commerce, intake, fulfillment, and delivery systems:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Stripe product/price IDs
- Gmail OAuth credentials
- Google Drive OAuth credentials
- Google service account keys
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `OPENAI_API_KEY`
- AnswerBrief Supabase credentials
- AnswerBrief payment links

## Operational Product Ownership

| Product | Operational project |
|---------|---------------------|
| AnswerBrief AI | `boritomas/answerbrief-ai-automation`, https://www.answer-brief.com |
| MixPilot AI | `boritomas/automix-pro`, https://automix-pro-nine.vercel.app |
| Other products | Waitlist until independent operational applications exist |
