import { prisma } from "~/server/db";

export async function POST(req: Request) {
  try {
    const { callId, roomId } = await req.json();
    const id = callId || roomId;
    if (!id) return new Response(JSON.stringify({ error: "Missing callId" }), { status: 400 });

    const call = await prisma.call.findUnique({ where: { id } });
    if (!call) return new Response(JSON.stringify({ error: "Call not found" }), { status: 404 });

    // Subscription logic (requires Subscription table to exist in DB)
    const subscription = await prisma.subscription.findFirst({
      where: { userId: call.userId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify({ planId: subscription?.planId ?? "free" }));
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
