"use client";

import { useMemo } from "react";
import type { BatteryReading } from "@/lib/types";
import BatteryChart from "@/components/BatteryChart";
import ReadingTable from "@/components/ReadingTable";
import BatteryRoster from "@/components/BatteryRoster";
import EntryForm from "@/components/EntryForm";

function Sparkline({
  data,
  color,
  width = 60,
  height = 18,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 2) - 1;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      className="mt-1.5"
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline points={points} fill="none" stroke={color ?? "#a1a1aa"} strokeWidth={1.5} />
    </svg>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const display = useMemo(() => value, [value]);
  return <>{display}</>;
}

function StatCard({
  label,
  value,
  unit,
  accent,
  sparklineData,
  sparklineColor,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
  sparklineData?: number[];
  sparklineColor?: string;
}) {
  const numValue = parseInt(value, 10);
  const isNumeric = !isNaN(numValue) && String(numValue) === value;

  return (
    <div className="rounded-lg border border-zinc-800/50 bg-[#0c0c14] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
        {label}
      </p>
      <p
        className={`mt-0.5 flex items-center gap-1.5 text-xl font-bold ${accent ?? "text-zinc-100"}`}
      >
        {isNumeric ? <AnimatedNumber value={numValue} /> : value}
        {unit && <span className="ml-1 text-xs font-medium text-zinc-600">{unit}</span>}
      </p>
      {sparklineData && (
        <Sparkline data={sparklineData} color={sparklineColor} />
      )}
    </div>
  );
}

export default function DashboardClient({
  readings,
}: {
  readings: BatteryReading[];
}) {
  const lastUpdated = useMemo(
    () => new Date(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [readings],
  );

  const latest = readings.at(-1);
  const avgHealth =
    readings.length > 0
      ? Math.round(
          readings.reduce((sum, r) => sum + r.healthScore, 0) / readings.length,
        )
      : null;

  const batteryCount = new Set(readings.map((r) => r.batteryLabel)).size;

  const recentHealth = readings.map((r) => r.healthScore).slice(-10);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="animate-fade-in">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600/70">
          Atlas · Competition Season
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
        <StatCard
          label="Readings Logged"
          value={String(readings.length)}
        />
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
          sparklineData={recentHealth.length > 1 ? recentHealth : undefined}
          sparklineColor={latest && latest.healthScore >= 80 ? "#34d399" : latest && latest.healthScore >= 60 ? "#fbbf24" : "#f87171"}
        />
        <StatCard
          label="Average Health"
          value={avgHealth !== null ? String(avgHealth) : "—"}
          unit="/ 100"
          accent={
            avgHealth !== null
              ? avgHealth >= 80
                ? "text-emerald-400"
                : avgHealth >= 60
                  ? "text-amber-400"
                  : "text-red-400"
              : undefined
          }
          sparklineData={recentHealth.length > 1 ? recentHealth : undefined}
          sparklineColor={
            avgHealth !== null
              ? avgHealth >= 80
                ? "#34d399"
                : avgHealth >= 60
                  ? "#fbbf24"
                  : "#f87171"
              : undefined
          }
        />
        <StatCard label="Batteries in Rotation" value={String(batteryCount)} />
      </div>

      <section className="animate-fade-in">
        <BatteryChart readings={readings} lastUpdated={lastUpdated} />
      </section>

      <section className="animate-fade-in">
        <BatteryRoster readings={readings} />
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
