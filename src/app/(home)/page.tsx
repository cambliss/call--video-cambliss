// src/app/(home)/page.tsx

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";
import { siteConfig } from "~/config/site-config";
import ContactSection from "~/components/layout/contact-section";
export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Background layers */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#FFD600_0,_#020617_55%,_#000_100%)] opacity-80" />
        {/* subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:90px_90px]" />
        {/* blurred orbs */}
        <div className="absolute -left-40 top-40 h-72 w-72 rounded-full bg-[#FFD600]/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#fff]/10 blur-3xl" />
      </div>
      <main className="relative">
        {/* HERO */}
        <section className="container mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-24 pt-20 md:flex-row md:items-center md:gap-16 lg:pt-28">
          {/* Left column */}
          <div className="flex-1 space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-black/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-yellow-300">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-yellow-400" />
              <span>Cambliss Meet • HD Video Collaboration</span>
            </div>
            <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[52px] lg:leading-[1.05]">
              Run{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                flawless video meetings
              </span>{" "}
              for clients, teams & classes.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              {siteConfig.description ??
                "Spin up meetings in seconds, share your screen beautifully, invite anyone with a link, and keep every interaction organised under a clean, intelligent dashboard."}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button className="group rounded-full bg-yellow-400 px-7 py-2 text-sm font-semibold uppercase tracking-wide text-black shadow-[0_0_40px_rgba(250,204,21,0.6)] transition hover:-translate-y-0.5 hover:bg-yellow-300">
                  <Icons.video className="mr-2 h-4 w-4 transition group-hover:scale-110" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-full border-yellow-300/70 bg-transparent px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-yellow-300 hover:text-black"
                >
                  <Icons.arrow className="mr-2 h-4 w-4 rotate-180" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
            {/* Hero stats row */}
            <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-yellow-300 sm:text-sm">
              <StatPill label="Avg. call uptime" value="99.9%" />
              <StatPill label="Teams onboarded" value="50+" />
              <StatPill label="Max participants" value="250 per call" />
            </div>
          </div>

          {/* Right column – hero mock */}
          <div className="flex-1">
            <div className="relative mx-auto max-w-md">
              {/* Glow ring */}
              <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-tr from-yellow-400/40 via-amber-300/10 to-cyan-300/40 opacity-80 blur-xl" />
              {/* Card */}
              <div className="relative rounded-[26px] border border-yellow-400/30 bg-gradient-to-br from-black/80 via-slate-950/95 to-black/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                {/* Top bar */}
                <div className="flex items-center justify-between rounded-2xl bg-black/60 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-300">
                      <Icons.camera className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-yellow-50">
                        Client Review – Q4 Sprint
                      </span>
                      <span className="text-[11px] text-yellow-100/60">
                        Cambliss Meet • Live
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-400">
                    00:24:12
                  </span>
                </div>

                {/* Main video grid mock */}
                <div className="mt-3 grid gap-2 rounded-2xl border border-yellow-400/20 bg-black/70 p-2 md:grid-cols-2">
                  <VideoTile name="You" label="Speaking" accent="primary" />
                  <VideoTile name="Client" label="Reviewing" />
                  <VideoTile name="Design Lead" label="Listening" />
                  <VideoTile name="Engineer" label="Sharing screen" />
                </div>

                {/* Bottom bar with controls */}
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-yellow-400/25 bg-black/70 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <AvatarPill />
                    <p className="text-[11px] text-yellow-100/80">
                      12 participants · Recording off
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCircle>
                      <Icons.camera className="h-3.5 w-3.5" />
                    </IconCircle>
                    <IconCircle>
                      <Icons.video className="h-3.5 w-3.5" />
                    </IconCircle>
                    <IconCircle className="bg-red-500 text-white hover:bg-red-400">
                      <Icons.arrow className="h-3.5 w-3.5 rotate-90" />
                    </IconCircle>
                  </div>
                </div>
              </div>

              {/* Floating mini card */}
              <div className="absolute -bottom-6 -left-4 hidden w-40 rounded-2xl border border-yellow-400/40 bg-black/90 px-3 py-2 text-[11px] text-yellow-100/90 shadow-xl sm:flex sm:flex-col">
                <span className="text-[10px] uppercase tracking-[0.18em] text-yellow-500/90">
                  Upcoming
                </span>
                <span className="mt-1 font-medium">Team standup • 11:00 AM</span>
                <span className="text-[10px] text-yellow-100/70">
                  8 invited · Auto-record enabled
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="border-y border-yellow-400/15 bg-black/40">
          <div className="container mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 text-center md:flex-row md:justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-yellow-300">
              BUILT FOR MODERN WORKFLOWS
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] text-white/60 sm:gap-8">
              <span>Agencies</span>
              <span className="h-4 w-px bg-yellow-400/30" />
              <span>Coaching & Classes</span>
              <span className="h-4 w-px bg-yellow-400/30" />
              <span>Consulting & Sales</span>
              <span className="h-4 w-px bg-yellow-400/30" />
              <span>Internal Teams</span>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="container mx-auto max-w-6xl px-4 pb-16 pt-14 md:pb-20">
          <div className="mb-10 flex flex-col items-center text-center">
            <Badge className="mb-3 border border-yellow-400/40 bg-yellow-400/10 text-yellow-300">
              WHY TEAMS CHOOSE CAMBLISS MEET
            </Badge>
            <h2 className="text-balance text-2xl font-semibold text-white sm:text-3xl md:text-[32px]">
              A meeting layer that feels tailored to your brand
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-base">
              From 1:1s to 200+ attendee sessions, Cambliss Meet gives you
              consistent quality, clear structure, and a UI your clients will
              actually enjoy.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Icons.video className="h-7 w-7 text-yellow-300" />}
              title="HD video & reliable audio"
              description="Powered by 100ms infrastructure for low-latency, high-quality calls that stay crisp even on less-than-perfect networks."
            />
            <FeatureCard
              icon={<Icons.settings className="h-7 w-7 text-yellow-300" />}
              title="Frictionless joining"
              description="Send a link, they join. No messy onboarding, no extra accounts. Perfect for clients, guests, and external teams."
            />
            <FeatureCard
              icon={<Icons.video className="h-7 w-7 text-yellow-300" />}
              title="Beautiful screen sharing"
              description="Present decks, demos, or walkthroughs in a polished, distraction-free layout optimised for focus."
            />
            <FeatureCard
              icon={<Icons.ellipsis className="h-7 w-7 text-yellow-300" />}
              title="Clear call history"
              description="See who joined, when, and for how long. Great for ops, sales, training, and follow-up notes."
            />
            <FeatureCard
              icon={<Icons.settings className="h-7 w-7 text-yellow-300" />}
              title="Secure & private rooms"
              description="Auth-protected access, host controls, and private links ensure your discussions stay in the right room."
            />
            <FeatureCard
              icon={<Icons.logo className="h-7 w-7 text-yellow-300" />}
              title="Cambliss-first experience"
              description="The entire experience feels premium, minimal, and on-brand — not like a generic off-the-shelf tool."
            />
          </div>
        </section>

        {/* HOW IT FLOWS */}
        <section className="container mx-auto max-w-6xl px-4 pb-18 pb-20">
          <div className="mb-10 flex flex-col items-center text-center">
            <Badge className="mb-3 border border-yellow-400/40 bg-yellow-400/10 text-yellow-300">
              HOW IT WORKS
            </Badge>
            <h2 className="text-2xl font-semibold text-yellow-50 sm:text-3xl">
              From idea to live call in under a minute
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <StepCard
              step="01"
              title="Create your account"
              description="Sign up with email or Google – you’ll land in a clean dashboard made for fast actions."
            />
            <StepCard
              step="02"
              title="Start or schedule a call"
              description="Spin up an instant room or create a link for later with just a couple of clicks."
            />
            <StepCard
              step="03"
              title="Invite your people"
              description="Copy the link, share it with your team, clients, or students – they can join in seconds."
            />
            <StepCard
              step="04"
              title="Collaborate in real time"
              description="Share screen, talk, review, and close loops with a layout built for modern collaboration."
            />
          </div>
        </section>

        {/* PRICING */}
        <section className="relative mx-auto mb-24 max-w-5xl px-4">
          <div className="pointer-events-none absolute inset-x-10 top-0 -z-10 h-full rounded-[40px] bg-gradient-to-b from-yellow-400/10 via-yellow-400/0 to-white/10 blur-3xl" />

          <div className="rounded-[32px] border border-yellow-400/25 bg-black/70 px-5 py-10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:px-8 md:px-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <Badge className="mb-3 border border-yellow-400/40 bg-yellow-400/10 text-yellow-300">
                SUBSCRIPTION PLANS
              </Badge>
              <h2 className="text-2xl font-semibold text-yellow-50 sm:text-3xl">
                Choose a plan that matches your meeting room
              </h2>
              <p className="mt-2 max-w-xl text-sm text-yellow-100/80 sm:text-base">
                Start with Starter and upgrade as your team, classes, or
                client-load grows. All plans support unlimited meetings.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <PriceCard
                label="Starter"
                price="499"
                highlight={false}
                tag="For freelancers & tiny teams"
                features={[
                  "Up to 10 participants per call",
                  "HD video & audio",
                  "Screen sharing",
                  "Basic call history",
                ]}
              />
              <PriceCard
                label="Professional"
                price="1,499"
                highlight
                tag="Perfect for growing teams"
                features={[
                  "Up to 50 participants per call",
                  "Advanced call history",
                  "Priority routing",
                  "Unlimited meetings",
                ]}
              />
              <PriceCard
                label="Enterprise"
                price="3,999"
                highlight={false}
                tag="For agencies & large orgs"
                features={[
                  "Up to 250 participants per call",
                  "Custom branding",
                  "Admin controls",
                  "Premium support",
                ]}
              />
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between">
              <p className="text-xs text-yellow-100/75 sm:text-sm">
                Prices in INR. Upgrade or downgrade anytime from your Cambliss
                dashboard.
              </p>
              <Link href="/register">
                <Button className="rounded-full bg-yellow-400 px-8 py-2 text-xs font-semibold uppercase tracking-wide text-black hover:bg-yellow-300">
                  Start with Starter plan
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT US */}
        <section className="container mx-auto max-w-6xl px-4 pb-20">
          <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] items-center">
            <div>
              <Badge className="mb-3 border border-yellow-400/40 bg-yellow-400/10 text-yellow-300">
                ABOUT CAMBLISS MEET
              </Badge>
              <h2 className="text-2xl font-semibold text-yellow-50 sm:text-3xl">
                Built by Cambliss for serious, everyday collaboration
              </h2>
              <p className="mt-3 text-sm text-yellow-100/80 sm:text-base">
                Cambliss Meet is part of the broader Cambliss ecosystem – a suite of
                tools crafted for creators, educators, agencies, and fast-moving teams.
                We&apos;ve spent countless hours inside client calls, student sessions, and
                internal standups, and we know exactly where traditional tools break.
              </p>
              <p className="mt-3 text-sm text-yellow-100/80 sm:text-base">
                This product is opinionated: clean layouts, zero clutter, and a flow
                that respects your time. You create the value in the meeting – our job
                is to make sure the tech never gets in the way.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-xs text-yellow-100/75">
                <span className="rounded-full border border-yellow-400/40 bg-black/60 px-3 py-1">
                  Made in India · Built for global teams
                </span>
                <span className="rounded-full border border-yellow-400/40 bg-black/60 px-3 py-1">
                  Optimised for agencies, educators & consultants
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-yellow-400/30 bg-black/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-300">
                  <Icons.logo className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                    CAMBLISS CLOUD
                  </p>
                  <p className="text-sm text-yellow-50">
                    A unified layer for meetings, learning & collaboration.
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs text-yellow-100/80">
                <p>• Built on modern video infrastructure (100ms)</p>
                <p>• Seamless integration with Cambliss dashboards & products</p>
                <p>• Designed to scale from solo creators to larger organisations</p>
              </div>
            </div>
          </div>
        </section>
        <ContactSection />
        {/* FINAL CTA STRIP */}
        <section className="border-t border-yellow-400/20 bg-black/70">
          <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                READY WHEN YOU ARE
              </p>
              <h3 className="mt-1 text-sm text-yellow-50 sm:text-base">
                Turn Cambliss Meet into your everyday meeting room in under 2
                minutes.
              </h3>
            </div>
            <div className="flex gap-3">
              <Link href="/register">
                <Button className="rounded-full bg-yellow-400 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-black hover:bg-yellow-300">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-full border-yellow-400/60 bg-transparent px-6 py-2 text-xs font-semibold uppercase tracking-wide text-yellow-100 hover:bg-yellow-300 hover:text-black"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- Small UI building blocks ---------- */

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-black/60 px-3 py-1">
      <span className="text-[11px] text-yellow-100/70">{label}</span>
      <span className="text-xs font-semibold text-yellow-300">{value}</span>
    </div>
  );
}

function IconCircle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-200 transition hover:bg-yellow-400 hover:text-black ${className}`}
    >
      {children}
    </button>
  );
}

function AvatarPill() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-yellow-400/10 px-3 py-1">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400/20">
        <Icons.avatar className="h-4 w-4 text-yellow-300" />
      </span>
      <span className="text-xs text-yellow-100">You</span>
    </div>
  );
}

function VideoTile({
  name,
  label,
  accent,
}: {
  name: string;
  label: string;
  accent?: "primary";
}) {
  return (
    <div className="relative h-28 rounded-2xl bg-gradient-to-br from-slate-900/90 via-black/80 to-slate-950/90 p-2">
      <div className="absolute inset-0 rounded-2xl border border-white/5" />
      <div className="flex h-full items-end justify-between p-2">
        <div>
          <p className="text-xs font-medium text-yellow-50">{name}</p>
          <p className="text-[10px] text-yellow-100/70">{label}</p>
        </div>
        <div
          className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
            accent === "primary"
              ? "bg-yellow-400 text-black"
              : "bg-black/60 text-yellow-100/80"
          }`}
        >
          Live
        </div>
      </div>
      {/* subtle placeholder/video pattern */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.28),_transparent_55%)] opacity-70" />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-yellow-400/25 bg-black/70 p-5 shadow-[0_0_35px_rgba(0,0,0,0.9)] backdrop-blur-md transition hover:-translate-y-1 hover:border-yellow-400/70 hover:shadow-[0_0_45px_rgba(250,204,21,0.45)]">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-300 transition group-hover:bg-yellow-400/20">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-yellow-50 sm:text-base">
        {title}
      </h3>
      <p className="text-xs text-yellow-100/80 sm:text-sm">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-yellow-400/25 bg-black/70 p-4 text-left shadow-lg">
      <span className="text-[11px] font-semibold tracking-[0.22em] text-yellow-400">
        STEP {step}
      </span>
      <h3 className="text-sm font-semibold text-yellow-50 sm:text-base">
        {title}
      </h3>
      <p className="text-xs text-yellow-100/80 sm:text-sm">{description}</p>
    </div>
  );
}

function PriceCard({
  label,
  price,
  tag,
  highlight,
  features,
}: {
  label: string;
  price: string;
  tag: string;
  highlight?: boolean;
  features: string[];
}) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border p-6 shadow-xl transition ${
        highlight
          ? "border-yellow-400 bg-yellow-400 text-black"
          : "border-yellow-400/40 bg-black/80 text-yellow-100"
      }`}
    >
      {highlight && (
        <span className="self-start rounded-full bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-yellow-400">
          Most Popular
        </span>
      )}
      <div>
        <h3 className="text-lg font-semibold">{label}</h3>
        <p
          className={`text-xs ${
            highlight ? "text-black/80" : "text-yellow-100/75"
          }`}
        >
          {tag}
        </p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold">₹{price}</span>
        <span
          className={`text-xs ${
            highlight ? "text-black/70" : "text-yellow-100/70"
          }`}
        >
          / month
        </span>
      </div>
      <ul
        className={`mt-1 flex flex-col gap-1.5 text-xs ${
          highlight ? "text-black" : "text-yellow-100/85"
        }`}
      >
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-yellow-400" />
            {f}
          </li>
        ))}
      </ul>
      <Link href="/register" className="mt-2">
        <Button
          className={`w-full rounded-full py-2 text-xs font-semibold uppercase tracking-wide ${
            highlight
              ? "bg-black text-yellow-400 hover:bg-yellow-500 hover:text-black"
              : "bg-yellow-400 text-black hover:bg-yellow-300"
          }`}
        >
          Get Started
        </Button>
      </Link>
    </div>
  );
}
