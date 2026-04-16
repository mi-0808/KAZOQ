import { TopLanding } from "@/components/top/top-landing";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

type TodoRow = {
  id: string;
  name: string;
};

async function getTodos() {
  if (!isSupabaseConfigured()) {
    return { todos: null, error: null as string | null };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("todos").select("id, name");

    if (error) {
      return { todos: null, error: error.message };
    }

    return { todos: (data ?? []) as TodoRow[], error: null as string | null };
  } catch {
    return { todos: null, error: "Supabase connection failed." };
  }
}

export default async function IndexPage() {
  const { todos, error } = await getTodos();

  return (
    <>
      <TopLanding />

      {todos ? (
        <section className="px-4 pb-8 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-[28px] bg-white/80 p-6 shadow-sticker">
            <h2 className="text-2xl font-bold text-ink">Todo Preview</h2>
            {todos.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {todos.map((todo) => (
                  <li key={todo.id} className="rounded-2xl bg-cream px-4 py-3 text-ink">
                    {todo.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-ink/70">まだ todo はありません。</p>
            )}
          </div>
        </section>
      ) : null}

      {error ? (
        <section className="px-4 pb-8 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-[28px] bg-white/80 p-6 text-sm text-ink/70 shadow-sticker">
            Todo preview could not be loaded right now.
          </div>
        </section>
      ) : null}
    </>
  );
}
