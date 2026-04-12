"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type CompanyFilterProps = {
  companyName?: string;
};

export function CompanyFilter({ companyName }: CompanyFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (value !== "") {
      params.set("companyName", value);
    } else {
      params.delete("companyName");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-6 rounded border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02] p-4">
      <p className="mb-3 text-sm font-medium text-[var(--foreground)]">
        会社名で絞り込む:
      </p>
      <input
        id="company-name"
        type="text"
        placeholder="例: トヨタ"
        defaultValue={companyName}
        onBlur={handleBlur}
        key={`company-name-${companyName ?? "empty"}`}
        className="w-64 rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--foreground)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]/20"
        aria-label="会社名（部分一致）"
      />
    </div>
  );
}
