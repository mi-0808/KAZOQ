"use client";

import { KeyRound, Mail, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signInAction, signUpAction } from "@/app/(auth)/auth/actions";

export function AuthScreen({ errorMessage }: { errorMessage?: string }) {
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
              { label: "ご飯や買い物", color: "bg-orange" },
              { label: "予定と場所", color: "bg-sky" },
              { label: "報連相ツリー", color: "bg-mint" }
            ].map((item) => (
              <div key={item.label} className={`rounded-4xl border-2 border-white/70 p-4 ${item.color}`}>
                <Image src="/icons/icons.png" alt="KAZOQ icon" width={20} height={20} className="h-5 w-5 rounded-md object-cover" />
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
                <div className="rounded-3xl bg-white px-4 py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">1</span>
                    アカウント作成
                  </div>
                  <p className="mt-2 text-sm text-ink/70">表示名、メール、パスワードを登録します。</p>
                </div>
                <div className="rounded-3xl bg-white/70 px-4 py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-ink">2</span>
                    家族ルーム作成
                  </div>
                  <p className="mt-2 text-sm text-ink/70">次の画面でルームを作成するか、招待コードで参加します。</p>
                </div>
              </div>
            </div>

            <div id="login">
              <h2 className="text-2xl font-bold">アカウントを作成</h2>
              <p className="mt-1 text-sm text-ink/70">新規登録またはログイン後に、家族ルームの専用画面へ進みます。</p>
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
                  新規登録して次へ
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
              <Link href="/auth/family" className="font-semibold text-coral">
                すでにログイン済みなら家族ルーム作成へ
              </Link>
              <Link href="/" className="font-semibold text-coral">
                トップでデモを見る
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
