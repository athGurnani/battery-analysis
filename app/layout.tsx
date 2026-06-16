import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FTC Battery Analysis",
  description: "Dashboard for monitoring and logging FTC battery test data",
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
      <body className="min-h-full flex flex-col bg-[#08080e] font-sans text-zinc-300">
        <nav className="border-b border-zinc-800/60 bg-[#0c0c14]">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-sm font-bold text-black shadow-[0_0_10px_rgba(34,211,238,0.4)] animate-glow-pulse">
              B
            </div>
            <span className="font-semibold text-zinc-100">FTC Battery Analysis</span>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
