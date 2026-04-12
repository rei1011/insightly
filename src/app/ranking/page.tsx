import { AgeFilter } from "@/components/AgeFilter/AgeFilter";
import { JobFilter } from "@/components/JobFilter/JobFilter";
import { RankingTable } from "@/components/RankingTable/RankingTable";
import { getRankingData } from "@/api/ranking";
import { getOccupations } from "@/api/occupations";
import { parseStringArrayParam, parseIntParam } from "@/lib/searchParams";

type RankingPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RankingPage({ searchParams }: RankingPageProps) {
  const params = await searchParams;

  const occupationIds = parseStringArrayParam(params.occupations);
  const ageFrom = parseIntParam(params.ageFrom);
  const ageTo = parseIntParam(params.ageTo);

  const [occupations, { data }] = await Promise.all([
    getOccupations(),
    getRankingData(occupationIds, ageFrom, ageTo),
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col py-16 px-8 bg-white dark:bg-black sm:px-16">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          年収ランキング（上位30社）
        </h1>
        <JobFilter occupations={occupations} selectedIds={occupationIds ?? []} />
        <AgeFilter ageFrom={ageFrom} ageTo={ageTo} />
        <RankingTable data={data} />
      </main>
    </div>
  );
}
