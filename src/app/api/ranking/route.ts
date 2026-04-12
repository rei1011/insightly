import { prisma } from '@/lib/prisma';

const RANKING_LIMIT = 30;

type RankingRow = {
  company_id: number;
  company_name: string;
  avg_salary: string;
  count: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const occupationsParam = searchParams.get('occupations');
  const ageFromParam = searchParams.get('ageFrom');
  const ageToParam = searchParams.get('ageTo');

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const occupationIds = occupationsParam
    ? occupationsParam.split(',').map((id) => id.trim()).filter((id) => UUID_REGEX.test(id))
    : undefined;

  const ageFrom = ageFromParam ? parseInt(ageFromParam, 10) : undefined;
  const ageTo = ageToParam ? parseInt(ageToParam, 10) : undefined;

  const conditions: string[] = [];
  const values: (string | number | string[])[] = [];
  let idx = 1;

  if (occupationIds?.length) {
    conditions.push(`s.occupation_id = ANY($${idx}::uuid[])`);
    values.push(occupationIds);
    idx++;
  }

  if (ageFrom !== undefined && !Number.isNaN(ageFrom)) {
    conditions.push(`s.age >= $${idx}`);
    values.push(ageFrom);
    idx++;
  }

  if (ageTo !== undefined && !Number.isNaN(ageTo)) {
    conditions.push(`s.age <= $${idx}`);
    values.push(ageTo);
    idx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const rows = await prisma.$queryRawUnsafe<RankingRow[]>(
    `
    SELECT
      c.id AS company_id,
      c.name AS company_name,
      AVG(s.annual_salary)::text AS avg_salary,
      COUNT(*)::text AS count
    FROM salary s
    JOIN company c ON s.company_id = c.id
    ${whereClause}
    GROUP BY c.id, c.name
    ORDER BY AVG(s.annual_salary) DESC
    LIMIT ${RANKING_LIMIT}
    `,
    ...values
  );

  const data = rows.map((row, index) => ({
    rank: index + 1,
    companyName: row.company_name,
    avgSalary: Math.round(Number(row.avg_salary)),
    count: Number(row.count),
  }));

  return Response.json({ data });
}
