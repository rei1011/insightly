import { prisma } from '@/lib/prisma';
import { createCsvResponse } from '@/lib/csv';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = await prisma.bulkJob.findUnique({ where: { id } });

  if (!job) {
    return Response.json({ error: 'ジョブが見つかりません' }, { status: 404 });
  }

  if (!job.errorCsv) {
    return Response.json({ error: 'エラーデータがありません' }, { status: 404 });
  }

  return createCsvResponse(job.errorCsv, `errors-${job.id}.csv`);
}
