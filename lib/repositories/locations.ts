import { familyLocations as mockLocations, places as mockPlaces, profiles as mockProfiles, schedules as mockSchedules } from "@/data/mock-data";
import { createClient } from "@/lib/supabase/server";
import { shouldUseDemoData } from "@/lib/config";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { getFamilyPreferences } from "@/lib/repositories/family-preferences";
import { getProfileBoardData } from "@/lib/repositories/profiles";
import { FamilyLocation, FamilyPreferences, PlaceRegistration, Profile, ScheduleItem } from "@/types/domain";
import type { Database } from "@/types/supabase";

export interface LocationBoardData {
  familyLocations: FamilyLocation[];
  places: PlaceRegistration[];
  schedules: ScheduleItem[];
  profiles: Profile[];
  preferences: FamilyPreferences;
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

function formatDateInput(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export async function getLocationBoardData(): Promise<LocationBoardData> {
  if (await shouldUseDemoData()) {
    return {
      familyLocations: mockLocations,
      places: mockPlaces,
      schedules: mockSchedules,
      profiles: mockProfiles,
      preferences: await getFamilyPreferences()
    };
  }

  const context = await getCurrentAppContext();
  const supabase = await createClient();
  const [locationsResult, placesResult, schedulesResult, profileBoard, preferences] = await Promise.all([
    supabase
      .from("locations")
      .select("id, user_id, family_id, place_id, label, lat, lng, share_mode, captured_at")
      .eq("family_id", context.familyId)
      .order("captured_at", { ascending: false })
      .returns<
        Pick<
          Database["public"]["Tables"]["locations"]["Row"],
          "id" | "user_id" | "family_id" | "place_id" | "label" | "lat" | "lng" | "share_mode" | "captured_at"
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
    getProfileBoardData(context.familyId),
    getFamilyPreferences(context.familyId)
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
      placeId: item.place_id ?? undefined,
      lat: item.lat ?? undefined,
      lng: item.lng ?? undefined
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
      dateValue: formatDateInput(item.starts_at),
      startTime: formatTime(item.starts_at),
      endTime: formatTime(item.ends_at),
      ownerId: item.owner_id ?? undefined,
      placeId: item.place_id ?? undefined,
      type: item.type as ScheduleItem["type"],
      sourceMessageId: item.source_message_id ?? undefined,
      note: item.note ?? undefined
    })),
    profiles: profileBoard.profiles,
    preferences
  };
}

export async function createPlaceRegistration(input: {
  familyId: string;
  name: string;
  category: PlaceRegistration["category"];
  address: string;
  lat?: number;
  lng?: number;
  color?: string;
}) {
  if (await shouldUseDemoData()) {
    return { mode: "mock" as const };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("place_registrations")
    .insert({
      family_id: input.familyId,
      name: input.name,
      category: input.category,
      address: input.address || null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      color: input.color ?? "bg-sky"
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    throw error ?? new Error("Failed to create place registration");
  }

  return { mode: "supabase" as const, id: data.id };
}

export async function captureLocation(input: {
  familyId: string;
  userId: string;
  label: string;
  lat?: number;
  lng?: number;
  placeId?: string;
  shareMode?: "manual" | "auto";
}) {
  if (await shouldUseDemoData()) {
    return { mode: "mock" as const };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .insert({
      family_id: input.familyId,
      user_id: input.userId,
      label: input.label,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      place_id: input.placeId ?? null,
      share_mode: input.shareMode ?? null
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    throw error ?? new Error("Failed to capture location");
  }

  return { mode: "supabase" as const, id: data.id };
}
