import Link from "next/link";
import { AgeFilter } from "@/components/AgeFilter/AgeFilter";
import { CompanyFilter } from "@/components/CompanyFilter/CompanyFilter";
import { CompensationTable } from "@/components/CompensationTable/CompensationTable";
import { JobFilter } from "@/components/JobFilter/JobFilter";
import { SalaryFilter } from "@/components/SalaryFilter/SalaryFilter";
import { getCompensationData } from "@/api/compensation";
import { getOccupations } from "@/api/occupations";
import { parseStringParam, parseStringArrayParam, parseIntParam } from "@/lib/searchParams";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const page = Math.max(1, parseIntParam(params.page) ?? 1);
  const sort = parseStringParam(params.sort);
  const order = parseStringParam(params.order) as "asc" | "desc" | undefined;
  const occupationIds = parseStringArrayParam(params.occupations);
  const companyName = parseStringParam(params.companyName);
  const ageFrom = parseIntParam(params.ageFrom);
  const ageTo = parseIntParam(params.ageTo);
  const salaryFrom = parseIntParam(params.salaryFrom);
  const salaryTo = parseIntParam(params.salaryTo);
  const baseSalaryFrom = parseIntParam(params.baseSalaryFrom);
  const baseSalaryTo = parseIntParam(params.baseSalaryTo);

  const [occupations, { data, total, page: currentPage, totalPages }] =
    await Promise.all([
      getOccupations(),
      getCompensationData(page, 1000, sort, order, occupationIds, ageFrom, ageTo, salaryFrom, salaryTo, baseSalaryFrom, baseSalaryTo, undefined, companyName),
    ]);

  const baseQuery = new URLSearchParams();
  if (sort) baseQuery.set("sort", sort);
  if (order) baseQuery.set("order", order);
  if (occupationIds?.length) baseQuery.set("occupations", occupationIds.join(","));
  if (companyName) baseQuery.set("companyName", companyName);
  if (ageFrom !== undefined) baseQuery.set("ageFrom", String(ageFrom));
  if (ageTo !== undefined) baseQuery.set("ageTo", String(ageTo));
  if (salaryFrom !== undefined) baseQuery.set("salaryFrom", String(salaryFrom));
  if (salaryTo !== undefined) baseQuery.set("salaryTo", String(salaryTo));
  if (baseSalaryFrom !== undefined) baseQuery.set("baseSalaryFrom", String(baseSalaryFrom));
  if (baseSalaryTo !== undefined) baseQuery.set("baseSalaryTo", String(baseSalaryTo));

  const annualSalarySortOrder =
    sort === "annualSalary" ? order ?? "desc" : null;
  const nextOrder =
    annualSalarySortOrder === "desc" || annualSalarySortOrder === null
      ? "asc"
      : "desc";
  const sortQuery = new URLSearchParams({ sort: "annualSalary", order: nextOrder });
  sortQuery.set("page", "1");
  if (occupationIds?.length) sortQuery.set("occupations", occupationIds.join(","));
  if (companyName) sortQuery.set("companyName", companyName);
  if (ageFrom !== undefined) sortQuery.set("ageFrom", String(ageFrom));
  if (ageTo !== undefined) sortQuery.set("ageTo", String(ageTo));
  if (salaryFrom !== undefined) sortQuery.set("salaryFrom", String(salaryFrom));
  if (salaryTo !== undefined) sortQuery.set("salaryTo", String(salaryTo));
  if (baseSalaryFrom !== undefined) sortQuery.set("baseSalaryFrom", String(baseSalaryFrom));
  if (baseSalaryTo !== undefined) sortQuery.set("baseSalaryTo", String(baseSalaryTo));
  const annualSalarySortHref = `?${sortQuery.toString()}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col py-16 px-8 bg-white dark:bg-black sm:px-16">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          報酬一覧
        </h1>
        <JobFilter
          occupations={occupations}
          selectedIds={occupationIds ?? []}
        />
        <CompanyFilter companyName={companyName} />
        <AgeFilter ageFrom={ageFrom} ageTo={ageTo} />
        <SalaryFilter salaryFrom={salaryFrom} salaryTo={salaryTo} baseSalaryFrom={baseSalaryFrom} baseSalaryTo={baseSalaryTo} />
        <CompensationTable
          data={data}
          annualSalarySortOrder={annualSalarySortOrder}
          annualSalarySortHref={annualSalarySortHref}
        />
        {totalPages > 1 && (
          <nav
            className="mt-8 flex items-center justify-center gap-4"
            aria-label="ページネーション"
          >
            {currentPage > 1 ? (
              <Link
                href={`?${new URLSearchParams({
                  ...Object.fromEntries(baseQuery),
                  page: String(currentPage - 1),
                }).toString()}`}
                className="rounded border border-[var(--foreground)]/20 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/5"
              >
                前へ
              </Link>
            ) : (
              <span className="rounded border border-[var(--foreground)]/10 px-4 py-2 text-sm text-[var(--foreground)]/40">
                前へ
              </span>
            )}
            <span className="text-sm text-[var(--foreground)]/70">
              {currentPage} / {totalPages} ページ（全 {total.toLocaleString()}{" "}
              件）
            </span>
            {currentPage < totalPages ? (
              <Link
                href={`?${new URLSearchParams({
                  ...Object.fromEntries(baseQuery),
                  page: String(currentPage + 1),
                }).toString()}`}
                className="rounded border border-[var(--foreground)]/20 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/5"
              >
                次へ
              </Link>
            ) : (
              <span className="rounded border border-[var(--foreground)]/10 px-4 py-2 text-sm text-[var(--foreground)]/40">
                次へ
              </span>
            )}
          </nav>
        )}
      </main>
    </div>
  );
}
