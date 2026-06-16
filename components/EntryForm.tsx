"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { encodeBatteryHealth } from "@/lib/encoding";

const STORAGE_KEY = "battery_team_number";

const BATTERY_MODELS = [
    "REV",
    "REV Slim",
    "Tetrix",
    "GoBILDA",
    "Modern Robotics",
    "Other",
];

const EMPTY_FORM = {
    resistance: "",
    avgTemp: "",
    voltageSag: "",
    capacity: "",
    recoveryTime: "",
    batteryLabel: "",
    batteryModel: "Other",
};

function parseForm(form: typeof EMPTY_FORM, teamNumber: number) {
    return {
        resistance: Number(form.resistance),
        avgTemp: Number(form.avgTemp),
        voltageSag: Number(form.voltageSag),
        capacity: Number(form.capacity),
        recoveryTime: Number(form.recoveryTime),
        teamNumber,
        batteryLabel: form.batteryLabel.trim(),
        batteryModel: form.batteryModel,
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
    const [teamNumber, setTeamNumber] = useState<number | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const n = Number(stored);
            if (Number.isFinite(n) && n > 0) setTeamNumber(n);
        }
    }, []);

    const noTeam = teamNumber === null;

    const payload = (() => {
        if (teamNumber === null) return null;
        const parsed = parseForm(form, teamNumber);
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
        <div className="rounded-lg border border-zinc-800/50 bg-[#0c0c14] p-5">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-zinc-100">Log Reading</h3>
                <p className="mt-0.5 text-xs text-zinc-600">
                    Record battery data from the latest match run.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {noTeam && (
                    <div className="rounded-md border border-amber-900/40 bg-amber-950/20 px-3 py-2">
                        <p className="text-xs text-amber-400">
                            Set your team number in the top-right corner first.
                        </p>
                    </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                        <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                            Battery Label
                        </span>
                        <input
                            type="text"
                            value={form.batteryLabel}
                            onChange={(e) => updateField("batteryLabel", e.target.value)}
                            placeholder="e.g. Battery A"
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-amber-600/50 focus:border-amber-600/60 focus:ring-2"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                            Battery Model
                        </span>
                        <select
                            value={form.batteryModel}
                            onChange={(e) => updateField("batteryModel", e.target.value)}
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-amber-600/50 focus:border-amber-600/60 focus:ring-2"
                        >
                            {BATTERY_MODELS.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                            Voltage Sag (V)
                        </span>
                        <input
                            type="number" step="0.01" min="0"
                            value={form.voltageSag}
                            onChange={(e) => updateField("voltageSag", e.target.value)}
                            placeholder="e.g. 0.50"
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-amber-600/50 focus:border-amber-600/60 focus:ring-2"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                            Internal Resistance (mΩ)
                        </span>
                        <input
                            type="number" step="0.01" min="0"
                            value={form.resistance}
                            onChange={(e) => updateField("resistance", e.target.value)}
                            placeholder="e.g. 0.45"
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-amber-600/50 focus:border-amber-600/60 focus:ring-2"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                            Capacity (Ah)
                        </span>
                        <input
                            type="number" step="0.1" min="0"
                            value={form.capacity}
                            onChange={(e) => updateField("capacity", e.target.value)}
                            placeholder="e.g. 3.0"
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-amber-600/50 focus:border-amber-600/60 focus:ring-2"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                            Recovery Time (s)
                        </span>
                        <input
                            type="number" step="0.1" min="0"
                            value={form.recoveryTime}
                            onChange={(e) => updateField("recoveryTime", e.target.value)}
                            placeholder="e.g. 15.0"
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-amber-600/50 focus:border-amber-600/60 focus:ring-2"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                            Avg Temperature (°C)
                        </span>
                        <input
                            type="number" step="0.1"
                            value={form.avgTemp}
                            onChange={(e) => updateField("avgTemp", e.target.value)}
                            placeholder="e.g. 22"
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-amber-600/50 focus:border-amber-600/60 focus:ring-2"
                        />
                    </label>
                </div>

                {preview !== null && allFilled && (
                    <div className="flex items-center gap-3 rounded-md border border-amber-900/40 bg-amber-950/20 px-3 py-2.5 animate-fade-in">
                        <span className="text-xs text-zinc-500">Health preview:</span>
                        <span className="text-lg font-bold text-amber-400">{preview}</span>
                        <span className="text-[10px] text-zinc-600">/ 100</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!payload || saving}
                    className="w-full rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {saving ? "Saving…" : "Submit Reading"}
                </button>
            </form>

            {successMessage && (
                <p className="mt-2 text-xs text-emerald-400">{successMessage}</p>
            )}
            {errorMessage && (
                <p className="mt-2 text-xs text-red-400">{errorMessage}</p>
            )}
        </div>
    );
}
