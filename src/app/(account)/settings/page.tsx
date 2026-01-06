"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icons } from "~/components/ui/icons";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { Badge } from "~/components/ui/badge";
import { formatDate } from "~/lib/date";

interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: string;
  amountInINR: number;
  razorpayPaymentId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  createdAt: string;
}

interface Call {
  id: string;
  name: string;
  title?: string;
  startTime: string;
  endTime?: string;
  status?: string;
  participants?: Array<{
    id: string;
    name: string;
    email?: string;
    role: string;
    status: string;
  }>;
}

interface CallHistory {
  created: Call[];
  participated: Array<{
    call: Call;
    name: string;
    email?: string;
    startTime?: string;
    endTime?: string;
  }>;
}

type TabType = "dashboard" | "subscription" | "payments" | "calls";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("subscription");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [callHistory, setCallHistory] = useState<CallHistory>({ created: [], participated: [] });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();
  
  // Determine if user is on free plan (no active subscription)
  const isFreePlan = subscriptions.length === 0 || subscriptions.every(s => s.status !== "ACTIVE");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const session = await getSession();
      if (session?.user) {
        setUser(session.user);
      }

      try {
        const [subsRes, callRes] = await Promise.all([
          fetch("/api/account/subscriptions"),
          fetch("/api/account/call-history"),
        ]);

        if (subsRes.ok) {
          const subs = await subsRes.json();
          setSubscriptions(subs);
        }

        if (callRes.ok) {
          const calls = await callRes.json();
          setCallHistory(calls);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load your data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: "dashboard", label: "Dashboard", icon: <Icons.settings width={16} height={16} /> },
    { id: "subscription", label: "My Subscription", icon: <Icons.settings width={16} height={16} /> },
    { id: "payments", label: "Payment History", icon: null },
    { id: "calls", label: "Call History", icon: <Icons.invite width={16} height={16} /> },
  ];

  return (
    <main 
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

      <div className="relative z-10 container mx-auto max-w-[1400px] pt-20 pb-12">
        {/* Header */}
        <section className="mb-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Badge
              variant="secondary"
              className="bg-yellow-400 text-black"
            >
              {formatDate(new Date())}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400">
              Account Settings
            </h1>
            {user && (
              <p className="text-slate-300 text-lg">
                Welcome, <span className="font-semibold text-yellow-300">{user.name}</span>
              </p>
            )}
          </div>
        </section>

        {/* Tabs */}
        <section className="mx-auto max-w-4xl mb-8 flex justify-center">
          <div className="border-b border-yellow-400/30">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "dashboard") {
                      router.push("/calls");
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`flex items-center gap-2 pb-3 px-4 border-b-2 transition whitespace-nowrap text-sm font-semibold ${
                    activeTab === tab.id
                      ? "border-yellow-400 text-yellow-400"
                      : "border-transparent text-slate-400 hover:text-yellow-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl">
          <div className="rounded-2xl border-2 border-yellow-400/40 bg-black/50 backdrop-blur-md p-8 min-h-[500px] shadow-2xl">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Icons.spinner color="#fbbf24" width={32} height={32} />
              </div>
            ) : activeTab === "subscription" ? (
              <SubscriptionTab subscriptions={subscriptions} isFreePlan={isFreePlan} />
            ) : activeTab === "payments" ? (
              <PaymentHistoryTab subscriptions={subscriptions} />
            ) : (
              <CallHistoryTab callHistory={callHistory} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function SubscriptionTab({ subscriptions, isFreePlan }: { subscriptions: Subscription[]; isFreePlan: boolean }) {
  const active = subscriptions.find((s) => s.status === "ACTIVE");

  return (
    <div className="space-y-10">
      {/* Current Plan */}
      <div className="max-w-xl mx-auto">
        {isFreePlan ? (
          <div className="rounded-xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-black to-black backdrop-blur-lg p-6 shadow-lg hover:border-yellow-400/40 transition">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-yellow-400/50 text-xs uppercase tracking-[2px] font-semibold mb-2">Current Plan</p>
                <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">FREE</h3>
                <p className="text-gray-400 text-xs mt-2">Upgrade for more features</p>
              </div>
              <Link href="/calls?upgrade=1" className="w-full md:w-auto">
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 font-bold px-6 py-3 text-sm rounded-xl shadow-lg hover:shadow-xl transition w-full">
                  Upgrade
                </Button>
              </Link>
            </div>
          </div>
        ) : active ? (
          <div className="rounded-xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-black to-black backdrop-blur-lg p-6 shadow-lg hover:border-yellow-400/40 transition">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-yellow-400/50 text-xs uppercase tracking-[2px] font-semibold mb-2">Current Plan</p>
                <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">{active.planName}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <p className="text-green-400 text-xs font-semibold">Active</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-xs uppercase tracking-[2px] font-semibold mb-1">Valid Until</p>
                <p className="text-lg font-bold text-yellow-300">
                  {active.currentPeriodEnd
                    ? new Date(active.currentPeriodEnd).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-yellow-400/20 bg-black/40 backdrop-blur p-4 text-center">
            <p className="text-gray-400 text-sm">No active subscription.</p>
          </div>
        )}
      </div>

      {/* Subscription History */}
      {subscriptions.length > 1 && (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Previous Plans</h3>
          <div className="space-y-3">
            {subscriptions
              .filter((s) => s.status !== "ACTIVE")
              .map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-yellow-400/20 bg-black/40 backdrop-blur p-5 flex justify-between items-center hover:border-yellow-400/50 hover:bg-black/60 transition"
                >
                  <div>
                    <p className="font-bold text-white text-lg">{sub.planName}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-400 text-lg">₹{sub.amountInINR}</p>
                    <p className="text-xs text-gray-400 mt-1">{sub.status}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentHistoryTab({ subscriptions }: { subscriptions: Subscription[] }) {
  const payments = subscriptions.filter((s) => s.razorpayPaymentId);

  return (
    <div>
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Payment History</h2>
      {payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-yellow-400/30">
                <th className="text-left py-4 px-4 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-4 px-4 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="text-left py-4 px-4 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-4 px-4 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  Payment ID
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-yellow-400/10 hover:bg-yellow-400/5 transition">
                  <td className="py-4 px-4 text-white font-medium">
                    {new Date(payment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-4 text-white font-semibold">{payment.planName}</td>
                  <td className="py-4 px-4 text-yellow-400 font-bold">₹{payment.amountInINR}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        payment.status === "ACTIVE"
                          ? "bg-green-500/30 text-green-300"
                          : payment.status === "PENDING"
                          ? "bg-yellow-500/30 text-yellow-300"
                          : "bg-red-500/30 text-red-300"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400 text-xs font-mono">
                    {payment.razorpayPaymentId?.slice(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8">No payments yet. Upgrade your plan to start!</p>
      )}
    </div>
  );
}

function CallHistoryTab({ callHistory }: { callHistory: CallHistory }) {
  return (
    <div className="space-y-10">
      {/* Calls Created */}
      <div>
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Calls You Created</h2>
        {callHistory.created.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {callHistory.created.map((call) => (
              <div
                key={call.id}
                className="rounded-2xl border-2 border-yellow-400/30 bg-black/40 backdrop-blur p-6 hover:border-yellow-400/60 transition shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">
                      {call.title || "Untitled Call"}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">{call.id}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/30 text-blue-300 whitespace-nowrap ml-2">
                    {call.status || "CREATED"}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-400">📅 Started:</span>{" "}
                    {new Date(call.startTime).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {call.endTime && (
                    <p>
                      <span className="text-gray-400">🏁 Ended:</span>{" "}
                      {new Date(call.endTime).toLocaleDateString()}
                    </p>
                  )}
                  <p>
                    <span className="text-gray-400">👥 Participants:</span>{" "}
                    <span className="font-bold text-yellow-400">{call.participants?.length || 0}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No calls created yet.</p>
        )}
      </div>

      {/* Calls Participated */}
      {callHistory.participated.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">Calls You Joined</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {callHistory.participated.map((entry, idx) => (
              <div
                key={idx}
                className="rounded-2xl border-2 border-green-400/30 bg-black/40 backdrop-blur p-6 hover:border-green-400/60 transition shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">
                      {entry.call.title || "Untitled Call"}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">{entry.call.id}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-500/30 text-green-300 whitespace-nowrap ml-2">
                    JOINED
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-400">📅 Date:</span>{" "}
                    {entry.startTime
                      ? new Date(entry.startTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : new Date(entry.call.startTime).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="text-gray-400">👤 You joined as:</span>{" "}
                    <span className="font-semibold text-yellow-300">{entry.name}</span>
                  </p>
                  {entry.email && (
                    <p>
                      <span className="text-gray-400">📧 Email:</span> {entry.email}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
