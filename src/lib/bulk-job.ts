import { prisma } from '@/lib/prisma';
import { resolveCompanyId, resolveOccupationId } from '@/lib/resolvers';
import { generateErrorCsv, type ParsedRow } from '@/lib/csv';

const PROGRESS_UPDATE_INTERVAL = 50;

type BulkJobType = 'import';

export async function createBulkJob(
  type: BulkJobType,
  validRows: ParsedRow[]
) {
  return prisma.bulkJob.create({
    data: {
      type,
      status: 'pending',
      totalRows: validRows.length,
      inputData: JSON.stringify(validRows),
    },
  });
}

export async function processBulkJob(jobId: string) {
  const job = await prisma.bulkJob.findUnique({ where: { id: jobId } });
  if (!job) return;

  await prisma.bulkJob.update({
    where: { id: jobId },
    data: { status: 'processing' },
  });

  const rows: ParsedRow[] = JSON.parse(job.inputData);
  let successRows = 0;
  let failedRows = 0;
  const errorRows: ParsedRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      await processImportRow(row);
      successRows++;
    } catch (error) {
      failedRows++;
      const message = error instanceof Error ? error.message : '不明なエラー';
      errorRows.push({
        ...row,
        errors: [{ field: 'system', message }],
      });
    }

    if ((i + 1) % PROGRESS_UPDATE_INTERVAL === 0 || i === rows.length - 1) {
      await prisma.bulkJob.update({
        where: { id: jobId },
        data: {
          processedRows: i + 1,
          successRows,
          failedRows,
        },
      });
    }
  }

  const errorCsv =
    errorRows.length > 0
      ? generateErrorCsv(errorRows, job.type as BulkJobType)
      : null;

  await prisma.bulkJob.update({
    where: { id: jobId },
    data: {
      status: 'completed',
      processedRows: rows.length,
      successRows,
      failedRows,
      errorCsv,
    },
  });
}

async function processImportRow(row: ParsedRow) {
  const data = row.data;
  const companyId = await resolveCompanyId(undefined, data['会社名'].trim());
  const occupationId = await resolveOccupationId(undefined, data['職種名'].trim());

  await prisma.salary.create({
    data: {
      companyId,
      occupationId,
      age: Number(data['年齢']),
      grade: data['グレード']?.trim() || null,
      overtimeHours: data['残業時間']?.trim() ? Number(data['残業時間']) : null,
      annualSalary: Number(data['年収']),
      baseSalary: Number(data['ベース給与']),
      bonus: data['賞与']?.trim() ? Number(data['賞与']) : null,
      rsu: data['RSU']?.trim() ? Number(data['RSU']) : null,
      stockOptions: data['ストックオプション']?.trim() ? Number(data['ストックオプション']) : null,
    },
  });
}
