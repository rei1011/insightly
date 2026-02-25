function getBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export type Occupation = {
  id: string;
  name: string;
};

/**
 * 職種一覧を取得するAPIクライアント。
 * GET /api/occupations を呼び出してデータを取得する。
 */
export async function getOccupations(): Promise<Occupation[]> {
  const res = await fetch(`${getBaseUrl()}/api/occupations`);
  if (!res.ok) throw new Error("Failed to fetch occupations");
  return res.json();
}
