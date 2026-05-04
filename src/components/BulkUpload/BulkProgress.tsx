'use client';

type BulkProgressProps = {
  totalRows: number;
  processedRows: number;
  successRows: number;
  failedRows: number;
  status: string;
};

export function BulkProgress({
  totalRows,
  processedRows,
  successRows,
  failedRows,
  status,
}: BulkProgressProps) {
  const percentage = totalRows > 0 ? Math.round((processedRows / totalRows) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--foreground)]">
          {status === 'pending' ? '処理待ち...' : status === 'processing' ? '処理中...' : '完了'}
        </span>
        <span className="text-[var(--foreground)]/60">
          {processedRows.toLocaleString()} / {totalRows.toLocaleString()} 件
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--foreground)]/10">
        <div
          className="h-full rounded-full bg-[var(--foreground)] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex gap-6 text-sm">
        <span className="text-green-600 dark:text-green-400">
          成功: {successRows.toLocaleString()}件
        </span>
        {failedRows > 0 && (
          <span className="text-red-600 dark:text-red-400">
            失敗: {failedRows.toLocaleString()}件
          </span>
        )}
      </div>
    </div>
  );
}
