'use client';

import { useState } from 'react';

export function BulkUpload() {
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/salary/export');
      if (!res.ok) {
        setError('エクスポートに失敗しました');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'salary-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('エクスポートに失敗しました');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm text-[var(--foreground)]/70">
          全件の報酬データをCSVファイルとしてダウンロードします。
        </p>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="rounded bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {exporting ? 'ダウンロード中...' : 'CSVをダウンロード'}
        </button>
      </div>
    </div>
  );
}
