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
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(
    typeof window !== "undefined" ? (localStorage.getItem("selectedPlan") as PlanId | null) : null
  );
  const [subscriptionActive, setSubscriptionActive] = useState<boolean>(false);
  const [currentSubscription, setCurrentSubscription] = useState<{
    planId: string;
    planName: string;
    status: string;
    currentPeriodEnd: Date | null;
  } | null>(null);

  const { data: session } = useSession();
  const user =
    (session?.user as {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }) ?? null;

  const searchParams = useSearchParams();
  const upgrade = searchParams.get("upgrade");
  
  // Always show pricing if user comes from a call or has upgrade=1 in URL
  const [showPricing, setShowPricing] = useState(upgrade === "1");

  useEffect(() => {
    if (upgrade === "1") {
      setShowPricing(true);
    }
  }, [upgrade]);

  useEffect(() => {
    // Load Razorpay script once
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Fetch current subscription status
  useEffect(() => {
    async function fetchSubscription() {
      if (!user?.id) return;
      try {
        const res = await fetch("/api/subscription/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentSubscription(data.subscription);
          setSubscriptionActive(data.subscription?.status === "ACTIVE");
        }
      } catch (e) {
        console.error("Failed to fetch subscription:", e);
      }
    }
    fetchSubscription();
  }, [user?.id]);

  // Handler for plan selection
  const handlePlanSelect = (planId: PlanId) => {
    setSelectedPlan(planId);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedPlan", planId);
    }
    if (planId === "free") {
      // For free plan, hide pricing and show dashboard
      setShowPricing(false);
      setSubscriptionActive(true);
    } else {
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

  // Show dashboard cards only if user has selected free plan or paid and activated
  const showDashboardCards = (selectedPlan === "free" || subscriptionActive) && !showPricing;

  return (
    <div 
      className="w-full min-h-screen text-white relative overflow-hidden"
      style={{ 
        background: "radial-gradient(ellipse at top, #1a1a1a 0%, #000000 50%, #0a0a0a 100%)",
        backgroundAttachment: "fixed"
      }}
    >
      {/* 3D Grid Background Effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 214, 0, 0.15) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255, 214, 0, 0.15) 2px, transparent 2px)
          `,
          backgroundSize: "80px 80px",
          transform: "perspective(800px) rotateX(60deg) scale(2)",
          transformOrigin: "center top",
          animation: "gridMove 20s linear infinite"
        }}
      />
      
      {/* 3D Floating Geometric Shapes */}
      <div className="absolute top-20 left-[10%] w-32 h-32 opacity-10" style={{
        background: "linear-gradient(135deg, #FFD600 0%, transparent 100%)",
        transform: "rotateX(45deg) rotateY(45deg)",
        animation: "float 6s ease-in-out infinite"
      }} />
      <div className="absolute top-40 right-[15%] w-40 h-40 opacity-10" style={{
        background: "linear-gradient(225deg, #FFD600 0%, transparent 100%)",
        transform: "rotateX(-45deg) rotateY(-45deg)",
        animation: "float 8s ease-in-out infinite reverse"
      }} />
      
      {/* Floating Orbs with 3D effect */}
      <div 
        className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255, 214, 0, 0.15) 0%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite, float 8s ease-in-out infinite"
        }}
      />
      <div 
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255, 214, 0, 0.1) 0%, transparent 70%)",
          animation: "pulse 5s ease-in-out infinite 1s, float 10s ease-in-out infinite reverse"
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(circle, rgba(255, 214, 0, 0.08) 0%, transparent 70%)",
          animation: "pulse 6s ease-in-out infinite 2s"
        }}
      />
      
      {/* Animated particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle ${5 + Math.random() * 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 80px; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateX(45deg) rotateY(45deg); }
          50% { transform: translateY(-20px) rotateX(50deg) rotateY(50deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        @keyframes particle {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }
      `}</style>
      
      <section className="container mx-auto mb-8 max-w-[1400px] space-y-6 md:mb-12 lg:mb-16 relative z-10">
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

      {/* Show current subscription status if active */}
      {currentSubscription && currentSubscription.status === "ACTIVE" && (
        <section className="mx-auto max-w-6xl px-4 mb-6 relative z-10">
          <div className="rounded-2xl border-2 border-yellow-400 bg-black/90 backdrop-blur-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Active Subscription</h3>
            <p className="text-white">Plan: <span className="font-semibold">{currentSubscription.planName}</span></p>
            <p className="text-white">Status: <span className="text-green-400 font-semibold">ACTIVE</span></p>
            {currentSubscription.currentPeriodEnd && (
              <p className="text-white">Valid until: <span className="font-semibold">{new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}</span></p>
            )}
          </div>
        </section>
      )}

      {/* Dashboard cards - always show if user has selected a plan */}
      {showDashboardCards && (
        <section className="mx-auto space-y-6 mb-12 relative z-10">
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
                  selectedPlan={selectedPlan ?? undefined}
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

      {/* Pricing plans section - always show */}
      <section className="mx-auto space-y-6 py-12 relative z-10">
        <div className="mx-auto w-full max-w-[1300px] text-center mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mb-3">
            {selectedPlan ? "Upgrade Your Plan" : "Premium Plans"}
          </h2>
          <p className="text-white/60 text-base">Choose the perfect plan to elevate your experience</p>
        </div>
        <div className="mx-auto w-full max-w-[1300px]">
          <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-4 md:px-8">
            {ALL_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`group relative flex flex-col gap-4 rounded-2xl p-6 transition-all duration-500 backdrop-blur-sm
                  ${selectedPlan === plan.id 
                    ? "bg-black border-2 border-yellow-400 shadow-2xl shadow-yellow-400/30 scale-105" 
                    : plan.popular 
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-300 hover:shadow-2xl hover:shadow-yellow-400/40" 
                    : "bg-black/40 border border-white/10 hover:border-yellow-400/50 hover:bg-black/60"
                  }
                  hover:scale-105 hover:-translate-y-2`}
                style={{
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-bl-full" />
                
                {/* Badges */}
                <div className="flex flex-col gap-2">
                  {plan.popular && (
                    <span className="self-start px-3 py-1 bg-black text-yellow-400 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                      ⭐ Most Popular
                    </span>
                  )}
                  {selectedPlan === plan.id && (
                    <span className="self-start px-3 py-1 bg-black border border-yellow-400 text-yellow-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      ✓ Current Plan
                    </span>
                  )}
                </div>

                {/* Plan name */}
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${plan.popular ? "text-black" : "text-white"}`}>
                    {plan.label}
                  </h3>
                  <p className={`text-xs ${plan.popular ? "text-black/70" : "text-white/60"}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="py-2">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${plan.popular ? "text-black" : "text-yellow-400"}`}>
                      {plan.priceInINR === 0 ? "Free" : `₹${plan.priceInINR}`}
                    </span>
                    {plan.priceInINR !== 0 && (
                      <span className={`text-sm ${plan.popular ? "text-black/60" : "text-white/60"}`}>
                        /mo
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="flex-grow space-y-2">
                  {plan.features.map((f, i) => (
                    <li 
                      key={i} 
                      className={`flex items-start gap-2 text-xs ${plan.popular ? "text-black" : "text-white/80"}`}
                    >
                      <span className={`mt-0.5 text-sm ${plan.popular ? "text-black" : "text-yellow-400"}`}>✓</span>
                      <span>{f.replace("✔ ", "")}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  className={`w-full rounded-full py-4 font-bold text-sm uppercase tracking-wide transition-all duration-300 
                    ${selectedPlan === plan.id
                      ? "bg-yellow-400 text-black cursor-not-allowed opacity-75"
                      : plan.popular
                      ? "bg-black text-yellow-400 hover:bg-black/90 hover:shadow-xl"
                      : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 hover:shadow-xl hover:shadow-yellow-400/50"
                    }`}
                  onClick={() => handlePlanSelect(plan.id as PlanId)}
                  disabled={selectedPlan === plan.id}
                >
                  {selectedPlan === plan.id 
                    ? "✓ Active Plan" 
                    : plan.priceInINR === 0 
                    ? "Get Started" 
                    : "Subscribe Now"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
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
