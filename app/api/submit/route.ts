import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";
import { encodeBatteryHealth } from "@/lib/encoding";
import type { SubmitPayload } from "@/lib/types";

function parsePayload(body: unknown): SubmitPayload | null {
  if (!body || typeof body !== "object") return null;

  const {
    resistance, avgTemp, voltageSag, capacity, recoveryTime,
    teamNumber, batteryLabel, batteryModel,
  } = body as Record<string, unknown>;

  const parsed = {
    resistance: Number(resistance),
    avgTemp: Number(avgTemp),
    voltageSag: Number(voltageSag),
    capacity: Number(capacity),
    recoveryTime: Number(recoveryTime),
    teamNumber: Number(teamNumber),
    batteryLabel: String(batteryLabel ?? "").trim(),
    batteryModel: String(batteryModel ?? "").trim(),
  };

  if (
    Object.values(parsed).some((v) => Number.isNaN(v)) ||
    parsed.resistance < 0 ||
    parsed.voltageSag < 0 ||
    parsed.capacity < 0 ||
    parsed.recoveryTime < 0 ||
    !Number.isFinite(parsed.teamNumber) ||
    parsed.teamNumber <= 0 ||
    !parsed.batteryLabel
  ) {
    return null;
  }

  return parsed;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = parsePayload(body);

    if (!payload) {
      return NextResponse.json(
        { error: "All fields are required with valid values." },
        { status: 400 }
      );
    }

    const healthScore = encodeBatteryHealth(
      payload.resistance,
      payload.avgTemp
    );

    const { data: run, error: runError } = await getServerClient()
      .from("test_runs")
      .insert({
        internal_resistance: payload.resistance,
        avg_temp: payload.avgTemp,
        voltage_sag: payload.voltageSag,
        capacity: payload.capacity,
        recovery_time: payload.recoveryTime,
        team_number: payload.teamNumber,
        battery_label: payload.batteryLabel,
        battery_model: payload.batteryModel,
        health_score: healthScore,
      })
      .select()
      .single();

    if (runError || !run) {
      return NextResponse.json(
        { error: runError?.message ?? "Failed to save test run" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reading: {
        id: run.id,
        testRunId: run.id,
        resistance: run.internal_resistance,
        avgTemp: run.avg_temp,
        voltageSag: run.voltage_sag,
        capacity: run.capacity,
        recoveryTime: run.recovery_time,
        teamNumber: run.team_number,
        batteryLabel: run.battery_label,
        batteryModel: run.battery_model,
        healthScore: run.health_score,
        recordedAt: run.created_at,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
