"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to send message");
      }

      setStatus("success");
      (event.currentTarget as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="border-t border-yellow-400/20 bg-black/80">
      <div className="container mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16 md:flex-row">
        {/* Left copy */}
        <div className="flex-1 space-y-4">
          <p className="inline-flex rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-100">
            Contact & Support
          </p>
          <h2 className="text-2xl font-semibold text-yellow-50 sm:text-3xl">
            Talk to the Cambliss team
          </h2>
          <p className="text-sm text-yellow-100/80 sm:text-base">
            Have questions about plans, onboarding, or using Cambliss Meet for
            your organisation? Send us a message and we&apos;ll get back to you
            on priority.
          </p>
          <div className="mt-4 space-y-2 text-sm text-yellow-100/80">
            <p>Email: <span className="font-medium">contact@camblissstudio.com</span></p>
            <p>Response time: usually within 24 business hours.</p>
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-6">
            <a
              href="https://wa.me/91XXXXXXXXXX"
              // TODO: replace 91XXXXXXXXXX with your WhatsApp number
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-green-400/60 bg-green-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-green-300 transition hover:bg-green-400/30"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <p className="mt-1 text-[11px] text-yellow-100/60">
              WhatsApp support is best for quick questions.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1">
          <div className="rounded-3xl border border-yellow-400/30 bg-black/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.9)]">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-xs font-medium text-yellow-100"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Your full name"
                  className="bg-black/60 text-sm text-yellow-50"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-yellow-100"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="bg-black/60 text-sm text-yellow-50"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="message"
                  className="text-xs font-medium text-yellow-100"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Tell us how we can help..."
                  rows={4}
                  className={cn(
                    "w-full rounded-md border border-yellow-400/30 bg-black/60 px-3 py-2 text-sm text-yellow-50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70"
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 w-full rounded-full bg-yellow-400 py-2 text-xs font-semibold uppercase tracking-wide text-black hover:bg-yellow-300"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </Button>

              {status === "success" && (
                <p className="text-xs text-emerald-400">
                  Thank you! Your message has been sent.
                </p>
              )}
              {status === "error" && (
                <p className="text-xs text-red-400">
                  {errorMsg ?? "Something went wrong. Please try again."}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M16.04 5C10.53 5 6.06 9.47 6.06 14.98c0 2.01.55 3.97 1.6 5.68L6 27l6.5-1.68a10.1 10.1 0 0 0 3.54.63h.01c5.51 0 9.98-4.47 9.98-9.98C26.03 9.47 21.56 5 16.04 5zm5.84 14.3c-.25.7-1.23 1.3-1.7 1.33-.43.03-.98.04-1.58-.1-.36-.09-.82-.27-1.41-.52-2.48-1.07-4.09-3.57-4.22-3.74-.12-.17-1-1.33-1-2.54 0-1.2.63-1.78.85-2.02.22-.24.48-.3.64-.3h.46c.15 0 .34-.06.54.42.21.51.71 1.76.77 1.89.06.13.1.28.02.45-.07.17-.11.27-.21.42-.11.15-.23.34-.33.46-.11.11-.23.24-.1.47.12.24.54.89 1.16 1.44.8.71 1.47.94 1.69 1.05.22.11.36.1.49-.05.13-.15.56-.65.71-.87.15-.22.3-.18.5-.1.21.09 1.31.62 1.54.73.23.12.38.17.43.26.05.09.05.73-.2 1.43z"
      />
    </svg>
  );
}
