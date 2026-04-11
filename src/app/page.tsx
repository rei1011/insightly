import Link from "next/link";
import { AgeFilter } from "@/components/AgeFilter/AgeFilter";
import { CompensationTable } from "@/components/CompensationTable/CompensationTable";
import { JobFilter } from "@/components/JobFilter/JobFilter";
import { SalaryFilter } from "@/components/SalaryFilter/SalaryFilter";
import { getCompensationData } from "@/api/compensation";
import { getOccupations } from "@/api/occupations";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const pageParam = params.page;
  const sortParam = params.sort;
  const orderParam = params.order;
  const occupationsParam = params.occupations;
  const ageFromParam = params.ageFrom;
  const ageToParam = params.ageTo;
  const salaryFromParam = params.salaryFrom;
  const salaryToParam = params.salaryTo;
  const baseSalaryFromParam = params.baseSalaryFrom;
  const baseSalaryToParam = params.baseSalaryTo;

  const page = Math.max(
    1,
    parseInt(
      Array.isArray(pageParam) ? pageParam[0] : (pageParam ?? "1"),
      10
    ) || 1
  );

  const sort = Array.isArray(sortParam) ? sortParam[0] : sortParam;
  const order = (Array.isArray(orderParam) ? orderParam[0] : orderParam) as
    | "asc"
    | "desc"
    | undefined;

  const occupationIds = occupationsParam
    ? (Array.isArray(occupationsParam) ? occupationsParam[0] : occupationsParam)
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : undefined;

  const ageFromRaw = Array.isArray(ageFromParam) ? ageFromParam[0] : ageFromParam;
  const ageToRaw = Array.isArray(ageToParam) ? ageToParam[0] : ageToParam;
  const ageFromParsed = ageFromRaw ? parseInt(ageFromRaw, 10) : undefined;
  const ageToParsed = ageToRaw ? parseInt(ageToRaw, 10) : undefined;
  const ageFrom =
    ageFromParsed !== undefined && !Number.isNaN(ageFromParsed)
      ? ageFromParsed
      : undefined;
  const ageTo =
    ageToParsed !== undefined && !Number.isNaN(ageToParsed)
      ? ageToParsed
      : undefined;

  const salaryFromRaw = Array.isArray(salaryFromParam) ? salaryFromParam[0] : salaryFromParam;
  const salaryToRaw = Array.isArray(salaryToParam) ? salaryToParam[0] : salaryToParam;
  const salaryFromParsed = salaryFromRaw ? parseInt(salaryFromRaw, 10) : undefined;
  const salaryToParsed = salaryToRaw ? parseInt(salaryToRaw, 10) : undefined;
  const salaryFrom =
    salaryFromParsed !== undefined && !Number.isNaN(salaryFromParsed)
      ? salaryFromParsed
      : undefined;
  const salaryTo =
    salaryToParsed !== undefined && !Number.isNaN(salaryToParsed)
      ? salaryToParsed
      : undefined;

  const baseSalaryFromRaw = Array.isArray(baseSalaryFromParam) ? baseSalaryFromParam[0] : baseSalaryFromParam;
  const baseSalaryToRaw = Array.isArray(baseSalaryToParam) ? baseSalaryToParam[0] : baseSalaryToParam;
  const baseSalaryFromParsed = baseSalaryFromRaw ? parseInt(baseSalaryFromRaw, 10) : undefined;
  const baseSalaryToParsed = baseSalaryToRaw ? parseInt(baseSalaryToRaw, 10) : undefined;
  const baseSalaryFrom =
    baseSalaryFromParsed !== undefined && !Number.isNaN(baseSalaryFromParsed)
      ? baseSalaryFromParsed
      : undefined;
  const baseSalaryTo =
    baseSalaryToParsed !== undefined && !Number.isNaN(baseSalaryToParsed)
      ? baseSalaryToParsed
      : undefined;

  const [occupations, { data, total, page: currentPage, totalPages }] =
    await Promise.all([
      getOccupations(),
      getCompensationData(page, 1000, sort, order, occupationIds, ageFrom, ageTo, salaryFrom, salaryTo, baseSalaryFrom, baseSalaryTo),
    ]);

  const baseQuery = new URLSearchParams();
  if (sort) baseQuery.set("sort", sort);
  if (order) baseQuery.set("order", order);
  if (occupationIds?.length) baseQuery.set("occupations", occupationIds.join(","));
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
