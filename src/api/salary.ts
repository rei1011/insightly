import type { SalaryInput } from '@/lib/validation';

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export type SalaryDetail = {
  id: string;
  companyId: number;
  companyName: string;
  occupationId: string;
  occupationName: string;
  age: number;
  grade: string | null;
  overtimeHours: number | null;
  annualSalary: number;
  baseSalary: number;
  bonus: number | null;
  stockOptions: number | null;
  rsu: number | null;
};

export async function getSalary(id: string): Promise<SalaryDetail> {
  const res = await fetch(`${getBaseUrl()}/api/salary/${id}`);
  if (!res.ok) throw new Error('Failed to fetch salary');
  return res.json();
}

export async function createSalary(
  data: SalaryInput
): Promise<{ id: string }> {
  const res = await fetch(`${getBaseUrl()}/api/salary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.details?.[0]?.message ?? 'Failed to create salary');
  }
  return res.json();
}

export async function updateSalary(
  id: string,
  data: SalaryInput
): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/salary/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.details?.[0]?.message ?? 'Failed to update salary');
  }
}

export async function deleteSalary(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/salary/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete salary');
}
