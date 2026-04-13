import { places as mockPlaces, profiles as mockProfiles, schedules as mockSchedules } from "@/data/mock-data";
import { createClient } from "@/lib/supabase/server";
import { shouldUseDemoData } from "@/lib/config";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { getProfileBoardData } from "@/lib/repositories/profiles";
import { PlaceRegistration, Profile, ScheduleItem } from "@/types/domain";
import type { Database } from "@/types/supabase";

export interface CalendarBoardData {
  weekDays: { day: string; date: string }[];
  schedules: ScheduleItem[];
  places: PlaceRegistration[];
  profiles: Profile[];
}

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric"
  }).format(new Date(value));
}

function formatWeekday(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    weekday: "short"
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function buildWeekDays(schedules: ScheduleItem[]) {
  const uniqueDates = Array.from(new Set(schedules.map((item) => item.date)));

  if (uniqueDates.length > 0) {
    return uniqueDates.slice(0, 4).map((date) => ({
      day: formatWeekday(`2026/${date}`),
      date
    }));
  }

  const today = new Date();

  return Array.from({ length: 4 }, (_, index) => {
    const value = new Date(today);
    value.setDate(today.getDate() + index);

    return {
      day: formatWeekday(value.toISOString()),
      date: formatDateLabel(value.toISOString())
    };
  });
}

export async function getCalendarBoardData(): Promise<CalendarBoardData> {
  if (await shouldUseDemoData()) {
    return {
      weekDays: [
        { day: "金", date: "4/11" },
        { day: "土", date: "4/12" },
        { day: "日", date: "4/13" },
        { day: "月", date: "4/14" }
      ],
      schedules: mockSchedules,
      places: mockPlaces,
      profiles: mockProfiles
    };
  }

  const context = await getCurrentAppContext();
  const supabase = await createClient();
  const [scheduleResult, placesResult, profileBoard] = await Promise.all([
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
    getProfileBoardData(context.familyId)
  ]);

  if (scheduleResult.error || placesResult.error) {
    throw scheduleResult.error ?? placesResult.error;
  }

  const schedules = (scheduleResult.data ?? []).map((item) => ({
    id: item.id,
    familyId: item.family_id,
    title: item.title,
    date: formatDateLabel(item.starts_at),
    startTime: formatTime(item.starts_at),
    endTime: formatTime(item.ends_at),
    ownerId: item.owner_id ?? undefined,
    placeId: item.place_id ?? undefined,
    type: item.type as ScheduleItem["type"],
    sourceMessageId: item.source_message_id ?? undefined,
    note: item.note ?? undefined
  }));

  const places = (placesResult.data ?? []).map((item) => ({
    id: item.id,
    familyId: item.family_id,
    name: item.name,
    category: item.category as PlaceRegistration["category"],
    address: item.address ?? "",
    lat: item.lat ?? 0,
    lng: item.lng ?? 0,
    color: item.color ?? "bg-sky"
  }));

  return {
    weekDays: buildWeekDays(schedules),
    schedules,
    places,
    profiles: profileBoard.profiles
  };
}
