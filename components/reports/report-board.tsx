"use client";

import { ArrowRight, CheckCircle2, GitBranch, MoonStar, Soup, UserRoundCheck } from "lucide-react";
import { completeFamilyReportAction, createFamilyReportAction, respondFamilyReportAction } from "@/app/(app)/reports/actions";
import { Chip } from "@/components/shared/chip";
import { SectionCard } from "@/components/shared/section-card";
import { FamilyReportThread, Profile } from "@/types/domain";

const kindIcon = {
  ご飯連絡: Soup,
  欠食届: UserRoundCheck,
  外泊届: MoonStar,
  お迎え相談: GitBranch,
  帰宅連絡: GitBranch
};

const toneStyles = {
  info: "bg-sky/25 border-sky/30",
  request: "bg-orange/25 border-orange/35",
  response: "bg-lavender/25 border-lavender/35",
  done: "bg-mint/25 border-mint/35"
};

export function ReportBoard({ threads, profiles }: { threads: FamilyReportThread[]; profiles: Profile[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
      <div className="space-y-4">
        <SectionCard title="報連相ツリーとは" subtitle="雑談ではなく、家庭内オペレーションを回すための場所">
          <div className="space-y-3">
            {[
              "ご飯できたよ、食べる・いらない・取り置きの返答",
              "外泊届、欠食届、帰宅の遅れなどの家庭内届け出",
              "依頼と返答と承認が一本の流れで残る表示"
            ].map((text) => (
              <div key={text} className="rounded-3xl border border-softline/70 bg-white px-4 py-4 text-sm leading-6 text-ink/78">
                {text}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="よく使う届出" subtitle="短い入力で、そのまま家庭内ツリーへ送れます">
          <form action={createFamilyReportAction} className="grid gap-3">
            <select name="kind" defaultValue="ご飯連絡" className="rounded-3xl border border-softline/70 bg-white px-4 py-3 text-sm outline-none">
              {["ご飯連絡", "欠食届", "外泊届", "お迎え相談", "帰宅連絡"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input
              name="title"
              className="rounded-3xl border border-softline/70 bg-white px-4 py-3 text-sm outline-none"
              placeholder="例: 今日の夕飯、19:10にできました"
            />
            <textarea
              name="summary"
              className="min-h-28 rounded-3xl border border-softline/70 bg-white px-4 py-3 text-sm outline-none"
              placeholder="例: 食べる / いらない / 取り置き のどれかを返してください。"
            />
            <input type="hidden" name="actionLabel" value="新しい届け出" />
            <label className="flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-sm">
              <input type="checkbox" name="requiresResponse" defaultChecked className="h-4 w-4 rounded border-softline" />
              返答が必要な連絡にする
            </label>
            <button className="flex items-center justify-between rounded-3xl bg-cream px-4 py-4 text-left transition hover:bg-orange/20">
              <span className="font-semibold">報連相ツリーへ送る</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </SectionCard>
      </div>

      <SectionCard title="家庭内ツリー" subtitle="依頼から返答・承諾までを一本で確認">
        <div className="space-y-4">
          {threads.map((thread) => {
            const Icon = kindIcon[thread.kind];

            return (
              <article key={thread.id} className="rounded-4xl border border-softline/70 bg-white px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <p className="font-semibold">{thread.title}</p>
                      <Chip color="bg-cream text-ink">{thread.kind}</Chip>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink/75">{thread.summary}</p>
                  </div>
                  <div className="text-right">
                    <Chip color={thread.status === "完了" ? "bg-mint text-ink" : thread.status === "進行中" ? "bg-sky text-ink" : "bg-orange text-ink"}>
                      {thread.status}
                    </Chip>
                    <p className="mt-2 text-xs text-ink/55">{thread.createdAt}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {thread.actions.map((action, index) => {
                    const author = profiles.find((profile) => profile.userId === action.authorId);
                    const isChild = Boolean(action.parentId);

                    return (
                      <div key={action.id} className={`relative ${isChild ? "ml-8" : ""}`}>
                        {index < thread.actions.length - 1 ? <div className="absolute left-5 top-11 h-[calc(100%+8px)] w-px bg-softline" /> : null}
                        <div className={`rounded-3xl border px-4 py-4 ${toneStyles[action.tone ?? "info"]}`}>
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${author?.accentColor} font-bold`}>
                              {author?.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold">{action.label}</p>
                                <span className="text-xs text-ink/55">{author?.name}</span>
                              </div>
                              <p className="mt-1 text-sm leading-6 text-ink/78">{action.body}</p>
                            </div>
                            <span className="text-xs text-ink/55">{action.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <form action={respondFamilyReportAction}>
                    <input type="hidden" name="reportId" value={thread.id} />
                    <input type="hidden" name="label" value={thread.kind === "ご飯連絡" ? "返答しました" : "確認しました"} />
                    <input
                      type="hidden"
                      name="body"
                      value={
                        thread.kind === "ご飯連絡"
                          ? "今日は食べる / いらない / 取り置き の返答をこのツリーで残します。"
                          : "内容を確認して、このまま進めます。"
                      }
                    />
                    <input type="hidden" name="status" value="進行中" />
                    <button className="rounded-full bg-cream px-4 py-2 text-sm font-semibold">返答する</button>
                  </form>
                  <form action={completeFamilyReportAction}>
                    <input type="hidden" name="reportId" value={thread.id} />
                    <input type="hidden" name="title" value="対応完了" />
                    <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    完了にする
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
