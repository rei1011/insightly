import Papa from 'papaparse';

export type BulkOperationType = 'import' | 'update';

const IMPORT_HEADERS = [
  '会社名', '職種名', '年齢', 'グレード', '残業時間',
  '年収', 'ベース給与', '賞与', 'RSU', 'ストックオプション',
] as const;

const UPDATE_HEADERS = ['id', ...IMPORT_HEADERS] as const;

export type CsvRowError = {
  row: number;
  field: string;
  message: string;
};

export type ParsedRow = {
  rowNumber: number;
  data: Record<string, string>;
  errors: CsvRowError[];
};

export type CsvParseResult = {
  validRows: ParsedRow[];
  errorRows: ParsedRow[];
  totalRows: number;
};

export function parseCsv(csvText: string): Record<string, string>[] {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data;
}

export function validateHeaders(
  headers: string[],
  type: BulkOperationType,
): string | null {
  if (type === 'import') {
    const expected = IMPORT_HEADERS;
    const missing = expected.filter((h) => !headers.includes(h));
    if (missing.length > 0) {
      return `必須ヘッダーが不足しています: ${missing.join(', ')}`;
    }
  } else if (type === 'update') {
    const expected = UPDATE_HEADERS;
    const missing = expected.filter((h) => !headers.includes(h));
    if (missing.length > 0) {
      return `必須ヘッダーが不足しています: ${missing.join(', ')}`;
    }
  }
  return null;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === '') return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
}

export function validateRow(
  row: Record<string, string>,
  rowNumber: number,
  type: BulkOperationType,
): CsvRowError[] {
  const errors: CsvRowError[] = [];

  if (type === 'update') {
    const id = row['id']?.trim();
    if (!id) {
      errors.push({ row: rowNumber, field: 'id', message: 'idは必須です' });
    } else if (!UUID_REGEX.test(id)) {
      errors.push({ row: rowNumber, field: 'id', message: 'idの形式が不正です（UUID形式で入力してください）' });
    }
  }

  const companyName = row['会社名']?.trim();
  if (!companyName) {
    errors.push({ row: rowNumber, field: '会社名', message: '会社名は必須です' });
  } else if (companyName.length > 100) {
    errors.push({ row: rowNumber, field: '会社名', message: '会社名は100文字以内で入力してください' });
  }

  const occupationName = row['職種名']?.trim();
  if (!occupationName) {
    errors.push({ row: rowNumber, field: '職種名', message: '職種名は必須です' });
  } else if (occupationName.length > 100) {
    errors.push({ row: rowNumber, field: '職種名', message: '職種名は100文字以内で入力してください' });
  }

  const age = parseNumber(row['年齢']);
  if (age === undefined) {
    errors.push({ row: rowNumber, field: '年齢', message: '年齢は必須です' });
  } else if (!Number.isInteger(age) || age < 18 || age > 100) {
    errors.push({ row: rowNumber, field: '年齢', message: '年齢は18〜100の整数で入力してください' });
  }

  const grade = row['グレード']?.trim();
  if (grade && grade.length > 50) {
    errors.push({ row: rowNumber, field: 'グレード', message: 'グレードは50文字以内で入力してください' });
  }

  const overtimeHours = parseNumber(row['残業時間']);
  if (overtimeHours !== undefined && (overtimeHours < 0 || overtimeHours > 500)) {
    errors.push({ row: rowNumber, field: '残業時間', message: '残業時間は0〜500の範囲で入力してください' });
  }

  const annualSalary = parseNumber(row['年収']);
  if (annualSalary === undefined) {
    errors.push({ row: rowNumber, field: '年収', message: '年収は必須です' });
  } else if (annualSalary <= 0) {
    errors.push({ row: rowNumber, field: '年収', message: '年収は正の数値を入力してください' });
  }

  const baseSalary = parseNumber(row['ベース給与']);
  if (baseSalary === undefined) {
    errors.push({ row: rowNumber, field: 'ベース給与', message: 'ベース給与は必須です' });
  } else if (baseSalary <= 0) {
    errors.push({ row: rowNumber, field: 'ベース給与', message: 'ベース給与は正の数値を入力してください' });
  }

  const bonus = parseNumber(row['賞与']);
  if (bonus !== undefined && bonus < 0) {
    errors.push({ row: rowNumber, field: '賞与', message: '賞与は0以上の数値を入力してください' });
  }

  const rsu = parseNumber(row['RSU']);
  if (rsu !== undefined && rsu < 0) {
    errors.push({ row: rowNumber, field: 'RSU', message: 'RSUは0以上の数値を入力してください' });
  }

  const stockOptions = parseNumber(row['ストックオプション']);
  if (stockOptions !== undefined && stockOptions < 0) {
    errors.push({ row: rowNumber, field: 'ストックオプション', message: 'ストックオプションは0以上の数値を入力してください' });
  }

  return errors;
}

export function parseAndValidateCsv(
  csvText: string,
  type: BulkOperationType,
): { headerError: string | null; result: CsvParseResult | null } {
  const parseResult = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const headers = parseResult.meta.fields ?? [];
  const headerError = validateHeaders(headers, type);
  if (headerError) {
    return { headerError, result: null };
  }

  const validRows: ParsedRow[] = [];
  const errorRows: ParsedRow[] = [];

  parseResult.data.forEach((row, index) => {
    const rowNumber = index + 2;
    const errors = validateRow(row, rowNumber, type);
    const parsed: ParsedRow = { rowNumber, data: row, errors };

    if (errors.length > 0) {
      errorRows.push(parsed);
    } else {
      validRows.push(parsed);
    }
  });

  return {
    headerError: null,
    result: { validRows, errorRows, totalRows: parseResult.data.length },
  };
}

export function generateErrorCsv(
  rows: { data: Record<string, string>; errors: string }[],
): string {
  if (rows.length === 0) return '';
  const headers = [...Object.keys(rows[0].data), 'ERROR'];
  const data = rows.map((r) => ({ ...r.data, ERROR: r.errors }));
  return Papa.unparse(data, { columns: headers });
}

const MAX_ROWS = 10000;
const VALID_TYPES: BulkOperationType[] = ['import', 'update'];

export type BulkRequestValidation =
  | { success: true; type: BulkOperationType; result: CsvParseResult }
  | { success: false; error: string; status: number };

export async function validateBulkRequest(
  formData: FormData,
): Promise<BulkRequestValidation> {
  const file = formData.get('file') as File | null;
  const type = formData.get('type') as string | null;

  if (!file) {
    return { success: false, error: 'CSVファイルが必要です', status: 400 };
  }

  if (!type || !VALID_TYPES.includes(type as BulkOperationType)) {
    return {
      success: false,
      error: 'typeは import, update のいずれかを指定してください',
      status: 400,
    };
  }

  const csvText = await file.text();
  const { headerError, result } = parseAndValidateCsv(
    csvText,
    type as BulkOperationType,
  );

  if (headerError) {
    return { success: false, error: headerError, status: 400 };
  }

  if (!result || result.totalRows === 0) {
    return { success: false, error: 'CSVにデータ行がありません', status: 400 };
  }

  if (result.totalRows > MAX_ROWS) {
    return {
      success: false,
      error: `データ行数が上限（${MAX_ROWS.toLocaleString()}件）を超えています`,
      status: 400,
    };
  }

  return { success: true, type: type as BulkOperationType, result };
}
