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
 * @param salaryFrom - 年収の下限（万円）
 * @param salaryTo - 年収の上限（万円）
 * @param baseSalaryFrom - ベース給与の下限（万円）
 * @param baseSalaryTo - ベース給与の上限（万円）
 * @param companyIds - 絞り込む会社IDの配列（複数指定可）
 * @param companyName - 会社名の部分一致フィルター
 */
export async function getCompensationData(
  page: number = 1,
  limit: number = 1000,
  sort?: string,
  order?: string,
  occupationIds?: string[],
  ageFrom?: number,
  ageTo?: number,
  salaryFrom?: number,
  salaryTo?: number,
  baseSalaryFrom?: number,
  baseSalaryTo?: number,
  companyIds?: number[],
  companyName?: string
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
  if (salaryFrom !== undefined) params.set("salaryFrom", String(salaryFrom));
  if (salaryTo !== undefined) params.set("salaryTo", String(salaryTo));
  if (baseSalaryFrom !== undefined) params.set("baseSalaryFrom", String(baseSalaryFrom));
  if (baseSalaryTo !== undefined) params.set("baseSalaryTo", String(baseSalaryTo));
  if (companyIds?.length) params.set("companies", companyIds.join(","));
  if (companyName) params.set("companyName", companyName);
  const res = await fetch(`${getBaseUrl()}/api/compensation?${params}`);
  if (!res.ok) throw new Error("Failed to fetch compensation data");
  return res.json();
}
