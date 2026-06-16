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
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800/50 bg-[#0c0c14] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
        {label}
      </p>
      <p className={`mt-0.5 text-xl font-bold ${accent ?? "text-zinc-100"}`}>
        {value}
        {unit && (
          <span className="ml-1 text-xs font-medium text-zinc-600">{unit}</span>
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
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="animate-fade-in">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600/70">
          Pit Log · Competition Season
        </p>
        <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          Battery Telemetry
        </h1>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-zinc-600">
          Track battery health across matches. Log sag, resistance, capacity, and
          temperature for every run.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Readings Logged" value={String(readings.length)} />
        <StatCard
          label="Latest Health"
          value={latest ? String(latest.healthScore) : "—"}
          unit="/ 100"
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
        />
        <StatCard label="Batteries in Rotation" value={String(batteryCount)} />
      </div>

      <section className="animate-fade-in">
        <BatteryChart readings={readings} />
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
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
