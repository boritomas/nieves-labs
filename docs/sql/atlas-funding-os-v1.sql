-- Atlas Funding OS v1 durable storage migration
-- Project: Nieves Labs / Atlas Funding OS
-- Safety: all buckets are private; RLS is enabled on public Atlas tables.

create extension if not exists pgcrypto;

create or replace function public.atlas_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.atlas_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_slug text not null unique default 'default',
  owner_user_id uuid,
  tenant_id text not null default 'nieves-labs',
  snapshot jsonb not null default '{}'::jsonb,
  storage_version integer not null default 1,
  verification_status text not null default 'pending_review',
  founder_approval_status text not null default 'pending_review',
  source_type text not null default 'atlas_app',
  version integer not null default 1,
  archived_at timestamptz,
  created_by text not null default 'atlas',
  updated_by text not null default 'atlas',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_companies (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  legal_name text,
  dba text,
  entity_type text,
  formation_state text,
  formation_date date,
  business_address text,
  mailing_address text,
  verification_status text not null default 'requires_founder_or_state_portal_verification',
  source_type text,
  source_url text,
  source_verified_at timestamptz,
  founder_approval_status text not null default 'pending_review',
  version integer not null default 1,
  archived_at timestamptz,
  created_by text not null default 'atlas',
  updated_by text not null default 'atlas',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_founders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  founder_name text not null,
  title text,
  ownership_percent numeric(5,2),
  background text,
  verification_status text not null default 'pending_review',
  founder_approval_status text not null default 'pending_review',
  version integer not null default 1,
  archived_at timestamptz,
  created_by text not null default 'atlas',
  updated_by text not null default 'atlas',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_ownership (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  owner_name text not null,
  owner_type text not null default 'individual',
  ownership_percent numeric(5,2),
  source_type text,
  verification_status text not null default 'pending_review',
  founder_approval_status text not null default 'pending_review',
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_entity_verifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  legal_name text,
  entity_type text,
  formation_state text,
  formation_date date,
  operating_agreement_status text not null default 'unknown',
  dba_document_status text not null default 'unknown',
  registry_status text not null default 'requires_founder_or_state_portal_verification',
  registry_url text,
  verification_date timestamptz,
  confidence integer not null default 0 check (confidence between 0 and 100),
  conflicts jsonb not null default '[]'::jsonb,
  source_type text,
  source_document_ids uuid[] not null default '{}',
  founder_approval_status text not null default 'pending_review',
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_ein_verifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  legal_name text,
  ein_masked text,
  ein_hash text,
  confirmation_status text not null default 'ein_confirmation_document_missing',
  name_match_status text not null default 'pending_review',
  confidence integer not null default 0 check (confidence between 0 and 100),
  source_document_id uuid,
  founder_approval_status text not null default 'pending_review',
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_bank_accounts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  bank_name text,
  account_type text,
  account_owner_name text,
  masked_account_identifier text,
  account_identifier_hash text,
  opening_date date,
  connection_type text not null default 'manual_statement_upload',
  connection_status text not null default 'not_connected',
  verification_status text not null default 'pending_review',
  founder_approval_status text not null default 'pending_review',
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_documents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  document_key text not null,
  document_name text not null,
  category text not null,
  storage_bucket text not null default 'atlas-private-documents',
  storage_path text,
  mime_type text,
  size_bytes bigint,
  content_hash text,
  required boolean not null default false,
  completed boolean not null default false,
  source_type text not null default 'manual_upload',
  verification_status text not null default 'pending_review',
  founder_approval_status text not null default 'pending_review',
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, document_key, version)
);

create table if not exists public.atlas_document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.atlas_documents(id) on delete cascade,
  version integer not null,
  storage_path text,
  content_hash text,
  notes text,
  created_at timestamptz not null default now(),
  unique (document_id, version)
);

create table if not exists public.atlas_bank_statements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  bank_account_id uuid references public.atlas_bank_accounts(id) on delete set null,
  document_id uuid references public.atlas_documents(id) on delete set null,
  statement_start_date date,
  statement_end_date date,
  beginning_balance numeric(14,2),
  ending_balance numeric(14,2),
  deposits numeric(14,2) not null default 0,
  withdrawals numeric(14,2) not null default 0,
  fees numeric(14,2) not null default 0,
  transfers numeric(14,2) not null default 0,
  extraction_confidence integer not null default 0 check (extraction_confidence between 0 and 100),
  verification_status text not null default 'pending_review',
  founder_approval_status text not null default 'pending_review',
  source_type text not null default 'manual_upload',
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_statement_summaries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  bank_account_id uuid references public.atlas_bank_accounts(id) on delete set null,
  months_available integer not null default 0,
  missing_periods text[] not null default '{}',
  average_monthly_deposits numeric(14,2) not null default 0,
  average_ending_balance numeric(14,2) not null default 0,
  deposit_consistency_status text not null default 'requires_founder_review',
  founder_contributions numeric(14,2) not null default 0,
  potential_revenue numeric(14,2) not null default 0,
  commingling_risk text not null default 'unknown',
  lender_statement_requirement_fit text not null default 'requires_lender_confirmation',
  verification_status text not null default 'pending_review',
  founder_approval_status text not null default 'pending_review',
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  statement_id uuid references public.atlas_bank_statements(id) on delete cascade,
  transaction_date date,
  description text,
  amount numeric(14,2) not null,
  normalized_description text,
  transaction_hash text,
  source_type text not null default 'statement_import',
  verification_status text not null default 'pending_review',
  founder_approval_status text not null default 'pending_review',
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_transaction_classifications (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.atlas_transactions(id) on delete cascade,
  classification text not null check (classification in ('likely_business','likely_personal','revenue','founder_contribution','transfer','refund','loan_proceeds','expense','unknown','requires_founder_review')),
  confidence integer not null default 0 check (confidence between 0 and 100),
  flags text[] not null default '{}',
  founder_confirmed boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_lenders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.atlas_profiles(id) on delete cascade,
  lender_name text not null,
  lender_type text not null,
  website text,
  application_url text,
  service_area text,
  fit_score integer not null default 50 check (fit_score between 0 and 100),
  status text not null default 'researching',
  source_url text,
  last_verified_date date,
  confidence integer not null default 0 check (confidence between 0 and 100),
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_lender_requirements (
  id uuid primary key default gen_random_uuid(),
  lender_id uuid not null references public.atlas_lenders(id) on delete cascade,
  requirement_key text not null,
  requirement_label text not null,
  requirement_value text not null default 'REQUIRES LENDER CONFIRMATION',
  source_url text,
  last_verified_date date,
  confidence integer not null default 0 check (confidence between 0 and 100),
  status text not null default 'requires_lender_confirmation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lender_id, requirement_key)
);

create table if not exists public.atlas_requirement_mappings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  lender_requirement_id uuid references public.atlas_lender_requirements(id) on delete cascade,
  document_id uuid references public.atlas_documents(id) on delete set null,
  mapping_status text not null default 'missing',
  notes text,
  founder_approval_status text not null default 'pending_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_use_of_funds (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  category text not null,
  amount numeric(14,2) not null default 0,
  percentage numeric(5,2),
  timing text,
  business_purpose text,
  expected_milestone text,
  supporting_estimate text,
  founder_approval_status text not null default 'pending_review',
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_financial_scenarios (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  scenario_name text not null,
  assumptions jsonb not null default '{}'::jsonb,
  forecast jsonb not null default '{}'::jsonb,
  verification_status text not null default 'pending_review',
  founder_approval_status text not null default 'pending_review',
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_field_sources (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  field_path text not null,
  value_summary text,
  source_document_id uuid references public.atlas_documents(id) on delete set null,
  source_label text,
  confidence integer not null default 0 check (confidence between 0 and 100),
  verification_status text not null default 'pending_review',
  created_at timestamptz not null default now()
);

create table if not exists public.atlas_field_conflicts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  field_path text not null,
  label text not null,
  value_a text,
  source_a text,
  value_b text,
  source_b text,
  recommended_resolution text,
  founder_decision_required boolean not null default true,
  status text not null default 'pending_founder_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_application_packages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  package_name text not null,
  target_lender text,
  funding_type text,
  funding_amount numeric(14,2),
  status text not null default 'Draft',
  generated_markdown text,
  generated_html text,
  storage_bucket text default 'atlas-private-documents',
  storage_path text,
  version integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_package_versions (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references public.atlas_application_packages(id) on delete cascade,
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  version_number integer not null,
  status text not null default 'Draft',
  notes text,
  generated_markdown text,
  generated_html text,
  created_at timestamptz not null default now()
);

create table if not exists public.atlas_founder_approvals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  approval_key text not null,
  approved boolean not null default false,
  approved_at timestamptz,
  approved_by text,
  source_type text not null default 'founder_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, approval_key)
);

create table if not exists public.atlas_applications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  lender_id uuid references public.atlas_lenders(id) on delete set null,
  status text not null default 'draft',
  submitted_at timestamptz,
  submitted_by text,
  external_reference text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_application_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.atlas_applications(id) on delete cascade,
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  event_type text not null,
  event_summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_by text not null default 'atlas',
  created_at timestamptz not null default now()
);

create table if not exists public.atlas_followups (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  lender_id uuid references public.atlas_lenders(id) on delete set null,
  due_date date,
  status text not null default 'open',
  contact_name text,
  contact_email text,
  next_action text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_founder_actions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  action_group text not null,
  action_text text not null,
  status text not null default 'open',
  priority text not null default 'medium',
  due_date date,
  source_type text not null default 'atlas_check',
  founder_approval_status text not null default 'pending_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.atlas_readiness_scores (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  score_type text not null,
  score integer not null check (score between 0 and 100),
  status text not null,
  breakdown jsonb not null default '{}'::jsonb,
  calculated_at timestamptz not null default now(),
  source_type text not null default 'atlas_app',
  version integer not null default 1
);

create table if not exists public.atlas_audit_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.atlas_profiles(id) on delete set null,
  event_type text not null,
  actor text not null default 'atlas',
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.atlas_document_imports (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.atlas_profiles(id) on delete cascade,
  import_mode text not null,
  discovered_count integer not null default 0,
  imported_count integer not null default 0,
  skipped_count integer not null default 0,
  conflict_count integer not null default 0,
  evidence_gap_count integer not null default 0,
  status text not null default 'complete',
  created_at timestamptz not null default now()
);

create table if not exists public.atlas_document_sources (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.atlas_documents(id) on delete cascade,
  source_path text,
  source_label text,
  source_hash text,
  extracted_summary text,
  created_at timestamptz not null default now()
);

create index if not exists atlas_profiles_tenant_idx on public.atlas_profiles(tenant_id);
create index if not exists atlas_documents_profile_idx on public.atlas_documents(profile_id);
create index if not exists atlas_bank_statements_profile_idx on public.atlas_bank_statements(profile_id);
create index if not exists atlas_transactions_statement_idx on public.atlas_transactions(statement_id);
create index if not exists atlas_lenders_profile_idx on public.atlas_lenders(profile_id);
create index if not exists atlas_founder_actions_status_idx on public.atlas_founder_actions(profile_id, status);
create index if not exists atlas_audit_profile_created_idx on public.atlas_audit_events(profile_id, created_at desc);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'atlas_profiles','atlas_companies','atlas_founders','atlas_ownership',
    'atlas_entity_verifications','atlas_ein_verifications','atlas_bank_accounts',
    'atlas_bank_statements','atlas_statement_summaries','atlas_transactions',
    'atlas_transaction_classifications','atlas_documents','atlas_document_versions',
    'atlas_document_sources','atlas_document_imports','atlas_field_sources',
    'atlas_field_conflicts','atlas_lenders','atlas_lender_requirements',
    'atlas_requirement_mappings','atlas_use_of_funds','atlas_financial_scenarios',
    'atlas_application_packages','atlas_package_versions','atlas_founder_approvals',
    'atlas_applications','atlas_application_events','atlas_followups',
    'atlas_founder_actions','atlas_readiness_scores','atlas_audit_events'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists "Atlas server managed only" on public.%I', table_name);
    execute format('create policy "Atlas server managed only" on public.%I for all using (false) with check (false)', table_name);
  end loop;
end $$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'atlas_profiles','atlas_companies','atlas_founders','atlas_ownership',
    'atlas_entity_verifications','atlas_ein_verifications','atlas_bank_accounts',
    'atlas_bank_statements','atlas_statement_summaries','atlas_transactions',
    'atlas_transaction_classifications','atlas_documents','atlas_document_versions',
    'atlas_document_sources','atlas_document_imports','atlas_field_sources',
    'atlas_field_conflicts','atlas_lenders','atlas_lender_requirements',
    'atlas_requirement_mappings','atlas_use_of_funds','atlas_financial_scenarios',
    'atlas_application_packages','atlas_package_versions','atlas_founder_approvals',
    'atlas_applications','atlas_application_events','atlas_followups',
    'atlas_founder_actions','atlas_readiness_scores','atlas_audit_events'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', table_name || '_updated_at', table_name);
    execute format('create trigger %I before update on public.%I for each row execute function public.atlas_set_updated_at()', table_name || '_updated_at', table_name);
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'atlas-private-documents',
  'atlas-private-documents',
  false,
  52428800,
  array[
    'application/pdf',
    'text/csv',
    'text/plain',
    'application/json',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/x-ofx',
    'application/x-qfx',
    'image/png',
    'image/jpeg'
  ]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Atlas private storage server managed only" on storage.objects;
create policy "Atlas private storage server managed only"
on storage.objects
for all
using (bucket_id = 'atlas-private-documents' and false)
with check (bucket_id = 'atlas-private-documents' and false);

insert into public.atlas_audit_events (event_type, actor, summary, metadata)
values (
  'schema_applied',
  'atlas_migration',
  'Atlas Funding OS v1 schema applied with server-managed RLS and private document bucket.',
  jsonb_build_object('schema_version', 1)
);
