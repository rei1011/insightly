import { prisma } from "@/lib/prisma";

export async function GET() {
  const occupations = await prisma.occupation.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return Response.json(occupations);
}
