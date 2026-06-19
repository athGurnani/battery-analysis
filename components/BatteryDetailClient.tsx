"use client";

import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BatteryReading } from "@/lib/types";

function formatTime(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function healthColor(score: number) {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#fbbf24";
  return "#f87171";
}

const gridColor = "#18181b";
const textColor = "#52525b";

const tooltipStyle = {
  borderRadius: 6,
  border: "1px solid #27272a",
  backgroundColor: "#0f0f14",
  fontSize: 12,
  color: "#f4f4f0",
};

function MetricChart({
  title,
  data,
  color,
  unit,
  domain,
}: {
  title: string;
  data: { label: string; value: number }[];
  color: string;
  unit?: string;
  domain?: [number, number];
}) {
  return (
    <div className="rounded-lg border border-zinc-800/50 bg-[#0c0c14] p-4">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-600/70">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: textColor }} interval="preserveStartEnd" />
          <YAxis domain={domain} tick={{ fontSize: 10, fill: textColor }} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}${unit ? ` ${unit}` : ""}`, title] as [string, string]} />
          <Line
            type="monotone"
            dataKey="value"
            name={title}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, fill: color, stroke: "#0c0c14", strokeWidth: 1.5 }}
            activeDot={{ r: 5, fill: color, stroke: "#0c0c14", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function BatteryDetailClient({
  label,
  readings,
}: {
  label: string;
  readings: BatteryReading[];
}) {
  const healthData = readings.map((r) => ({
    label: formatTime(r.recordedAt),
    value: r.healthScore,
    raw: r.healthScore,
  }));

  const resistanceData = readings.map((r) => ({
    label: formatTime(r.recordedAt),
    value: r.resistance,
  }));

  const sagData = readings.map((r) => ({
    label: formatTime(r.recordedAt),
    value: r.voltageSag,
  }));

  const capacityData = readings.map((r) => ({
    label: formatTime(r.recordedAt),
    value: r.capacity,
  }));

  const recoveryData = readings.map((r) => ({
    label: formatTime(r.recordedAt),
    value: r.recoveryTime,
  }));

  const tempData = readings.map((r) => ({
    label: formatTime(r.recordedAt),
    value: r.avgTemp,
  }));

  const latest = readings.at(-1);
  const avgHealth =
    readings.length > 0
      ? Math.round(readings.reduce((sum, r) => sum + r.healthScore, 0) / readings.length)
      : null;
  const avgResistance =
    readings.length > 0
      ? readings.reduce((sum, r) => sum + r.resistance, 0) / readings.length
      : null;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="animate-fade-in flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="mb-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-600/70 transition-colors hover:text-amber-400"
          >
            &larr; Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            {label}
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {readings.length} reading{readings.length !== 1 ? "s" : ""}
            {latest && ` · Latest health: ${latest.healthScore}/100`}
          </p>
        </div>
        <div className="hidden gap-4 sm:flex">
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Avg Health
            </p>
            <p className="text-lg font-bold text-zinc-100">{avgHealth ?? "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Avg Resistance
            </p>
            <p className="text-lg font-bold text-zinc-100">
              {avgResistance !== null ? `${avgResistance.toFixed(1)} mΩ` : "—"}
            </p>
          </div>
        </div>
      </header>

      <section className="animate-slide-up">
        <div className="rounded-lg border border-zinc-800/50 bg-[#0c0c14] p-4">
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-600/70">
            Overall Rating Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={healthData} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: textColor }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: textColor }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="value"
                name="Health Score"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (cx === undefined || cy === undefined) return null;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={healthColor(payload?.raw ?? 0)}
                      stroke="#0c0c14"
                      strokeWidth={2}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="animate-slide-up grid gap-4 sm:grid-cols-2">
        <MetricChart
          title="Internal Resistance"
          data={resistanceData}
          color="#f97316"
          unit="mΩ"
        />
        <MetricChart
          title="Voltage Sag"
          data={sagData}
          color="#a78bfa"
          unit="V"
        />
        <MetricChart
          title="Capacity"
          data={capacityData}
          color="#34d399"
          unit="Ah"
        />
        <MetricChart
          title="Recovery Time"
          data={recoveryData}
          color="#38bdf8"
          unit="s"
        />
        <MetricChart
          title="Average Temperature"
          data={tempData}
          color="#fb923c"
          unit="°C"
        />
      </section>
    </div>
  );
}
