"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type AgeFilterProps = {
  ageFrom?: number;
  ageTo?: number;
};

export function AgeFilter({ ageFrom, ageTo }: AgeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFromBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    const num = value === "" ? undefined : parseInt(value, 10);
    if (num !== undefined && !Number.isNaN(num)) {
      params.set("ageFrom", String(num));
    } else {
      params.delete("ageFrom");
    }

    router.push(`?${params.toString()}`);
  };

  const handleToBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    const num = value === "" ? undefined : parseInt(value, 10);
    if (num !== undefined && !Number.isNaN(num)) {
      params.set("ageTo", String(num));
    } else {
      params.delete("ageTo");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-6 rounded border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02] p-4">
      <p className="mb-3 text-sm font-medium text-[var(--foreground)]">
        年齢で絞り込む:
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label
            htmlFor="age-from"
            className="text-sm text-[var(--foreground)]/80"
          >
            〜歳から
          </label>
          <input
            id="age-from"
            type="number"
            min={18}
            max={70}
            placeholder="例: 31"
            defaultValue={ageFrom}
            onBlur={handleFromBlur}
            key={`age-from-${ageFrom ?? "empty"}`}
            className="w-20 rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--foreground)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]/20"
            aria-label="年齢の下限（歳）"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="age-to" className="text-sm text-[var(--foreground)]/80">
            〜歳まで
          </label>
          <input
            id="age-to"
            type="number"
            min={18}
            max={70}
            placeholder="例: 34"
            defaultValue={ageTo}
            onBlur={handleToBlur}
            key={`age-to-${ageTo ?? "empty"}`}
            className="w-20 rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--foreground)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]/20"
            aria-label="年齢の上限（歳）"
          />
        </div>
      </div>
    </div>
  );
}
