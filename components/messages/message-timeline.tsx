"use client";

import { GitBranch, Plus, SendHorizonal, Sparkles } from "lucide-react";
import Link from "next/link";
import { createMessageAction } from "@/app/(app)/messages/actions";
import { Chip } from "@/components/shared/chip";
import { SectionCard } from "@/components/shared/section-card";
import { Message, Profile } from "@/types/domain";

const categories = ["雑談", "ご飯", "買い物", "家事", "予定", "部活・習い事"] as const;
const templates = [
  {
    title: "今日のご飯",
    category: "ご飯" as const,
    body: "今日のご飯をカードで共有しました。",
    fields: [
      { label: "メニュー", value: "ハンバーグ / サラダ / スープ" },
      { label: "食べ始め", value: "19:00" },
      { label: "連絡", value: "食べる・いらない・取り置きで返事してください" }
    ]
  },
  {
    title: "買い物メモ",
    category: "買い物" as const,
    body: "帰りに買ってほしいものを共有しました。",
    fields: [
      { label: "お願い", value: "牛乳 / たまご / バナナ" },
      { label: "期限", value: "今日の帰宅まで" }
    ]
  },
  {
    title: "家事連絡",
    category: "家事" as const,
    body: "家事の進み具合をカードで共有しました。",
    fields: [
      { label: "内容", value: "洗濯物は取り込み済み" },
      { label: "メモ", value: "たたむのは夜にお願いします" }
    ]
  },
  {
    title: "今日の予定",
    category: "予定" as const,
    body: "今日の予定を共有しました。",
    fields: [
      { label: "予定", value: "18:30 歯医者 / 20:00 帰宅予定" },
      { label: "場所", value: "みどりクリニック" }
    ]
  },
  {
    title: "部活・習い事の共有",
    category: "部活・習い事" as const,
    body: "放課後の予定をカードで共有しました。",
    fields: [
      { label: "内容", value: "バスケ部 練習" },
      { label: "帰宅予定", value: "18:40" }
    ]
  }
];

export function MessageTimeline({ messages, profiles }: { messages: Message[]; profiles: Profile[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <SectionCard title="判断が必要な連絡は報連相へ" subtitle="欠食届や外泊届などは専用タブで流れを残せます">
          <Link href="/reports" className="flex items-center justify-between rounded-3xl border border-softline/70 bg-white px-4 py-4 transition hover:bg-cream">
            <div>
              <p className="font-semibold">報連相ツリーを使う</p>
              <p className="mt-1 text-sm text-ink/70">依頼、返答、承認を一本で追える画面です。</p>
            </div>
            <GitBranch className="h-5 w-5" />
          </Link>
        </SectionCard>

        <SectionCard title="投稿する" subtitle="通常メッセージもテンプレ投稿もここから">
          <form action={createMessageAction} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <label key={category} className="cursor-pointer rounded-full bg-cream px-4 py-2 text-sm font-semibold">
                  <input type="radio" name="category" value={category} defaultChecked={category === "雑談"} className="sr-only" />
                  {category}
                </label>
              ))}
            </div>
            <textarea
              name="body"
              className="min-h-32 w-full rounded-4xl border border-softline bg-white px-4 py-4 outline-none"
              placeholder="家族に伝えたいことを書いてください"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" className="inline-flex items-center gap-2 rounded-full bg-lavender px-4 py-2 font-semibold">
                <Sparkles className="h-4 w-4" />
                テンプレートを使う
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 font-semibold text-white">
                <SendHorizonal className="h-4 w-4" />
                投稿する
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard title="テンプレート投稿" subtitle="家族連絡を短時間で、漏れなく共有">
          <div className="grid gap-3">
            {templates.map((template) => (
              <form key={template.title} action={createMessageAction}>
                <input type="hidden" name="category" value={template.category} />
                <input type="hidden" name="body" value={template.body} />
                <input type="hidden" name="templateTitle" value={template.title} />
                <input type="hidden" name="templateFields" value={JSON.stringify(template.fields)} />
                <button className="flex w-full items-center justify-between rounded-3xl bg-white px-4 py-4 text-left hover:bg-orange/40">
                  <div>
                    <p className="font-semibold">{template.title}</p>
                    <p className="mt-1 text-sm text-ink/70">必要項目がまとまったカード形式で送信できます。</p>
                  </div>
                  <Plus className="h-5 w-5" />
                </button>
              </form>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="家族チャット" subtitle="通常投稿とテンプレ投稿を同じタイムラインに表示">
        <div className="space-y-4">
          {messages.map((message) => {
            const author = profiles.find((profile) => profile.userId === message.authorId);
            return (
              <article key={message.id} className="rounded-4xl bg-white px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${author?.accentColor} font-bold text-base`}>
                    {author?.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{author?.name}</p>
                      <Chip>{message.category}</Chip>
                      {message.templateType ? <Chip color="bg-lavender text-ink">テンプレ投稿</Chip> : null}
                      <span className="text-xs text-ink/60">{message.createdAt}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-ink/80">{message.body}</p>

                    {message.templatePayload ? (
                      <div className="mt-4 rounded-4xl bg-cream p-4">
                        <p className="font-semibold">{message.templatePayload.title}</p>
                        <div className="mt-3 grid gap-2">
                          {message.templatePayload.fields.map((field) => (
                            <div key={field.label} className="rounded-3xl bg-white px-4 py-3">
                              <p className="text-xs font-semibold text-ink/60">{field.label}</p>
                              <p className="mt-1 text-sm">{field.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-4 text-xs text-ink/60">確認済み {message.readBy.length}人</div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
