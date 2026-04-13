"use client";

import { CheckCircle2, HeartHandshake, KeyRound, LockKeyhole, Mail, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createFamilyRoomAction, joinFamilyAction, quickDemoLoginAction, signInAction, signUpAction } from "@/app/(auth)/auth/actions";
import { defaultFamilyPreferences, favoriteFeatureOptions, menuItemOptions, shortcutOptions } from "@/lib/family-preferences";

export function AuthScreen({
  isSignedIn,
  hasFamilyRoom,
  accountLabel,
  errorMessage
}: {
  isSignedIn: boolean;
  hasFamilyRoom: boolean;
  accountLabel?: string;
  errorMessage?: string;
}) {
  const isStepOneDone = isSignedIn;
  const familyFormsEnabled = isSignedIn && !hasFamilyRoom;

  return (
    <div className="min-h-screen bg-board-pattern px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="paper-card overflow-hidden p-8">
          <div className="playful-pill inline-flex items-center gap-2 bg-blush px-4 py-2 text-sm font-semibold text-ink">
            <Image src="/icons/icons.png" alt="KAZOQ icon" width={18} height={18} className="h-[18px] w-[18px] rounded-md object-cover" />
            KAZOQ
          </div>
          <div className="mt-5 overflow-hidden rounded-[28px] bg-white/75 p-3 shadow-sticker">
            <Image
              src="/icons/top.png"
              alt="KAZOQ top logo"
              width={1536}
              height={512}
              className="h-auto w-full rounded-[22px] object-cover"
              priority
            />
          </div>
          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight text-ink">
            家族の毎日をまとめる
            <span className="block text-coral">生活連携アプリ KAZOQ。</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink/75">
            KAZOQ は、家族の会話だけでなく、ご飯、予定、見守り、気持ちの共有までまとめて見えるようにしたMVPです。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "ご飯や買い物", color: "bg-orange", icon: HeartHandshake },
                { label: "予定と場所", color: "bg-sky", image: true },
                { label: "報連相ツリー", color: "bg-mint", image: true }
              ].map((item) => (
              <div key={item.label} className={`rounded-4xl border-2 border-white/70 p-4 ${item.color}`}>
                {"icon" in item && item.icon ? (
                  <item.icon className="h-5 w-5" />
                ) : (
                  <Image src="/icons/icons.png" alt="KAZOQ icon" width={20} height={20} className="h-5 w-5 rounded-md object-cover" />
                )}
                <p className="mt-3 text-sm font-semibold">{item.label}</p>
                <p className="mt-2 text-sm text-ink/75">テンプレで迷わず投稿できる設計です。</p>
              </div>
            ))}
          </div>
        </section>

        <section className="paper-card p-6 sm:p-8">
          <div className="space-y-6">
            {errorMessage ? (
              <div className="rounded-3xl border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-medium text-ink">
                {errorMessage}
              </div>
            ) : null}
            <div className="rounded-4xl bg-cream p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className={`rounded-3xl px-4 py-4 ${isStepOneDone ? "bg-white" : "bg-white/70"}`}>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {isStepOneDone ? <CheckCircle2 className="h-4 w-4 text-coral" /> : <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">1</span>}
                    アカウント作成
                  </div>
                  <p className="mt-2 text-sm text-ink/70">
                    {isStepOneDone ? `${accountLabel ?? "登録済みアカウント"} でログイン済みです。` : "まず表示名・メール・パスワードを登録します。"}
                  </p>
                </div>
                <div className={`rounded-3xl px-4 py-4 ${familyFormsEnabled ? "bg-white" : "bg-white/70"}`}>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {familyFormsEnabled ? <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">2</span> : <LockKeyhole className="h-4 w-4 text-ink/50" />}
                    家族ルーム作成
                  </div>
                  <p className="mt-2 text-sm text-ink/70">
                    {familyFormsEnabled ? "次に家族ルームを作るか、招待コードで参加します。" : "ステップ1が終わるとここが入力できるようになります。"}
                  </p>
                </div>
              </div>
            </div>

            <div id="login">
              <h2 className="text-2xl font-bold">ステップ1. アカウントを作成</h2>
              <p className="mt-1 text-sm text-ink/70">見た目はそのままに、先にアカウント作成、そのあと家族ルーム作成の順で進めます。</p>
            </div>
            <form className={`space-y-4 ${isStepOneDone ? "opacity-75" : ""}`}>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  表示名
                </span>
                <input name="name" className="w-full rounded-3xl border border-softline bg-white px-4 py-3 outline-none" placeholder="美咲" />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  メールアドレス
                </span>
                <input name="email" className="w-full rounded-3xl border border-softline bg-white px-4 py-3 outline-none" placeholder="family@example.com" />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <KeyRound className="h-4 w-4" />
                  パスワード
                </span>
                <input
                  name="password"
                  type="password"
                  className="w-full rounded-3xl border border-softline bg-white px-4 py-3 outline-none"
                  placeholder="••••••••"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button formAction={signInAction} className="w-full rounded-3xl bg-coral px-4 py-3 text-base font-semibold text-white shadow-sticker">
                  ログインして続ける
                </button>
                <button formAction={signUpAction} className="w-full rounded-3xl bg-white px-4 py-3 text-base font-semibold text-ink shadow-sticker">
                  新規登録して次へ
                </button>
              </div>
            </form>

            <form action={createFamilyRoomAction} className={`rounded-4xl bg-white p-5 transition ${familyFormsEnabled ? "opacity-100" : "pointer-events-none opacity-50"}`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <HeartHandshake className="h-4 w-4" />
                ステップ2. 家族ルームを作る
              </div>
              {!familyFormsEnabled ? <p className="mt-2 text-sm text-ink/65">先に上のアカウント作成を完了すると、このまま続けて家族ルームを作成できます。</p> : null}
              <div className="mt-3 grid gap-3">
                <input name="familyName" className="rounded-3xl border border-softline bg-paper px-4 py-3 outline-none" placeholder="例: さくら家" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input name="relationLabel" className="rounded-3xl border border-softline bg-paper px-4 py-3 outline-none" placeholder="例: お母さん" />
                  <select name="roleLabel" className="rounded-3xl border border-softline bg-paper px-4 py-3 outline-none">
                    {["親", "子", "祖父母", "保護者", "その他"].map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <input name="organization" className="rounded-3xl border border-softline bg-paper px-4 py-3 outline-none" placeholder="学校名や所属（任意）" />
                <input name="status" className="rounded-3xl border border-softline bg-paper px-4 py-3 outline-none" placeholder="今日のひとこと（任意）" />
                <div className="rounded-[28px] bg-cream p-4">
                  <p className="text-sm font-semibold">初期オンボーディング</p>
                  <p className="mt-1 text-sm text-ink/70">最初に使いやすいよう、ホームとメニューを家族向けに整えます。</p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm font-semibold">メニューに出す機能</p>
                      <div className="mt-2 grid gap-2">
                        {menuItemOptions.map((item) => (
                          <label key={item.id} className="flex items-start gap-3 rounded-3xl bg-white px-4 py-3">
                            <input
                              type="checkbox"
                              name="menuItemIds"
                              value={item.id}
                              defaultChecked={defaultFamilyPreferences.menuItemIds.includes(item.id)}
                              className="mt-1 h-4 w-4 accent-coral"
                            />
                            <span>
                              <span className="block text-sm font-semibold">{item.label}</span>
                              <span className="block text-sm text-ink/70">{item.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">ホームのショートカット</p>
                      <div className="mt-2 grid gap-2">
                        {shortcutOptions.map((item) => (
                          <label key={item.id} className="flex items-start gap-3 rounded-3xl bg-white px-4 py-3">
                            <input
                              type="checkbox"
                              name="shortcutItemIds"
                              value={item.id}
                              defaultChecked={defaultFamilyPreferences.shortcutItemIds.includes(item.id)}
                              className="mt-1 h-4 w-4 accent-coral"
                            />
                            <span>
                              <span className="block text-sm font-semibold">{item.label}</span>
                              <span className="block text-sm text-ink/70">{item.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">よく使う機能</p>
                      <div className="mt-2 grid gap-2">
                        {favoriteFeatureOptions.map((item) => (
                          <label key={item.id} className="flex items-start gap-3 rounded-3xl bg-white px-4 py-3">
                            <input
                              type="checkbox"
                              name="favoriteItemIds"
                              value={item.id}
                              defaultChecked={defaultFamilyPreferences.favoriteItemIds.includes(item.id)}
                              className="mt-1 h-4 w-4 accent-coral"
                            />
                            <span>
                              <span className="block text-sm font-semibold">{item.label}</span>
                              <span className="block text-sm text-ink/70">{item.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <button className="rounded-3xl bg-coral px-4 py-3 font-semibold text-white shadow-sticker">家族ルームを作成</button>
              </div>
            </form>

            <form action={joinFamilyAction} className={`rounded-4xl bg-cream p-5 transition ${familyFormsEnabled ? "opacity-100" : "pointer-events-none opacity-50"}`} id="join">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4" />
                または招待コードで参加
              </div>
              {!familyFormsEnabled ? <p className="mt-2 text-sm text-ink/65">ログイン後に、招待コードから家族グループへ参加できます。</p> : null}
              <div className="mt-3 grid gap-3">
                <input name="inviteCode" className="flex-1 rounded-3xl border border-softline bg-white px-4 py-3 outline-none" placeholder="招待コードを入力" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input name="relationLabel" className="rounded-3xl border border-softline bg-white px-4 py-3 outline-none" placeholder="例: お母さん" />
                  <select name="roleLabel" className="rounded-3xl border border-softline bg-white px-4 py-3 outline-none">
                    {["親", "子", "祖父母", "保護者", "その他"].map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="rounded-3xl bg-lavender px-4 py-3 font-semibold shadow-sticker">参加</button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
              <form action={quickDemoLoginAction}>
                <button className="font-semibold text-coral">デモ用にそのまま入る</button>
              </form>
              <span>または</span>
              <Link href="/home" className="font-semibold text-coral">
                ホーム画面へ移動
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
