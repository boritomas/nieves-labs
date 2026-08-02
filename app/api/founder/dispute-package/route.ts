import { NextRequest, NextResponse } from 'next/server';

const bureauAddresses: Record<string, string> = {
  Experian: 'Experian\nP.O. Box 4500\nAllen, TX 75013',
  Equifax: 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374-0256',
  TransUnion: 'TransUnion Consumer Solutions\nP.O. Box 2000\nChester, PA 19016-2000',
};

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function lines(value: string) {
  return escapeHtml(value).replaceAll('\n', '<br />');
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const required = ['consumerName', 'address', 'cityStateZip', 'bureau', 'furnisher', 'accountNumber', 'facts', 'currentReporting', 'correctReporting'];
  if (required.some((key) => !String(body[key] || '').trim())) {
    return NextResponse.json({ error: 'Missing required dispute facts.' }, { status: 400 });
  }

  const evidence = [...(Array.isArray(body.evidence) ? body.evidence : []), ...(Array.isArray(body.files) ? body.files : [])];
  const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'America/Chicago' }).format(new Date());
  const bureauAddress = bureauAddresses[body.bureau] || body.bureau;
  const complaintNarrative = `I disputed inaccurate credit reporting concerning ${body.furnisher}, account ${body.accountNumber}, with ${body.bureau}. The report currently states: ${body.currentReporting}. The accurate information is: ${body.correctReporting}. My supporting facts are: ${body.facts}. I requested: ${body.requestedResolution}. ${body.disputeDate ? `The direct dispute was submitted on ${body.disputeDate}.` : ''}`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Credit Dispute Package</title><style>
body{font-family:Arial,sans-serif;color:#111;max-width:900px;margin:40px auto;padding:0 24px;line-height:1.5}h1,h2{color:#14213d}section{page-break-after:always}section:last-child{page-break-after:auto}.box{border:1px solid #bbb;padding:14px;margin:14px 0}.muted{color:#555}.warning{background:#fff4d6;border:1px solid #ddb85b;padding:12px}.signature{margin-top:60px;border-top:1px solid #333;width:320px;padding-top:8px}ul{padding-left:20px}@media print{body{margin:0;max-width:none}.no-print{display:none}}
</style></head><body>
<div class="no-print warning"><strong>Review required:</strong> Confirm every fact and attach copies, not originals. This package does not submit itself. Print or save as PDF after review.</div>
<section><h1>Credit Dispute Package</h1><p><strong>Prepared:</strong> ${today}</p><div class="box"><strong>Consumer</strong><br/>${lines(body.consumerName)}<br/>${lines(body.address)}<br/>${lines(body.cityStateZip)}</div><div class="box"><strong>Dispute target:</strong> ${escapeHtml(body.bureau)}<br/><strong>Furnisher:</strong> ${escapeHtml(body.furnisher)}<br/><strong>Account:</strong> ${escapeHtml(body.accountNumber)}<br/><strong>Issue:</strong> ${escapeHtml(body.issueType)}<br/><strong>Report number:</strong> ${escapeHtml(body.reportNumber || 'Not provided')}</div><p class="muted">30-day target: ${escapeHtml(body.deadlines?.deadline30 || 'Not calculated')}<br/>45-day outer gate: ${escapeHtml(body.deadlines?.deadline45 || 'Not calculated')}<br/>CFPB escalation review: ${body.cfpbEligible ? 'Eligible based on entered status' : 'Not yet eligible based on entered status'}</p></section>
<section><p>${today}</p><p>${lines(body.consumerName)}<br/>${lines(body.address)}<br/>${lines(body.cityStateZip)}</p><p>${lines(bureauAddress)}</p><p><strong>Re: Credit report dispute; ${escapeHtml(body.furnisher)} account ${escapeHtml(body.accountNumber)}</strong></p><p>To Whom It May Concern:</p><p>I am writing to dispute inaccurate or incomplete information appearing in my consumer report. Please conduct a reasonable reinvestigation and review all enclosed supporting documentation.</p><p><strong>Information currently reported:</strong><br/>${lines(body.currentReporting)}</p><p><strong>Accurate information:</strong><br/>${lines(body.correctReporting)}</p><p><strong>Factual basis:</strong><br/>${lines(body.facts)}</p><p><strong>Requested resolution:</strong><br/>${lines(body.requestedResolution)}</p><p>Please provide the written results of your reinvestigation and an updated copy of my consumer report. If the information cannot be verified accurately and completely, please delete or correct it as required by applicable law.</p><p>Sincerely,</p><div class="signature">${escapeHtml(body.consumerName)}<br/>Signature / Date</div></section>
<section><h2>Direct Furnisher Dispute Draft</h2><p>${today}</p><p>${lines(body.consumerName)}<br/>${lines(body.address)}<br/>${lines(body.cityStateZip)}</p><p><strong>${escapeHtml(body.furnisher)}</strong></p><p><strong>Re: Direct dispute concerning account ${escapeHtml(body.accountNumber)}</strong></p><p>I dispute the accuracy and completeness of information you furnished concerning this account.</p><p><strong>Current reporting:</strong> ${lines(body.currentReporting)}</p><p><strong>Correct information:</strong> ${lines(body.correctReporting)}</p><p><strong>Supporting facts:</strong> ${lines(body.facts)}</p><p>Please investigate, review the enclosed records, report accurate results to every consumer reporting agency to which you furnished the information, and provide me with your written findings.</p><div class="signature">${escapeHtml(body.consumerName)}<br/>Signature / Date</div></section>
<section><h2>Evidence Index</h2>${evidence.length ? `<ol>${evidence.map((item: string, index: number) => `<li>Exhibit ${index + 1}: ${escapeHtml(item)}</li>`).join('')}</ol>` : '<p>No evidence items were selected. Add supporting documents before sending.</p>'}<div class="box"><strong>Recommended assembly order</strong><ol><li>Signed dispute letter</li><li>Copy of government ID</li><li>Proof of current address</li><li>Relevant credit report page with disputed item marked</li><li>Supporting exhibits in indexed order</li><li>Certified-mail receipt and tracking copy after mailing</li></ol></div></section>
<section><h2>CFPB Complaint Draft</h2><p><strong>Company:</strong> ${escapeHtml(body.furnisher)}</p><p><strong>Product:</strong> Credit reporting or credit card</p><p><strong>Issue:</strong> ${escapeHtml(body.issueType)}</p><p><strong>Complaint narrative:</strong></p><div class="box">${lines(complaintNarrative)}</div><p><strong>Requested resolution:</strong> ${lines(body.requestedResolution)}</p><p class="warning">Submit only after confirming CFPB eligibility and reviewing the current CFPB instructions. Do not state that documents were ignored unless the record supports that statement.</p></section>
<section><h2>Case Timeline and Tracking Log</h2><table style="width:100%;border-collapse:collapse"><tr><th style="border:1px solid #999;padding:8px">Event</th><th style="border:1px solid #999;padding:8px">Date</th><th style="border:1px solid #999;padding:8px">Evidence / tracking</th></tr><tr><td style="border:1px solid #999;padding:8px">Direct dispute sent</td><td style="border:1px solid #999;padding:8px">${escapeHtml(body.disputeDate || '')}</td><td style="border:1px solid #999;padding:8px"></td></tr><tr><td style="border:1px solid #999;padding:8px">30-day target</td><td style="border:1px solid #999;padding:8px">${escapeHtml(body.deadlines?.deadline30 || '')}</td><td style="border:1px solid #999;padding:8px"></td></tr><tr><td style="border:1px solid #999;padding:8px">45-day outer gate</td><td style="border:1px solid #999;padding:8px">${escapeHtml(body.deadlines?.deadline45 || '')}</td><td style="border:1px solid #999;padding:8px"></td></tr><tr><td style="border:1px solid #999;padding:8px">Bureau response received</td><td style="border:1px solid #999;padding:8px"></td><td style="border:1px solid #999;padding:8px"></td></tr><tr><td style="border:1px solid #999;padding:8px">CFPB complaint submitted</td><td style="border:1px solid #999;padding:8px"></td><td style="border:1px solid #999;padding:8px"></td></tr></table></section>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="credit-dispute-package-${Date.now()}.html"`,
      'Cache-Control': 'no-store',
    },
  });
}
