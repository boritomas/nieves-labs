import { NextRequest, NextResponse } from 'next/server';

const CFPB_ENDPOINT = 'https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/';

export async function GET(request: NextRequest) {
  const company = request.nextUrl.searchParams.get('company')?.trim();

  if (!company) {
    return NextResponse.json({ error: 'Company is required.' }, { status: 400 });
  }

  const params = new URLSearchParams({
    company,
    size: '10',
    frm: '0',
    sort: 'created_date_desc',
    format: 'json',
    no_aggs: 'true',
    no_highlight: 'true',
  });

  const response = await fetch(`${CFPB_ENDPOINT}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: 'CFPB complaint data is temporarily unavailable.' },
      { status: 502 },
    );
  }

  const payload = await response.json();
  const hits = payload?.hits?.hits ?? [];
  const complaints = hits.map((hit: { _source?: Record<string, unknown> }) => hit._source ?? {});

  return NextResponse.json({ complaints, total: payload?.hits?.total?.value ?? complaints.length });
}
