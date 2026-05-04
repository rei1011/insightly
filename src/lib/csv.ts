import Papa from 'papaparse';

export const IMPORT_HEADERS = [
  '会社名',
  '職種名',
  '年齢',
  'グレード',
  '残業時間',
  '年収',
  'ベース給与',
  '賞与',
  'RSU',
  'ストックオプション',
] as const;

export const UPDATE_HEADERS = ['id', ...IMPORT_HEADERS] as const;

export function createCsvResponse(csv: string, filename: string): Response {
  const bom = '﻿';
  return new Response(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

export function generateExportCsv(
  salaries: {
    id: string;
    companyName: string;
    occupationName: string;
    age: number;
    grade: string | null;
    overtimeHours: number | null;
    annualSalary: number;
    baseSalary: number;
    bonus: number | null;
    rsu: number | null;
    stockOptions: number | null;
  }[]
): string {
  const headers = [...UPDATE_HEADERS];
  const data = salaries.map((s) => ({
    id: s.id,
    '会社名': s.companyName,
    '職種名': s.occupationName,
    '年齢': String(s.age),
    'グレード': s.grade ?? '',
    '残業時間': s.overtimeHours != null ? String(s.overtimeHours) : '',
    '年収': String(s.annualSalary),
    'ベース給与': String(s.baseSalary),
    '賞与': s.bonus != null ? String(s.bonus) : '',
    RSU: s.rsu != null ? String(s.rsu) : '',
    'ストックオプション': s.stockOptions != null ? String(s.stockOptions) : '',
  }));

  return Papa.unparse(data, { columns: headers as unknown as string[] });
}
