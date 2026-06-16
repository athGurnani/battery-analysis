"use client";

import {
  CartesianGrid,
  Legend,
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

export default function BatteryChart({
  readings,
}: {
  readings: BatteryReading[];
}) {
  if (readings.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-[#0c0c14] text-sm text-zinc-600">
        No readings yet — log data below to populate charts.
      </div>
    );
  }

  const chartData = readings.map((r) => ({
    label: formatTime(r.recordedAt) || `#${r.id}`,
    teamNumber: r.teamNumber,
    batteryLabel: r.batteryLabel,
    healthScore: r.healthScore,
    voltageSag: r.voltageSag,
    resistance: r.resistance,
    capacity: r.capacity,
    recoveryTime: r.recoveryTime,
    avgTemp: r.avgTemp,
  }));

  const gridColor = "#18181b";
  const textColor = "#52525b";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-zinc-800/50 bg-[#0c0c14] p-4">
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-600/70">
          Health Score
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: textColor }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: textColor }} />
            <Tooltip
              contentStyle={{
                borderRadius: 6,
                border: "1px solid #27272a",
                backgroundColor: "#0f0f14",
                fontSize: 12,
                color: "#f4f4f0",
              }}
            />
            <Line
              type="monotone"
              dataKey="healthScore"
              name="Health Score"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={healthColor(payload.healthScore)}
                    stroke="#0c0c14"
                    strokeWidth={2}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-zinc-800/50 bg-[#0c0c14] p-4">
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-600/70">
          Sag, Resistance &amp; Capacity
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: textColor }} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: textColor }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: textColor }} />
            <Tooltip
              contentStyle={{
                borderRadius: 6,
                border: "1px solid #27272a",
                backgroundColor: "#0f0f14",
                fontSize: 12,
                color: "#f4f4f0",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: textColor }}
              iconSize={8}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="voltageSag"
              name="Sag (V)"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={{ r: 2, fill: "#a78bfa", stroke: "#0c0c14", strokeWidth: 1.5 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="resistance"
              name="Resistance (mΩ)"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 2, fill: "#f97316", stroke: "#0c0c14", strokeWidth: 1.5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="capacity"
              name="Capacity (Ah)"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ r: 2, fill: "#34d399", stroke: "#0c0c14", strokeWidth: 1.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
