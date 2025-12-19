import { prisma } from "~/server/db";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    const history = await prisma.call.findMany({
      where: { userId },
      include: { participants: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return new Response(JSON.stringify({ history }));
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch history" }), { status: 500 });
  }
}
