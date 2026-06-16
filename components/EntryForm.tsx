"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { encodeBatteryHealth } from "@/lib/encoding";

const EMPTY_FORM = {
  resistance: "",
  avgTemp: "",
  voltageSag: "",
  capacity: "",
  recoveryTime: "",
  teamNumber: "",
  batteryLabel: "",
};

function parseForm(form: typeof EMPTY_FORM) {
  return {
    resistance: Number(form.resistance),
    avgTemp: Number(form.avgTemp),
    voltageSag: Number(form.voltageSag),
    capacity: Number(form.capacity),
    recoveryTime: Number(form.recoveryTime),
    teamNumber: Number(form.teamNumber),
    batteryLabel: form.batteryLabel.trim(),
  };
}

function isValidPayload(payload: ReturnType<typeof parseForm>) {
  return (
    !Object.values(payload).some((v) => typeof v === "number" && Number.isNaN(v)) &&
    payload.resistance >= 0 &&
    payload.voltageSag >= 0 &&
    payload.capacity >= 0 &&
    payload.recoveryTime >= 0 &&
    Number.isFinite(payload.teamNumber) &&
    payload.teamNumber > 0 &&
    payload.batteryLabel.length > 0
  );
}

export default function EntryForm() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const payload = (() => {
    const parsed = parseForm(form);
    if (!isValidPayload(parsed)) return null;
    return parsed;
  })();

  const preview = payload ? encodeBatteryHealth(payload.resistance, payload.avgTemp) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!payload) return;

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Failed to save");
        return;
      }

      setSuccessMessage("Reading saved");
      setForm(EMPTY_FORM);
      router.refresh();
    } catch {
      setErrorMessage("Network error — check your connection");
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccessMessage("");
  }

  const allFilled = Object.values(form).every((v) => v.trim() !== "");

  return (
    <div className="group rounded-xl border border-zinc-800/60 bg-[#0c0c14] p-6 shadow-sm transition-all duration-300 hover:border-cyan-700/50 hover:shadow-[0_0_16px_rgba(34,211,238,0.08)]">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-zinc-100">Add Reading</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Fill in the fields and click submit to save.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Team Number
            </span>
            <input
              type="number" step="1" min="1"
              value={form.teamNumber}
              onChange={(e) => updateField("teamNumber", e.target.value)}
              placeholder="e.g. 12563"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 outline-none ring-cyan-600/50 focus:border-cyan-600/60 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Battery Label
            </span>
            <input
              type="text"
              value={form.batteryLabel}
              onChange={(e) => updateField("batteryLabel", e.target.value)}
              placeholder="e.g. Battery A"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 outline-none ring-cyan-600/50 focus:border-cyan-600/60 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Voltage Sag (V)
            </span>
            <input
              type="number" step="0.01" min="0"
              value={form.voltageSag}
              onChange={(e) => updateField("voltageSag", e.target.value)}
              placeholder="e.g. 0.50"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 outline-none ring-cyan-600/50 focus:border-cyan-600/60 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Internal Resistance (mΩ)
            </span>
            <input
              type="number" step="0.01" min="0"
              value={form.resistance}
              onChange={(e) => updateField("resistance", e.target.value)}
              placeholder="e.g. 0.45"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 outline-none ring-cyan-600/50 focus:border-cyan-600/60 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Capacity (Ah)
            </span>
            <input
              type="number" step="0.1" min="0"
              value={form.capacity}
              onChange={(e) => updateField("capacity", e.target.value)}
              placeholder="e.g. 3.0"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 outline-none ring-cyan-600/50 focus:border-cyan-600/60 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Recovery Time (s)
            </span>
            <input
              type="number" step="0.1" min="0"
              value={form.recoveryTime}
              onChange={(e) => updateField("recoveryTime", e.target.value)}
              placeholder="e.g. 15.0"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 outline-none ring-cyan-600/50 focus:border-cyan-600/60 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Avg Temperature (°C)
            </span>
            <input
              type="number" step="0.1"
              value={form.avgTemp}
              onChange={(e) => updateField("avgTemp", e.target.value)}
              placeholder="e.g. 22"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 outline-none ring-cyan-600/50 focus:border-cyan-600/60 focus:ring-2"
            />
          </label>
        </div>

        {preview !== null && allFilled && (
          <div className="flex items-center gap-3 rounded-lg border border-cyan-900/50 bg-cyan-950/30 px-4 py-3 animate-fade-in">
            <span className="text-sm text-zinc-400">Predicted health score:</span>
            <span className="text-2xl font-bold text-cyan-400">{preview}</span>
            <span className="text-xs text-zinc-500">/ 100</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!allFilled || saving}
          className={`w-full rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40 shadow-[0_0_8px_rgba(34,211,238,0.25)] hover:shadow-[0_0_14px_rgba(34,211,238,0.45)] ${allFilled && !saving ? "animate-glow-pulse" : ""}`}
        >
          {saving ? "Saving…" : "Submit Reading"}
        </button>
      </form>

      {successMessage && (
        <p className="mt-3 text-sm text-emerald-400">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mt-3 text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
