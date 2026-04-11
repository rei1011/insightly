"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type SalaryFilterProps = {
  salaryFrom?: number;
  salaryTo?: number;
};

export function SalaryFilter({ salaryFrom, salaryTo }: SalaryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFromBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    const num = value === "" ? undefined : parseInt(value, 10);
    if (num !== undefined && !Number.isNaN(num)) {
      params.set("salaryFrom", String(num));
    } else {
      params.delete("salaryFrom");
    }

    router.push(`?${params.toString()}`);
  };

  const handleToBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    const num = value === "" ? undefined : parseInt(value, 10);
    if (num !== undefined && !Number.isNaN(num)) {
      params.set("salaryTo", String(num));
    } else {
      params.delete("salaryTo");
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
            onBlur={handleFromBlur}
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
            onBlur={handleToBlur}
            key={`salary-to-${salaryTo ?? "empty"}`}
            className="w-24 rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--foreground)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]/20"
            aria-label="年収の上限（万円）"
          />
        </div>
      </div>
    </div>
  );
}
