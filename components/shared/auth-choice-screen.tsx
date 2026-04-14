"use client";

import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AuthChoiceScreen() {
  return (
    <div className="min-h-screen bg-board-pattern px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.04fr_0.96fr]">
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
            アカウントの入口を
            <span className="block text-coral">ログインと新規登録で分けました。</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink/75">
            スマホでも迷いにくいように、既存アカウントのログインと、はじめて使う人の新規登録を別ページにしています。
          </p>
        </section>

        <section className="paper-card p-6 sm:p-8">
          <div className="space-y-4">
            <div className="rounded-4xl bg-cream p-5">
              <p className="text-sm font-semibold text-coral">Auth Entry</p>
              <h2 className="mt-2 text-3xl font-black text-ink">どちらから始めますか？</h2>
              <p className="mt-2 text-sm leading-7 text-ink/75">アカウントがある人はログインへ。初めて使う人は新規登録へ進みます。</p>
            </div>

            <Link href="/auth/login" className="block rounded-4xl border border-softline/70 bg-white px-5 py-5 transition hover:bg-cream">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-coral/15 p-3 text-coral">
                    <LogIn className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">ログインする</p>
                    <p className="mt-1 text-sm text-ink/70">すでに作成済みのアカウントで続けます。</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-ink/55" />
              </div>
            </Link>

            <Link href="/auth/signup" className="block rounded-4xl border border-softline/70 bg-white px-5 py-5 transition hover:bg-cream">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky/25 p-3 text-ink">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">新規登録する</p>
                    <p className="mt-1 text-sm text-ink/70">表示名・メール・パスワードを登録して家族ルーム作成へ進みます。</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-ink/55" />
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-ink/70">
              <Link href="/" className="font-semibold text-coral">
                トップでデモを見る
              </Link>
              <Link href="/auth/family" className="font-semibold text-coral">
                すでにログイン済みなら家族ルーム作成へ
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
