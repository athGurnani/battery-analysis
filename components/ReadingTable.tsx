"use client";

import { useState, useMemo } from "react";
import type { BatteryReading } from "@/lib/types";

type SortableKey = keyof BatteryReading;

const SORTABLE_COLUMNS: { key: SortableKey; label: string }[] = [
  { key: "recordedAt", label: "Time" },
  { key: "teamNumber", label: "Team" },
  { key: "batteryLabel", label: "Battery" },
  { key: "batteryModel", label: "Model" },
  { key: "voltageSag", label: "Sag (V)" },
  { key: "resistance", label: "Resistance" },
  { key: "capacity", label: "Capacity" },
  { key: "recoveryTime", label: "Recovery (s)" },
  { key: "avgTemp", label: "Temp (°C)" },
  { key: "healthScore", label: "Health" },
];

function formatTime(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function scoreBadge(score: number) {
  if (score >= 80) return "bg-emerald-900/50 text-emerald-300 border border-emerald-800/40";
  if (score >= 60) return "bg-amber-900/50 text-amber-300 border border-amber-800/40";
  return "bg-red-900/50 text-red-300 border border-red-800/40";
}

function scoreRowBg(score: number) {
  if (score >= 80) return "bg-emerald-950/10";
  if (score >= 60) return "bg-amber-950/10";
  return "bg-red-950/10";
}

export default function ReadingTable({
  readings,
}: {
  readings: BatteryReading[];
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortableKey>("recordedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    if (!search.trim()) return readings;
    const q = search.toLowerCase();
    return readings.filter(
      (r) =>
        r.batteryLabel.toLowerCase().includes(q) ||
        r.batteryModel.toLowerCase().includes(q) ||
        String(r.teamNumber).includes(q) ||
        String(r.healthScore).includes(q)
    );
  }, [readings, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortableKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "recordedAt" ? "desc" : "asc");
    }
  }

  if (readings.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800/50 bg-[#0c0c14]">
      <div className="flex items-center gap-3 border-b border-zinc-800/50 px-4 py-2.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-600/70">
          Match Log
        </h3>
        <div className="ml-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by battery, team, model…"
            className="w-48 rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-xs text-zinc-200 outline-none ring-amber-600/50 placeholder:text-zinc-600 focus:border-amber-600/60 focus:ring-2"
          />
        </div>
      </div>
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-zinc-800/40 bg-zinc-900 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              {SORTABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="cursor-pointer select-none px-3 py-2 font-medium transition-colors hover:text-zinc-400"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-amber-500 text-[9px]">
                        {sortDir === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr
                key={r.id}
                className={`border-b border-zinc-800/20 last:border-0 transition-colors hover:bg-zinc-800/15 ${scoreRowBg(r.healthScore)}`}
              >
                <td className="whitespace-nowrap px-3 py-2 text-xs text-zinc-500">
                  {formatTime(r.recordedAt)}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">
                  {r.teamNumber}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">
                  {r.batteryLabel}
                </td>
                <td className="px-3 py-2 text-xs text-zinc-400">
                  {r.batteryModel || "—"}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">
                  {r.voltageSag.toFixed(2)}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">
                  {r.resistance.toFixed(2)}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">
                  {r.capacity.toFixed(1)}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">
                  {r.recoveryTime.toFixed(1)}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">
                  {r.avgTemp.toFixed(1)}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-semibold ${scoreBadge(r.healthScore)}`}
                  >
                    {r.healthScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
