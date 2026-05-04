import { validateBulkRequest } from '@/lib/csv';

export async function POST(request: Request) {
  const formData = await request.formData();
  const validation = await validateBulkRequest(formData);

  if (!validation.success) {
    return Response.json({ error: validation.error }, { status: validation.status });
  }

  const { result } = validation;
  return Response.json({
    totalRows: result.totalRows,
    validCount: result.validRows.length,
    errorCount: result.errorRows.length,
    validRows: result.validRows.slice(0, 100).map((r) => ({
      rowNumber: r.rowNumber,
      data: r.data,
    })),
    errorRows: result.errorRows.map((r) => ({
      rowNumber: r.rowNumber,
      data: r.data,
      errors: r.errors,
    })),
  });
}
