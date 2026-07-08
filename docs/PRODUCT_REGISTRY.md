# Nieves Labs Product Registry

**Last Updated**: July 2026  
**Version**: 2.0  
**Purpose**: Track every operational Nieves Labs product, package, workflow, and production dependency.

| Product | Category | Status | Repository | Production Path | Workflow Key | Next Milestone |
|---------|----------|--------|------------|-----------------|--------------|----------------|
| AnswerBrief AI | SaaS | Operational workflow | boritomas/nieves-labs | `/products/answerbrief-ai` | `answerbrief_ai` | Configure Stripe/Google/Gmail credentials |
| Tax Buddy | SaaS | Operational workflow | boritomas/nieves-labs | `/products/tax-buddy` | `tax_buddy` | Configure production storage |
| Tax Appeal Buddy | SaaS | Operational workflow | boritomas/nieves-labs | `/products/tax-appeal-buddy` | `tax_appeal_buddy` | Validate appeal packet templates |
| Interview Coach | SaaS | Operational workflow | boritomas/nieves-labs | `/products/interview-coach` | `interview_coach` | Add optional AI refinement |
| Workforce Study | SaaS | Operational workflow | boritomas/nieves-labs | `/products/workforce-study` | `workforce_study` | Add durable report storage |
| MixPilot AI | Product app + hub | Free beta / operational workflow | boritomas/automix-pro + boritomas/nieves-labs | `/products/mixpilot-ai` | `mixpilot_ai` | Decide paid checkout timing; keep `automix_pro` alias |
| Nieves AI Platform | Platform | Operational workflow | boritomas/nieves-labs | `/products/nieves-ai-platform` | `nieves_ai_platform` | Configure consulting package fulfillment |

## Shared Operational Requirements

- Polished landing page
- Working package CTA
- Stripe-ready checkout
- Secure intake token
- Product-specific questions
- File upload support
- Shared workflow execution
- Google Drive folder creation
- Gmail notification automation
- Deliverable generation
- Admin dashboard visibility
- Logs and needs-review status

## Current Credential Dependencies

Production automation requires Stripe, Google Drive, Gmail, and optional OpenAI credentials. Missing credentials are logged and surfaced in protected `/admin` and `/admin/operations`.
