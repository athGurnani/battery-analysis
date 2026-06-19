"use client";

import Link from "next/link";
import type { BatteryReading } from "@/lib/types";

function scoreBadge(score: number) {
  if (score >= 80) return "bg-emerald-900/50 text-emerald-300 border border-emerald-800/40";
  if (score >= 60) return "bg-amber-900/50 text-amber-300 border border-amber-800/40";
  return "bg-red-900/50 text-red-300 border border-red-800/40";
}

function scoreDot(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function trend(current: number, previous: number | null) {
  if (previous === null) return { arrow: "→", color: "text-zinc-600", label: "stable" };
  if (current > previous) return { arrow: "↑", color: "text-emerald-400", label: "improving" };
  if (current < previous) return { arrow: "↓", color: "text-red-400", label: "declining" };
  return { arrow: "→", color: "text-zinc-500", label: "stable" };
}

export default function BatteryRoster({
  readings,
}: {
  readings: BatteryReading[];
}) {
  const byBattery = new Map<string, BatteryReading[]>();
  for (const r of readings) {
    const key = r.batteryLabel;
    if (!byBattery.has(key)) byBattery.set(key, []);
    byBattery.get(key)!.push(r);
  }

  const roster = Array.from(byBattery.entries())
    .map(([label, runs]) => {
      runs.sort(
        (a, b) =>
          new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
      );
      const latest = runs[0];
      const previous = runs.length > 1 ? runs[1] : null;
      const t = trend(latest.healthScore, previous?.healthScore ?? null);
      return { label, latest, trend: t, count: runs.length };
    })
    .sort((a, b) => b.latest.healthScore - a.latest.healthScore);

  if (roster.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-zinc-800/50 bg-[#0c0c14] p-4">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-600/70">
        Battery Roster
      </h3>
      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {roster.map((b) => (
          <div
            key={b.label}
            className="group flex items-center gap-3 rounded-md border border-zinc-800/30 bg-zinc-900/30 px-3 py-2 transition-all duration-200 hover:scale-[1.02] hover:border-amber-800/40 hover:bg-zinc-800/40 hover:shadow-[0_0_12px_rgba(245,158,11,0.06)]"
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125 ${scoreDot(b.latest.healthScore)}`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-200 transition-colors duration-200 group-hover:text-zinc-100">
                {b.label}
              </p>
              <p className="text-[10px] text-zinc-600">{b.count} reading{b.count !== 1 ? "s" : ""}</p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-semibold transition-all duration-200 group-hover:scale-105 ${scoreBadge(b.latest.healthScore)}`}
              >
                {b.latest.healthScore}
              </span>
              <p className={`mt-0.5 text-xs ${b.trend.color}`}>
                {b.trend.arrow}
              </p>
            </div>
            <Link
              href={`/battery/${encodeURIComponent(b.label)}`}
              className="rounded-md border border-zinc-800/40 px-2 py-1 text-[10px] font-medium text-amber-500/70 transition-all duration-200 hover:bg-amber-900/20 hover:text-amber-400"
            >
              Metrics
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
