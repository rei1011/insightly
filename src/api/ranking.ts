function getBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export type RankingRecord = {
  rank: number;
  companyName: string;
  avgSalary: number;
  count: number;
};

export type RankingResponse = {
  data: RankingRecord[];
};

/**
 * 会社別平均年収ランキングを取得するAPIクライアント。
 * GET /api/ranking を呼び出してデータを取得する。
 * @param occupationIds - 絞り込む職種IDの配列（複数指定可）
 * @param ageFrom - 年齢の下限（歳）
 * @param ageTo - 年齢の上限（歳）
 */
export async function getRankingData(
  occupationIds?: string[],
  ageFrom?: number,
  ageTo?: number
): Promise<RankingResponse> {
  const params = new URLSearchParams();
  if (occupationIds?.length) params.set('occupations', occupationIds.join(','));
  if (ageFrom !== undefined) params.set('ageFrom', String(ageFrom));
  if (ageTo !== undefined) params.set('ageTo', String(ageTo));
  const res = await fetch(`${getBaseUrl()}/api/ranking?${params}`);
  if (!res.ok) throw new Error('Failed to fetch ranking data');
  return res.json();
}
