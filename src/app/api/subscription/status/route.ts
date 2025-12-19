import { prisma } from "~/server/db";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });

    const subscription = await prisma.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    // Check if subscription has expired
    if (subscription && subscription.currentPeriodEnd && new Date() > subscription.currentPeriodEnd) {
      // Automatically terminate expired subscription
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" },
      });
      return new Response(JSON.stringify({ subscription: null }));
    }

    return new Response(JSON.stringify({ subscription }));
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
