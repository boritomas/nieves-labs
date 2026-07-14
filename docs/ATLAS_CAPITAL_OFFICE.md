# Atlas Capital Office

Atlas is an internal first-class module inside the Nieves AI Platform. It uses founder/admin session protection for normal access and keeps the legacy admin token only as an emergency recovery path.

Atlas prepares founder-reviewed lender materials. It does not submit applications automatically, does not guarantee approval, and should not be presented as legal, tax, credit, or underwriting advice.

## Release 0.1 routes

- `/atlas`
- `/atlas/capital-office`
- `/atlas/sba-loan-package`
- `/atlas/financial-model`
- `/atlas/document-vault`
- `/atlas/funding-tracker`
- `/atlas/due-diligence-checklist`

All routes require a valid Atlas founder/admin session. The legacy admin token query parameter is retained only for emergency recovery and diagnostics.

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

This route is protected by the Atlas founder/admin session pattern.

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

## Release 1.2 summary

Release 1.2 captures the live funding campaign lessons learned from the SBA/CDFI application effort and turns them into a five-step Funding Campaign OS.

New route:

- `/atlas/funding-campaign`

The route is protected by the Atlas founder/admin session pattern. Emergency `ADMIN_TOKEN` access remains available for recovery only.

## Release 1.2 five-step campaign model

Atlas now compresses future funding campaigns into:

1. Founder profile once
2. Lender triage and failover
3. Portal field mapping
4. Submission proof and evidence
5. Follow-up operating loop

The intent is to stop repeating two-day manual portal loops. Atlas now records which paths succeeded, which paths blocked, what founder-only checkpoint stopped automation, and which next action should happen after submission.

## Release 1.2 lender campaign lessons

- DreamSpring: successful submitted path; application moved to lender review with a three-business-day response expectation.
- SBA Lender Match: blocked by SBA account/loan-number registration validation. Do not retry the same registration loop without SBA account resolution.
- PeopleFund: blocked by account-creation/login conflict. Use an account-resolution branch before retrying.
- BCL of Texas: prescreen indicated lending opportunities were not available at this time. Preserve decline reason and move on.
- LiftFund: paused by login/reset delivery and founder-only field requirements. Preserve progress; resume only after access recovery.

## Release 1.2 automation guardrails

Atlas may prepare materials, map non-sensitive answers, preserve status evidence, and track follow-up. Atlas must not store or certify:

- SSN/ITIN
- Date of birth
- Government ID or identity-verification answers
- Credit authorization
- Personal guarantees or lender certifications
- CAPTCHA, MFA, password, or payment-card steps

Those remain founder-only actions on official lender screens.

## Future Release 1.3 recommendations

- Add encrypted founder-only session vault or browser-local autofill for sensitive fields that should never enter source control.
- Add lender-specific form maps for DreamSpring, SBA Lender Match, PeopleFund, LiftFund, and other verified CDFI paths.
- Add evidence packet export containing screenshots, submitted answer summaries, uploaded-document lists, and follow-up tasks.
- Add reminder automation for lender response windows and document requests.
- Add account-resolution playbooks for duplicate-account and password-reset loops.

## Atlas Autonomous Funding Operator v1

Atlas now includes the first secure founder-auth and campaign-memory layer needed to turn the two-day founder-guided funding pilot into a repeatable five-step operating flow.

Access changes:

- `/atlas/login` provides founder/admin sign-in.
- Atlas sessions use an HTTP-only `atlas_session` cookie.
- Founder roles are modeled as `founder_admin`, `internal_admin`, `founder_user`, and `read_only`.
- `/atlas/*` routes redirect unauthenticated users to `/atlas/login?returnTo=...`.
- Clean session-mode links do not include URL tokens.
- `ADMIN_TOKEN` remains only for emergency recovery and protected diagnostics.

Environment variables:

- `ATLAS_SESSION_SECRET`
- `ATLAS_FOUNDER_EMAIL`
- `ATLAS_FOUNDER_PASSWORD_HASH`
- `ATLAS_FOUNDER_NAME` optional
- `ADMIN_TOKEN` emergency recovery only

Storage additions:

- `campaignState`
- `lenderWorkflowLibrary`
- `pilotFailureRecords`

The formal non-sensitive failure report lives at:

- `docs/ATLAS_FOUNDER_PILOT_FAILURE_REPORT.md`

Founder-only values remain prohibited in source control, URLs, logs, screenshots, exports, and documentation. This includes SSN/ITIN, dates of birth, passwords, MFA codes, bank account values, private application IDs, identity documents, and private financial records.

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

## Atlas Autonomous Funding Operator v2

Atlas now treats the founder pilot as a digital funding employee rather than a dashboard. The default Atlas home answers four questions only: what Atlas is doing, what Atlas completed, what Atlas is waiting on from Tomas, and what happens next.

The V2 operator layer derives its state from existing Atlas memory: DreamSpring submission status, blocked SBA/PeopleFund/LiftFund lessons, grant-discovery results, document reconciliation, lender field maps, package readiness, and campaign follow-up data. The primary KPI is Founder Time To Funding (FTTF).

Current autonomous agents:

- Funding Discovery Agent
- Eligibility Agent
- Company Knowledge Agent
- Application Agent
- Browser Automation Agent
- Follow-up Agent
- Self-Healing Agent

Atlas still stops for founder-only legal, identity, account-holder, certification, signature, MFA, CAPTCHA, credit authorization, and final-submission actions. Those items appear in the founder queue instead of being hidden inside dashboards.

Validation support:

- `npm run check:atlas-operator` verifies the V2 operator model, founder queue, FTTF metric, home screen wiring, and watchdog registration.
- `npm run watchdog -- <timeout-seconds> <command> [...args]` runs long commands with heartbeat output and a hard timeout so validation does not appear silently stuck.

## Atlas Funding OS v1 production storage

Atlas Funding OS v1 moves production Atlas state away from local `.data/atlas.json` and into a dedicated Supabase project. Local JSON remains a development fallback only. Vercel production must set `ATLAS_STORAGE_PROVIDER=supabase`, `ATLAS_SUPABASE_URL`, and `ATLAS_SUPABASE_SECRET_KEY`.

The app also accepts `ATLAS_SUPABASE_SERVICE_ROLE_KEY` as a backward-compatible alias, but the preferred server-only value is `ATLAS_SUPABASE_SECRET_KEY`.

Production behavior:

- If `ATLAS_STORAGE_PROVIDER=supabase`, Atlas reads and writes the durable Supabase profile snapshot.
- Vercel production always requires Supabase credentials and refuses `ATLAS_STORAGE_PROVIDER=json`.
- If Vercel production has no Supabase configuration, Atlas refuses to boot the protected storage path rather than writing sensitive data to local JSON.
- Server credentials stay server-only and must never be exposed through `NEXT_PUBLIC_*`, URLs, logs, screenshots, or exports.
- Existing Atlas JSON can be backed up with `node scripts/backup-atlas-json.mjs`.
- Existing Atlas JSON can be migrated with `node scripts/migrate-atlas-to-supabase.mjs` when the required Atlas Supabase env vars are present.
- Production storage can be verified with `npm run check:atlas-storage` when Atlas test credentials or a diagnostics token are provided in the shell environment.

## Atlas Funding OS v1 database and storage

The production SQL migration lives at:

- `docs/sql/atlas-funding-os-v1.sql`

It creates a private Supabase storage bucket:

- `atlas-private-documents`

## Protected Statement Ingestion

Atlas includes a protected server-side statement-ingestion endpoint:

- `GET /api/atlas/statement-ingestion`
- `GET /api/atlas/statement-ingestion?smoke=1`
- `POST /api/atlas/statement-ingestion`

The route requires `ADMIN_TOKEN` or `ATLAS_DIAGNOSTICS_TOKEN`. It uploads statement files to the private `atlas-private-documents` bucket, records document and bank-statement metadata, parses supported CSV/OFX/QFX transaction exports, creates statement summaries, classifies transactions for founder review, and records audit events. PDF statements are accepted as sensitive documents in the storage model, but full OCR-grade PDF extraction remains a Release 1.1/1.2 parser-hardening item.

Supported transaction ingestion formats:

- CSV
- OFX
- QFX

The endpoint does not make final tax, accounting, lender, or underwriting determinations. Ambiguous classifications are marked for founder review.

## Atlas Funding OS v1.2 EIN evidence and founder intake

Atlas includes a protected EIN evidence endpoint:

- `GET /api/atlas/ein-ingestion`
- `POST /api/atlas/ein-ingestion`

The route requires `ADMIN_TOKEN` or `ATLAS_DIAGNOSTICS_TOKEN`. It records only safe EIN confirmation metadata:

- source filename
- source SHA-256 hash
- source file size
- IRS notice type/date when known
- masked EIN display value only
- verification timestamp

It never stores a full EIN in source control, URLs, logs, analytics, screenshots, or client-visible payloads. The source PDF must stay in private document storage or a founder-approved local/private vault. The helper script `scripts/ingest-atlas-ein.mjs` can compute the local file hash and call the protected endpoint without printing secrets or the full EIN.

Atlas also includes a protected founder intake route:

- `/atlas/founder-intake`

This route preserves the five-step founder experience while adding a missing-only intake review. It shows:

- values Atlas already has
- documents already verified
- missing or conflicting fields
- founder-only identity/credit/certification checkpoints
- explicit limits on what Atlas/Codex may not do

Founder-only fields such as SSN, date of birth, driver license/state ID, credit authorization, personal guarantee acceptance, legal certifications, e-signatures, and final submission approval must be completed by Tomas directly in the official lender or government-controlled workflow.

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

## Atlas Autonomy Remediation v1

Atlas now reconciles document requirements before asking Tomas for action. The reconciliation layer inventories approved Atlas sources across the document vault, imports, extracted sections, generated packages, company profile, founder profile, financial model, campaign state, and source mappings.

Requirement statuses are:

- `VERIFIED COMPLETE`
- `FOUND, NEEDS FOUNDER CONFIRMATION`
- `FOUND, NEEDS CLASSIFICATION`
- `FOUND, STALE`
- `FOUND, CONFLICTING`
- `NOT APPLICABLE`
- `REQUIRES LENDER CONFIRMATION`
- `TRULY MISSING`

Low-risk evidence such as EIN confirmation metadata, generated package coverage, approved business-plan coverage, founder-background coverage, and startup-stage tax-return applicability is auto-resolved when the source evidence is already present. Atlas does not ask Tomas to re-upload documents it can already reconcile. Founder actions are deduplicated and limited to unresolved, stale, conflicting, lender-confirmation, or founder-only review items.

The founder home, documents view, review view, advanced dashboard, lender requirement mapping, application builder, readiness scoring, workflow stages, and package generator all use the same reconciliation source of truth. The active funding amount is normalized to the current $50,000 campaign target.

The operator activity feed records what Atlas searched, what it resolved, what drafts it generated, what conflicts remain, and the exact next best action. It is an audit trail for Atlas work; it is not a new dashboard.

## Atlas Funding OS v1 rollback

Rollback path:

1. Keep the JSON backup manifest created under the workspace-level `outputs/atlas-backups/` folder.
2. Do not remove `ATLAS_STORAGE_PROVIDER=supabase` from Vercel production as a routine rollback step.
3. Restore the selected backup to `.data/atlas.json` for local development only.
4. If production Supabase is unavailable, treat it as a production incident and restore Supabase from backup or database tooling before resuming founder work.
5. Do not use JSON fallback for production funding-campaign data unless a founder-approved emergency process is documented and the risk is explicitly accepted.

## Atlas Funding OS v1 remaining limitations

- Bank-statement CSV/OFX/QFX ingestion is available through the protected server-side ingestion route. OCR-grade PDF parsing and bank-provider connections require founder authorization and additional parser QA.
- Plaid or live bank OAuth is intentionally not implemented in this mission.
- Official state registry checks may require portal access or manual founder verification.
- Lender rules that are not published in official sources remain marked for lender confirmation.
- Atlas prepares packages and tracks submissions, but Tomas must still review and submit lender applications manually.

## Atlas Federal Grant Operator v1

Atlas now includes a protected founder-pilot federal grant workflow. The route group is:

- `/atlas/grants`
- `/atlas/grants/profile`
- `/atlas/grants/opportunities`
- `/atlas/grants/[opportunity]`
- `/atlas/grants/[opportunity]/application`
- `/atlas/grants/project-pitch`
- `/atlas/grants/track`

The founder-facing flow remains three steps:

1. Confirm what Atlas already knows.
2. Review the strongest official-source grant opportunities.
3. Review the application package and stop at founder-only approvals.

The federal grant operator records the real submission state explicitly:

- Federal grant applications submitted: `1`
- Submission evidence: NSF Project Pitch confirmation `00119518`
- Submission type: NSF SBIR/STTR Project Pitch
- Topic area: Artificial Intelligence
- NSF 26-511 status: monitored only; a full NSF Phase I proposal still requires NSF invitation after Project Pitch review.

The first pilot uses official NSF America’s Seed Fund / NSF SBIR/STTR Project Pitch guidance plus official Grants.gov source data. The selected near-term path is:

- Agency: U.S. National Science Foundation
- Submission type: NSF Project Pitch
- Program: NSF SBIR/STTR / America’s Seed Fund
- Official source: `https://seedfund.nsf.gov/apply/project-pitch/`
- Fit status: Strong fit, with founder approval, portal authentication, field-limit validation, and registration verification required

Atlas also tracks monitor opportunities from NSF scientific instrumentation pilot (`26-511`), NIH Parent SBIR (`PA-27-100`), and NSF PESOSE (`26-506`) while hiding low-value or unrelated opportunities by default.

The first application package is prepared to the founder gate only. It includes:

- project concept
- project abstract
- technical narrative
- commercialization plan
- work plan
- budget narrative
- compliance checklist
- document reuse map
- founder-only gaps
- learning records

Atlas does not submit federal grant applications, certify eligibility, sign legal statements, create accounts through MFA/CAPTCHA, or represent approval probability. Current blocking founder-only gates are SAM.gov/UEI, Grants.gov/AOR, NSF/Research.gov path verification, technical-claim approval, budget-rate confirmation, and final legal certification/submission.

The NSF Project Pitch review route includes:

- official process and source links
- registration preflight table
- concept scoring across five Nieves Labs concepts
- selected concept rationale
- exact draft Project Pitch text
- missing evidence and assumptions
- founder approval phrase: `I approve the NSF Project Pitch for submission.`

The NSF Project Pitch was submitted through the official NSF TIP Submission Portal / MyWork workflow with founder approval. Atlas must now monitor `info@nieves-labs.com` for NSF feedback. If NSF invites a full Phase I proposal, Atlas must verify NSF ID, Research.gov organization, SAM.gov, UEI, Grants.gov, PI/SPO/AOR roles, and full proposal requirements before preparing the next package.

Regression coverage:

- `scripts/validate-atlas-grants.mjs`
