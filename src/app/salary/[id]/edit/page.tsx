import { notFound } from 'next/navigation';
import { SalaryForm } from '@/components/SalaryForm/SalaryForm';
import { getCompanies } from '@/api/companies';
import { getOccupations } from '@/api/occupations';
import { getSalary } from '@/api/salary';

type EditSalaryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSalaryPage({ params }: EditSalaryPageProps) {
  const { id } = await params;

  let salary;
  try {
    salary = await getSalary(id);
  } catch {
    notFound();
  }

  const [companies, occupations] = await Promise.all([
    getCompanies(),
    getOccupations(),
  ]);

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl py-16 px-8 bg-white dark:bg-black sm:px-16">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          給与データ編集
        </h1>
        <SalaryForm
          mode="edit"
          initialData={{
            id: salary.id,
            companyId: salary.companyId,
            companyName: salary.companyName,
            occupationId: salary.occupationId,
            occupationName: salary.occupationName,
            age: salary.age,
            grade: salary.grade,
            overtimeHours: salary.overtimeHours,
            annualSalary: salary.annualSalary,
            baseSalary: salary.baseSalary,
            bonus: salary.bonus,
            stockOptions: salary.stockOptions,
            rsu: salary.rsu,
          }}
          companies={companies}
          occupations={occupations}
        />
      </main>
    </div>
  );
}
