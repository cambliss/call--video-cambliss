// src/lib/subscription.ts
import { prisma } from "~/server/db";
import { PLAN_CONFIG, type PlanId } from "~/config/plans";

const DEFAULT_FREE_LIMIT = 5; // decide your free tier limit here

export async function getActiveSubscription(userId: string) {
  const now = new Date();

  // If the `Subscription` table doesn't exist yet or Prisma throws, 
  // we catch it in getMaxParticipantsForUser, not here.
  return await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gt: now } }],
    },
    orderBy: { createdAt: "desc" },
  });
}

// maximum allowed participants in *a single* call for this user
export async function getMaxParticipantsForUser(userId: string) {
  try {
    const sub = await getActiveSubscription(userId);

    if (!sub) {
      // No active subscription → free tier
      return DEFAULT_FREE_LIMIT;
    }

    const planKey = sub.planId as PlanId;
    const plan = PLAN_CONFIG[planKey];

    if (!plan) {
      return DEFAULT_FREE_LIMIT;
    }

    return plan.maxParticipantsPerCall;
  } catch (err) {
    // Most likely: `Subscription` table doesn’t exist yet, or Prisma error
    console.error("[subscription] Failed to fetch subscription, falling back to free tier:", err);
    return DEFAULT_FREE_LIMIT;
  }
}
