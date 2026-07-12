# Atlas Capital Office

Atlas is an internal first-class module inside the Nieves AI Platform. It uses the same admin-token protection pattern as the existing admin console and the same lightweight app-storage convention as orders.

Atlas prepares founder-reviewed lender materials. It does not submit applications automatically, does not guarantee approval, and should not be presented as legal, tax, credit, or underwriting advice.

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

## Release 1.0 summary

Release 1.0 turns Atlas into an internal loan application agent for SBA Microloan, CDFI, grant, and lender package preparation. It adds a full workflow backbone from readiness assessment through manual submission and follow-up tracking while preserving the existing Atlas dashboard, financial model, package generator, founder review, and storage conventions.

## Release 1.0 routes added

- `/atlas/readiness-assessment`
- `/atlas/company-profile`
- `/atlas/founder-profile`
- `/atlas/personal-financial-profile`
- `/atlas/business-financial-profile`
- `/atlas/chapter-7`
- `/atlas/use-of-funds`
- `/atlas/package-generator`
- `/atlas/lender-research`
- `/atlas/lender-comparison`
- `/atlas/requirement-mapping`
- `/atlas/manual-submission`
- `/atlas/follow-up-tracker`

## Release 1.0 workflow stages

Atlas now models the internal lender workflow as:

1. Readiness Assessment
2. Company Profile
3. Founder Profile
4. Personal Financial Profile
5. Business Financial Profile
6. Document Vault
7. Lender Research
8. Lender Comparison
9. Requirement Mapping
10. Application Builder
11. Package Generator
12. Founder Review
13. Manual Submission
14. Follow-up Tracker

The dashboard displays stage status, readiness gaps, latest package status, missing founder approvals, and the next recommended action.

## Release 1.0 storage updates

Release 1.0 extends the Atlas storage shape with database-ready equivalents for:

- `atlas_personal_financial_profile`
- `atlas_chapter_seven_workflow`
- `atlas_use_of_funds_plan`
- `atlas_package_versions`
- `atlas_founder_approvals`
- `atlas_generated_packages`
- `atlas_workflow_stages`

The current implementation remains file-backed through `.data/atlas.json`. These records are intentionally structured so they can be moved to a durable database later without changing the UI workflow.

## Release 1.0 package generation

The Package Generator route produces lender-ready in-app package content for:

- Cover Page
- Executive Summary
- Business Overview
- Founder Background
- Funding Request
- Use of Funds
- Revenue Assumptions
- Repayment Strategy
- Risk Mitigation
- Chapter 7 Explanation
- Required Documents Checklist
- Due Diligence Status
- Lender Follow-Up Plan

Users can copy individual sections, copy the full package, download markdown, and download HTML. PDF and DOCX export remain future work.

## Founder approval gate

Atlas prevents package status changes to `Ready` or `Submitted` until the founder confirms:

- Funding amount reviewed
- Use of funds reviewed
- Revenue assumptions reviewed
- Repayment strategy reviewed
- Chapter 7 explanation reviewed
- Required documents confirmed
- Atlas prepares documents only and does not submit applications

If the user attempts to move a package to `Ready` or `Submitted` without all confirmations, Atlas keeps the package in `Founder Review`.

## Release 1.0 known limitations

- Manual submission is still required by Tomas or an authorized founder/operator.
- Lender websites, requirements, and underwriting criteria must be independently verified before use.
- Chapter 7 explanation drafts require founder review and, where appropriate, legal or financial advisor review.
- The Document Vault still tracks completion status and placeholders; it does not yet provide attached file storage inside Atlas.
- Package exports are markdown/HTML only.
- Atlas provides preparation support only and never guarantees funding approval.

## Future Release 1.1 recommendations

- Add database-backed persistence for Atlas records.
- Add file attachments to Document Vault using the existing secure storage provider.
- Add lender-specific requirement templates and deadline reminders.
- Add package PDF/DOCX export.
- Add scenario-based financial projections and DSCR-style repayment analysis.
- Add review notes and approval history by reviewer.
