import { family, familyReports } from "@/data/mock-data";
import { FamilyReportAction, FamilyReportThread } from "@/types/domain";
import { createClient } from "@/lib/supabase/server";
import { shouldUseDemoData } from "@/lib/config";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import type { Database, Json } from "@/types/supabase";

function normalizeCreatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function parseActions(payload: Json | null): FamilyReportAction[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, Json>;

    if (
      typeof record.id !== "string" ||
      typeof record.authorId !== "string" ||
      typeof record.label !== "string" ||
      typeof record.body !== "string" ||
      typeof record.createdAt !== "string"
    ) {
      return [];
    }

    return [
      {
        id: record.id,
        parentId: typeof record.parentId === "string" ? record.parentId : undefined,
        authorId: record.authorId,
        label: record.label,
        body: record.body,
        createdAt: record.createdAt,
        tone: typeof record.tone === "string" ? (record.tone as FamilyReportAction["tone"]) : undefined
      }
    ];
  });
}

export async function listFamilyReports(familyId = family.id): Promise<FamilyReportThread[]> {
  if (await shouldUseDemoData()) {
    return familyReports;
  }

  const context = await getCurrentAppContext();
  const resolvedFamilyId = familyId ?? context.familyId;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("family_reports")
    .select(
      `
        id,
        family_id,
        kind,
        title,
        summary,
        status,
        requires_response,
        created_at,
        family_report_actions (
          id,
          parent_action_id,
          author_id,
          label,
          body,
          tone,
          created_at
        )
      `
    )
    .eq("family_id", resolvedFamilyId)
    .order("created_at", { ascending: false })
    .returns<
      Array<
        Database["public"]["Tables"]["family_reports"]["Row"] & {
          family_report_actions: Database["public"]["Tables"]["family_report_actions"]["Row"][];
        }
      >
    >();

  if (error) {
    throw error;
  }

  return (data ?? []).map((report) => ({
    id: report.id,
    familyId: report.family_id,
    kind: report.kind as FamilyReportThread["kind"],
    title: report.title,
    summary: report.summary,
    status: report.status as FamilyReportThread["status"],
    createdAt: normalizeCreatedAt(report.created_at),
    requiresResponse: report.requires_response,
    actions: report.family_report_actions.map((action) => ({
      id: action.id,
      parentId: action.parent_action_id ?? undefined,
      authorId: action.author_id,
      label: action.label,
      body: action.body,
      createdAt: normalizeCreatedAt(action.created_at),
      tone: action.tone as FamilyReportAction["tone"]
    }))
  }));
}

export async function updateFamilyReport(input: {
  reportId: string;
  status?: FamilyReportThread["status"];
  action?: {
    authorId: string;
    label: string;
    body: string;
    tone?: FamilyReportAction["tone"];
    parentId?: string;
  };
}) {
  if (await shouldUseDemoData()) {
    return { mode: "mock" as const };
  }

  const supabase = await createClient();

  if (input.status) {
    const { error: updateError } = await supabase
      .from("family_reports")
      .update({ status: input.status })
      .eq("id", input.reportId);

    if (updateError) {
      throw updateError;
    }
  }

  if (input.action) {
    const { error: actionError } = await supabase.from("family_report_actions").insert({
      family_report_id: input.reportId,
      parent_action_id: input.action.parentId ?? null,
      author_id: input.action.authorId,
      label: input.action.label,
      body: input.action.body,
      tone: input.action.tone ?? "response"
    });

    if (actionError) {
      throw actionError;
    }
  }

  return { mode: "supabase" as const, id: input.reportId };
}

export async function createFamilyReport(input: {
  familyId: string;
  authorId: string;
  kind: FamilyReportThread["kind"];
  title: string;
  summary: string;
  requiresResponse?: boolean;
  actions?: FamilyReportAction[];
}) {
  if (await shouldUseDemoData()) {
    return { mode: "mock" as const };
  }

  const supabase = await createClient();
  const { data: report, error: reportError } = await supabase
    .from("family_reports")
    .insert({
      family_id: input.familyId,
      author_id: input.authorId,
      kind: input.kind,
      title: input.title,
      summary: input.summary,
      requires_response: input.requiresResponse ?? true
    })
    .select("id")
    .single();

  if (reportError || !report) {
    throw reportError ?? new Error("Failed to create family report");
  }

  if (input.actions && input.actions.length > 0) {
    const { error: actionsError } = await supabase.from("family_report_actions").insert(
      input.actions.map((action) => ({
        family_report_id: report.id,
        parent_action_id: action.parentId ?? null,
        author_id: action.authorId,
        label: action.label,
        body: action.body,
        tone: action.tone ?? "info"
      }))
    );

    if (actionsError) {
      throw actionsError;
    }
  }

  return { mode: "supabase" as const, id: report.id };
}
