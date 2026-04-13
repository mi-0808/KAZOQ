"use server";

import { revalidatePath } from "next/cache";
import { captureLocation, createPlaceRegistration } from "@/lib/repositories/locations";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { PlaceRegistration } from "@/types/domain";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

const categories: PlaceRegistration["category"][] = ["学校", "習い事", "塾", "職場", "旅行先", "その他"];
const colors = ["bg-orange", "bg-sky", "bg-mint", "bg-lavender", "bg-blush"];

export async function createPlaceRegistrationAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const name = normalizeText(formData.get("name"));
  const category = normalizeText(formData.get("category")) as PlaceRegistration["category"];

  if (!name || !categories.includes(category)) {
    return;
  }

  await createPlaceRegistration({
    familyId: context.familyId,
    name,
    category,
    address: normalizeText(formData.get("address")),
    color: colors[Math.floor(Math.random() * colors.length)]
  });

  revalidatePath("/locations");
  revalidatePath(`/rooms/${context.familyId}`);
}

export async function captureLocationAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const label = normalizeText(formData.get("label"));
  const lat = Number(normalizeText(formData.get("lat")));
  const lng = Number(normalizeText(formData.get("lng")));

  if (!label) {
    return;
  }

  await captureLocation({
    familyId: context.familyId,
    userId: context.appUserId,
    label,
    lat: Number.isFinite(lat) ? lat : undefined,
    lng: Number.isFinite(lng) ? lng : undefined,
    placeId: normalizeText(formData.get("placeId")) || undefined,
    shareMode: normalizeText(formData.get("shareMode")) === "auto" ? "auto" : "manual"
  });

  revalidatePath("/locations");
  revalidatePath("/home");
  revalidatePath(`/rooms/${context.familyId}`);
}
