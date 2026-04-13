"use client";

import { useState } from "react";
import { ArrowRight, Clock3, GitBranch, House, LogIn, MapPinned, MessageCircleMore, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { familyLocations, familyReports, messages, schedules } from "@/data/mock-data";

const demoTabs = [
  { id: "messages", label: "メッセージ", icon: MessageCircleMore },
  { id: "reports", label: "報連相", icon: GitBranch },
  { id: "calendar", label: "予定", icon: Clock3 },
  { id: "locations", label: "場所", icon: MapPinned }
] as const;

export function TopLanding() {
  const [activeTab, setActiveTab] = useState<(typeof demoTabs)[number]["id"]>("messages");
  const latestMessage = messages[0];
  const latestReport = familyReports[0];
  const latestSchedule = schedules[0];
  const latestLocation = familyLocations[0];

  return (
    <div className="min-h-screen bg-board-pattern px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="paper-card overflow-hidden p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blush px-4 py-2 text-sm font-semibold text-ink">
                <Image src="/icons/icons.png" alt="KAZOQ icon" width={18} height={18} className="h-[18px] w-[18px] rounded-md object-cover" />
                KAZOQ
              </div>
              <h1 className="mt-4 text-4xl font-black leading-tight text-ink sm:text-5xl">
                家族の毎日を
                <span className="block text-coral">報連相でやさしく回す。</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-ink/75">
                KAZOQ は、家族チャットでは流れやすい「ご飯の返事」「欠食届」「外泊届」「帰宅連絡」を、
                家庭の中で見やすく残せる生活連携アプリです。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/auth#login" className="inline-flex items-center gap-2 rounded-3xl bg-coral px-5 py-3 font-semibold text-white shadow-sticker">
                  <LogIn className="h-4 w-4" />
                  ログイン
                </Link>
                <Link href="/auth#login" className="inline-flex items-center gap-2 rounded-3xl bg-white px-5 py-3 font-semibold text-ink shadow-sticker">
                  <UserPlus className="h-4 w-4" />
                  新規登録
                </Link>
                <Link href="/auth" className="inline-flex items-center gap-2 rounded-3xl bg-cream px-5 py-3 font-semibold text-ink">
                  家族ルームを作る
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#demo" className="inline-flex items-center gap-2 rounded-3xl bg-white/70 px-5 py-3 font-semibold text-ink">
                  デモを見る
                </a>
              </div>
            </div>

            <div className="rounded-[30px] bg-white/80 p-3 shadow-sticker">
              <Image src="/icons/top.png" alt="KAZOQ top visual" width={1536} height={512} className="h-auto w-full rounded-[24px] object-cover" priority />
            </div>
          </div>
        </section>

        <section id="demo" className="paper-card p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="text-sm font-semibold text-coral">Top Demo</p>
              <h2 className="mt-2 text-3xl font-black text-ink">トップだけで操作感を試せます。</h2>
              <p className="mt-3 text-sm leading-7 text-ink/75">
                β版ではログイン後デモを終了し、公開トップでは操作感だけを確認できるようにします。家族ルームの実データには入りません。
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {demoTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTab === tab.id ? "bg-coral text-white shadow-sticker" : "bg-cream text-ink"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/60 bg-white/78 p-4 shadow-sticker backdrop-blur">
              {activeTab === "messages" ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-ink/65">今日の家族メッセージ</p>
                  <div className="rounded-4xl bg-cream px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">{latestMessage.category}</span>
                      <span className="text-xs text-ink/55">{latestMessage.createdAt}</span>
                    </div>
                    <p className="mt-3 font-semibold">{latestMessage.body}</p>
                    {latestMessage.templatePayload ? (
                      <div className="mt-3 grid gap-2">
                        {latestMessage.templatePayload.fields.map((field) => (
                          <div key={field.label} className="rounded-3xl bg-white px-4 py-3">
                            <p className="text-xs font-semibold text-ink/55">{field.label}</p>
                            <p className="mt-1 text-sm">{field.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {activeTab === "reports" ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-ink/65">家庭内ワークフロー</p>
                  <div className="rounded-4xl bg-cream px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{latestReport.title}</p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">{latestReport.status}</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-ink/75">{latestReport.summary}</p>
                    <div className="mt-3 space-y-2">
                      {latestReport.actions.slice(0, 3).map((action) => (
                        <div key={action.id} className="rounded-3xl bg-white px-4 py-3">
                          <p className="text-sm font-semibold">{action.label}</p>
                          <p className="mt-1 text-sm text-ink/70">{action.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "calendar" ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-ink/65">予定の見え方</p>
                  <div className="rounded-4xl bg-cream px-4 py-4">
                    <p className="font-semibold">{latestSchedule.title}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink/75">
                      <span className="rounded-full bg-white px-3 py-1">{latestSchedule.date}</span>
                      <span className="rounded-full bg-white px-3 py-1">
                        {latestSchedule.startTime} - {latestSchedule.endTime}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1">{latestSchedule.type}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-ink/70">学校、通院、家族の予定をまとめて見られる構成です。</p>
                  </div>
                </div>
              ) : null}

              {activeTab === "locations" ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-ink/65">場所共有の見え方</p>
                  <div className="rounded-4xl bg-cream px-4 py-4">
                    <p className="font-semibold">{latestLocation.label}</p>
                    <p className="mt-2 text-sm text-ink/70">更新: {latestLocation.updatedAt}</p>
                    <div className="mt-4 rounded-[28px] bg-gradient-to-br from-sky/70 via-white to-mint/70 p-6">
                      <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold">位置共有 / 登録地点 / 予定連携</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "ご飯と届け出",
              icon: House,
              body: "できたよ、いらない、取り置き、外泊。家庭の判断が必要なことだけを迷わず整理します。 "
            },
            {
              title: "ツリーで追える",
              icon: GitBranch,
              body: "依頼、返答、承認、完了までが一本で残るので、あとから見返しても分かりやすいです。"
            },
            {
              title: "家族ルーム制",
              icon: Users,
              body: "最初に家族ルームを作っておけば、招待コードでメンバー追加と初期設定をまとめて進められます。"
            }
          ].map((item) => (
            <article key={item.title} className="paper-card p-5">
              <item.icon className="h-6 w-6" />
              <h2 className="mt-4 text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-ink/75">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="paper-card p-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { step: "1", title: "新規登録", body: "まずは保護者か代表メンバーとしてアカウントを作成します。" },
              { step: "2", title: "家族ルーム作成", body: "家族名、あなたの立場、ひとことを入れて最初の部屋を作ります。" },
              { step: "3", title: "招待して開始", body: "招待コードで家族を追加し、そのまま報連相とメッセージを始められます。" }
            ].map((item) => (
              <div key={item.step} className="rounded-4xl bg-white px-5 py-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream font-bold">{item.step}</div>
                <p className="mt-4 font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-ink/75">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
