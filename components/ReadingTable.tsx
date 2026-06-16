import type { BatteryReading } from "@/lib/types";

function formatTime(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function scoreBadge(score: number) {
  if (score >= 80) return "bg-emerald-900/50 text-emerald-300 border border-emerald-800/40";
  if (score >= 60) return "bg-amber-900/50 text-amber-300 border border-amber-800/40";
  return "bg-red-900/50 text-red-300 border border-red-800/40";
}

export default function ReadingTable({
  readings,
}: {
  readings: BatteryReading[];
}) {
  if (readings.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800/50 bg-[#0c0c14]">
      <div className="border-b border-zinc-800/50 px-4 py-2.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-600/70">
          Match Log
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800/40 bg-zinc-900/30 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Team</th>
              <th className="px-3 py-2 font-medium">Battery</th>
              <th className="px-3 py-2 font-medium">Model</th>
              <th className="px-3 py-2 font-medium">Sag (V)</th>
              <th className="px-3 py-2 font-medium">Resistance</th>
              <th className="px-3 py-2 font-medium">Capacity</th>
              <th className="px-3 py-2 font-medium">Recovery (s)</th>
              <th className="px-3 py-2 font-medium">Temp (°C)</th>
              <th className="px-3 py-2 font-medium">Health</th>
            </tr>
          </thead>
          <tbody>
            {[...readings].reverse().map((r) => (
              <tr
                key={r.id}
                className="border-b border-zinc-800/20 last:border-0 hover:bg-zinc-800/15"
              >
                <td className="whitespace-nowrap px-3 py-2 text-xs text-zinc-500">{formatTime(r.recordedAt)}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">{r.teamNumber}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">{r.batteryLabel}</td>
                <td className="px-3 py-2 text-xs text-zinc-400">{r.batteryModel || "—"}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">{r.voltageSag.toFixed(2)}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">{r.resistance.toFixed(2)}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">{r.capacity.toFixed(1)}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">{r.recoveryTime.toFixed(1)}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">{r.avgTemp.toFixed(1)}</td>
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
