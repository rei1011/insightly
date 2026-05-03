import { SalaryForm } from '@/components/SalaryForm/SalaryForm';
import { getCompanies } from '@/api/companies';
import { getOccupations } from '@/api/occupations';

export const dynamic = 'force-dynamic';

export default async function NewSalaryPage() {
  const [companies, occupations] = await Promise.all([
    getCompanies(),
    getOccupations(),
  ]);

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl py-16 px-8 bg-white dark:bg-black sm:px-16">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          給与データ新規作成
        </h1>
        <SalaryForm
          mode="create"
          companies={companies}
          occupations={occupations}
        />
      </main>
    </div>
  );
}
