"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { createFamilyReport, updateFamilyReport } from "@/lib/repositories/family-reports";
import { FamilyReportKind, FamilyReportStatus } from "@/types/domain";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function buildReportDraft(kind: FamilyReportKind, detail: string) {
  const baseDetail = detail || "家族に共有したい連絡があります。";

  switch (kind) {
    case "ご飯連絡":
      return {
        title: "ご飯の確認",
        summary: detail || "食べる / いらない / 取り置き を返してください。",
        actionLabel: "ご飯連絡を出しました"
      };
    case "欠食届":
      return {
        title: "欠食届",
        summary: baseDetail,
        actionLabel: "欠食届を出しました"
      };
    case "外泊届":
      return {
        title: "外泊届",
        summary: baseDetail,
        actionLabel: "外泊届を出しました"
      };
    case "お迎え相談":
      return {
        title: "お迎えの相談",
        summary: baseDetail,
        actionLabel: "お迎え相談を出しました"
      };
    case "帰宅連絡":
      return {
        title: "帰宅連絡",
        summary: baseDetail,
        actionLabel: "帰宅連絡を出しました"
      };
  }
}

const reportKinds: FamilyReportKind[] = ["ご飯連絡", "欠食届", "外泊届", "お迎え相談", "帰宅連絡"];
const reportStatuses: FamilyReportStatus[] = ["確認待ち", "進行中", "完了"];

export async function createFamilyReportAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const kind = normalizeText(formData.get("kind")) as FamilyReportKind;
  const detail = normalizeText(formData.get("detail"));
  const draft = buildReportDraft(kind, detail);
  const title = normalizeText(formData.get("title")) || draft.title;
  const summary = normalizeText(formData.get("summary")) || draft.summary;

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
        label: normalizeText(formData.get("actionLabel")) || draft.actionLabel,
        body: summary,
        createdAt: new Date().toISOString(),
        tone: "request"
      }
    ]
  });

  revalidatePath("/home");
  revalidatePath(`/rooms/${context.familyId}`);
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
  revalidatePath(`/rooms/${context.familyId}`);
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
  revalidatePath(`/rooms/${context.familyId}`);
  revalidatePath("/reports");
}
