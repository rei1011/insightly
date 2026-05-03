import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { resolveCompanyId, resolveOccupationId } from '@/lib/resolvers';
import { validateSalaryInput } from '@/lib/validation';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const salary = await prisma.salary.findUnique({
    where: { id },
    include: { company: true, occupation: true },
  });

  if (!salary) {
    return Response.json({ error: 'データが見つかりません' }, { status: 404 });
  }

  return Response.json({
    id: salary.id,
    companyId: salary.companyId,
    companyName: salary.company.name,
    occupationId: salary.occupationId,
    occupationName: salary.occupation.name,
    age: salary.age,
    grade: salary.grade,
    overtimeHours: salary.overtimeHours ? Number(salary.overtimeHours) : null,
    annualSalary: Number(salary.annualSalary),
    baseSalary: Number(salary.baseSalary),
    bonus: salary.bonus ? Number(salary.bonus) : null,
    stockOptions: salary.stockOptions ? Number(salary.stockOptions) : null,
    rsu: salary.rsu ? Number(salary.rsu) : null,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const errors = validateSalaryInput(body);
  if (errors.length > 0) {
    return Response.json({ error: 'バリデーションエラー', details: errors }, { status: 400 });
  }

  try {
    const companyId = await resolveCompanyId(body.companyId, body.newCompanyName);
    const occupationId = await resolveOccupationId(body.occupationId, body.newOccupationName);

    await prisma.salary.update({
      where: { id },
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

    return Response.json({ message: '給与データを更新しました' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return Response.json({ error: 'データが見つかりません' }, { status: 404 });
      }
      if (error.code === 'P2003') {
        return Response.json({ error: '指定された会社または職種が存在しません' }, { status: 400 });
      }
    }
    throw error;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.salary.delete({ where: { id } });
    return Response.json({ message: '給与データを削除しました' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ error: 'データが見つかりません' }, { status: 404 });
    }
    throw error;
  }
}
