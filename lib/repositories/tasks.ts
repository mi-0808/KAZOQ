import { createClient } from "@/lib/supabase/server";
import { shouldUseDemoData } from "@/lib/config";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { FamilyTask } from "@/types/domain";
import type { Database } from "@/types/supabase";

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

const mockTasks: FamilyTask[] = [
  {
    id: "task1",
    familyId: "f1",
    createdBy: "u1",
    assigneeId: "u2",
    title: "牛乳とたまごを買う",
    note: "帰宅前にスーパーでお願いします",
    dueDate: "4/13",
    status: "open",
    createdAt: "18:10"
  },
  {
    id: "task2",
    familyId: "f1",
    createdBy: "u2",
    assigneeId: "u3",
    title: "明日の体育着を準備",
    note: "",
    dueDate: "4/13",
    status: "open",
    createdAt: "20:00"
  }
];

export async function listFamilyTasks(familyId?: string): Promise<FamilyTask[]> {
  if (await shouldUseDemoData()) {
    return mockTasks;
  }

  const context = await getCurrentAppContext();
  const resolvedFamilyId = familyId ?? context.familyId;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("family_tasks")
    .select("id, family_id, created_by, assignee_id, title, note, due_date, status, created_at, completed_at")
    .eq("family_id", resolvedFamilyId)
    .order("status", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<Database["public"]["Tables"]["family_tasks"]["Row"][]>();

  if (error) {
    throw error;
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
  if (await shouldUseDemoData()) {
    return { mode: "mock" as const, id: mockTasks[0].id };
  }

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

  if (error || !data) {
    throw error ?? new Error("Failed to create family task");
  }

  return { mode: "supabase" as const, id: data.id };
}

export async function updateFamilyTaskStatus(input: { taskId: string; status: FamilyTask["status"] }) {
  if (await shouldUseDemoData()) {
    return { mode: "mock" as const, id: input.taskId };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("family_tasks")
    .update({
      status: input.status,
      completed_at: input.status === "done" ? new Date().toISOString() : null
    })
    .eq("id", input.taskId);

  if (error) {
    throw error;
  }

  return { mode: "supabase" as const, id: input.taskId };
}
