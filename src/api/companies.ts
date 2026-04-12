function getBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export type Company = { id: number; name: string };

export async function getCompanies(): Promise<Company[]> {
  const res = await fetch(`${getBaseUrl()}/api/companies`);
  if (!res.ok) throw new Error("Failed to fetch companies");
  return res.json();
}
