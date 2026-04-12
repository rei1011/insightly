import { prisma } from '@/lib/prisma';

type SalaryDetailRow = {
  age: number;
  occupation_name: string;
  annual_salary: string;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const { companyId: companyIdParam } = await params;
  const companyId = parseInt(companyIdParam, 10);
  if (Number.isNaN(companyId)) {
    return Response.json({ error: 'Invalid companyId' }, { status: 400 });
  }

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

  const conditions: string[] = ['s.company_id = $1'];
  const values: (number | string | string[])[] = [companyId];
  let idx = 2;

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

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const rows = await prisma.$queryRawUnsafe<SalaryDetailRow[]>(
    `
    SELECT
      s.age,
      o.name AS occupation_name,
      s.annual_salary::text AS annual_salary
    FROM salary s
    JOIN occupation o ON s.occupation_id = o.id
    ${whereClause}
    ORDER BY s.annual_salary DESC
    `,
    ...values
  );

  const data = rows.map((row) => ({
    age: row.age,
    occupationName: row.occupation_name,
    annualSalary: Math.round(Number(row.annual_salary)),
  }));

  return Response.json({ data });
}
