import { createClient } from "@/lib/supabase/server";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { FamilyTask } from "@/types/domain";
import type { Database } from "@/types/supabase";

function isMissingFamilyTasksError(error: { code?: string | null; message?: string | null } | null) {
  return error?.code === "PGRST205" || error?.message?.includes("public.family_tasks") || false;
}

function formatDate(value: string | null) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric"
  }).format(date);
}

export async function listFamilyTasks(familyId?: string): Promise<FamilyTask[]> {
  const context = await getCurrentAppContext();
  const resolvedFamilyId = familyId ?? context.familyId;

  if (!resolvedFamilyId) {
    return [];
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("family_tasks")
    .select("id, family_id, created_by, assignee_id, title, note, due_date, status, created_at, completed_at")
    .eq("family_id", resolvedFamilyId)
    .order("status", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<Database["public"]["Tables"]["family_tasks"]["Row"][]>();

  if (error && !isMissingFamilyTasksError(error)) {
    throw error;
  }

  if (isMissingFamilyTasksError(error)) {
    return [];
  }

  return (data ?? []).map((task) => ({
    id: task.id,
    familyId: task.family_id,
    createdBy: task.created_by,
    assigneeId: task.assignee_id ?? undefined,
    title: task.title,
    note: task.note ?? "",
    dueDate: formatDate(task.due_date),
    status: task.status as FamilyTask["status"],
    createdAt: formatDate(task.created_at) ?? task.created_at
  }));
}

export async function createFamilyTask(input: {
  familyId: string;
  createdBy: string;
  assigneeId?: string;
  title: string;
  note?: string;
  dueDate?: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("family_tasks")
    .insert({
      family_id: input.familyId,
      created_by: input.createdBy,
      assignee_id: input.assigneeId ?? null,
      title: input.title,
      note: input.note ?? null,
      due_date: input.dueDate ?? null
    })
    .select("id")
    .single<{ id: string }>();

  if (isMissingFamilyTasksError(error)) {
    return { mode: "supabase" as const, id: "family-tasks-unavailable" };
  }

  if (error || !data) {
    throw error ?? new Error("Failed to create family task");
  }

  return { mode: "supabase" as const, id: data.id };
}

export async function updateFamilyTaskStatus(input: { taskId: string; status: FamilyTask["status"] }) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("family_tasks")
    .update({
      status: input.status,
      completed_at: input.status === "done" ? new Date().toISOString() : null
    })
    .eq("id", input.taskId);

  if (isMissingFamilyTasksError(error)) {
    return { mode: "supabase" as const, id: input.taskId };
  }

  if (error) {
    throw error;
  }

  return { mode: "supabase" as const, id: input.taskId };
}
