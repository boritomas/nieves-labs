# Atlas Capital Office

Atlas is an internal first-class module inside the Nieves AI Platform. It uses the same admin-token protection pattern as the existing admin console and the same lightweight app-storage convention as orders.

## Release 0.1 routes

- `/atlas`
- `/atlas/capital-office`
- `/atlas/sba-loan-package`
- `/atlas/financial-model`
- `/atlas/document-vault`
- `/atlas/funding-tracker`
- `/atlas/due-diligence-checklist`

All routes require the existing admin token query parameter.

## Release 0.2 summary

Release 0.2 upgrades Atlas from a static capital workspace into a lender-ready SBA/CDFI application engine. It adds a guided application builder, generated in-app markdown previews, richer lender tracking, founder review mode, and readiness scoring that reflects more of the actual funding workflow.

## Release 0.2 routes added

- `/atlas/application-builder`
- `/atlas/founder-review`

## Generated previews

The Application Builder can generate in-app markdown previews for:

- Executive Summary
- SBA Microloan Application Narrative
- CDFI Application Narrative
- Use of Funds Summary
- Repayment Strategy
- Chapter 7 Explanation

These are previews only. PDF/file export is intentionally deferred.

## Storage equivalent

Release 0.1 stores Atlas records in `.data/atlas.json` through `lib/atlas-store.ts`. The data model is intentionally database-ready and maps to these future tables:

- `atlas_company_profile`
- `atlas_financial_assumptions`
- `atlas_funding_opportunities`
- `atlas_documents`
- `atlas_risks`
- `atlas_tasks`
- `atlas_readiness_scores`

## Release 0.2 data model updates

Release 0.2 adds:

- `atlas_application_sections`
- Expanded fields on `atlas_funding_opportunities`:
  - lender/intermediary name
  - website
  - application URL
  - contact name
  - contact email
  - phone
  - fit score
  - requirements
  - next follow-up date
  - last contacted date
  - status notes
- Expanded readiness score breakdown:
  - required documents
  - financial assumptions
  - funding tracker
  - due diligence tasks
  - risk mitigation
  - application sections

No new environment variables are required for Release 0.1 or Release 0.2.

## Known limitations

- Atlas prepares application materials but does not submit lender, grant, SBA, or CDFI applications automatically.
- Generated previews are markdown-style in-app previews only.
- Document Vault uses completion status and upload placeholders; actual file attachments remain handled outside Atlas Release 0.2.
- Financial model assumptions are simplified and should be reviewed before lender use.
- Chapter 7 language is preparation support only and should be reviewed carefully before external submission.

## Future Release 0.3 recommendations

- Add PDF/DOCX export for generated lender packets.
- Add real file upload links from Document Vault to the existing Google Drive workflow.
- Add application packet version history and founder approvals.
- Add lender-specific requirement templates.
- Add scenario modeling for low/base/high revenue cases.
- Add reminders for next follow-up dates and deadline tracking.
- Add optional read-only board view for advisors or funding partners.
