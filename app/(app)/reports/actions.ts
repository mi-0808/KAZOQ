"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { createFamilyReport, updateFamilyReport } from "@/lib/repositories/family-reports";
import { FamilyReportKind, FamilyReportStatus } from "@/types/domain";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

const reportKinds: FamilyReportKind[] = ["ご飯連絡", "欠食届", "外泊届", "お迎え相談", "帰宅連絡"];
const reportStatuses: FamilyReportStatus[] = ["確認待ち", "進行中", "完了"];

export async function createFamilyReportAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const kind = normalizeText(formData.get("kind")) as FamilyReportKind;
  const title = normalizeText(formData.get("title"));
  const summary = normalizeText(formData.get("summary"));

  if (!title || !summary || !reportKinds.includes(kind)) {
    return;
  }

  await createFamilyReport({
    familyId: context.familyId,
    authorId: context.appUserId,
    kind,
    title,
    summary,
    requiresResponse: normalizeText(formData.get("requiresResponse")) !== "off",
    actions: [
      {
        id: crypto.randomUUID(),
        authorId: context.appUserId,
        label: normalizeText(formData.get("actionLabel")) || "新しい届け出",
        body: summary,
        createdAt: new Date().toISOString(),
        tone: "request"
      }
    ]
  });

  revalidatePath("/home");
  revalidatePath("/reports");
}

export async function respondFamilyReportAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const reportId = normalizeText(formData.get("reportId"));
  const label = normalizeText(formData.get("label")) || "返答";
  const body = normalizeText(formData.get("body")) || "確認しました。";
  const status = normalizeText(formData.get("status")) as FamilyReportStatus;
  const parentId = normalizeText(formData.get("parentId"));

  if (!reportId) {
    return;
  }

  await updateFamilyReport({
    reportId,
    status: reportStatuses.includes(status) ? status : "進行中",
    action: {
      authorId: context.appUserId,
      label,
      body,
      tone: "response",
      parentId: parentId || undefined
    }
  });

  revalidatePath("/home");
  revalidatePath("/reports");
}

export async function completeFamilyReportAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const reportId = normalizeText(formData.get("reportId"));
  const title = normalizeText(formData.get("title")) || "対応完了";

  if (!reportId) {
    return;
  }

  await updateFamilyReport({
    reportId,
    status: "完了",
    action: {
      authorId: context.appUserId,
      label: title,
      body: "対応が完了したので、この連絡を閉じます。",
      tone: "done"
    }
  });

  revalidatePath("/home");
  revalidatePath("/reports");
}
