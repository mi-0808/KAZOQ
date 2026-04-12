import Link from "next/link";
import { CalendarRange, MapPinned, MessageCircle, NotebookPen } from "lucide-react";
import { diaryEntries, family, familyLocations, messages, profiles, schedules, shortcuts } from "@/data/mock-data";
import { Chip } from "@/components/shared/chip";
import { SectionCard } from "@/components/shared/section-card";

export function HomeDashboard() {
  const latestDiary = diaryEntries[0];
  const mealMessage = messages.find((message) => message.templateType === "meal");

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-r from-coral/85 via-orange/85 to-sky/80 p-6">
          <div className="absolute -right-10 -top-8 h-28 w-28 rounded-full bg-sunny/55 blur-xl" />
          <div className="absolute bottom-0 left-10 h-24 w-24 rounded-full bg-blush/35 blur-2xl" />
          <p className="text-sm font-semibold text-ink/70">今日のまとめ</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight">
            {family.name}の予定・ご飯・見守りが
            <span className="block">ひと目でつながるホーム</span>
          </h1>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/70 p-4">
              <p className="text-sm text-ink/70">今日の予定</p>
              <p className="mt-1 text-2xl font-bold">{schedules.filter((item) => item.date === "4/12").length}件</p>
            </div>
            <div className="rounded-3xl bg-white/70 p-4">
              <p className="text-sm text-ink/70">未確認メッセージ</p>
              <p className="mt-1 text-2xl font-bold">{messages.length}</p>
            </div>
            <div className="rounded-3xl bg-white/70 p-4">
              <p className="text-sm text-ink/70">位置更新中</p>
              <p className="mt-1 text-2xl font-bold">{familyLocations.length}人</p>
            </div>
          </div>
        </div>

        <SectionCard
          title="すぐ使えるショートカット"
          subtitle="よく使う家族連絡をワンタップで"
          className="bg-white/80"
        >
          <div className="grid gap-3">
            {shortcuts.map((shortcut) => (
              <Link key={shortcut.id} href={shortcut.href} className="rounded-3xl border-2 border-white/70 bg-cream px-4 py-3 transition hover:-rotate-1 hover:bg-orange/60">
                <p className="font-semibold">{shortcut.label}</p>
                <p className="mt-1 text-sm text-ink/70">{shortcut.description}</p>
              </Link>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <SectionCard
            title="今日の予定"
            subtitle="学校・部活・通院・夕飯の流れを確認"
            action={
              <Link href="/calendar" className="rounded-full bg-sky px-4 py-2 text-sm font-semibold">
                予定を追加
              </Link>
            }
          >
            <div className="space-y-3">
              {schedules
                .filter((item) => item.date === "4/12")
                .map((item) => (
                  <div key={item.id} className="flex items-start gap-3 rounded-3xl border-2 border-sky/25 bg-white px-4 py-4">
                    <div className="rounded-2xl bg-sky px-3 py-2 text-center text-sm font-semibold text-ink">
                      <p>{item.startTime}</p>
                      <p className="text-xs text-ink/60">{item.endTime}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{item.title}</p>
                        <Chip color={item.type === "家族" ? "bg-orange text-ink" : "bg-mint text-ink"}>{item.type}</Chip>
                      </div>
                      <p className="mt-1 text-sm text-ink/70">{item.note ?? "場所つき予定として家族に共有されます。"}</p>
                    </div>
                  </div>
                ))}
            </div>
          </SectionCard>

          <SectionCard
            title="最近のメッセージ"
            subtitle="テンプレ投稿も同じタイムラインで確認"
            action={
              <Link href="/messages" className="rounded-full bg-blush px-4 py-2 text-sm font-semibold">
                メッセージへ
              </Link>
            }
          >
            <div className="space-y-3">
              {messages.slice(0, 3).map((message) => {
                const author = profiles.find((profile) => profile.userId === message.authorId);
                return (
                  <div key={message.id} className="rounded-3xl border-2 border-blush/20 bg-white px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${author?.accentColor} font-bold`}>{author?.avatar}</div>
                        <div>
                          <p className="font-semibold">{author?.name}</p>
                          <p className="text-xs text-ink/60">{message.createdAt}</p>
                        </div>
                      </div>
                      <Chip>{message.category}</Chip>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-ink/80">{message.body}</p>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="今日のご飯" subtitle="ご飯テンプレは家族全員が見つけやすいカードで表示">
            <div className="rounded-4xl border-2 border-orange/35 bg-orange/55 p-4">
              <div className="flex items-center gap-2">
                <CalendarRange className="h-5 w-5" />
                <p className="font-semibold">{mealMessage?.templatePayload?.title}</p>
              </div>
              <div className="mt-4 space-y-2">
                {mealMessage?.templatePayload?.fields.map((field) => (
                  <div key={field.label} className="rounded-3xl bg-white/80 px-4 py-3">
                    <p className="text-xs font-semibold text-ink/60">{field.label}</p>
                    <p className="mt-1 text-sm">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="家族の状態" subtitle="連絡相手の今がやさしく分かる">
            <div className="space-y-3">
              {profiles.map((profile) => (
                <div key={profile.userId} className="flex items-start gap-3 rounded-3xl border-2 border-mint/25 bg-white px-4 py-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full ${profile.accentColor} font-bold`}>{profile.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{profile.name}</p>
                      <Chip color="bg-cream text-ink">{profile.familyRole}</Chip>
                    </div>
                    <p className="mt-1 text-sm text-ink/75">{profile.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="交換日記の最新投稿" subtitle="感情や今日の出来事を家族でやさしく共有">
            <div className="rounded-4xl border-2 border-lavender/30 bg-lavender/55 p-4">
              <div className="flex items-center gap-2">
                <NotebookPen className="h-5 w-5" />
                <p className="font-semibold">{profiles.find((profile) => profile.userId === latestDiary.authorId)?.name}さんの日記</p>
              </div>
              <p className="mt-3 text-sm leading-6">{latestDiary.todayStory}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip color="bg-white text-ink">気分: {latestDiary.mood}</Chip>
                <Chip color="bg-white text-ink">{latestDiary.reactions.length}リアクション</Chip>
                <Chip color="bg-white text-ink">
                  <MapPinned className="mr-1 inline h-3.5 w-3.5" />
                  見守り共有中
                </Chip>
              </div>
            </div>
          </SectionCard>
        </div>
      </section>

      <SectionCard title="生活連携の構造" subtitle="MVPでも機能同士がつながるように設計">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { icon: MessageCircle, title: "メッセージ", desc: "通常投稿とテンプレ投稿の基盤" },
            { icon: CalendarRange, title: "予定", desc: "投稿から予定化しやすい構造" },
            { icon: MapPinned, title: "場所", desc: "地点登録と見守りを接続" },
            { icon: NotebookPen, title: "交換日記", desc: "感情と生活の補助線を作る" }
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border-2 border-orange/20 bg-white px-4 py-4">
              <item.icon className="h-5 w-5" />
              <p className="mt-3 font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-ink/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
