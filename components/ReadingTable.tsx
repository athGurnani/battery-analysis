import type { BatteryReading } from "@/lib/types";

function formatTime(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function scoreBadge(score: number) {
  if (score >= 80) return "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50";
  if (score >= 60) return "bg-amber-900/60 text-amber-300 border border-amber-700/50";
  return "bg-red-900/60 text-red-300 border border-red-700/50";
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
    <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-[#0c0c14] shadow-sm">
      <div className="border-b border-zinc-800/60 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-500/80">
          All Readings
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800/60 bg-zinc-900/40 text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Team</th>
              <th className="px-4 py-3 font-medium">Battery</th>
              <th className="px-4 py-3 font-medium">Sag (V)</th>
              <th className="px-4 py-3 font-medium">Resistance</th>
              <th className="px-4 py-3 font-medium">Capacity</th>
              <th className="px-4 py-3 font-medium">Recovery (s)</th>
              <th className="px-4 py-3 font-medium">Avg Temp (°C)</th>
              <th className="px-4 py-3 font-medium">Health</th>
            </tr>
          </thead>
          <tbody>
            {[...readings].reverse().map((r) => (
              <tr
                key={r.id}
                className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20"
              >
                <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{formatTime(r.recordedAt)}</td>
                <td className="px-4 py-3 font-mono text-zinc-200">{r.teamNumber}</td>
                <td className="px-4 py-3 font-mono text-zinc-200">{r.batteryLabel}</td>
                <td className="px-4 py-3 font-mono text-zinc-200">{r.voltageSag.toFixed(2)}</td>
                <td className="px-4 py-3 font-mono text-zinc-200">{r.resistance.toFixed(2)}</td>
                <td className="px-4 py-3 font-mono text-zinc-200">{r.capacity.toFixed(1)}</td>
                <td className="px-4 py-3 font-mono text-zinc-200">{r.recoveryTime.toFixed(1)}</td>
                <td className="px-4 py-3 font-mono text-zinc-200">{r.avgTemp.toFixed(1)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreBadge(r.healthScore)}`}
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
