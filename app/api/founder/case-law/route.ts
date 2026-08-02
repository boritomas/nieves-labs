import { NextRequest, NextResponse } from 'next/server';

const COURTLISTENER_ENDPOINT = 'https://www.courtlistener.com/api/rest/v3/search/';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();
  const token = process.env.COURTLISTENER_API_TOKEN;

  if (!query) {
    return NextResponse.json({ error: 'Search query is required.' }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json(
      {
        error: 'CourtListener API token is not configured.',
        setup: 'Add COURTLISTENER_API_TOKEN to the Vercel project environment.',
        results: [],
      },
      { status: 503 },
    );
  }

  const params = new URLSearchParams({ q: query, type: 'o', order_by: 'score desc' });
  const response = await fetch(`${COURTLISTENER_ENDPOINT}?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: 'CourtListener search is temporarily unavailable.', results: [] },
      { status: 502 },
    );
  }

  const payload = await response.json();
  const results = (payload?.results ?? []).slice(0, 10).map((item: Record<string, unknown>) => ({
    id: item.id,
    caseName: item.caseName,
    citation: item.citation,
    dateFiled: item.dateFiled,
    court: item.court,
    absolute_url: item.absolute_url,
    snippet: item.snippet,
  }));

  return NextResponse.json({ results, total: payload?.count ?? results.length });
}
