'use client'

import { useState, useEffect } from "react";

const STORAGE_KEY = "battery_team_number";

export default function TeamBadge() {
  const [teamNumber, setTeamNumber] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setTeamNumber(stored);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setTeamNumber(e.newValue);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!teamNumber) return null;

  return (
    <div className="ml-auto flex items-center gap-2 rounded-lg border border-zinc-800/60 bg-zinc-900/50 px-3 py-1.5 text-sm">
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        Team
      </span>
      <span className="font-semibold text-cyan-400">#{teamNumber}</span>
    </div>
  );
}
