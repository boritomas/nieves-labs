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

## Storage equivalent

Release 0.1 stores Atlas records in `.data/atlas.json` through `lib/atlas-store.ts`. The data model is intentionally database-ready and maps to these future tables:

- `atlas_company_profile`
- `atlas_financial_assumptions`
- `atlas_funding_opportunities`
- `atlas_documents`
- `atlas_risks`
- `atlas_tasks`
- `atlas_readiness_scores`

No new environment variables are required for Release 0.1.

