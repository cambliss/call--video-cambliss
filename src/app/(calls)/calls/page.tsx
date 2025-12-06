/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Badge } from "~/components/ui/badge";
import { Icons } from "~/components/ui/icons";
import { formatDate } from "~/lib/date";
import JoinCallDialog from "~/components/call/join-call-dialog";
import InviteParticipantsDialog from "~/components/call/invite-participants-dialog";
import { type CardProps } from "~/components/layout/card-shell";
import CreateCallCard from "~/components/call/create-call-card";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";

// ✅ Use the same config as backend & lib/subscription
import { PLAN_CONFIG } from "~/config/plans";

type PlanId = "free" | "starter" | "professional" | "enterprise";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Add Free plan config
const ALL_PLANS = [
  {
    id: "free",
    label: "FREE",
    description: "Basic access for individuals",
    priceInINR: 0,
    features: [
      "✔ Up to 3 participants",
      "✔ SD video calling",
      "✔ Limited call history",
      "✔ 500MB cloud storage",
    ],
    buttonClass: "bg-gray-400 text-black hover:bg-gray-500",
  },
  {
    id: "starter",
    label: "STARTER",
    description: "Perfect for freelancers & small teams",
    priceInINR: PLAN_CONFIG.starter.priceInINR,
    features: [
      "✔ Up to 10 participants",
      "✔ HD video calling",
      "✔ Screen sharing",
      "✔ Basic call history",
      "✔ 5GB cloud storage",
    ],
    buttonClass: "bg-yellow-400 text-black hover:bg-yellow-500",
  },
  {
    id: "professional",
    label: "PROFESSIONAL",
    description: "For high-performance teams",
    priceInINR: PLAN_CONFIG.professional.priceInINR,
    features: [
      "✔ Up to 50 participants",
      "✔ Advanced call history",
      "✔ AI-generated meeting notes",
      "✔ Unlimited invites",
      "✔ 25GB storage",
      "✔ Email + chat support",
    ],
    buttonClass: "bg-black text-yellow-400 hover:bg-yellow-500 hover:text-black",
    popular: true,
  },
  {
    id: "enterprise",
    label: "ENTERPRISE",
    description: "For large organizations and agencies",
    priceInINR: PLAN_CONFIG.enterprise.priceInINR,
    features: [
      "✔ Up to 250 participants",
      "✔ Custom branding & domain",
      "✔ Encrypted call recordings",
      "✔ Admin dashboard",
      "✔ API integrations",
      "✔ Priority support",
      "✔ 200GB storage",
    ],
    buttonClass: "bg-yellow-400 text-black hover:bg-yellow-500",
  },
];

function openRazorpayForPlan(
  planId: PlanId,
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null,
  onCancel?: () => void,
  onSuccess?: () => void
) {
  // Free plan does not redirect to payment
  if (planId === "free") {
    alert("You have selected the Free plan. Enjoy!");
    return;
  }

  const plan = PLAN_CONFIG[planId];

  if (!plan) {
    console.error("Invalid planId passed to openRazorpayForPlan:", planId);
    return;
  }

  // Not logged in -> go to register / Google login first, keep selected plan in query
  if (!user?.email) {
    window.location.href = `/register?plan=${planId}`;
    return;
  }

  if (!window.Razorpay) {
    alert("Payment system is still loading. Please try again in a moment.");
    return;
  }

  // In openRazorpayForPlan, update the Razorpay key to use your LIVE key from .env
  const options = {
    // IMPORTANT: set this in your .env as NEXT_PUBLIC_RAZORPAY_KEY
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_live_DWyfLCL7ScTLd1",
    amount: plan.priceInINR * 100, // PLAN_CONFIG uses priceInINR; adjust name if needed
    currency: "INR",
    name: "Cambliss Meet",
    description: `${plan.label} Plan Subscription`,
    handler: function (response: any) {
      // TODO: call your backend to verify the payment & activate subscription in DB
      alert("Payment successful! Thank you for subscribing.");
      console.log("Razorpay response:", response);
      if (onSuccess) onSuccess();
    },
    modal: {
      ondismiss: function () {
        alert("Payment cancelled.");
        if (onCancel) onCancel();
      },
    },
    prefill: {
      email: user.email || "",
    },
    theme: {
      color: "#FFD600",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

function CallsPageContent() {
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(
    typeof window !== "undefined" ? (localStorage.getItem("selectedPlan") as PlanId | null) : null
  );
  const [subscriptionActive, setSubscriptionActive] = useState<boolean>(false);

  const { data: session } = useSession();
  const user =
    (session?.user as {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }) ?? null;

  const searchParams = useSearchParams();
  const upgrade = searchParams.get("upgrade"); // from PLAN_LIMIT_EXCEEDED redirect
  const router = useRouter();

  useEffect(() => {
    // Load Razorpay script once
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // If user came:
    // - from homepage / landing with ?plan=starter|professional|enterprise
    // - OR from a "limit reached, upgrade" flow with ?upgrade=1
    // then open pricing modal.
    if (upgrade === "1") {
      setShowPricing(true);
    }
  }, [upgrade]);

  // Handler for plan selection
  const handlePlanSelect = (planId: PlanId) => {
    setSelectedPlan(planId);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedPlan", planId);
    }
    if (planId !== "free") {
      openRazorpayForPlan(planId, user, handlePaymentCancel, handlePaymentSuccess);
    }
  };

  // Razorpay payment cancel handler
  const handlePaymentCancel = () => {
    setSelectedPlan(null);
    setSubscriptionActive(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("selectedPlan");
    }
  };

  // Razorpay payment success handler
  const handlePaymentSuccess = () => {
    setSubscriptionActive(true);
  };

  // Show plans if no plan selected, or paid plan not activated
  const showDashboardCards = selectedPlan === "free" || subscriptionActive;

  return (
    <div
      className="w-full bg-black min-h-screen text-white"
      style={{
        background: "linear-gradient(135deg, #111 60%, #fff 100%)",
      }}
    >
      <section className="container mx-auto mb-8 max-w-[1400px] space-y-6 md:mb-12 lg:mb-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <Badge
              variant="secondary"
              className="bg-yellow-400 text-black"
            >
              {formatDate(new Date())}
            </Badge>
            <h1 className="mt-4 px-4 text-4xl font-semibold leading-none md:px-8 md:text-5xl lg:text-[50px] text-yellow-400">
              {`Welcome ${user?.name ?? ""}`}
            </h1>
          </div>
        </div>
      </section>

      {!showDashboardCards ? (
        // Show plans
        <section className="mx-auto space-y-6">
          <div className="mx-auto w-full max-w-[1200px] text-center">
            <div className="grid w-full grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-8">
              {ALL_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`flex flex-col items-center gap-4 rounded-2xl border-2 border-yellow-400 p-6 shadow-xl ${
                    plan.popular ? "bg-yellow-400" : plan.id === "free" ? "bg-gray-900" : "bg-[#10131a]"
                  }`}
                >
                  {plan.popular && (
                    <span className="mb-2 px-3 py-1 bg-black text-yellow-400 text-xs font-bold rounded-full">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className={`text-xl font-bold ${plan.popular ? "text-black" : "text-white"}`}>{plan.label}</h3>
                  <p className={`text-base ${plan.popular ? "text-black" : "text-yellow-200"}`}>{plan.description}</p>
                  <p className={`text-3xl font-bold ${plan.popular ? "text-black" : "text-yellow-400"}`}>
                    {plan.priceInINR === 0 ? "Free" : `₹${plan.priceInINR}`}
                    {plan.priceInINR !== 0 && (
                      <span className={`text-lg font-normal ${plan.popular ? "text-black" : "text-yellow-200"}`}>
                        /month
                      </span>
                    )}
                  </p>
                  <ul className={`${plan.popular ? "text-black" : "text-yellow-200"} text-left list-none space-y-1 mb-2`}>
                    {plan.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-lg py-2 font-semibold transition ${plan.buttonClass}`}
                    onClick={() => handlePlanSelect(plan.id as PlanId)}
                  >
                    {plan.priceInINR === 0 ? "SELECT FREE" : "GET STARTED"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        // Show dashboard cards only for free plan or after payment success
        <section className="mx-auto space-y-6">
          <div className="mx-auto w-full max-w-[1200px] text-center">
            <div className="grid w-full grid-cols-1 place-items-center gap-3 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3 lg:gap-5">
              <div className="w-full">
                <CreateCallCard
                  title="Create a call"
                  description="Create a call and invite others to join in conversation, discussion, or collaboration."
                  icon={<Icons.video width={24} height={14} />}
                  buttonText="Create"
                  loadingIcon={<Icons.spinner width={14} height={14} />}
                  buttonIcon={<Icons.add className="ml-2" width={16} height={16} />}
                  selectedPlan={selectedPlan ?? undefined} // <-- fix: never pass null
                />
              </div>
              <div className="w-full">
                <JoinCallDialog
                  title="Join a call"
                  description="Join a call to participate in a conversation, discussion, or collaboration."
                  icon={<Icons.add width={16} height={16} />}
                  buttonText="Join"
                  loadingIcon={<Icons.spinner width={14} height={14} />}
                  buttonIcon={<Icons.add className="ml-2" width={16} height={16} />}
                />
              </div>
              <div className="w-full">
                <InviteParticipantsDialog
                  title="Invite Participants"
                  description="Invite your friends or participants to join your call and engage in a conversation."
                  icon={<Icons.invite width={24} height={24} />}
                  loadingIcon={<Icons.spinner width={14} height={14} />}
                  buttonText="Invite"
                  buttonIcon={<Icons.add className="ml-2" width={16} height={16} />}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function CallsPage() {
  return (
    <SessionProvider>
      <CallsPageContent />
    </SessionProvider>
  );
}
