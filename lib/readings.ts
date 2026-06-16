import { getServerClient } from "@/lib/supabase";
import type { BatteryReading, TestRun } from "@/lib/types";

function toReading(run: TestRun): BatteryReading {
  return {
    id: run.id,
    testRunId: run.id,
    resistance: run.internal_resistance ?? 0,
    avgTemp: run.avg_temp ?? 0,
    voltageSag: run.voltage_sag ?? 0,
    capacity: run.capacity ?? 0,
    recoveryTime: run.recovery_time ?? 0,
    teamNumber: run.team_number ?? 0,
    batteryLabel: run.battery_label ?? "",
    batteryModel: run.battery_model ?? "",
    healthScore: run.health_score ?? 0,
    recordedAt: run.created_at ?? "",
  };
}

export async function fetchReadings(): Promise<BatteryReading[]> {
  const { data, error } = await getServerClient()
    .from("test_runs")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch readings:", error.message);
    return [];
  }

  return (data as TestRun[]).map(toReading);
}
