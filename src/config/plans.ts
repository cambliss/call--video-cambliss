// src/config/plans.ts

export const PLAN_CONFIG = {
  free: {
    id: "free",
    label: "Free",
    priceInINR: 0,
    maxParticipantsPerCall: 4,
    features: [
      "1:1 & small group meetings",
      "Up to 4 participants",
      "15 min per call",
      "Standard video quality",
    ],
  },

  starter: {
    id: "starter",
    label: "Starter",
    priceInINR: 299,
    maxParticipantsPerCall: 10,
    features: [
      "1:1 & small group meetings",
      "Up to 10 participants",
      "Basic screen sharing",
      "Standard video quality",
    ],
  },

  professional: {
    id: "professional",
    label: "Professional",
    priceInINR: 999,
    maxParticipantsPerCall: 50,
    features: [
      "Team & client meetings",
      "Up to 50 participants",
      "Full HD video",
      "Cloud recordings (10GB)",
      "Basic admin controls",
    ],
  },

  enterprise: {
    id: "enterprise",
    label: "Enterprise",
    priceInINR: 2999,
    maxParticipantsPerCall: 250,
    features: [
      "Large events & webinars",
      "Up to 250 participants",
      "Priority support",
      "Advanced admin dashboard",
      "Custom branding",
      "Unlimited cloud recordings",
    ],
  },
} as const;

export type PlanId = keyof typeof PLAN_CONFIG;
