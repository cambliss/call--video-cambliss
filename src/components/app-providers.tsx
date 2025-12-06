// src/components/app-providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "~/components/theme-provider";
import RoomProvider from "~/components/room-provider";
import CallIdProvider from "~/context/call-id-context";
import { Toaster } from "~/components/ui/toaster";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <RoomProvider>
          <CallIdProvider>
            {children}
            <Toaster />
          </CallIdProvider>
        </RoomProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
