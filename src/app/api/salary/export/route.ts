import { prisma } from '@/lib/prisma';
import { generateExportCsv, createCsvResponse } from '@/lib/csv';

export async function GET() {
  const salaries = await prisma.salary.findMany({
    include: { company: true, occupation: true },
    orderBy: { annualSalary: 'desc' },
  });

  const data = salaries.map((s) => ({
    id: s.id,
    companyName: s.company.name,
    occupationName: s.occupation.name,
    age: s.age,
    grade: s.grade,
    overtimeHours: s.overtimeHours ? Number(s.overtimeHours) : null,
    annualSalary: Number(s.annualSalary),
    baseSalary: Number(s.baseSalary),
    bonus: s.bonus ? Number(s.bonus) : null,
    rsu: s.rsu ? Number(s.rsu) : null,
    stockOptions: s.stockOptions ? Number(s.stockOptions) : null,
  }));

  const csv = generateExportCsv(data);
  return createCsvResponse(csv, 'salary-export.csv');
}
