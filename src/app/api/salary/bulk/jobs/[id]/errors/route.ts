import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const job = await prisma.bulkJob.findUnique({
    where: { id },
    select: { errorCsv: true, status: true },
  });

  if (!job) {
    return Response.json({ error: 'ジョブが見つかりません' }, { status: 404 });
  }

  if (job.status !== 'completed') {
    return Response.json({ error: 'ジョブが完了していません' }, { status: 400 });
  }

  if (!job.errorCsv) {
    return Response.json({ error: 'エラーデータがありません' }, { status: 404 });
  }

  const bom = '﻿';
  return new Response(bom + job.errorCsv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="errors-${id}.csv"`,
    },
  });
}
