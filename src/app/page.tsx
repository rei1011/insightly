import Link from "next/link";
import { CompensationTable } from "@/components/CompensationTable/CompensationTable";
import { getCompensationData } from "@/api/compensation";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const pageParam = params.page;
  const page = Math.max(
    1,
    parseInt(
      Array.isArray(pageParam) ? pageParam[0] : (pageParam ?? "1"),
      10
    ) || 1
  );

  const {
    data,
    total,
    page: currentPage,
    totalPages,
  } = await getCompensationData(page, 1000);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col py-16 px-8 bg-white dark:bg-black sm:px-16">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          報酬一覧
        </h1>
        <CompensationTable data={data} />
        {totalPages > 1 && (
          <nav
            className="mt-8 flex items-center justify-center gap-4"
            aria-label="ページネーション"
          >
            {currentPage > 1 ? (
              <Link
                href={`?page=${currentPage - 1}`}
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
                href={`?page=${currentPage + 1}`}
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
