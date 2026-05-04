import { after } from 'next/server';
import { createBulkJob, processBulkJob } from '@/lib/bulk-job';
import { prisma } from '@/lib/prisma';
import type { ParsedRow } from '@/lib/csv';

export async function POST(request: Request) {
  const body = await request.json();
  const { type, validRows } = body as {
    type: 'import' | 'update';
    validRows: ParsedRow[];
  };

  if (!type || !['import', 'update'].includes(type)) {
    return Response.json({ error: '操作タイプが不正です' }, { status: 400 });
  }

  if (!validRows || !Array.isArray(validRows) || validRows.length === 0) {
    return Response.json({ error: '処理対象のデータがありません' }, { status: 400 });
  }

  if (validRows.length > 10000) {
    return Response.json({ error: '最大10,000件までです' }, { status: 400 });
  }

  const job = await createBulkJob(type, validRows);

  after(async () => {
    try {
      await processBulkJob(job.id);
    } catch {
      await prisma.bulkJob.update({
        where: { id: job.id },
        data: { status: 'failed' },
      });
    }
  });

  return Response.json({ jobId: job.id }, { status: 201 });
}
