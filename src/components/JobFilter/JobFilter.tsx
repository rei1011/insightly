"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type JobFilterProps = {
  occupations: { id: string; name: string }[];
  selectedIds: string[];
};

export function JobFilter({ occupations, selectedIds }: JobFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (occupationId: string, checked: boolean) => {
    const newIds = checked
      ? [...selectedIds, occupationId]
      : selectedIds.filter((id) => id !== occupationId);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (newIds.length > 0) {
      params.set("occupations", newIds.join(","));
    } else {
      params.delete("occupations");
    }

    router.push(`?${params.toString()}`);
  };

  if (occupations.length === 0) return null;

  return (
    <div className="mb-6 rounded border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02] p-4">
      <p className="mb-3 text-sm font-medium text-[var(--foreground)]">
        職種で絞り込む:
      </p>
      <div className="flex flex-wrap gap-3">
        {occupations.map((occ) => (
          <label
            key={occ.id}
            data-jobfilter-label
            className="flex cursor-pointer items-center gap-2 rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/5 has-[:checked]:border-[var(--foreground)]/40 has-[:checked]:bg-[var(--foreground)]/10"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(occ.id)}
              onChange={(e) => handleChange(occ.id, e.target.checked)}
              className="h-4 w-4 rounded border-[var(--foreground)]/30 accent-[var(--foreground)]"
              aria-label={`${occ.name}で絞り込む`}
            />
            <span>{occ.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
