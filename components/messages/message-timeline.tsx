import { Plus, SendHorizonal, Sparkles } from "lucide-react";
import { messages, profiles } from "@/data/mock-data";
import { Chip } from "@/components/shared/chip";
import { SectionCard } from "@/components/shared/section-card";

const categories = ["雑談", "ご飯", "買い物", "家事", "予定", "部活・習い事"] as const;
const templates = [
  "今日のご飯",
  "買い物メモ",
  "家事連絡",
  "今日の予定",
  "部活・習い事の共有"
];

export function MessageTimeline() {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <SectionCard title="投稿する" subtitle="通常メッセージもテンプレ投稿もここから">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button key={category} className="rounded-full bg-cream px-4 py-2 text-sm font-semibold">
                  {category}
                </button>
              ))}
            </div>
            <textarea
              className="min-h-32 w-full rounded-4xl border border-softline bg-white px-4 py-4 outline-none"
              placeholder="家族に伝えたいことを書いてください"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-lavender px-4 py-2 font-semibold">
                <Sparkles className="h-4 w-4" />
                テンプレートを使う
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 font-semibold text-white">
                <SendHorizonal className="h-4 w-4" />
                投稿する
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="テンプレート投稿" subtitle="家族連絡を短時間で、漏れなく共有">
          <div className="grid gap-3">
            {templates.map((template) => (
              <button key={template} className="flex items-center justify-between rounded-3xl bg-white px-4 py-4 text-left hover:bg-orange/40">
                <div>
                  <p className="font-semibold">{template}</p>
                  <p className="mt-1 text-sm text-ink/70">必要項目がまとまったカード形式で送信できます。</p>
                </div>
                <Plus className="h-5 w-5" />
              </button>
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
