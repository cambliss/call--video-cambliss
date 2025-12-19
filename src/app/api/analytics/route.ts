import { prisma } from "~/server/db";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    const analytics = await prisma.call.groupBy({
      by: ["status"],
      where: { userId },
      _count: { id: true },
    });

    const totalDuration = await prisma.participant.aggregate({
      where: { userId },
      _sum: { duration: true },
    });

    return new Response(JSON.stringify({ analytics, totalDuration }));
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch analytics" }), { status: 500 });
  }
}
