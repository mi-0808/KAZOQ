import { familyLocations as mockLocations, places as mockPlaces, profiles as mockProfiles, schedules as mockSchedules } from "@/data/mock-data";
import { createClient } from "@/lib/supabase/server";
import { shouldUseDemoData } from "@/lib/config";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { getProfileBoardData } from "@/lib/repositories/profiles";
import { FamilyLocation, PlaceRegistration, Profile, ScheduleItem } from "@/types/domain";
import type { Database } from "@/types/supabase";

export interface LocationBoardData {
  familyLocations: FamilyLocation[];
  places: PlaceRegistration[];
  schedules: ScheduleItem[];
  profiles: Profile[];
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric"
  }).format(new Date(value));
}

export async function getLocationBoardData(): Promise<LocationBoardData> {
  if (await shouldUseDemoData()) {
    return {
      familyLocations: mockLocations,
      places: mockPlaces,
      schedules: mockSchedules,
      profiles: mockProfiles
    };
  }

  const context = await getCurrentAppContext();
  const supabase = await createClient();
  const [locationsResult, placesResult, schedulesResult, profileBoard] = await Promise.all([
    supabase
      .from("locations")
      .select("id, user_id, family_id, place_id, label, captured_at")
      .eq("family_id", context.familyId)
      .order("captured_at", { ascending: false })
      .returns<
        Pick<
          Database["public"]["Tables"]["locations"]["Row"],
          "id" | "user_id" | "family_id" | "place_id" | "label" | "captured_at"
        >[]
      >(),
    supabase
      .from("place_registrations")
      .select("id, family_id, name, category, address, lat, lng, color")
      .eq("family_id", context.familyId)
      .returns<
        Pick<
          Database["public"]["Tables"]["place_registrations"]["Row"],
          "id" | "family_id" | "name" | "category" | "address" | "lat" | "lng" | "color"
        >[]
      >(),
    supabase
      .from("schedules")
      .select("id, family_id, title, starts_at, ends_at, owner_id, place_id, type, source_message_id, note")
      .eq("family_id", context.familyId)
      .order("starts_at", { ascending: true })
      .returns<
        Pick<
          Database["public"]["Tables"]["schedules"]["Row"],
          "id" | "family_id" | "title" | "starts_at" | "ends_at" | "owner_id" | "place_id" | "type" | "source_message_id" | "note"
        >[]
      >(),
    getProfileBoardData(context.familyId)
  ]);

  if (locationsResult.error || placesResult.error || schedulesResult.error) {
    throw locationsResult.error ?? placesResult.error ?? schedulesResult.error;
  }

  const latestByUser = new Map<string, (typeof locationsResult.data)[number]>();

  for (const location of locationsResult.data ?? []) {
    if (!latestByUser.has(location.user_id)) {
      latestByUser.set(location.user_id, location);
    }
  }

  return {
    familyLocations: Array.from(latestByUser.values()).map((item) => ({
      id: item.id,
      userId: item.user_id,
      label: item.label ?? "現在地はまだ登録されていません",
      updatedAt: formatTime(item.captured_at),
      placeId: item.place_id ?? undefined
    })),
    places: (placesResult.data ?? []).map((item) => ({
      id: item.id,
      familyId: item.family_id,
      name: item.name,
      category: item.category as PlaceRegistration["category"],
      address: item.address ?? "",
      lat: item.lat ?? 0,
      lng: item.lng ?? 0,
      color: item.color ?? "bg-sky"
    })),
    schedules: (schedulesResult.data ?? []).map((item) => ({
      id: item.id,
      familyId: item.family_id,
      title: item.title,
      date: formatDate(item.starts_at),
      startTime: formatTime(item.starts_at),
      endTime: formatTime(item.ends_at),
      ownerId: item.owner_id ?? undefined,
      placeId: item.place_id ?? undefined,
      type: item.type as ScheduleItem["type"],
      sourceMessageId: item.source_message_id ?? undefined,
      note: item.note ?? undefined
    })),
    profiles: profileBoard.profiles
  };
}
