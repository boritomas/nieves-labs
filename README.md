# Nieves Labs

NievesLabs.com is the portfolio, discovery, and marketplace website for Nieves Labs products. It presents product pages, routes visitors to verified operational product applications, and keeps unfinished products on waitlist until their independent customer journeys are production-ready.

Production site: https://nieves-labs.com

## Products

- AnswerBrief AI: operational app at https://www.answer-brief.com
- MixPilot AI: operational app at https://automix-pro-nine.vercel.app
- Tax Buddy: waitlist
- Tax Appeal Buddy: waitlist
- Interview Coach: waitlist
- Workforce Study: waitlist
- Nieves AI Platform: waitlist / internal platform work

## Architecture

Nieves Labs is not the backend for operational products. Each operational product owns its own production application, commerce, customer data, intake, fulfillment, delivery, and support workflow.

- `app/page.tsx`: public portfolio hub
- `app/products/[slug]/page.tsx`: product discovery pages and external app/waitlist CTAs
- `app/admin/page.tsx`: protected admin entry point
- `app/admin/operations/page.tsx`: protected portfolio operations notes
- `app/atlas/*`: internal Atlas Capital Office module
- `lib/products.ts`: portfolio product registry with operational-app and waitlist status
- `scripts/check-public-ctas.mjs`: public CTA regression checks
- `scripts/check-platform-integrity.mjs`: architecture regression checks

The legacy Nieves Labs checkout, intake, Stripe webhook, and workflow endpoints are disabled with `410 Gone` responses. They remain present only as guardrails so accidental calls fail safely with a clear message.

## Verification

```bash
npm install
npm run check:platform
npm run check:ctas
npm run lint
npx tsc --noEmit
npm run build
```

## Required Production Variables

Nieves Labs portfolio production requires only:

- `APP_BASE_URL`
- `NEXT_PUBLIC_APP_BASE_URL`
- `ADMIN_TOKEN`

Do not copy operational product secrets into Nieves Labs. In particular, AnswerBrief AI production secrets belong only in `boritomas/answerbrief-ai-automation` and its Vercel project.

Do not configure these in Nieves Labs for AnswerBrief duplication:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Gmail OAuth credentials
- Google Drive OAuth credentials
- `OPENAI_API_KEY`
- AnswerBrief Supabase credentials

## Deployment

The repository is configured for Vercel with `vercel.json`.

1. Deploy `main` to the existing `nieves-labs` Vercel project.
2. Ensure `nieves-labs.com` and `www.nieves-labs.com` point to the latest production deployment.
3. Verify AnswerBrief CTAs route to `https://www.answer-brief.com`.
4. Verify unfinished product CTAs route to `/contact` and do not expose Buy buttons.
5. Run the CTA and platform integrity checks.
