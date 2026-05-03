import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { resolveCompanyId, resolveOccupationId } from '@/lib/resolvers';
import { validateSalaryInput } from '@/lib/validation';

export async function POST(request: Request) {
  const body = await request.json();
  const errors = validateSalaryInput(body);
  if (errors.length > 0) {
    return Response.json({ error: 'バリデーションエラー', details: errors }, { status: 400 });
  }

  try {
    const companyId = await resolveCompanyId(body.companyId, body.newCompanyName);
    const occupationId = await resolveOccupationId(body.occupationId, body.newOccupationName);

    const salary = await prisma.salary.create({
      data: {
        companyId,
        occupationId,
        age: body.age,
        grade: body.grade ?? null,
        overtimeHours: body.overtimeHours ?? null,
        annualSalary: body.annualSalary,
        baseSalary: body.baseSalary,
        bonus: body.bonus ?? null,
        stockOptions: body.stockOptions ?? null,
        rsu: body.rsu ?? null,
      },
    });

    return Response.json({ id: salary.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return Response.json({ error: '指定された会社または職種が存在しません' }, { status: 400 });
    }
    throw error;
  }
}
