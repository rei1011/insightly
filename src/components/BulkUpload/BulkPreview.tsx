'use client';

import type { ParsedRow } from '@/lib/csv';

type BulkPreviewProps = {
  type: 'import';
  validRows: ParsedRow[];
  errorRows: ParsedRow[];
  onExecute: () => void;
  onCancel: () => void;
  executing: boolean;
};

const thClass =
  'px-3 py-2 text-left text-xs font-medium text-[var(--foreground)]/60 uppercase tracking-wider';
const tdClass = 'px-3 py-2 text-sm text-[var(--foreground)] whitespace-nowrap';

export function BulkPreview({
  validRows,
  errorRows,
  onExecute,
  onCancel,
  executing,
}: BulkPreviewProps) {
  const displayHeaders = ['会社名', '職種名', '年齢', 'グレード', '残業時間', '年収', 'ベース給与', '賞与', 'RSU', 'ストックオプション'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="rounded border border-green-300 bg-green-50 px-4 py-2 text-sm dark:border-green-700 dark:bg-green-900/20">
          <span className="font-medium text-green-700 dark:text-green-400">
            正常行: {validRows.length}件
          </span>
        </div>
        {errorRows.length > 0 && (
          <div className="rounded border border-red-300 bg-red-50 px-4 py-2 text-sm dark:border-red-700 dark:bg-red-900/20">
            <span className="font-medium text-red-700 dark:text-red-400">
              エラー行: {errorRows.length}件
            </span>
          </div>
        )}
      </div>

      {errorRows.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-red-700 dark:text-red-400">
            エラー行（処理されません）
          </h3>
          <div className="max-h-60 overflow-auto rounded border border-red-200 dark:border-red-800">
            <table className="min-w-full divide-y divide-red-200 dark:divide-red-800">
              <thead className="bg-red-50 dark:bg-red-900/20">
                <tr>
                  <th className={thClass}>行番号</th>
                  {displayHeaders.map((h) => (
                    <th key={h} className={thClass}>{h}</th>
                  ))}
                  <th className={thClass}>エラー内容</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100 dark:divide-red-900">
                {errorRows.slice(0, 50).map((row) => (
                  <tr key={row.rowNumber}>
                    <td className={tdClass}>{row.rowNumber}</td>
                    {displayHeaders.map((h) => (
                      <td key={h} className={tdClass}>
                        {row.data[h] ?? ''}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-sm text-red-600 dark:text-red-400">
                      {row.errors.map((e) => e.message).join(', ')}
                    </td>
                  </tr>
                ))}
                {errorRows.length > 50 && (
                  <tr>
                    <td colSpan={displayHeaders.length + 2} className="px-3 py-2 text-sm text-[var(--foreground)]/50 text-center">
                      ...他 {errorRows.length - 50} 件のエラー行
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {validRows.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-green-700 dark:text-green-400">
            正常行（プレビュー: 最大10件表示）
          </h3>
          <div className="max-h-60 overflow-auto rounded border border-[var(--foreground)]/10">
            <table className="min-w-full divide-y divide-[var(--foreground)]/10">
              <thead className="bg-[var(--foreground)]/5">
                <tr>
                  <th className={thClass}>行番号</th>
                  {displayHeaders.map((h) => (
                    <th key={h} className={thClass}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--foreground)]/5">
                {validRows.slice(0, 10).map((row) => (
                  <tr key={row.rowNumber}>
                    <td className={tdClass}>{row.rowNumber}</td>
                    {displayHeaders.map((h) => (
                      <td key={h} className={tdClass}>
                        {row.data[h] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
                {validRows.length > 10 && (
                  <tr>
                    <td colSpan={displayHeaders.length + 1} className="px-3 py-2 text-sm text-[var(--foreground)]/50 text-center">
                      ...他 {validRows.length - 10} 件の正常行
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={onExecute}
          disabled={executing || validRows.length === 0}
          className="rounded bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {executing ? '実行中...' : `${validRows.length}件を処理する`}
        </button>
        <button
          onClick={onCancel}
          disabled={executing}
          className="rounded border border-[var(--foreground)]/20 px-6 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/5 disabled:opacity-50"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
