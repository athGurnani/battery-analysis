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
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-700/60 bg-[#0c0c14] text-zinc-500">
        No readings yet — add data below to populate the chart.
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

  const gridColor = "#1e293b";
  const textColor = "#71717a";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800/60 bg-[#0c0c14] p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-500/80">
          Health Score Over Time
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: textColor }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: textColor }} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #1e293b",
                backgroundColor: "#14141f",
                fontSize: 13,
                color: "#e4e4f0",
              }}
            />
            <Line
              type="monotone"
              dataKey="healthScore"
              name="Health Score"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
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

      <div className="rounded-xl border border-zinc-800/60 bg-[#0c0c14] p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-500/80">
          Sag, Resistance & Recovery
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: textColor }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: textColor }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: textColor }} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #1e293b",
                backgroundColor: "#14141f",
                fontSize: 13,
                color: "#e4e4f0",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: textColor }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="voltageSag"
              name="Voltage Sag (V)"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={{ r: 3, fill: "#a78bfa", stroke: "#0c0c14", strokeWidth: 2 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="recoveryTime"
              name="Recovery Time (s)"
              stroke="#f472b6"
              strokeWidth={2}
              dot={{ r: 3, fill: "#f472b6", stroke: "#0c0c14", strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="resistance"
              name="Resistance (mΩ)"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3, fill: "#f59e0b", stroke: "#0c0c14", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-zinc-800/60 bg-[#0c0c14] p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-500/80">
          Capacity & Temperature
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: textColor }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: textColor }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: textColor }} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #1e293b",
                backgroundColor: "#14141f",
                fontSize: 13,
                color: "#e4e4f0",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: textColor }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="capacity"
              name="Capacity (Ah)"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ r: 3, fill: "#34d399", stroke: "#0c0c14", strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgTemp"
              name="Avg Temp (°C)"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ r: 3, fill: "#06b6d4", stroke: "#0c0c14", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
