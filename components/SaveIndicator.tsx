import type { SaveStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  SaveStatus,
  { label: string; dot: string; text: string }
> = {
  idle: { label: "Ready", dot: "bg-zinc-400", text: "text-zinc-500" },
  saving: { label: "Saving…", dot: "bg-amber-400 animate-pulse", text: "text-amber-600" },
  saved: { label: "Saved to database", dot: "bg-emerald-500", text: "text-emerald-600" },
  error: { label: "Save failed", dot: "bg-red-500", text: "text-red-600" },
};

export default function SaveIndicator({ status }: { status: SaveStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <div className={`flex items-center gap-2 text-sm ${config.text}`}>
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}
