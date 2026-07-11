# Nieves Labs Product Registry

**Last Updated**: July 2026  
**Version**: 3.0  
**Purpose**: Track each Nieves Labs product as either an external operational application, waitlisted product, coming-soon product, or internal module.

## Architecture Decision

Nieves Labs is the portfolio, discovery, and marketplace website. Operational products own their own production application, commerce, customer data, intake, fulfillment, delivery, notifications, and support workflows.

Do not duplicate AnswerBrief AI infrastructure inside Nieves Labs. AnswerBrief production remains in `boritomas/answerbrief-ai-automation` and at `https://www.answer-brief.com`.

| Product | Status | Operational App | Nieves Labs Path | CTA Behavior |
|---------|--------|-----------------|------------------|--------------|
| AnswerBrief AI | External operational application | https://www.answer-brief.com | `/products/answerbrief-ai` | Link to AnswerBrief app, Fit Check, and packages |
| MixPilot AI | External operational application | https://automix-pro-nine.vercel.app | `/products/mixpilot-ai` | Link to MixPilot app, create flow, and demo |
| Tax Buddy | Waitlist | Not yet available | `/products/tax-buddy` | Request access / contact |
| Tax Appeal Buddy | Waitlist | Not yet available | `/products/tax-appeal-buddy` | Request access / contact |
| Interview Coach | Waitlist | Not yet available | `/products/interview-coach` | Request access / contact |
| Workforce Study | Waitlist | Not yet available | `/products/workforce-study` | Request access / contact |
| Nieves AI Platform | Waitlist / internal platform | Not yet public as operational app | `/products/nieves-ai-platform` | Request access / contact |

## Nieves Labs Portfolio Requirements

- Public product pages load and are responsive.
- Verified operational products link to their production applications.
- Unfinished products do not expose Buy buttons or internal checkout forms.
- Nieves Labs does not require AnswerBrief Stripe, Supabase, Gmail, Google Drive, or OpenAI secrets.
- Legacy checkout, intake, Stripe webhook, and workflow routes return `410 Gone`.
- Admin and operations pages remain protected.
- CTA regression tests verify external links and waitlist safety.
