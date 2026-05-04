import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = await prisma.bulkJob.findUnique({ where: { id } });

  if (!job) {
    return Response.json({ error: 'ジョブが見つかりません' }, { status: 404 });
  }

  return Response.json({
    id: job.id,
    type: job.type,
    status: job.status,
    totalRows: job.totalRows,
    processedRows: job.processedRows,
    successRows: job.successRows,
    failedRows: job.failedRows,
    hasErrors: !!job.errorCsv,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  });
}
