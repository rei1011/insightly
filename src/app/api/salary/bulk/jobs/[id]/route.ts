import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const job = await prisma.bulkJob.findUnique({
    where: { id },
    select: {
      id: true,
      type: true,
      status: true,
      totalRows: true,
      processedRows: true,
      successRows: true,
      failedRows: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!job) {
    return Response.json({ error: 'ジョブが見つかりません' }, { status: 404 });
  }

  return Response.json(job);
}
