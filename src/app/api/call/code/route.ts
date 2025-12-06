import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { env } from "~/env.mjs";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { generateManagementToken } from "~/server/management-token";
import { NextResponse } from "next/server";

const roomCodeSchema = z.object({
  callName: z.string().optional(),
  roomId: z.string().optional(),
  hmsRoomId: z.string().optional(),
});

type RoomCode = {
  code: string;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    let userId: string | undefined;
    if (session?.user?.id) {
      userId = session.user.id;
    }

    const json = await req.json();
    const body = roomCodeSchema.parse(json);

    // Debug: log incoming payload for troubleshooting
    console.log("Received payload for /api/call/code:", body);

    // Try to find call by id, hmsRoomId, or name
    let call = null;
    if (body.roomId) {
      call = await prisma.call.findUnique({
        where: { id: body.roomId },
        include: { participants: true },
      });
    }
    if (!call && body.hmsRoomId) {
      call = await prisma.call.findFirst({
        where: { hmsRoomId: body.hmsRoomId },
        include: { participants: true },
      });
    }
    if (!call && body.callName) {
      call = await prisma.call.findFirst({
        where: { name: body.callName },
        include: { participants: true },
      });
    }

    // Debug: log found call for troubleshooting
    console.log("Found call for /api/call/code:", call);

    if (!call || call.status === "ended") {
      console.error("Room not found in database for payload:", body);
      return NextResponse.json(
        { success: false, error: "Room not found in database" },
        { status: 404 }
      );
    }

    // Use the correct 100ms room ID
    const hmsRoomId = call.hmsRoomId;
    if (!hmsRoomId) {
      return NextResponse.json(
        { success: false, error: "No 100ms room ID found for this call" },
        { status: 500 }
      );
    }

    // Get the user's subscription plan for this call
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: call.userId,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
    });
    const planId = subscription?.planId ?? "free";

    // Enforce free plan limits
    if (planId === "free") {
      if (call.participants.length >= 4) {
        return NextResponse.json(
          { success: false, error: "Free plan allows only 4 participants." },
          { status: 403 }
        );
      }
    }

    // Determine role
    let role = "guest";
    if (userId) {
      const participant = await prisma.participant.findFirst({
        where: { userId, callId: call.id },
      });
      if (participant) {
        role = participant.role;
      }
    }

    const token = await generateManagementToken();

    // Use correct 100ms endpoint for role-based room code
    const response = await fetch(
      `${env.TOKEN_ENDPOINT}/room-codes/room/${hmsRoomId}/role/${role}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("100ms /room-codes/room error:", errorData);
      return NextResponse.json(
        { success: false, error: "Failed to generate room code", details: errorData },
        { status: 500 }
      );
    }

    const { code }: RoomCode = await response.json();
    return NextResponse.json({ success: true, code });
  } catch (error) {
    console.error("Unexpected error in /api/call/code", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}