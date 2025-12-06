import { prisma } from "~/server/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { z } from "zod";
import { env } from "~/env.mjs";
import { generateManagementToken } from "~/server/management-token";

const leaveCallSchema = z.object({
  callName: z.string().uuid(),
  roomId: z.string().min(8),
  userName: z.string().min(1).optional(),
});

interface LeaveCallBody {
  callName: string;
  roomId: string;
  userName?: string;
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const json = (await req.json()) as LeaveCallBody;
    const body = leaveCallSchema.parse(json);

    let participant = null;

    // 🔹 1) Logged-in user → find by userId + callName
    if (session?.user?.id) {
      participant = await prisma.participant.findFirst({
        where: {
          userId: session.user.id,
          callName: body.callName,
        },
      });
    }
    // 🔹 2) Guest user → fallback to name + callName
    else if (body.userName) {
      participant = await prisma.participant.findFirst({
        where: {
          name: body.userName,
          callName: body.callName,
        },
      });
    }

    if (!participant) {
      return new Response("Participant not found", { status: 404 });
    }

    const endTime = new Date();

    const updatedParticipant = await prisma.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        status: "left",
        endTime,
      },
    });

    // 🔹 Check if any other participants are still "joined"
    const otherJoinedCount = await prisma.participant.count({
      where: {
        callName: updatedParticipant.callName,
        status: "joined",
      },
    });

    // 🔹 Fetch the call and host's subscription plan
    const call = await prisma.call.findUnique({
      where: { id: body.roomId },
    });
    let planId = "free";
    if (call) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: call.userId,
          status: "ACTIVE",
        },
        orderBy: { createdAt: "desc" },
      });
      planId = subscription?.planId ?? "free";
    }

    // 🔹 If no one is left → end the room in 100ms + mark call as ended
    if (otherJoinedCount === 0) {
      const managementToken = await generateManagementToken();

      const response = await fetch(
        `${env.TOKEN_ENDPOINT}/active-rooms/${body.roomId}/end-room`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${managementToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lock: true,
          }),
        },
      );

      if (response.ok) {
        let durationMs =
          endTime.getTime() -
          (participant.startTime as Date).getTime();

        // Enforce free plan duration limit
        if (planId === "free" && durationMs > 15 * 60 * 1000) {
          durationMs = 15 * 60 * 1000;
        }

        await prisma.call.update({
          where: { id: body.roomId },
          data: {
            status: "ended",
            endTime,
            duration: durationMs,
          },
        });
      }
    }

    return new Response(JSON.stringify(updatedParticipant));
  } catch (error) {
    console.log(error);
    return new Response(null, { status: 500 });
  }
}
