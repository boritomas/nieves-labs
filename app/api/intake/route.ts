import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { getProductByKey } from '@/lib/products';
import { addLog, getOrderByIntakeToken, updateOrder } from '@/lib/store';
import { sendOrderEmail } from '@/lib/email';
import { runWorkflow } from '@/lib/workflows';
import type { UploadRecord } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const token = String(form.get('token') || '');
    const order = await getOrderByIntakeToken(token);
    if (!order) return NextResponse.json({ error: 'Invalid intake token' }, { status: 404 });

    const product = getProductByKey(order.productKey);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const answers: Record<string, string> = {};
    for (const question of product.requiredQuestions) {
      const value = String(form.get(question.id) || '');
      if (question.required && !value.trim()) {
        return NextResponse.json({ error: `${question.label} is required` }, { status: 400 });
      }
      answers[question.id] = value;
    }

    const uploadDir = path.join(process.cwd(), '.data', 'uploads', order.id);
    await mkdir(uploadDir, { recursive: true });

    const files = form.getAll('files').filter((item): item is File => item instanceof File && item.size > 0);
    const uploadRecords: UploadRecord[] = [];
    for (const file of files) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const fileName = `${randomUUID()}-${safeName}`;
      const storagePath = path.join(uploadDir, fileName);
      await writeFile(storagePath, bytes);
      uploadRecords.push({
        id: randomUUID(),
        orderId: order.id,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        size: file.size,
        storagePath,
        createdAt: new Date().toISOString(),
      });
    }

    const updated = await updateOrder(order.id, {
      intakeAnswers: answers,
      uploads: [...order.uploads, ...uploadRecords],
      intakeSubmittedAt: new Date().toISOString(),
      status: order.paymentStatus === 'paid' || order.paymentStatus === 'manual_review' ? 'processing' : 'intake_pending',
    });

    await addLog(order.id, 'info', 'Intake submitted', { uploads: uploadRecords.length });
    if (updated) {
      await sendOrderEmail(updated, product, 'files_received');
      await runWorkflow(product.key, order.id);
    }

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
