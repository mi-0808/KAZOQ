import Link from "next/link";
import { ArrowRight, CheckCircle2, GitBranch, MessageCircleMore, SquareCheckBig } from "lucide-react";
import type { HomeFeed } from "@/lib/repositories/home";
import { Chip } from "@/components/shared/chip";
import { SectionCard } from "@/components/shared/section-card";
import { completeFamilyTaskAction, createFamilyTaskAction } from "@/app/(app)/home/actions";

export function HomeDashboard({ feed }: { feed: HomeFeed }) {
  const { shortcuts, favoriteFeatures, latestMessage, latestReport, reportPeek, summary, tasks, preferences } = feed;

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard title="今日の要点" subtitle="まず確認したいことだけを先に表示">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-3xl border border-softline/70 bg-white px-4 py-4">
              <div className="flex items-center gap-2">
                <MessageCircleMore className="h-4 w-4" />
                <p className="text-sm font-semibold">未読メッセージ</p>
              </div>
              <p className="mt-3 text-2xl font-black">{summary.unreadMessages}</p>
            </div>
            <div className="rounded-3xl border border-softline/70 bg-white px-4 py-4">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                <p className="text-sm font-semibold">進行中の報連相</p>
              </div>
              <p className="mt-3 text-2xl font-black">{summary.pendingReports}</p>
            </div>
            <div className="rounded-3xl border border-softline/70 bg-white px-4 py-4">
              <div className="flex items-center gap-2">
                <SquareCheckBig className="h-4 w-4" />
                <p className="text-sm font-semibold">未完了タスク</p>
              </div>
              <p className="mt-3 text-2xl font-black">{preferences.tasksEnabled ? summary.openTasks : 0}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="ショートカット" subtitle="よく使う入口だけ">
          <div className="grid gap-3">
            {shortcuts.map((shortcut) => (
              <Link key={shortcut.id} href={shortcut.href} className="rounded-3xl border border-softline/70 bg-white px-4 py-3 transition hover:bg-cream">
                <p className="font-semibold">{shortcut.label}</p>
                <p className="mt-1 text-sm text-ink/70">{shortcut.description}</p>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="お知らせ"
          subtitle="最新の更新だけ、1画面で判断できる量に絞っています"
          action={
            <Link href="/messages" className="rounded-full bg-cream px-4 py-2 text-sm font-semibold">
              もっと見る
            </Link>
          }
        >
          <div className="space-y-3">
            <div className="rounded-3xl border border-softline/70 bg-white px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">最新の報連相</p>
                <Chip color="bg-orange/45 text-ink">{latestReport.kind}</Chip>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/78">{latestReport.summary}</p>
            </div>
            <div className="rounded-3xl border border-softline/70 bg-white px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">最新メッセージ</p>
                <Chip>{latestMessage.category}</Chip>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/78">{latestMessage.body}</p>
            </div>
          </div>
        </SectionCard>
      </section>

      <SectionCard
        title="よく使う機能"
        subtitle="家族設定で選んだ機能だけを並べています"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {favoriteFeatures.map((feature) => (
            <Link key={feature.id} href={feature.href} className="rounded-3xl border border-softline/70 bg-white px-4 py-4 transition hover:bg-cream">
              <p className="font-semibold">{feature.label}</p>
              <p className="mt-2 text-sm leading-6 text-ink/75">{feature.description}</p>
            </Link>
          ))}
        </div>
      </SectionCard>

      {preferences.tasksEnabled ? (
        <SectionCard title="家庭タスク" subtitle="報連相とは別に、やることだけを管理">
          <div className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
            <form action={createFamilyTaskAction} className="rounded-3xl bg-white px-4 py-4">
              <p className="font-semibold">新しいタスク</p>
              <div className="mt-3 grid gap-3">
                <input name="title" className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none" placeholder="例: 牛乳を買う" />
                <input name="note" className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none" placeholder="メモ（任意）" />
                <input name="dueDate" type="date" className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none" />
                <button className="rounded-3xl bg-ink px-4 py-3 text-sm font-semibold text-white">追加する</button>
              </div>
            </form>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="rounded-3xl bg-white px-4 py-5 text-sm text-ink/70">いまはタスクがありません。買い物や準備をここに分けておくと、報連相が見やすくなります。</div>
              ) : null}
              {tasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between gap-3 rounded-3xl bg-white px-4 py-4">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    {task.note ? <p className="mt-1 text-sm text-ink/70">{task.note}</p> : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {task.dueDate ? <Chip color="bg-cream text-ink">期限 {task.dueDate}</Chip> : null}
                      <Chip color={task.status === "done" ? "bg-mint text-ink" : "bg-sky text-ink"}>{task.status === "done" ? "完了" : "対応中"}</Chip>
                    </div>
                  </div>
                  {task.status === "open" ? (
                    <form action={completeFamilyTaskAction}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <button className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold">
                        <CheckCircle2 className="h-4 w-4" />
                        完了
                      </button>
                    </form>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title="報連相をちょっと見る"
        subtitle="ご飯確認や欠食届など、家庭の判断が必要なことだけを下にまとめています"
        action={
          <Link href="/reports" className="inline-flex items-center gap-1 rounded-full bg-cream px-4 py-2 text-sm font-semibold">
            報連相へ
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          {reportPeek.map((thread) => (
            <Link key={thread.id} href="/reports" className="rounded-3xl border border-softline/70 bg-white px-4 py-4 transition hover:bg-cream">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  <p className="font-semibold">{thread.title}</p>
                </div>
                <Chip color={thread.status === "完了" ? "bg-mint text-ink" : thread.status === "進行中" ? "bg-sky text-ink" : "bg-orange text-ink"}>
                  {thread.status}
                </Chip>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/75">{thread.summary}</p>
              <p className="mt-3 text-xs text-ink/55">{thread.createdAt}</p>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
