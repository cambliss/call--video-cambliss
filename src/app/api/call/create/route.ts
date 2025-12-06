// src/app/api/call/create/route.ts

import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { env } from "~/env.mjs";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { cookies } from "next/headers";
import { generateManagementToken } from "~/server/management-token";

const callCreateSchema = z.object({
  callName: z.string().uuid(),
});

interface CallCreateBody {
  callName: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    if (!user || !user.id || !user.name || !user.email) {
      throw new Error("You must be logged in to create a call");
    }

    const json: CallCreateBody = (await req.json()) as CallCreateBody;
    const body = callCreateSchema.parse(json);

    // Create room on 100ms
    const managementToken = await generateManagementToken();
    console.log("About to create 100ms room");
    const response = await fetch(`${env.TOKEN_ENDPOINT}/rooms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${managementToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: body.callName,
        template_id: env.TEMPLATE_ID,
        region: "us",
      }),
    });
    console.log("100ms room creation response status:", response.status);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("100ms room creation failed:", text);
      throw new Error(
        `HTTP error creating room. status: ${response.status}, body: ${text}`
      );
    }

    const roomData = await response.json();
    console.log("100ms roomData:", roomData);
    const hmsRoomId = roomData.id;

    // Get user's active subscription plan
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
    });
    const planId = subscription?.planId ?? "free";

    // Set limits for free plan
    const callData: any = {
      id: body.callName,
      name: body.callName,
      hmsRoomId,
      userId: user.id,
      title: `${user.name}'s Call`,
      startTime: new Date(),
      status: "created",
      endTime: null,
    };
    if (planId === "free") {
      callData.maxParticipants = 4;
      callData.duration = 15; // minutes
    }

    // Create new Call record
    const newCall = await prisma.call.create({
      data: callData,
    });

    const inviteLink = `${env.NEXT_PUBLIC_APP_URL}/call/${newCall.name}`;

    // Store inviteLink
    await prisma.call.update({
      where: { id: newCall.id },
      data: { inviteLink },
    });

    // Add host as participant
    await prisma.participant.create({
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        callName: newCall.name,
        role: "host",
        status: "joined",
        callId: newCall.id,
        startTime: new Date(),
      },
    });

    // Save room info in cookies
    cookies().set("room-id", newCall.id);
    cookies().set("room-name", newCall.name);

    return new Response(
      JSON.stringify({
        success: true,
        callId: newCall.id,
        callName: newCall.name,
        inviteLink,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/call/create:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return new Response(
      JSON.stringify({
        success: false,
        error: message,
      }),
      { status: 500 }
    );
  }
}
