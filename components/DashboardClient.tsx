"use client";

import type { BatteryReading } from "@/lib/types";
import BatteryChart from "@/components/BatteryChart";
import ReadingTable from "@/components/ReadingTable";
import EntryForm from "@/components/EntryForm";

function StatCard({
  label,
  value,
  unit,
  accent,
  index = 0,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
  index?: number;
}) {
  return (
    <div
      className="group rounded-xl border border-zinc-800/60 bg-[#0c0c14] p-4 shadow-sm transition-all duration-300 hover:border-cyan-700/50 hover:shadow-[0_0_16px_rgba(34,211,238,0.08)]"
      style={{ animation: `slide-up 0.5s ease-out ${index * 0.1}s both` }}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-cyan-500/80 transition-colors duration-300 group-hover:text-cyan-400/90">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${accent ?? "text-zinc-100"}`}>
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal text-zinc-500">{unit}</span>
        )}
      </p>
    </div>
  );
}

export default function DashboardClient({
  readings,
}: {
  readings: BatteryReading[];
}) {
  const latest = readings.at(-1);
  const avgHealth =
    readings.length > 0
      ? Math.round(
          readings.reduce((sum, r) => sum + r.healthScore, 0) / readings.length
        )
      : null;

  const teamCount = new Set(readings.map((r) => r.teamNumber)).size;
  const batteryCount = new Set(readings.map((r) => r.batteryLabel)).size;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="animate-fade-in">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-500/60">
          FIRST Tech Challenge
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
          Battery Analysis
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-500">
          Monitor and log battery health across test runs. Track sag,
          resistance, capacity, and temperature trends.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Readings" value={String(readings.length)} index={0} />
        <StatCard
          label="Latest Health"
          value={latest ? String(latest.healthScore) : "—"}
          unit="/ 100"
          index={1}
          accent={
            latest
              ? latest.healthScore >= 80
                ? "text-emerald-400"
                : latest.healthScore >= 60
                  ? "text-amber-400"
                  : "text-red-400"
              : undefined
          }
        />
        <StatCard
          label="Average Health"
          value={avgHealth !== null ? String(avgHealth) : "—"}
          unit="/ 100"
          index={2}
        />
        <StatCard label="Teams Tracked" value={String(teamCount)} index={3} />
        <StatCard label="Batteries Tracked" value={String(batteryCount)} index={4} />
        <StatCard
          label="Latest Sag"
          value={latest ? latest.voltageSag.toFixed(2) : "—"}
          unit="V"
          index={5}
        />
        <StatCard
          label="Latest Capacity"
          value={latest ? latest.capacity.toFixed(1) : "—"}
          unit="Ah"
          index={6}
        />
        <StatCard
          label="Latest Avg Temp"
          value={latest ? latest.avgTemp.toFixed(1) : "—"}
          unit="°C"
          index={7}
        />
      </div>

      <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <BatteryChart readings={readings} />
      </section>

      <section
        className="grid gap-8 lg:grid-cols-5"
        style={{ animation: "fade-in 0.6s ease-out 0.5s both" }}
      >
        <div className="lg:col-span-2">
          <EntryForm />
        </div>
        <div className="lg:col-span-3">
          <ReadingTable readings={readings} />
        </div>
      </section>
    </div>
  );
}
