'use client';

import Link from 'next/link';

const OPENMONEY_SALARY_BASE = 'https://openmoney.jp/salaries';

export type CompensationRecord = {
  id: string;
  companyName: string;
  jobTitle: string;
  age: number;
  grade: string | null;
  avgOvertimeHours: number | null;
  annualSalary: number;
  baseSalary: number;
  bonusIncentive: number | null;
  rsu: number | null;
  stockOptions: number | null;
};

export type SortOrder = 'asc' | 'desc';

export type CompensationTableProps = {
  data: CompensationRecord[];
  /** 空データ時の表示メッセージ */
  emptyMessage?: string;
  /** 年収ソートの現在の並び順（指定時はヘッダーをクリック可能に） */
  annualSalarySortOrder?: SortOrder | null;
  /** 年収ソート切り替え時のリンク先（例: ?sort=annualSalary&order=asc） */
  annualSalarySortHref?: string;
};

function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return '-';
  return `${value.toLocaleString('ja-JP')}万円`;
}

function formatHours(value: number | null): string {
  if (value === null || value === undefined) return '-';
  return `${value}時間`;
}

function formatAge(value: number): string {
  return `${value}歳`;
}

export const CompensationTable = ({
  data,
  emptyMessage = 'データがありません',
  annualSalarySortOrder = null,
  annualSalarySortHref,
}: CompensationTableProps) => {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--foreground)]/70 font-sans">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse font-sans text-sm">
        <thead>
          <tr className="border-b-2 border-[var(--foreground)]/20">
            <th className="px-4 py-3 text-left font-semibold text-[var(--foreground)]">
              会社名
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--foreground)]">
              職種
            </th>
            <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
              年齢
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--foreground)]">
              グレード
            </th>
            <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
              平均残業時間（月間）
            </th>
            <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
              {annualSalarySortHref ? (
                <Link
                  href={annualSalarySortHref}
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  年収
                  {annualSalarySortOrder === 'asc' ? ' ↑' : ' ↓'}
                </Link>
              ) : (
                '年収'
              )}
            </th>
            <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
              ベースの給与
            </th>
            <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
              賞与・インセンティブ
            </th>
            <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
              RSU
            </th>
            <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
              ストックオプション
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => {
            const detailUrl = `${OPENMONEY_SALARY_BASE}/${record.id}`;
            const handleRowClick = () => {
              window.open(detailUrl, '_blank', 'noopener,noreferrer');
            };
            const handleKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRowClick();
              }
            };
            return (
              <tr
                key={record.id}
                role="link"
                tabIndex={0}
                onClick={handleRowClick}
                onKeyDown={handleKeyDown}
                className="cursor-pointer border-b border-[var(--foreground)]/10 transition-colors hover:bg-[var(--foreground)]/5 [&:nth-child(even)]:bg-[var(--foreground)]/[0.02]"
              >
                <td className="px-4 py-3 text-[var(--foreground)]">
                  {record.companyName}
                </td>
                <td className="px-4 py-3 text-[var(--foreground)]">
                  {record.jobTitle}
                </td>
                <td className="px-4 py-3 text-right text-[var(--foreground)]">
                  {formatAge(record.age)}
                </td>
                <td className="px-4 py-3 text-[var(--foreground)]">
                  {record.grade ?? '-'}
                </td>
                <td className="px-4 py-3 text-right text-[var(--foreground)]">
                  {formatHours(record.avgOvertimeHours)}
                </td>
                <td className="px-4 py-3 text-right text-[var(--foreground)]">
                  {formatCurrency(record.annualSalary)}
                </td>
                <td className="px-4 py-3 text-right text-[var(--foreground)]">
                  {formatCurrency(record.baseSalary)}
                </td>
                <td className="px-4 py-3 text-right text-[var(--foreground)]">
                  {formatCurrency(record.bonusIncentive)}
                </td>
                <td className="px-4 py-3 text-right text-[var(--foreground)]">
                  {formatCurrency(record.rsu)}
                </td>
                <td className="px-4 py-3 text-right text-[var(--foreground)]">
                  {formatCurrency(record.stockOptions)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
