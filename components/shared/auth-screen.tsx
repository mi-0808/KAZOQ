"use client";

import { HeartHandshake, KeyRound, Mail, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createFamilyRoomAction, joinFamilyAction, quickDemoLoginAction, signInAction, signUpAction } from "@/app/(auth)/auth/actions";

export function AuthScreen() {
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
            <div id="login">
              <h2 className="text-2xl font-bold">ログイン</h2>
              <p className="mt-1 text-sm text-ink/70">KAZOQ に入って、家族の今日をひと目で確認できます。</p>
            </div>
            <form className="space-y-4">
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
                  新規登録する
                </button>
              </div>
            </form>

            <form action={createFamilyRoomAction} className="rounded-4xl bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <HeartHandshake className="h-4 w-4" />
                家族ルームを作る
              </div>
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
                <button className="rounded-3xl bg-coral px-4 py-3 font-semibold text-white shadow-sticker">家族ルームを作成</button>
              </div>
            </form>

            <form action={joinFamilyAction} className="rounded-4xl bg-cream p-5" id="join">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4" />
                家族グループへ参加
              </div>
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
