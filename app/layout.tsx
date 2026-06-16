import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TeamSelector from "@/components/TeamSelector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FTC Pit Telemetry",
  description: "Battery scouting dashboard for FTC competition teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080808] font-sans text-zinc-300">
        <nav className="border-b border-zinc-800/50 bg-[#0a0a0f]">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
            <svg
              viewBox="0 0 48 48"
              className="h-8 w-8"
              fill="none"
              aria-label="FTC"
            >
              <polygon
                points="24,4 41.6,14 41.6,34 24,44 6.4,34 6.4,14"
                className="fill-amber-600/20 stroke-amber-500"
                strokeWidth="2"
              />
              <text
                x="24"
                y="28"
                textAnchor="middle"
                className="fill-amber-400 text-[14px] font-bold"
                fontFamily="Geist, system-ui, sans-serif"
              >
                FTC
              </text>
            </svg>
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-zinc-200">
              Pit Telemetry
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden h-4 w-px bg-zinc-800 sm:block" />
              <TeamSelector />
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
