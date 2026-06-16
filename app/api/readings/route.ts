import { NextResponse } from "next/server";
import { fetchReadings } from "@/lib/readings";

export async function GET() {
  const readings = await fetchReadings();
  return NextResponse.json({ readings });
}
