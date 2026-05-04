import { prisma } from '@/lib/prisma';
import type { BulkOperationType, ParsedRow } from '@/lib/csv';
import { generateErrorCsv } from '@/lib/csv';

const PROGRESS_UPDATE_INTERVAL = 50;

export async function createBulkJob(
  type: BulkOperationType,
  validRows: ParsedRow[],
): Promise<string> {
  const job = await prisma.bulkJob.create({
    data: {
      type,
      totalRows: validRows.length,
      inputData: JSON.stringify(validRows.map((r) => r.data)),
    },
  });
  return job.id;
}

type CompanyMap = Map<string, number>;
type OccupationMap = Map<string, string>;

async function buildCompanyMap(names: string[]): Promise<CompanyMap> {
  const unique = [...new Set(names)];
  const map: CompanyMap = new Map();

  for (const name of unique) {
    const company = await prisma.company.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    map.set(name, company.id);
  }
  return map;
}

async function buildOccupationMap(names: string[]): Promise<OccupationMap> {
  const unique = [...new Set(names)];
  const map: OccupationMap = new Map();

  for (const name of unique) {
    const occupation = await prisma.occupation.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    map.set(name, occupation.id);
  }
  return map;
}

function parseOptionalNumber(value: string | undefined): number | null {
  if (value === undefined || value === '') return null;
  return Number(value);
}

function buildSalaryData(
  row: Record<string, string>,
  companyId: number,
  occupationId: string,
) {
  return {
    companyId,
    occupationId,
    age: Number(row['年齢']),
    grade: row['グレード']?.trim() || null,
    overtimeHours: parseOptionalNumber(row['残業時間']),
    annualSalary: Number(row['年収']),
    baseSalary: Number(row['ベース給与']),
    bonus: parseOptionalNumber(row['賞与']),
    rsu: parseOptionalNumber(row['RSU']),
    stockOptions: parseOptionalNumber(row['ストックオプション']),
  };
}

type ProcessRowFn = (row: Record<string, string>) => Promise<void>;

async function processBulkRows(
  jobId: string,
  rows: Record<string, string>[],
  processRow: ProcessRowFn,
) {
  let processed = 0;
  let success = 0;
  let failed = 0;
  const errorEntries: { data: Record<string, string>; errors: string }[] = [];

  for (const row of rows) {
    try {
      await processRow(row);
      success++;
    } catch (error) {
      failed++;
      errorEntries.push({
        data: row,
        errors: error instanceof Error ? error.message : '不明なエラー',
      });
    }

    processed++;
    if (processed % PROGRESS_UPDATE_INTERVAL === 0) {
      await prisma.bulkJob.update({
        where: { id: jobId },
        data: { processedRows: processed, successRows: success, failedRows: failed },
      });
    }
  }

  const errorCsv = errorEntries.length > 0 ? generateErrorCsv(errorEntries) : null;
  await prisma.bulkJob.update({
    where: { id: jobId },
    data: {
      status: 'completed',
      processedRows: processed,
      successRows: success,
      failedRows: failed,
      errorCsv,
    },
  });
}

async function processImport(jobId: string, rows: Record<string, string>[]) {
  const companyMap = await buildCompanyMap(rows.map((r) => r['会社名'].trim()));
  const occupationMap = await buildOccupationMap(rows.map((r) => r['職種名'].trim()));

  await processBulkRows(jobId, rows, async (row) => {
    const companyId = companyMap.get(row['会社名'].trim())!;
    const occupationId = occupationMap.get(row['職種名'].trim())!;
    await prisma.salary.create({ data: buildSalaryData(row, companyId, occupationId) });
  });
}

async function processUpdate(jobId: string, rows: Record<string, string>[]) {
  const companyMap = await buildCompanyMap(rows.map((r) => r['会社名'].trim()));
  const occupationMap = await buildOccupationMap(rows.map((r) => r['職種名'].trim()));

  await processBulkRows(jobId, rows, async (row) => {
    const id = row['id'].trim();
    const existing = await prisma.salary.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`id: ${id} のデータが見つかりません`);
    }

    const companyId = companyMap.get(row['会社名'].trim())!;
    const occupationId = occupationMap.get(row['職種名'].trim())!;
    await prisma.salary.update({
      where: { id },
      data: buildSalaryData(row, companyId, occupationId),
    });
  });
}

async function processDelete(jobId: string, rows: Record<string, string>[]) {
  await processBulkRows(jobId, rows, async (row) => {
    const id = row['id'].trim();
    const existing = await prisma.salary.findUnique({ where: { id } });
    if (!existing) return;
    await prisma.salary.delete({ where: { id } });
  });
}

export async function executeBulkJob(jobId: string) {
  const job = await prisma.bulkJob.update({
    where: { id: jobId },
    data: { status: 'processing' },
  });

  const rows: Record<string, string>[] = JSON.parse(job.inputData);
  const type = job.type as BulkOperationType;

  try {
    if (type === 'import') {
      await processImport(jobId, rows);
    } else if (type === 'update') {
      await processUpdate(jobId, rows);
    } else if (type === 'delete') {
      await processDelete(jobId, rows);
    }
  } catch (error) {
    await prisma.bulkJob.update({
      where: { id: jobId },
      data: {
        status: 'failed',
      },
    });
    throw error;
  }
}
