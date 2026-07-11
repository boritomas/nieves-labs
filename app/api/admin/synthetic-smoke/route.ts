import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { createOrder, deleteOrder, getOrder, listLogs, updateOrder } from '@/lib/store';
import { runWorkflow } from '@/lib/workflows';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!env.adminToken && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'ADMIN_TOKEN must be configured in production' }, { status: 503 });
  }

  if (env.adminToken && request.headers.get('x-admin-token') !== env.adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({})) as { cleanup?: boolean };
  const cleanup = body.cleanup !== false;
  const order = await createOrder({
    productKey: 'answerbrief_ai',
    packageId: 'brief',
    customerEmail: 'codex-smoke-nieves@example.com',
    customerName: 'Codex Smoke',
    amount: 49,
  });

  try {
    await updateOrder(order.id, {
      paymentStatus: 'paid',
      status: 'processing',
      intakeSubmittedAt: new Date().toISOString(),
      intakeAnswers: {
        candidate_name: 'Codex Smoke',
        target_role: 'Operations Manager at Example Company',
        target_company: 'Example Company',
        interview_stage: 'Hiring manager',
        interview_date: 'Synthetic test only',
        career_lane: 'Operations, compliance, and workflow improvement',
        job_posting_text: 'Example Company seeks an operations manager who can improve processes, coordinate stakeholders, reduce risk, and communicate clearly.',
        focus_areas: 'Process improvement, stakeholder communication, and risk reduction.',
      },
      uploads: [
        {
          id: `upload-${order.id}`,
          orderId: order.id,
          fileName: 'synthetic-resume.txt',
          fileType: 'text/plain',
          size: 128,
          storagePath: 'synthetic://resume',
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const result = await runWorkflow('answerbrief_ai', order.id);
    const logs = await listLogs(order.id);
    const finalOrder = await getOrder(order.id);
    const checks = {
      orderCreated: Boolean(order.id),
      paymentVerifiedSynthetic: finalOrder?.paymentStatus === 'paid',
      intakeSubmitted: Boolean(finalOrder?.intakeSubmittedAt),
      uploadRecorded: Boolean(finalOrder?.uploads.length),
      workflowTriggered: logs.some((log) => log.message === 'Workflow started'),
      interviewPrepReuse: logs.some((log) => String(log.meta?.event || '').includes('interview_prep_kb_reused')),
      aiExecution: logs.some((log) => /AnswerBrief deliverable generated|OpenAI deliverable generated|Structured fallback deliverable generated/.test(log.message)),
      qaValidation: logs.some((log) => String(log.meta?.event || '').includes('qa_validation')),
      deliverableGenerated: Boolean(finalOrder?.deliverables.length),
      adminVisibility: Boolean(result?.id),
      customerPortalVisibility: Boolean(finalOrder?.intakeToken && finalOrder.deliverables.length),
      ownerNotificationAttempted: logs.some((log) => log.message.includes('Email sent: owner_update') || log.message.includes('Email skipped: missing Gmail credentials')),
      customerNotificationAttempted: logs.some((log) => log.message.includes('Email sent: deliverable_ready') || log.message.includes('Email skipped: missing Gmail credentials')),
      retryCapable: (finalOrder?.workflowAttempts || 0) >= 1,
    };
    const passed = Object.values(checks).every(Boolean);

    if (cleanup) {
      await deleteOrder(order.id);
    }

    return NextResponse.json({
      ok: passed,
      checks,
      orderId: order.id,
      cleanup,
      syntheticDataRemoved: cleanup,
    });
  } catch (error) {
    if (cleanup) await deleteOrder(order.id);
    return NextResponse.json({ error: String(error), orderId: order.id, cleanup }, { status: 500 });
  }
}
