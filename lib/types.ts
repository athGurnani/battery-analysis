export interface SubmitPayload {
  resistance: number;
  avgTemp: number;
  voltageSag: number;
  capacity: number;
  recoveryTime: number;
  teamNumber: number;
  batteryLabel: string;
  batteryModel: string;
}

export interface TestRun {
  id: string;
  internal_resistance: number;
  avg_temp: number;
  voltage_sag: number;
  capacity: number;
  recovery_time: number;
  team_number: number;
  battery_label: string;
  battery_model: string;
  health_score: number;
  created_at?: string;
}

export interface BatteryReading {
  id: string;
  testRunId: string;
  resistance: number;
  avgTemp: number;
  voltageSag: number;
  capacity: number;
  recoveryTime: number;
  teamNumber: number;
  batteryLabel: string;
  batteryModel: string;
  healthScore: number;
  recordedAt: string;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";
