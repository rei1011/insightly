import { previewCsv } from '@/lib/csv';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const type = formData.get('type') as string | null;

  if (!file) {
    return Response.json({ error: 'ファイルが指定されていません' }, { status: 400 });
  }

  if (!type || !['import', 'update', 'delete'].includes(type)) {
    return Response.json({ error: '操作タイプが不正です' }, { status: 400 });
  }

  const csvText = await file.text();
  const result = previewCsv(csvText, type as 'import' | 'update' | 'delete');

  if (result.headerError) {
    return Response.json({ error: result.headerError }, { status: 400 });
  }

  return Response.json({
    validRows: result.validRows,
    errorRows: result.errorRows,
    totalRows: result.totalRows,
    validCount: result.validRows.length,
    errorCount: result.errorRows.length,
  });
}
