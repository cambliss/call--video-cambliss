// src/app/layout.tsx

import "../styles/globals.css";
import RoomProvider from "~/components/room-provider";
import CallIdProvider from "~/context/call-id-context";
import { Toaster } from "~/components/ui/toaster";
import { siteConfig } from "~/config/site-config";
import { Inter } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  // ...
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
        <Script
          async
          src={process.env.UMAMI_URL}
          data-website-id={process.env.UMAMI_DATA_WEBSITE_ID}
        />
      </body>
    </html>
  );
}
