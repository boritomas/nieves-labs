# NAIP-OS Platform Release Gate

This document records the Release 0.1 platform consolidation work for Nieves Labs.

## Current Platform Shape

Nieves Labs now treats public products as configuration-driven modules backed by shared platform services:

- Product registry: `lib/products.ts`
- Commerce entry point: `lib/commerce.ts`
- Checkout API: `app/api/checkout/route.ts`
- Intake API: `app/api/intake/route.ts`
- Workflow engine: `lib/workflows.ts`
- Prompt registry: `lib/prompt-registry.ts`
- AI generation: `lib/ai.ts`
- Durable storage selector: `lib/durable-storage.ts`
- Gmail notifications: `lib/email.ts`
- Google Drive / Apps Script integrations: `lib/google.ts`

## Registered Products

- AnswerBrief AI
- Tax Buddy
- Tax Appeal Buddy
- Interview Coach
- Workforce Study
- MixPilot AI
- Nieves AI Platform

## Shared Product Contract

Every product must define:

- Product key and public slug
- Packages and pricing metadata
- Intake schema
- Required files
- Deliverables
- Disclaimer
- Workflow definition
- Lifecycle stage and availability

The default workflow includes:

1. Checkout or package start
2. Durable order creation
3. Product-specific intake
4. Customer file capture
5. Configured deliverable generation
6. Automated quality checks
7. Customer delivery and admin visibility

## What Is Implemented

- One shared checkout API for all product CTAs.
- One shared intake API for all products.
- One shared workflow engine for generation, Drive upload, Apps Script notification, customer email, and workflow logs.
- Versioned prompt registry records for all current products.
- Basic deliverable QA logging.
- Durable storage fail-closed behavior in production when persistent storage is not configured.
- Public CTA audit script.
- Platform integrity audit script.

## Release Gate Status

The platform foundation is implemented. The stricter NAIP-OS release gate is:

- A product may be marked `available` only after its complete customer journey is automated and verified.
- Products without a passing synthetic end-to-end gate must be marked `waitlist` or `internal`.
- AnswerBrief AI is the current flagship/reference implementation for the automated journey.

The full NAIP-OS v3.0 mission is not production-complete until the following are configured and verified in production:

- Durable order storage credentials.
- Stripe secret key and webhook signing secret.
- Product-specific Stripe Price IDs or approved Payment Links for every paid package.
- Gmail OAuth credentials.
- Google Drive OAuth or service account with writable root folder.
- OpenAI API key.
- Admin token.
- End-to-end synthetic order test for each paid product.
- Customer portal authentication.
- Refund/subscription management if subscription products are added.
- Background job queue beyond the current server-side workflow trigger.
- Mobile shell and push notifications.

## Known Limitations

- Workflow execution is server-side and shared, but it is still request-triggered rather than backed by a dedicated external queue.
- The prompt registry is in code. A future release should move prompt records to durable storage with an admin editor and change approval.
- Stripe products are not auto-provisioned from the registry yet.
- The customer portal is represented by intake links and admin views; full account authentication is not yet implemented.
- Current QA validation is structural and conservative. Product-specific validators should be added before high-volume fulfillment.

## Next Release Recommendations

1. Add a protected platform diagnostics endpoint for checkout, storage, Stripe, Gmail, Drive, OpenAI, workflow, and prompt registry readiness.
2. Add a queue-backed job runner with idempotency keys and retry counts.
3. Add customer account authentication and order portal routes.
4. Add Stripe product/price synchronization tooling.
5. Add product-specific fulfillment modules that reuse the shared workflow and prompt registry.
6. Add synthetic end-to-end tests for each product package.
