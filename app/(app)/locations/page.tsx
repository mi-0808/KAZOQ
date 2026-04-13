import { LocationBoard } from "@/components/locations/location-board";
import { getLocationBoardData } from "@/lib/repositories/locations";

export default async function LocationsPage() {
  const data = await getLocationBoardData();

  return <LocationBoard data={data} />;
}
