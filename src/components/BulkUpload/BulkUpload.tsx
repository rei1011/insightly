'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { BulkPreview } from './BulkPreview';
import { BulkProgress } from './BulkProgress';
import { BulkResult } from './BulkResult';
import type { ParsedRow } from '@/lib/csv';

type Tab = 'import' | 'update' | 'export';

type Step = 'upload' | 'preview' | 'processing' | 'result';

type JobStatus = {
  id: string;
  status: string;
  totalRows: number;
  processedRows: number;
  successRows: number;
  failedRows: number;
  hasErrors: boolean;
};

const TAB_CONFIG: { key: Tab; label: string; templateUrl: string | null; description: string }[] = [
  { key: 'import', label: '一括取り込み', templateUrl: '/templates/salary-import.csv', description: 'CSVファイルで報酬データを一括取り込みします。' },
  { key: 'update', label: '一括編集', templateUrl: '/templates/salary-update.csv', description: 'CSVファイルで既存の報酬データを一括編集します。id列で対象を特定します。' },
  { key: 'export', label: 'エクスポート', templateUrl: null, description: '全件の報酬データをCSVファイルとしてダウンロードします。' },
];

const inputClass =
  'w-full rounded border border-[var(--foreground)]/20 px-3 py-2 text-sm text-[var(--foreground)] file:mr-4 file:rounded file:border-0 file:bg-[var(--foreground)]/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--foreground)]';

export function BulkUpload() {
  const [activeTab, setActiveTab] = useState<Tab>('import');
  const [step, setStep] = useState<Step>('upload');
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [validRows, setValidRows] = useState<ParsedRow[]>([]);
  const [errorRows, setErrorRows] = useState<ParsedRow[]>([]);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetState = useCallback(() => {
    setStep('upload');
    setError(null);
    setUploading(false);
    setExecuting(false);
    setValidRows([]);
    setErrorRows([]);
    setJobStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const handleTabChange = (tab: Tab) => {
    resetState();
    setActiveTab(tab);
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', activeTab);

    try {
      const res = await fetch('/api/salary/bulk/preview', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'プレビューに失敗しました');
        setUploading(false);
        return;
      }

      setValidRows(data.validRows);
      setErrorRows(data.errorRows);
      setStep('preview');
    } catch {
      setError('ファイルの読み込みに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleExecute = async () => {
    setExecuting(true);
    setError(null);

    try {
      const res = await fetch('/api/salary/bulk/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, validRows }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '実行に失敗しました');
        setExecuting(false);
        return;
      }

      setStep('processing');
      startPolling(data.jobId);
    } catch {
      setError('実行に失敗しました');
      setExecuting(false);
    }
  };

  const startPolling = (jobId: string) => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/salary/bulk/jobs/${jobId}`);
        if (!res.ok) return;
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
        // ポーリングエラーはリトライ
      }
    };

    poll();
    pollingRef.current = setInterval(poll, 2000);
  };

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

  const currentTabConfig = TAB_CONFIG.find((t) => t.key === activeTab)!;

  return (
    <div className="space-y-6">
      {/* タブ */}
      <div className="flex border-b border-[var(--foreground)]/10">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'border-[var(--foreground)] text-[var(--foreground)]'
                : 'border-transparent text-[var(--foreground)]/50 hover:text-[var(--foreground)]/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* エクスポートタブ */}
      {activeTab === 'export' ? (
        <div className="space-y-4">
          <p className="text-sm text-[var(--foreground)]/70">{currentTabConfig.description}</p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="rounded bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {exporting ? 'ダウンロード中...' : 'CSVをダウンロード'}
          </button>
        </div>
      ) : (
        <>
          {/* アップロードステップ */}
          {step === 'upload' && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--foreground)]/70">{currentTabConfig.description}</p>

              {currentTabConfig.templateUrl && (
                <div>
                  <a
                    href={currentTabConfig.templateUrl}
                    download
                    className="text-sm font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    テンプレートCSVをダウンロード
                  </a>
                </div>
              )}

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className={inputClass}
                />
              </div>

              {uploading && (
                <p className="text-sm text-[var(--foreground)]/60">
                  ファイルを読み込み中...
                </p>
              )}
            </div>
          )}

          {/* プレビューステップ */}
          {step === 'preview' && (
            <BulkPreview
              type={activeTab as 'import' | 'update'}
              validRows={validRows}
              errorRows={errorRows}
              onExecute={handleExecute}
              onCancel={resetState}
              executing={executing}
            />
          )}

          {/* 処理中ステップ */}
          {step === 'processing' && jobStatus && (
            <BulkProgress
              totalRows={jobStatus.totalRows}
              processedRows={jobStatus.processedRows}
              successRows={jobStatus.successRows}
              failedRows={jobStatus.failedRows}
              status={jobStatus.status}
            />
          )}

          {/* 結果ステップ */}
          {step === 'result' && jobStatus && (
            <BulkResult
              jobId={jobStatus.id}
              successRows={jobStatus.successRows}
              failedRows={jobStatus.failedRows}
              hasErrors={jobStatus.hasErrors}
              onReset={resetState}
            />
          )}
        </>
      )}
    </div>
  );
}
