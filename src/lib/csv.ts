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

export type CsvRow = Record<string, string>;

export type ParsedRow = {
  rowNumber: number;
  data: CsvRow;
  errors: { field: string; message: string }[];
};

export type PreviewResult = {
  validRows: ParsedRow[];
  errorRows: ParsedRow[];
  totalRows: number;
};

export function parseCsv(csvText: string): CsvRow[] {
  const cleanText = csvText.replace(/^﻿/, '');

  const result = Papa.parse<CsvRow>(cleanText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  return result.data;
}

export function validateHeaders(
  headers: string[],
  type: 'import'
): string | null {
  const expected = IMPORT_HEADERS;

  for (const h of expected) {
    if (!headers.includes(h)) {
      return `必須ヘッダー「${h}」が見つかりません`;
    }
  }
  return null;
}

export function validateImportRow(row: CsvRow, rowNumber: number): ParsedRow {
  const errors: { field: string; message: string }[] = [];

  const companyName = row['会社名']?.trim();
  if (!companyName) {
    errors.push({ field: '会社名', message: '会社名は必須です' });
  } else if (companyName.length > 100) {
    errors.push({ field: '会社名', message: '会社名は100文字以内で入力してください' });
  }

  const occupationName = row['職種名']?.trim();
  if (!occupationName) {
    errors.push({ field: '職種名', message: '職種名は必須です' });
  } else if (occupationName.length > 100) {
    errors.push({ field: '職種名', message: '職種名は100文字以内で入力してください' });
  }

  const age = Number(row['年齢']);
  if (!row['年齢']?.trim() || isNaN(age) || !Number.isInteger(age) || age < 18 || age > 100) {
    errors.push({ field: '年齢', message: '年齢は18〜100の整数で入力してください' });
  }

  const grade = row['グレード']?.trim();
  if (grade && grade.length > 50) {
    errors.push({ field: 'グレード', message: 'グレードは50文字以内で入力してください' });
  }

  const overtimeHours = row['残業時間']?.trim();
  if (overtimeHours) {
    const val = Number(overtimeHours);
    if (isNaN(val) || val < 0 || val > 500) {
      errors.push({ field: '残業時間', message: '残業時間は0〜500の範囲で入力してください' });
    }
  }

  const annualSalary = Number(row['年収']);
  if (!row['年収']?.trim() || isNaN(annualSalary) || annualSalary <= 0) {
    errors.push({ field: '年収', message: '年収は正の数値を入力してください' });
  }

  const baseSalary = Number(row['ベース給与']);
  if (!row['ベース給与']?.trim() || isNaN(baseSalary) || baseSalary <= 0) {
    errors.push({ field: 'ベース給与', message: 'ベース給与は正の数値を入力してください' });
  }

  const optionalPositiveFields = [
    { key: '賞与', label: '賞与' },
    { key: 'RSU', label: 'RSU' },
    { key: 'ストックオプション', label: 'ストックオプション' },
  ] as const;

  for (const { key, label } of optionalPositiveFields) {
    const val = row[key]?.trim();
    if (val) {
      const num = Number(val);
      if (isNaN(num) || num < 0) {
        errors.push({ field: key, message: `${label}は0以上の数値を入力してください` });
      }
    }
  }

  return { rowNumber, data: row, errors };
}

export function previewCsv(
  csvText: string,
  type: 'import'
): PreviewResult & { headerError?: string } {
  const rows = parseCsv(csvText);

  if (rows.length === 0) {
    return { validRows: [], errorRows: [], totalRows: 0, headerError: 'CSVにデータ行がありません' };
  }

  if (rows.length > 10000) {
    return { validRows: [], errorRows: [], totalRows: rows.length, headerError: '最大10,000件までです' };
  }

  const headers = Object.keys(rows[0]);
  const headerError = validateHeaders(headers, type);
  if (headerError) {
    return { validRows: [], errorRows: [], totalRows: rows.length, headerError };
  }

  const validRows: ParsedRow[] = [];
  const errorRows: ParsedRow[] = [];

  rows.forEach((row, i) => {
    const result = validateImportRow(row, i + 2);
    if (result.errors.length > 0) {
      errorRows.push(result);
    } else {
      validRows.push(result);
    }
  });

  return { validRows, errorRows, totalRows: rows.length };
}

export function generateErrorCsv(
  errorRows: ParsedRow[],
  type: 'import'
): string {
  const headers = [...IMPORT_HEADERS, 'エラー内容'];

  const data = errorRows.map((row) => {
    const errorMessage = row.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
    return { ...row.data, 'エラー内容': errorMessage };
  });

  return Papa.unparse(data, { columns: headers as unknown as string[] });
}

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
