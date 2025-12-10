import { getServerSession } from "next-auth/next";
import { cookies } from "next/headers";
import { z } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

// 👇 NEW: to fall back to plan limit if maxParticipants is null
import { getMaxParticipantsForUser } from "~/lib/subscription"

const joinCallSchema = z.object({
  username: z.string().optional(),
  callName: z.string().uuid(),
  audio: z.boolean().optional(),
  video: z.boolean().optional(),
});

interface JoinCallBody {
  callName: string;
  username?: string;
  audio?: boolean;
  video?: boolean;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    let userId: string | undefined;
    let userName: string | undefined;
    let userEmail: string | undefined;
    if (session) {
      const { user } = session;
      if (user && user.id && user.name && user.email) {
        userId = user.id;
        userName = user.name;
        userEmail = user.email;
      }
    }

    const json: JoinCallBody = (await req.json()) as JoinCallBody;

    // Fix: Ensure callName is always a string, not an array
    let callNameValue = json.callName;
    if (Array.isArray(callNameValue)) {
      callNameValue = callNameValue[0] ?? "";
    }

    const body = joinCallSchema.parse({
      ...json,
      callName: callNameValue,
    });

    const call = await prisma.call.findFirst({
      where: { status: "created", name: body.callName },
    });

    if (!call || call.status === "ended") {
      return new Response("Not Found", { status: 404 });
    }

    // Get current joined participants count
    const currentJoinedCount = await prisma.participant.count({
      where: {
        callId: call.id,
        status: "joined",
      },
    });

    // Determine max allowed participants for this call
    const maxAllowed =
      call.maxParticipants ??
      (await getMaxParticipantsForUser(call.userId))

    // If user is logged in, see if they already have a participant record
    let participant = null;
    if (userId) {
      const existing = await prisma.participant.findFirst({
        where: { userId: userId, callId: call.id },
      });

      // If already participant, allow them to re-join even if room is “full”
      if (existing) {
        participant = await prisma.participant.update({
          where: { id: existing.id },
          data: {
            callName: call.name,
            status: "joined",
            startTime: new Date(),
          },
        });

        cookies().set("room-id", call.id);
        cookies().set("room-name", call.name);

        return new Response(JSON.stringify(participant));
      }
    }

    // If room capacity is reached, block new participants
    if (currentJoinedCount >= maxAllowed) {
      return new Response(
        JSON.stringify({
          error: "PLAN_LIMIT_EXCEEDED",
          message: `This meeting is full. The host's current plan allows only ${maxAllowed} participants. Please upgrade the plan to add more.`,
          maxAllowed,
        }),
        { status: 403 }
      );
    }

    // Create new participant (logged-in or guest)
    participant = await prisma.participant.create({
      data: {
        callName: call.name,
        userId: userId || null,
        email: userEmail || null,
        name: body.username || userName || "Guest",
        role: "guest",
        status: "joined",
        callId: call.id,
        startTime: new Date(),
      },
    });

    cookies().set("room-id", call.id);
    cookies().set("room-name", call.name);

    return new Response(JSON.stringify(participant));
  } catch (error) {
    console.log(error);
    return new Response(null, { status: 500 });
  }
}
