import { prisma } from "~/server/db";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    const analytics = await prisma.call.groupBy({
      by: ["status"],
      where: { userId },
      _count: { id: true },
    });

    const participantCount = await prisma.participant.count({
      where: { userId },
    });

    return new Response(JSON.stringify({ analytics, participantCount }));
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch analytics" }), { status: 500 });
  }
}
