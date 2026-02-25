import type { CompensationRecord } from '@/components/CompensationTable/CompensationTable';

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * 報酬データを取得するAPIクライアント。
 * GET /api/compensation を呼び出してデータを取得する。
 */
export async function getCompensationData(): Promise<CompensationRecord[]> {
  const res = await fetch(`${getBaseUrl()}/api/compensation`);
  if (!res.ok) throw new Error('Failed to fetch compensation data');
  return res.json();
}
