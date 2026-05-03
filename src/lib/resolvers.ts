import { prisma } from '@/lib/prisma';

export async function resolveCompanyId(
  companyId?: number,
  newCompanyName?: string
): Promise<number> {
  if (companyId !== undefined) return companyId;

  const company = await prisma.company.upsert({
    where: { name: newCompanyName! },
    update: {},
    create: { name: newCompanyName! },
  });
  return company.id;
}

export async function resolveOccupationId(
  occupationId?: string,
  newOccupationName?: string
): Promise<string> {
  if (occupationId !== undefined) return occupationId;

  const occupation = await prisma.occupation.upsert({
    where: { name: newOccupationName! },
    update: {},
    create: { name: newOccupationName! },
  });
  return occupation.id;
}
