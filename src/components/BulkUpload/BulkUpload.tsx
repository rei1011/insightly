'use client';

import { useState, useRef, useEffect } from 'react';

type BulkOperationType = 'import' | 'export';

type PreviewError = {
  row: number;
  field: string;
  message: string;
};

type PreviewRow = {
  rowNumber: number;
  data: Record<string, string>;
  errors?: PreviewError[];
};

type PreviewResult = {
  totalRows: number;
  validCount: number;
  errorCount: number;
  validRows: PreviewRow[];
  errorRows: PreviewRow[];
};

type JobStatus = {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRows: number;
  processedRows: number;
  successRows: number;
  failedRows: number;
};

type Step = 'upload' | 'preview' | 'progress' | 'result';

const TAB_LABELS: { type: BulkOperationType; label: string }[] = [
  { type: 'import', label: '一括取り込み' },
  { type: 'export', label: 'エクスポート' },
];

const TEMPLATE_FILES: Record<string, string> = {
  import: '/templates/salary-import.csv',
};

const inputClass =
  'w-full rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--foreground)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]/20';

export function BulkUpload() {
  const [activeTab, setActiveTab] = useState<BulkOperationType>('import');
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  const resetState = () => {
    setStep('upload');
    setFile(null);
    setPreview(null);
    setJobStatus(null);
    setError(null);
    setLoading(false);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTabChange = (type: BulkOperationType) => {
    resetState();
    setActiveTab(type);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
  };

  const handlePreview = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', activeTab);

      const res = await fetch('/api/salary/bulk/preview', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setPreview(data);
      setStep('preview');
    } catch {
      setError('プレビューの取得に失敗しました');
    }
    setLoading(false);
  };

  const handleExecute = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', activeTab);

      const res = await fetch('/api/salary/bulk/execute', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setStep('progress');
      startPolling(data.jobId);
    } catch {
      setError('実行に失敗しました');
    }
    setLoading(false);
  };

  const startPolling = (jobId: string) => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/salary/bulk/jobs/${jobId}`);
        const data: JobStatus = await res.json();
        setJobStatus(data);

        if (data.status === 'completed' || data.status === 'failed') {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          setStep('result');
        }
      } catch {
        // ignore
      }
    };

    poll();
    pollingRef.current = setInterval(poll, 2000);
  };

  const handleDownloadErrors = async () => {
    if (!jobStatus) return;
    const res = await fetch(`/api/salary/bulk/jobs/${jobStatus.id}/errors`);
    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `errors-${jobStatus.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/salary/export');
      if (!res.ok) {
        setError('エクスポートに失敗しました');
        setExporting(false);
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
    }
    setExporting(false);
  };

  const operationLabel = '取り込み';

  return (
    <div>
      {/* タブ */}
      <div className="mb-6 flex border-b border-[var(--foreground)]/10">
        {TAB_LABELS.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => handleTabChange(type)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === type
                ? 'border-[var(--foreground)] text-[var(--foreground)]'
                : 'border-transparent text-[var(--foreground)]/50 hover:text-[var(--foreground)]/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* エクスポートタブ */}
      {activeTab === 'export' && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--foreground)]/70">
            全件の報酬データをCSVファイルとしてダウンロードします。ダウンロードしたCSVは一括編集・一括削除の入力ファイルとしてそのまま利用できます。
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="rounded bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {exporting ? 'ダウンロード中...' : 'CSVをダウンロード'}
          </button>
        </div>
      )}

      {/* ステップ: アップロード */}
      {step === 'upload' && activeTab !== 'export' && (
        <div className="space-y-4">
          <div>
            <a
              href={TEMPLATE_FILES[activeTab]}
              download
              className="text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              テンプレートCSVをダウンロード
            </a>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              CSVファイルを選択
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePreview}
              disabled={!file || loading}
              className="rounded bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {loading ? 'プレビュー中...' : 'プレビュー'}
            </button>
          </div>
        </div>
      )}

      {/* ステップ: プレビュー */}
      {step === 'preview' && preview && activeTab !== 'export' && (
        <div className="space-y-4">
          <div className="rounded border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02] p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-[var(--foreground)]/60">全行数:</span>{' '}
                <span className="font-medium text-[var(--foreground)]">
                  {preview.totalRows.toLocaleString()}件
                </span>
              </div>
              <div>
                <span className="text-green-600 dark:text-green-400">正常:</span>{' '}
                <span className="font-medium text-[var(--foreground)]">
                  {preview.validCount.toLocaleString()}件
                </span>
              </div>
              <div>
                <span className="text-red-600 dark:text-red-400">エラー:</span>{' '}
                <span className="font-medium text-[var(--foreground)]">
                  {preview.errorCount.toLocaleString()}件
                </span>
              </div>
            </div>
          </div>

          {/* エラー行の詳細 */}
          {preview.errorRows.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-red-600 dark:text-red-400">
                エラー行（{preview.errorCount}件）
              </h3>
              <div className="overflow-x-auto rounded border border-red-200 dark:border-red-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                      <th className="px-3 py-2 text-left font-medium text-red-700 dark:text-red-400">
                        行番号
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-red-700 dark:text-red-400">
                        エラー内容
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.errorRows.map((row) => (
                      <tr
                        key={row.rowNumber}
                        className="border-b border-red-100 dark:border-red-900"
                      >
                        <td className="px-3 py-2 text-[var(--foreground)]">
                          {row.rowNumber}
                        </td>
                        <td className="px-3 py-2 text-red-600 dark:text-red-400">
                          {row.errors?.map((e) => e.message).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 正常行のプレビュー */}
          {preview.validRows.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-green-600 dark:text-green-400">
                正常行プレビュー（先頭{Math.min(preview.validRows.length, 100)}件）
              </h3>
              <div className="overflow-x-auto rounded border border-[var(--foreground)]/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02]">
                      <th className="px-3 py-2 text-left font-medium text-[var(--foreground)]">
                        行番号
                      </th>
                      {Object.keys(preview.validRows[0].data).map((key) => (
                        <th
                          key={key}
                          className="px-3 py-2 text-left font-medium text-[var(--foreground)]"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.validRows.map((row) => (
                      <tr
                        key={row.rowNumber}
                        className="border-b border-[var(--foreground)]/5 [&:nth-child(even)]:bg-[var(--foreground)]/[0.02]"
                      >
                        <td className="px-3 py-2 text-[var(--foreground)]">
                          {row.rowNumber}
                        </td>
                        {Object.values(row.data).map((val, i) => (
                          <td
                            key={i}
                            className="px-3 py-2 text-[var(--foreground)]"
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleExecute}
              disabled={preview.validCount === 0 || loading}
              className="rounded bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {loading
                ? '実行中...'
                : `${preview.validCount.toLocaleString()}件を${operationLabel}`}
            </button>
            <button
              onClick={resetState}
              className="rounded border border-[var(--foreground)]/20 px-6 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/5"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* ステップ: 進捗 */}
      {step === 'progress' && activeTab !== 'export' && (
        <div className="space-y-4">
          <div className="rounded border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02] p-6">
            <h3 className="mb-4 text-sm font-medium text-[var(--foreground)]">
              一括{operationLabel}を実行中...
            </h3>
            {jobStatus && (
              <div>
                <div className="mb-2 flex justify-between text-sm text-[var(--foreground)]/60">
                  <span>処理中</span>
                  <span>
                    {jobStatus.processedRows.toLocaleString()} /{' '}
                    {jobStatus.totalRows.toLocaleString()} 件
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--foreground)]/10">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-300"
                    style={{
                      width: `${jobStatus.totalRows > 0 ? (jobStatus.processedRows / jobStatus.totalRows) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ステップ: 結果 */}
      {step === 'result' && jobStatus && activeTab !== 'export' && (
        <div className="space-y-4">
          <div
            className={`rounded border p-6 ${
              jobStatus.status === 'failed'
                ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                : jobStatus.failedRows > 0
                  ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20'
                  : 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
            }`}
          >
            <h3
              className={`mb-4 text-lg font-medium ${
                jobStatus.status === 'failed'
                  ? 'text-red-700 dark:text-red-400'
                  : jobStatus.failedRows > 0
                    ? 'text-yellow-700 dark:text-yellow-400'
                    : 'text-green-700 dark:text-green-400'
              }`}
            >
              {jobStatus.status === 'failed'
                ? `一括${operationLabel}に失敗しました`
                : `一括${operationLabel}が完了しました`}
            </h3>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-[var(--foreground)]/60">全行数:</span>{' '}
                <span className="font-medium text-[var(--foreground)]">
                  {jobStatus.totalRows.toLocaleString()}件
                </span>
              </div>
              <div>
                <span className="text-green-600 dark:text-green-400">成功:</span>{' '}
                <span className="font-medium text-[var(--foreground)]">
                  {jobStatus.successRows.toLocaleString()}件
                </span>
              </div>
              <div>
                <span className="text-red-600 dark:text-red-400">失敗:</span>{' '}
                <span className="font-medium text-[var(--foreground)]">
                  {jobStatus.failedRows.toLocaleString()}件
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {jobStatus.failedRows > 0 && (
              <button
                onClick={handleDownloadErrors}
                className="rounded border border-red-300 px-6 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                エラーCSVをダウンロード
              </button>
            )}
            <button
              onClick={resetState}
              className="rounded bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-80"
            >
              新しいファイルをアップロード
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
