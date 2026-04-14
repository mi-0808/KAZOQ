"use client";

import { KeyRound, Mail, UserPlus, Users, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signInAction, signUpAction } from "@/app/(auth)/auth/actions";

export function AuthCredentialScreen({
  mode,
  errorMessage
}: {
  mode: "login" | "signup";
  errorMessage?: string;
}) {
  const isSignup = mode === "signup";
  const title = isSignup ? "アカウントを作成" : "アカウントにログイン";
  const subtitle = isSignup
    ? "新規登録が完了すると、そのまま家族ルーム作成へ進みます。"
    : "既存アカウントでログインして、自分の家族ルームへ進みます。";
  const action = isSignup ? signUpAction : signInAction;
  const buttonLabel = isSignup ? "新規登録して次へ" : "ログインして続ける";
  const errorPath = isSignup ? "/auth/signup" : "/auth/login";

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
            {isSignup ? "はじめての家族アカウントを" : "すでにあるアカウントで"}
            <span className="block text-coral">{isSignup ? "ここで作成します。" : "ここから再開します。"}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink/75">
            {isSignup
              ? "まずアカウントを登録し、そのあと家族ルーム作成か招待コード参加へ進みます。"
              : "ログイン後は、家族ルーム未所属なら家族ルーム作成、所属済みなら自分のルームへ進みます。"}
          </p>
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
                    {isSignup ? "新規登録" : "ログイン"}
                  </div>
                  <p className="mt-2 text-sm text-ink/70">{isSignup ? "新しいアカウントを作成します。" : "既存アカウントでサインインします。"}</p>
                </div>
                <div className="rounded-3xl bg-white/70 px-4 py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-ink">2</span>
                    家族ルーム
                  </div>
                  <p className="mt-2 text-sm text-ink/70">次に家族ルーム作成、または既存ルームへ参加します。</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-1 text-sm text-ink/70">{subtitle}</p>
            </div>

            <form className="space-y-4">
              <input type="hidden" name="errorPath" value={errorPath} />
              {isSignup ? (
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    表示名
                  </span>
                  <input name="name" className="w-full rounded-3xl border border-softline bg-white px-4 py-3 outline-none" placeholder="美咲" />
                </label>
              ) : null}
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
                <input name="password" type="password" className="w-full rounded-3xl border border-softline bg-white px-4 py-3 outline-none" placeholder="••••••••" />
              </label>
              <button formAction={action} className="w-full rounded-3xl bg-coral px-4 py-3 text-base font-semibold text-white shadow-sticker">
                {buttonLabel}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
              <Link href="/auth" className="font-semibold text-coral">
                認証メニューへ戻る
              </Link>
              <Link href={isSignup ? "/auth/login" : "/auth/signup"} className="font-semibold text-coral">
                {isSignup ? "すでにアカウントがあるのでログイン" : "はじめて使うので新規登録"}
              </Link>
            </div>

            <div className="rounded-4xl bg-white px-5 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                {isSignup ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                {isSignup ? "新規登録後" : "ログイン後"}
              </div>
              <p className="mt-2 text-sm leading-7 text-ink/70">
                {isSignup
                  ? "家族ルーム未所属なら `/auth/family` に進み、作成完了後に `/rooms/[familyId]` へ移動します。"
                  : "家族ルーム所属済みならそのまま `/rooms/[familyId]` へ、未所属なら `/auth/family` に進みます。"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
