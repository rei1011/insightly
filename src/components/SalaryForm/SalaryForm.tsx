'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Company } from '@/api/companies';
import type { Occupation } from '@/api/occupations';

export type SalaryFormData = {
  id?: string;
  companyId: number;
  companyName: string;
  occupationId: string;
  occupationName: string;
  age: number;
  grade: string | null;
  overtimeHours: number | null;
  annualSalary: number;
  baseSalary: number;
  bonus: number | null;
  stockOptions: number | null;
  rsu: number | null;
};

type SalaryFormProps = {
  mode: 'create' | 'edit';
  initialData?: SalaryFormData;
  companies: Company[];
  occupations: Occupation[];
};

const inputClass =
  'w-full rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--foreground)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]/20';

const labelClass = 'block text-sm font-medium text-[var(--foreground)] mb-1';

export function SalaryForm({
  mode,
  initialData,
  companies,
  occupations,
}: SalaryFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companyMode, setCompanyMode] = useState<'existing' | 'new'>(
    initialData ? 'existing' : 'existing'
  );
  const [occupationMode, setOccupationMode] = useState<'existing' | 'new'>(
    initialData ? 'existing' : 'existing'
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload: Record<string, unknown> = {
      age: Number(formData.get('age')),
      annualSalary: Number(formData.get('annualSalary')),
      baseSalary: Number(formData.get('baseSalary')),
    };

    if (companyMode === 'existing') {
      payload.companyId = Number(formData.get('companyId'));
    } else {
      payload.newCompanyName = formData.get('newCompanyName');
    }

    if (occupationMode === 'existing') {
      payload.occupationId = formData.get('occupationId');
    } else {
      payload.newOccupationName = formData.get('newOccupationName');
    }

    const grade = formData.get('grade') as string;
    if (grade) payload.grade = grade;

    const overtimeHours = formData.get('overtimeHours') as string;
    if (overtimeHours) payload.overtimeHours = Number(overtimeHours);

    const bonus = formData.get('bonus') as string;
    if (bonus) payload.bonus = Number(bonus);

    const stockOptions = formData.get('stockOptions') as string;
    if (stockOptions) payload.stockOptions = Number(stockOptions);

    const rsu = formData.get('rsu') as string;
    if (rsu) payload.rsu = Number(rsu);

    try {
      const url =
        mode === 'create'
          ? '/api/salary'
          : `/api/salary/${initialData!.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        const message =
          err.details?.map((d: { message: string }) => d.message).join('\n') ??
          '保存に失敗しました';
        setError(message);
        setSubmitting(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('保存に失敗しました');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 whitespace-pre-line">
          {error}
        </div>
      )}

      {/* 会社選択 */}
      <fieldset className="rounded border border-[var(--foreground)]/10 p-4">
        <legend className="px-2 text-sm font-medium text-[var(--foreground)]">
          会社
        </legend>
        <div className="mb-3 flex gap-4">
          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="radio"
              name="companyMode"
              value="existing"
              checked={companyMode === 'existing'}
              onChange={() => setCompanyMode('existing')}
            />
            既存の会社から選択
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="radio"
              name="companyMode"
              value="new"
              checked={companyMode === 'new'}
              onChange={() => setCompanyMode('new')}
            />
            新しい会社を追加
          </label>
        </div>
        {companyMode === 'existing' ? (
          <select
            name="companyId"
            required
            defaultValue={initialData?.companyId ?? ''}
            className={inputClass}
          >
            <option value="">選択してください</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            name="newCompanyName"
            type="text"
            required
            maxLength={100}
            placeholder="会社名を入力"
            className={inputClass}
          />
        )}
      </fieldset>

      {/* 職種選択 */}
      <fieldset className="rounded border border-[var(--foreground)]/10 p-4">
        <legend className="px-2 text-sm font-medium text-[var(--foreground)]">
          職種
        </legend>
        <div className="mb-3 flex gap-4">
          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="radio"
              name="occupationMode"
              value="existing"
              checked={occupationMode === 'existing'}
              onChange={() => setOccupationMode('existing')}
            />
            既存の職種から選択
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="radio"
              name="occupationMode"
              value="new"
              checked={occupationMode === 'new'}
              onChange={() => setOccupationMode('new')}
            />
            新しい職種を追加
          </label>
        </div>
        {occupationMode === 'existing' ? (
          <select
            name="occupationId"
            required
            defaultValue={initialData?.occupationId ?? ''}
            className={inputClass}
          >
            <option value="">選択してください</option>
            {occupations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            name="newOccupationName"
            type="text"
            required
            maxLength={100}
            placeholder="職種名を入力"
            className={inputClass}
          />
        )}
      </fieldset>

      {/* 基本情報 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className={labelClass}>
            年齢
          </label>
          <input
            id="age"
            name="age"
            type="number"
            required
            min={18}
            max={100}
            defaultValue={initialData?.age}
            placeholder="例: 30"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="grade" className={labelClass}>
            グレード（任意）
          </label>
          <input
            id="grade"
            name="grade"
            type="text"
            maxLength={50}
            defaultValue={initialData?.grade ?? ''}
            placeholder="例: M1"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="overtimeHours" className={labelClass}>
          平均残業時間（月間・任意）
        </label>
        <input
          id="overtimeHours"
          name="overtimeHours"
          type="number"
          min={0}
          max={500}
          step={0.5}
          defaultValue={initialData?.overtimeHours ?? ''}
          placeholder="例: 20"
          className={inputClass}
        />
      </div>

      {/* 給与情報 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="annualSalary" className={labelClass}>
            年収（万円）
          </label>
          <input
            id="annualSalary"
            name="annualSalary"
            type="number"
            required
            min={1}
            step={1}
            defaultValue={initialData?.annualSalary}
            placeholder="例: 800"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="baseSalary" className={labelClass}>
            ベースの給与（万円）
          </label>
          <input
            id="baseSalary"
            name="baseSalary"
            type="number"
            required
            min={1}
            step={1}
            defaultValue={initialData?.baseSalary}
            placeholder="例: 600"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="bonus" className={labelClass}>
            賞与（万円・任意）
          </label>
          <input
            id="bonus"
            name="bonus"
            type="number"
            min={0}
            step={1}
            defaultValue={initialData?.bonus ?? ''}
            placeholder="例: 150"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="rsu" className={labelClass}>
            RSU（万円・任意）
          </label>
          <input
            id="rsu"
            name="rsu"
            type="number"
            min={0}
            step={1}
            defaultValue={initialData?.rsu ?? ''}
            placeholder="例: 50"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="stockOptions" className={labelClass}>
            ストックオプション（万円・任意）
          </label>
          <input
            id="stockOptions"
            name="stockOptions"
            type="number"
            min={0}
            step={1}
            defaultValue={initialData?.stockOptions ?? ''}
            placeholder="例: 30"
            className={inputClass}
          />
        </div>
      </div>

      {/* アクション */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {submitting ? '保存中...' : mode === 'create' ? '作成' : '更新'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-[var(--foreground)]/20 px-6 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/5"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
