"use client";

import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "battery_team_number";

export default function TeamSelector() {
  const [teamNumber, setTeamNumber] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTeamNumber(stored);
      setInput(stored);
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleApply() {
    const trimmed = input.trim();
    if (!trimmed || isNaN(Number(trimmed)) || Number(trimmed) <= 0) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    setTeamNumber(trimmed);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md border border-zinc-800/50 bg-zinc-900/50 px-2.5 py-1 text-xs hover:bg-zinc-800/50 transition-colors"
      >
        {teamNumber ? (
          <>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              Team
            </span>
            <span className="font-bold text-amber-400">#{teamNumber}</span>
          </>
        ) : (
          <span className="text-zinc-500">Set Team</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 rounded-lg border border-zinc-800 bg-[#0f0f14] p-3 shadow-lg z-50 animate-fade-in">
          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              Team Number
            </span>
            <input
              type="number"
              step="1"
              min="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApply();
              }}
              placeholder="e.g. 12563"
              autoFocus
              className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-amber-600/50 focus:border-amber-600/60 focus:ring-2"
            />
          </label>
          <button
            onClick={handleApply}
            disabled={!input.trim() || isNaN(Number(input.trim())) || Number(input.trim()) <= 0}
            className="mt-2 w-full rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-black transition-all hover:bg-amber-500 disabled:opacity-40"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
