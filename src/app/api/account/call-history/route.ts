import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response("Unauthorized", { status: 403 });
    }

    // Get all calls created by the user
    const callsCreated = await prisma.call.findMany({
      where: { userId: session.user.id },
      include: {
        participants: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Get all calls the user participated in
    const participatedCalls = await prisma.participant.findMany({
      where: { userId: session.user.id },
      include: {
        call: true,
      },
      orderBy: { startTime: "desc" },
      take: 20,
    });

    return new Response(
      JSON.stringify({
        created: callsCreated,
        participated: participatedCalls,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching call history:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to fetch call history",
      }),
      { status: 500 }
    );
  }
}
