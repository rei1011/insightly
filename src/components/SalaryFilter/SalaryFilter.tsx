"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type SalaryFilterProps = {
  salaryFrom?: number;
  salaryTo?: number;
  baseSalaryFrom?: number;
  baseSalaryTo?: number;
};

export function SalaryFilter({ salaryFrom, salaryTo, baseSalaryFrom, baseSalaryTo }: SalaryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const makeBlurHandler = (paramKey: string) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    const num = value === "" ? undefined : parseInt(value, 10);
    if (num !== undefined && !Number.isNaN(num)) {
      params.set(paramKey, String(num));
    } else {
      params.delete(paramKey);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-6 rounded border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02] p-4">
      <p className="mb-3 text-sm font-medium text-[var(--foreground)]">
        年収で絞り込む:
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label
            htmlFor="salary-from"
            className="text-sm text-[var(--foreground)]/80"
          >
            〜万円から
          </label>
          <input
            id="salary-from"
            type="number"
            min={0}
            placeholder="例: 500"
            defaultValue={salaryFrom}
            onBlur={makeBlurHandler("salaryFrom")}
            key={`salary-from-${salaryFrom ?? "empty"}`}
            className="w-24 rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--foreground)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]/20"
            aria-label="年収の下限（万円）"
          />
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="salary-to"
            className="text-sm text-[var(--foreground)]/80"
          >
            〜万円まで
          </label>
          <input
            id="salary-to"
            type="number"
            min={0}
            placeholder="例: 1000"
            defaultValue={salaryTo}
            onBlur={makeBlurHandler("salaryTo")}
            key={`salary-to-${salaryTo ?? "empty"}`}
            className="w-24 rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--foreground)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]/20"
            aria-label="年収の上限（万円）"
          />
        </div>
      </div>
      <p className="mt-4 mb-3 text-sm font-medium text-[var(--foreground)]">
        ベース給与で絞り込む:
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label
            htmlFor="base-salary-from"
            className="text-sm text-[var(--foreground)]/80"
          >
            〜万円から
          </label>
          <input
            id="base-salary-from"
            type="number"
            min={0}
            placeholder="例: 400"
            defaultValue={baseSalaryFrom}
            onBlur={makeBlurHandler("baseSalaryFrom")}
            key={`base-salary-from-${baseSalaryFrom ?? "empty"}`}
            className="w-24 rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--foreground)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]/20"
            aria-label="ベース給与の下限（万円）"
          />
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="base-salary-to"
            className="text-sm text-[var(--foreground)]/80"
          >
            〜万円まで
          </label>
          <input
            id="base-salary-to"
            type="number"
            min={0}
            placeholder="例: 800"
            defaultValue={baseSalaryTo}
            onBlur={makeBlurHandler("baseSalaryTo")}
            key={`base-salary-to-${baseSalaryTo ?? "empty"}`}
            className="w-24 rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--foreground)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]/20"
            aria-label="ベース給与の上限（万円）"
          />
        </div>
      </div>
    </div>
  );
}
