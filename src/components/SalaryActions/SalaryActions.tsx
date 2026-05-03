'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type SalaryActionsProps = {
  salaryId: string;
};

export function SalaryActions({ salaryId }: SalaryActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('このデータを削除しますか？')) return;

    setDeleting(true);
    const res = await fetch(`/api/salary/${salaryId}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      alert('削除に失敗しました');
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
      <Link
        href={`/salary/${salaryId}/edit`}
        className="rounded border border-[var(--foreground)]/20 px-3 py-1 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/5"
      >
        編集
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="rounded border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        {deleting ? '削除中...' : '削除'}
      </button>
    </div>
  );
}
