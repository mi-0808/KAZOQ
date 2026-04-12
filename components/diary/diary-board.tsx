"use client";

import { Heart, NotebookPen, SmilePlus } from "lucide-react";
import { diaryEntries, profiles } from "@/data/mock-data";
import { Chip } from "@/components/shared/chip";
import { SectionCard } from "@/components/shared/section-card";

const moods = ["にこにこ", "おだやか", "がんばった", "つかれた", "しんぱい"] as const;

export function DiaryBoard() {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <SectionCard title="交換日記を書く" subtitle="気分と今日のことをやさしく残す">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">今日の気分</p>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <button key={mood} className="rounded-full bg-cream px-4 py-2 text-sm font-semibold">
                    {mood}
                  </button>
                ))}
              </div>
            </div>
            {[
              "今日あったこと",
              "嬉しかったこと",
              "困っていること",
              "家族に伝えたいこと"
            ].map((label) => (
              <label key={label} className="block">
                <span className="mb-2 block text-sm font-medium">{label}</span>
                <textarea className="min-h-24 w-full rounded-4xl border border-softline bg-white px-4 py-3 outline-none" />
              </label>
            ))}
            <button className="w-full rounded-3xl bg-ink px-4 py-3 text-base font-semibold text-white">日記を投稿する</button>
          </div>
        </SectionCard>

        <SectionCard title="感情の見え方" subtitle="スタンプのようにやわらかく共有">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { mood: "にこにこ", emoji: "😊" },
              { mood: "おだやか", emoji: "🍵" },
              { mood: "がんばった", emoji: "👏" },
              { mood: "つかれた", emoji: "☁️" },
              { mood: "しんぱい", emoji: "🌱" }
            ].map((item) => (
              <div key={item.mood} className="rounded-3xl bg-white px-4 py-4">
                <p className="text-2xl">{item.emoji}</p>
                <p className="mt-2 font-semibold">{item.mood}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="交換日記一覧" subtitle="投稿者・日付・気分・本文・リアクションをまとめて表示">
        <div className="space-y-4">
          {diaryEntries.map((entry) => {
            const author = profiles.find((profile) => profile.userId === entry.authorId);
            return (
              <article key={entry.id} className="rounded-4xl bg-white px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${author?.accentColor} font-bold`}>
                      {author?.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{author?.name}</p>
                      <p className="text-xs text-ink/60">{entry.date}</p>
                    </div>
                  </div>
                  <Chip color="bg-lavender text-ink">{entry.mood}</Chip>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-3xl bg-lavender/35 px-4 py-4">
                    <p className="text-xs font-semibold text-ink/60">今日あったこと</p>
                    <p className="mt-1 text-sm leading-6">{entry.todayStory}</p>
                  </div>
                  <div className="rounded-3xl bg-mint/40 px-4 py-4">
                    <p className="text-xs font-semibold text-ink/60">嬉しかったこと</p>
                    <p className="mt-1 text-sm leading-6">{entry.happyMoment}</p>
                  </div>
                  <div className="rounded-3xl bg-orange/35 px-4 py-4">
                    <p className="text-xs font-semibold text-ink/60">困っていること</p>
                    <p className="mt-1 text-sm leading-6">{entry.concern}</p>
                  </div>
                  <div className="rounded-3xl bg-blush/40 px-4 py-4">
                    <p className="text-xs font-semibold text-ink/60">家族に伝えたいこと</p>
                    <p className="mt-1 text-sm leading-6">{entry.messageToFamily}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    <Heart className="h-4 w-4" />
                    リアクション
                  </span>
                  {entry.reactions.map((reaction) => {
                    const user = profiles.find((profile) => profile.userId === reaction.userId);
                    return (
                      <span key={reaction.id} className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-sm">
                        {reaction.emoji}
                        {user?.name}
                      </span>
                    );
                  })}
                  <button className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold">
                    <SmilePlus className="h-4 w-4" />
                    反応する
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
