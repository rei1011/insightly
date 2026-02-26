import type { CompensationRecord } from "@/components/CompensationTable/CompensationTable";

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export type CompensationResponse = {
  data: CompensationRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * 報酬データを取得するAPIクライアント。
 * GET /api/compensation を呼び出してデータを取得する。
 * @param page - ページ番号（1始まり）
 * @param limit - 1ページあたりの件数（デフォルト1000）
 * @param sort - ソート項目（例: annualSalary）
 * @param order - ソート順（asc / desc）
 * @param occupationIds - 絞り込む職種IDの配列（複数指定可）
 * @param ageFrom - 年齢の下限（歳）
 * @param ageTo - 年齢の上限（歳）
 */
export async function getCompensationData(
  page: number = 1,
  limit: number = 1000,
  sort?: string,
  order?: string,
  occupationIds?: string[],
  ageFrom?: number,
  ageTo?: number
): Promise<CompensationResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (sort) params.set("sort", sort);
  if (order) params.set("order", order);
  if (occupationIds?.length) params.set("occupations", occupationIds.join(","));
  if (ageFrom !== undefined) params.set("ageFrom", String(ageFrom));
  if (ageTo !== undefined) params.set("ageTo", String(ageTo));
  const res = await fetch(`${getBaseUrl()}/api/compensation?${params}`);
  if (!res.ok) throw new Error("Failed to fetch compensation data");
  return res.json();
}
