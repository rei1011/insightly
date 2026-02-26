import { prisma } from '@/lib/prisma';

const DEFAULT_LIMIT = 1000;
const DEFAULT_PAGE = 1;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  const sortParam = searchParams.get('sort');
  const orderParam = searchParams.get('order');
  const occupationsParam = searchParams.get('occupations');
  const ageFromParam = searchParams.get('ageFrom');
  const ageToParam = searchParams.get('ageTo');

  const page = Math.max(1, parseInt(pageParam ?? String(DEFAULT_PAGE), 10) || DEFAULT_PAGE);
  const limit = Math.max(1, Math.min(10000, parseInt(limitParam ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;

  const occupationIds = occupationsParam
    ? occupationsParam.split(',').map((id) => id.trim()).filter(Boolean)
    : undefined;

  const ageFrom = ageFromParam ? parseInt(ageFromParam, 10) : undefined;
  const ageTo = ageToParam ? parseInt(ageToParam, 10) : undefined;

  const ageCondition =
    ageFrom !== undefined && !Number.isNaN(ageFrom) && ageTo !== undefined && !Number.isNaN(ageTo)
      ? { age: { gte: ageFrom, lte: ageTo } }
      : ageFrom !== undefined && !Number.isNaN(ageFrom)
        ? { age: { gte: ageFrom } }
        : ageTo !== undefined && !Number.isNaN(ageTo)
          ? { age: { lte: ageTo } }
          : undefined;

  const where =
    occupationIds?.length || ageCondition
      ? {
          ...(occupationIds?.length && { occupationId: { in: occupationIds } }),
          ...ageCondition,
        }
      : undefined;

  const order: 'asc' | 'desc' = orderParam === 'asc' ? 'asc' : 'desc';
  const orderBy =
    sortParam === 'annualSalary'
      ? { annualSalary: order }
      : { annualSalary: 'desc' as const };

  const [salaries, total] = await Promise.all([
    prisma.salary.findMany({
      where,
      include: { company: true, occupation: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.salary.count({ where }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return Response.json({
    data: salaries.map((s) => ({
      id: s.id,
      companyName: s.company.name,
      jobTitle: s.occupation.name,
      age: s.age,
      grade: s.grade,
      avgOvertimeHours: s.overtimeHours ? Number(s.overtimeHours) : null,
      annualSalary: Number(s.annualSalary),
      baseSalary: Number(s.baseSalary),
      bonusIncentive: s.bonus ? Number(s.bonus) : null,
      rsu: s.rsu ? Number(s.rsu) : null,
      stockOptions: s.stockOptions ? Number(s.stockOptions) : null,
    })),
    total,
    page,
    limit,
    totalPages,
  });
}
