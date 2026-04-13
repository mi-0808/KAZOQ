import { LocationBoard } from "@/components/locations/location-board";
import { RealtimeRefresh } from "@/components/shared/realtime-refresh";
import { getLocationBoardData } from "@/lib/repositories/locations";

export default async function LocationsPage() {
  const data = await getLocationBoardData();

  return (
    <>
      <RealtimeRefresh tables={["locations", "place_registrations", "schedules", "families"]} />
      <LocationBoard data={data} />
    </>
  );
}
