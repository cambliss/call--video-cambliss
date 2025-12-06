// src/components/layout/full-nav.tsx

import Link from "next/link";
import React from "react";
import { Icons } from "../ui/icons";
import { getCurrentUser } from "~/lib/session";
import { ModeToggle } from "../mode-toggle";
import UserAccountDropdown from "./user-account-dropdown"; // ✅ fixed path
import { Button } from "../ui/button";

export default async function FullNav({
  children,
}: {
  children?: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Default nav actions if no `children` are passed
  const defaultActions = !user ? (
    <>
      {/* Login (outline yellow) */}
      <Link href="/login">
        <Button
          variant="outline"
          className="rounded-full border-yellow-400/60 bg-transparent px-6 py-2 text-sm font-semibold uppercase tracking-wide text-yellow-200 hover:bg-yellow-400 hover:text-black transition"
        >
          Login
        </Button>
      </Link>

      {/* Get Started (solid yellow) */}
      <Link href="/register">
        <Button className="rounded-full bg-yellow-400 px-7 py-2 text-sm font-semibold uppercase tracking-wide text-black shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:bg-yellow-300 transition">
          Get Started
        </Button>
      </Link>
    </>
  ) : (
    <>
      {/* Dashboard button when logged in */}
      <Link href="/calls">
        <Button className="rounded-full bg-yellow-400 px-7 py-2 text-sm font-semibold uppercase tracking-wide text-black shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:bg-yellow-300 transition">
          Dashboard
        </Button>
      </Link>

      {/* User dropdown (avatar + logout) */}
      <UserAccountDropdown
        user={{
          name: user.name ?? "Cambliss User",
          email: user.email ?? "",
          image: user.image ?? "",
        }}
      />
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-screen border-b border-yellow-400/60 bg-black/80 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:h-20">
        {/* Logo only */}
        <Link href={user ? "/calls" : "/"}>
          <Icons.logo
            width={150}
            height={30}
            className="-ml-2 text-yellow-400"
          />
        </Link>

        {/* Right-side actions */}
        <nav className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {children ?? defaultActions}
          </div>

          {/* Theme toggle */}
          <div className="hidden sm:block">
            <ModeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
