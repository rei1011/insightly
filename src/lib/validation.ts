export type SalaryInput = {
  companyId?: number;
  newCompanyName?: string;
  occupationId?: string;
  newOccupationName?: string;
  age: number;
  grade?: string;
  overtimeHours?: number;
  annualSalary: number;
  baseSalary: number;
  bonus?: number;
  stockOptions?: number;
  rsu?: number;
};

export type ValidationError = { field: string; message: string };

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateSalaryInput(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof data !== 'object' || data === null) {
    return [{ field: '_', message: '不正なリクエストです' }];
  }

  const d = data as Record<string, unknown>;

  if (!d.companyId && !d.newCompanyName) {
    errors.push({
      field: 'company',
      message: '会社を選択または入力してください',
    });
  }
  if (d.companyId !== undefined && (typeof d.companyId !== 'number' || !Number.isInteger(d.companyId))) {
    errors.push({ field: 'companyId', message: '会社IDが不正です' });
  }
  if (d.newCompanyName !== undefined) {
    if (typeof d.newCompanyName !== 'string' || d.newCompanyName.length === 0 || d.newCompanyName.length > 100) {
      errors.push({ field: 'newCompanyName', message: '会社名は1〜100文字で入力してください' });
    }
  }

  if (!d.occupationId && !d.newOccupationName) {
    errors.push({
      field: 'occupation',
      message: '職種を選択または入力してください',
    });
  }
  if (d.occupationId !== undefined && (typeof d.occupationId !== 'string' || !UUID_REGEX.test(d.occupationId))) {
    errors.push({ field: 'occupationId', message: '職種IDが不正です' });
  }
  if (d.newOccupationName !== undefined) {
    if (typeof d.newOccupationName !== 'string' || d.newOccupationName.length === 0 || d.newOccupationName.length > 100) {
      errors.push({ field: 'newOccupationName', message: '職種名は1〜100文字で入力してください' });
    }
  }

  if (typeof d.age !== 'number' || !Number.isInteger(d.age) || d.age < 18 || d.age > 100) {
    errors.push({ field: 'age', message: '年齢は18〜100の整数で入力してください' });
  }

  if (d.grade !== undefined && (typeof d.grade !== 'string' || d.grade.length > 50)) {
    errors.push({ field: 'grade', message: 'グレードは50文字以内で入力してください' });
  }

  if (d.overtimeHours !== undefined && d.overtimeHours !== null) {
    if (typeof d.overtimeHours !== 'number' || d.overtimeHours < 0 || d.overtimeHours > 500) {
      errors.push({ field: 'overtimeHours', message: '残業時間は0〜500の範囲で入力してください' });
    }
  }

  if (typeof d.annualSalary !== 'number' || d.annualSalary <= 0) {
    errors.push({ field: 'annualSalary', message: '年収は正の数値を入力してください' });
  }

  if (typeof d.baseSalary !== 'number' || d.baseSalary <= 0) {
    errors.push({ field: 'baseSalary', message: 'ベースの給与は正の数値を入力してください' });
  }

  const optionalPositiveFields = [
    { key: 'bonus', label: '賞与' },
    { key: 'stockOptions', label: 'ストックオプション' },
    { key: 'rsu', label: 'RSU' },
  ] as const;

  for (const { key, label } of optionalPositiveFields) {
    if (d[key] !== undefined && d[key] !== null) {
      if (typeof d[key] !== 'number' || (d[key] as number) < 0) {
        errors.push({ field: key, message: `${label}は0以上の数値を入力してください` });
      }
    }
  }

  return errors;
}
