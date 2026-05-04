'use client';

type BulkResultProps = {
  jobId: string;
  successRows: number;
  failedRows: number;
  hasErrors: boolean;
  onReset: () => void;
};

export function BulkResult({
  jobId,
  successRows,
  failedRows,
  hasErrors,
  onReset,
}: BulkResultProps) {
  const handleDownloadErrors = async () => {
    const res = await fetch(`/api/salary/bulk/jobs/${jobId}/errors`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `errors-${jobId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="rounded border border-[var(--foreground)]/10 p-6">
        <h3 className="mb-4 text-lg font-medium text-[var(--foreground)]">処理完了</h3>
        <div className="flex gap-6 text-sm">
          <div className="rounded border border-green-300 bg-green-50 px-4 py-3 dark:border-green-700 dark:bg-green-900/20">
            <div className="text-xs text-green-600 dark:text-green-400">成功</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {successRows.toLocaleString()}件
            </div>
          </div>
          {failedRows > 0 && (
            <div className="rounded border border-red-300 bg-red-50 px-4 py-3 dark:border-red-700 dark:bg-red-900/20">
              <div className="text-xs text-red-600 dark:text-red-400">失敗</div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {failedRows.toLocaleString()}件
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {hasErrors && (
          <button
            onClick={handleDownloadErrors}
            className="rounded border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
          >
            エラー詳細CSVをダウンロード
          </button>
        )}
        <button
          onClick={onReset}
          className="rounded border border-[var(--foreground)]/20 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/5"
        >
          別のファイルを処理
        </button>
      </div>
    </div>
  );
}
