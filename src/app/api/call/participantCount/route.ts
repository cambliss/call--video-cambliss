import { prisma } from "~/server/db";

export async function POST(req: Request) {
  try {
    const { callId } = await req.json();
    if (!callId) return new Response(JSON.stringify({ error: "Missing callId" }), { status: 400 });

    const count = await prisma.participant.count({
      where: { callId },
    });

    return new Response(JSON.stringify({ count }));
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
