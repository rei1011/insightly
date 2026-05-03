"use client";

import { useEffect, useState } from "react";
import { getSalaryDetail, SalaryDetailRecord } from "@/api/ranking";

export type SalaryDetailModalProps = {
  companyId: number;
  companyName: string;
  occupationIds?: string[];
  ageFrom?: number;
  ageTo?: number;
  onClose: () => void;
};

export type SalaryDetailModalViewProps = {
  companyName: string;
  data: SalaryDetailRecord[];
  loading: boolean;
  error: boolean;
  onClose: () => void;
};

function formatCurrency(value: number): string {
  return `${value.toLocaleString("ja-JP")}万円`;
}

export function SalaryDetailModalView({
  companyName,
  data,
  loading,
  error,
  onClose,
}: SalaryDetailModalViewProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-testid="salary-detail-modal"
    >
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        data-testid="salary-detail-modal-overlay"
      />

      {/* モーダル本体 */}
      <div className="relative z-10 w-full max-w-2xl max-h-[80vh] mx-4 flex flex-col rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-[var(--foreground)]/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {companyName} — 個別データ
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-[var(--foreground)]/60 transition-colors hover:bg-[var(--foreground)]/10 hover:text-[var(--foreground)]"
            data-testid="salary-detail-modal-close"
            aria-label="閉じる"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="overflow-y-auto px-6 py-4">
          {loading && (
            <div className="py-12 text-center text-[var(--foreground)]/60 font-sans text-sm">
              読み込み中...
            </div>
          )}
          {error && (
            <div className="py-12 text-center text-red-500 font-sans text-sm">
              データの取得に失敗しました
            </div>
          )}
          {!loading && !error && data.length === 0 && (
            <div className="py-12 text-center text-[var(--foreground)]/60 font-sans text-sm">
              データがありません
            </div>
          )}
          {!loading && !error && data.length > 0 && (
            <table className="w-full border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--foreground)]/20">
                  <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                    年齢
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--foreground)]">
                    職種
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                    年収
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((record, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--foreground)]/10 [&:nth-child(even)]:bg-[var(--foreground)]/[0.02]"
                  >
                    <td className="px-4 py-3 text-right text-[var(--foreground)]">
                      {record.age}歳
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]">
                      {record.occupationName}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--foreground)]">
                      {formatCurrency(record.annualSalary)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* フッター */}
        {!loading && !error && data.length > 0 && (
          <div className="border-t border-[var(--foreground)]/10 px-6 py-3 text-right text-xs text-[var(--foreground)]/50">
            {data.length.toLocaleString("ja-JP")}件
          </div>
        )}
      </div>
    </div>
  );
}

export function SalaryDetailModal({
  companyId,
  companyName,
  occupationIds,
  ageFrom,
  ageTo,
  onClose,
}: SalaryDetailModalProps) {
  const [data, setData] = useState<SalaryDetailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSalaryDetail(companyId, occupationIds, ageFrom, ageTo)
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [companyId, occupationIds, ageFrom, ageTo]);

  return (
    <SalaryDetailModalView
      companyName={companyName}
      data={data}
      loading={loading}
      error={error}
      onClose={onClose}
    />
  );
}
