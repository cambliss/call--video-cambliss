import { prisma } from "~/server/db";

export async function POST(req: Request) {
  try {
    const { callId } = await req.json();
    if (!callId) {
      return new Response(JSON.stringify({ error: "Missing callId" }), { status: 400 });
    }

    const call = await prisma.call.findUnique({
      where: { id: callId },
    });

    if (!call) {
      return new Response(JSON.stringify({ error: "Call not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(call));
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
