import { fetchReadings } from "@/lib/readings";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  const readings = await fetchReadings();

  return <DashboardClient readings={readings} />;
}
