export type RankingTableProps = {
  data: {
    rank: number;
    companyName: string;
    avgSalary: number;
    count: number;
  }[];
  emptyMessage?: string;
};

function formatCurrency(value: number): string {
  return `${value.toLocaleString('ja-JP')}万円`;
}

export function RankingTable({
  data,
  emptyMessage = 'データがありません',
}: RankingTableProps) {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--foreground)]/70 font-sans">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse font-sans text-sm">
        <thead>
          <tr className="border-b-2 border-[var(--foreground)]/20">
            <th className="w-16 px-4 py-3 text-right font-semibold text-[var(--foreground)]">
              順位
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--foreground)]">
              会社名
            </th>
            <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
              平均年収
            </th>
            <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
              データ件数
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr
              key={record.rank}
              className="border-b border-[var(--foreground)]/10 [&:nth-child(even)]:bg-[var(--foreground)]/[0.02]"
            >
              <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                {record.rank}
              </td>
              <td className="px-4 py-3 text-[var(--foreground)]">
                {record.companyName}
              </td>
              <td className="px-4 py-3 text-right text-[var(--foreground)]">
                {formatCurrency(record.avgSalary)}
              </td>
              <td className="px-4 py-3 text-right text-[var(--foreground)]/70">
                {record.count.toLocaleString('ja-JP')}件
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
