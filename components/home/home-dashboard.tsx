import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";
import type { HomeFeed } from "@/lib/repositories/home";
import { Chip } from "@/components/shared/chip";
import { SectionCard } from "@/components/shared/section-card";

export function HomeDashboard({ feed }: { feed: HomeFeed }) {
  const { shortcuts, latestMessage, latestReport, reportPeek } = feed;

  return (
    <div className="space-y-4">
      <section className="grid gap-4 lg:grid-cols-2">
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
          subtitle="最新の更新だけ短く表示"
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
