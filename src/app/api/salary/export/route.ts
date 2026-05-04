import Papa from 'papaparse';
import { prisma } from '@/lib/prisma';

const EXPORT_HEADERS = [
  'id', '会社名', '職種名', '年齢', 'グレード', '残業時間',
  '年収', 'ベース給与', '賞与', 'RSU', 'ストックオプション',
] as const;

export async function GET() {
  const salaries = await prisma.salary.findMany({
    include: { company: true, occupation: true },
    orderBy: { annualSalary: 'desc' },
  });

  const rows = salaries.map((s) => ({
    id: s.id,
    '会社名': s.company.name,
    '職種名': s.occupation.name,
    '年齢': s.age,
    'グレード': s.grade ?? '',
    '残業時間': s.overtimeHours ? Number(s.overtimeHours) : '',
    '年収': Number(s.annualSalary),
    'ベース給与': Number(s.baseSalary),
    '賞与': s.bonus ? Number(s.bonus) : '',
    'RSU': s.rsu ? Number(s.rsu) : '',
    'ストックオプション': s.stockOptions ? Number(s.stockOptions) : '',
  }));

  const csv = Papa.unparse(rows, { columns: [...EXPORT_HEADERS] });

  const bom = '﻿';
  return new Response(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="salary-export.csv"`,
    },
  });
}
