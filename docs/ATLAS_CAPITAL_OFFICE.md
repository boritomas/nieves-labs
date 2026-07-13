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

## Release 1.1 summary

Release 1.1 adds protected automatic document ingestion and profile population through the Atlas Import Center. Atlas can now discover approved project source documents, parse supported document formats, map lender-relevant fields into the Atlas data model, create a founder review queue, flag conflicts and evidence gaps, and generate a new founder-review package draft from imported source material.

Atlas never modifies original files. It also excludes sensitive personal, banking, tax, identification, and bankruptcy case-number data from automatic profile population.

## Release 1.1 route added

- `/atlas/import-center`

This route is protected by the existing admin token pattern.

## Release 1.1 import API

- `GET /api/atlas/import`
- `POST /api/atlas/import`

Supported actions:

- `scan`
- `preview`
- `import`
- `approve-field`
- `reject-field`
- `defer-field`
- `mark-assumption`

## Release 1.1 source discovery

Atlas scans approved project locations only:

- `docs/`
- `outputs/`
- `seed_assets/`
- `public/`
- `data/`
- `.data/`
- `work/`
- the workspace-level `outputs/` folder

The scanner excludes build, dependency, git, Vercel, and denylisted sensitive/unrelated paths.

## Release 1.1 supported parsing

Atlas supports:

- DOCX
- PDF
- XLSX
- CSV
- Markdown
- TXT
- JSON

DOCX and XLSX are parsed server-side from ZIP XML content. PDF parsing is a conservative text extraction pass and does not perform OCR.

## Release 1.1 storage updates

Release 1.1 extends the file-backed Atlas storage shape with database-ready equivalents for:

- `atlas_source_documents`
- `atlas_document_imports`
- `atlas_extracted_sections`
- `atlas_imported_fields`
- `atlas_field_sources`
- `atlas_field_conflicts`
- `atlas_field_versions`
- `atlas_import_runs`
- `atlas_import_errors`
- `atlas_founder_review_queue`
- `atlas_staleness_flags`
- `atlas_evidence_gaps`

The current implementation remains file-backed through `.data/atlas.json`.

## Release 1.1 source traceability

Imported fields record:

- filename
- source path
- file type
- source section
- import timestamp
- original value
- normalized value
- classification
- confidence
- verification status
- founder approval status

## Release 1.1 founder review rules

Low-risk, non-sensitive, non-conflicting fields can be bulk-reviewed after source confirmation. The following categories require individual review before lender-facing use:

- funding amounts
- revenue assumptions
- use of funds
- repayment strategy
- founder biography/background
- Chapter 7 explanation
- personal financial information
- lender-facing claims

## Release 1.1 known limitations

- OCR is not implemented.
- PDF extraction is conservative and may miss visually embedded text.
- Imported financial model values should be founder-reviewed before lender use.
- Sensitive values are intentionally excluded from automatic population.
- The import workflow prepares materials but does not submit lender applications.

## Atlas UX 2.0 summary

Atlas UX 2.0 changes the default presentation layer from an internal dashboard to a founder-first guided funding experience. The backend, storage, readiness logic, financial model, package generator, import workflow, lender tools, founder approval gate, and submission tracking remain intact.

The default `/atlas` route now presents one clear next action and a five-step founder journey:

1. About Your Business
2. Your Funding Request
3. Your Documents
4. Atlas Review
5. Review and Submit

## Atlas UX 2.0 founder routes

- `/atlas`
- `/atlas/journey`
- `/atlas/documents`
- `/atlas/opportunities`
- `/atlas/review`
- `/atlas/track`
- `/atlas/settings`

The founder navigation is intentionally limited to:

- Home
- My Application
- Documents
- Funding Options
- Review & Submit
- Track
- Settings

## Atlas UX 2.0 advanced/admin route

- `/atlas/admin`

The previous dense dashboard remains available through the advanced route for internal review and debugging. Existing internal Atlas routes remain available for compatibility and detailed editing.

## Atlas UX 2.0 terminology rules

Founder-facing UI uses plain language:

- Capital Office becomes My Funding
- Requirement Mapping becomes Lender requirements
- Package Generator becomes Prepare my application / application draft
- Founder Approval Gate becomes Final review
- Workflow Stages becomes Your funding journey
- Evidence Gap Report becomes What is still missing

Internal names may remain in code and advanced/admin documentation.

## Atlas UX 2.0 known limitations

- Guided screens are presentation-layer wrappers around existing Atlas modules; deeper field-by-field editing still uses the preserved advanced routes.
- Atlas still prepares materials only and does not submit lender applications automatically.
- Founder review remains mandatory before any lender-facing use.

## Atlas Funding OS v1 production storage

Atlas Funding OS v1 moves production Atlas state away from local `.data/atlas.json` and into a dedicated Supabase project. Local JSON remains a development fallback only. Vercel production must set `ATLAS_STORAGE_PROVIDER=supabase`, `ATLAS_SUPABASE_URL`, and `ATLAS_SUPABASE_SECRET_KEY`.

The app also accepts `ATLAS_SUPABASE_SERVICE_ROLE_KEY` as a backward-compatible alias, but the preferred server-only value is `ATLAS_SUPABASE_SECRET_KEY`.

Production behavior:

- If `ATLAS_STORAGE_PROVIDER=supabase`, Atlas reads and writes the durable Supabase profile snapshot.
- If Vercel production has no Supabase configuration, Atlas refuses to write sensitive data to local JSON.
- Server credentials stay server-only and must never be exposed through `NEXT_PUBLIC_*`, URLs, logs, screenshots, or exports.
- Existing Atlas JSON can be backed up with `node scripts/backup-atlas-json.mjs`.
- Existing Atlas JSON can be migrated with `node scripts/migrate-atlas-to-supabase.mjs` when the required Atlas Supabase env vars are present.

## Atlas Funding OS v1 database and storage

The production SQL migration lives at:

- `docs/sql/atlas-funding-os-v1.sql`

It creates a private Supabase storage bucket:

- `atlas-private-documents`

It also creates durable tables for:

- profiles, companies, founders, ownership
- entity and EIN verification metadata
- bank accounts, statements, summaries, transactions, and classifications
- documents, document versions, source records, imports, and field sources
- lender records, lender requirements, and requirement mappings
- use-of-funds plans, financial scenarios, application packages, package versions, approvals, applications, follow-ups, founder actions, readiness scores, and audit events

All public Atlas tables have RLS enabled. Browser/client access is intentionally denied by default. Atlas server routes use server-only credentials for authorized operations.

## Atlas Funding OS v1 automated readiness checks

Atlas now generates a founder-facing business-readiness report inside the existing five-step journey. It does not add a new founder-facing dashboard.

The report checks:

- business identity and formation-document status
- operating agreement availability
- EIN confirmation-document status, with EIN values masked by default
- banking-readiness status based on statement availability
- use-of-funds consistency
- imported field/evidence conflicts
- lender-specific requirements that still require lender confirmation
- plain-language "Atlas completed" and "Tomas still needs to" action lists

Unknown official facts remain marked as `REQUIRES FOUNDER OR STATE PORTAL VERIFICATION` or `REQUIRES LENDER CONFIRMATION`. Atlas never assumes entity good standing, lender acceptance, EIN validity, or final accounting/tax classifications without verified evidence.

## Atlas Funding OS v1 rollback

Rollback path:

1. Keep the JSON backup manifest created under the workspace-level `outputs/atlas-backups/` folder.
2. Remove or disable `ATLAS_STORAGE_PROVIDER=supabase` in the target environment.
3. Restore the selected backup to `.data/atlas.json` for local development only.
4. Do not use JSON fallback for production funding-campaign data unless a founder-approved emergency process is documented.

## Atlas Funding OS v1 remaining limitations

- Manual bank-statement upload metadata and parsing support are now modeled, but real bank OCR/OFX/QFX parsing requires founder-provided source files and additional parser QA.
- Plaid or live bank OAuth is intentionally not implemented in this mission.
- Official state registry checks may require portal access or manual founder verification.
- Lender rules that are not published in official sources remain marked for lender confirmation.
- Atlas prepares packages and tracks submissions, but Tomas must still review and submit lender applications manually.
