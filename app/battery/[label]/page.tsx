import { fetchReadings } from "@/lib/readings";
import BatteryDetailClient from "@/components/BatteryDetailClient";

export default async function BatteryPage({
  params,
}: {
  params: Promise<{ label: string }>;
}) {
  const { label } = await params;
  const allReadings = await fetchReadings();
  const decodedLabel = decodeURIComponent(label);
  const readings = allReadings.filter(
    (r) => r.batteryLabel === decodedLabel,
  );
  return <BatteryDetailClient label={decodedLabel} readings={readings} />;
}
