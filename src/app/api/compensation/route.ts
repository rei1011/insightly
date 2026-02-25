import type { CompensationRecord } from '@/components/CompensationTable/CompensationTable';

const data: CompensationRecord[] = [
  {
    companyName: '株式会社サンプルA',
    jobTitle: 'ソフトウェアエンジニア',
    age: 32,
    grade: 'シニア',
    avgOvertimeHours: 20,
    annualSalary: 800,
    baseSalary: 600,
    bonusIncentive: 150,
    rsu: 50,
    stockOptions: null,
  },
  {
    companyName: '株式会社サンプルB',
    jobTitle: 'プロダクトマネージャー',
    age: 38,
    grade: 'スタッフ',
    avgOvertimeHours: 35,
    annualSalary: 1200,
    baseSalary: 900,
    bonusIncentive: 200,
    rsu: 100,
    stockOptions: 50,
  },
  {
    companyName: '株式会社サンプルC',
    jobTitle: 'データサイエンティスト',
    age: 28,
    grade: 'ミドル',
    avgOvertimeHours: 15,
    annualSalary: 650,
    baseSalary: 500,
    bonusIncentive: null,
    rsu: null,
    stockOptions: null,
  },
];

export async function GET() {
  return Response.json(data);
}
