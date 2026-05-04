import { after } from 'next/server';
import { validateBulkRequest } from '@/lib/csv';
import { createBulkJob, executeBulkJob } from '@/lib/bulk-job';

export async function POST(request: Request) {
  const formData = await request.formData();
  const validation = await validateBulkRequest(formData);

  if (!validation.success) {
    return Response.json({ error: validation.error }, { status: validation.status });
  }

  const { result, type } = validation;

  if (result.validRows.length === 0) {
    return Response.json(
      { error: 'すべての行にバリデーションエラーがあります' },
      { status: 400 },
    );
  }

  const jobId = await createBulkJob(type, result.validRows);

  after(async () => {
    await executeBulkJob(jobId);
  });

  return Response.json({ jobId }, { status: 202 });
}
