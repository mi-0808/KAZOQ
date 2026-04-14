"use client";

import { HeartHandshake, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createFamilyRoomAction, joinFamilyAction } from "@/app/(auth)/auth/actions";
import { defaultFamilyPreferences, favoriteFeatureOptions, menuItemOptions, shortcutOptions } from "@/lib/family-preferences";

export function FamilyRoomSetupScreen({
  accountLabel,
  errorMessage
}: {
  accountLabel?: string;
  errorMessage?: string;
}) {
  return (
    <div className="min-h-screen bg-board-pattern px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="paper-card overflow-hidden p-8">
          <div className="playful-pill inline-flex items-center gap-2 bg-blush px-4 py-2 text-sm font-semibold text-ink">
            <Image src="/icons/icons.png" alt="KAZOQ icon" width={18} height={18} className="h-[18px] w-[18px] rounded-md object-cover" />
            KAZOQ
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-ink">
            家族ルームをつくって
            <span className="block text-coral">ルームIDを発行します。</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink/75">
            アカウント作成は完了しています。ここで新しい家族ルームを作るか、招待コードで参加すると、
            <span className="font-semibold text-ink"> `/rooms/[familyId]` </span>
            の正規URLへ進みます。
          </p>

          <div className="mt-8 rounded-[28px] bg-white/80 p-5 shadow-sticker">
            <p className="text-sm font-semibold text-ink">現在のアカウント</p>
            <p className="mt-2 text-lg font-bold text-coral">{accountLabel ?? "ログイン済み"}</p>
            <p className="mt-2 text-sm text-ink/70">ここで家族ルームを作成した時点で、招待コードとルームIDが使えるようになります。</p>
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
                  <p className="mt-2 text-sm text-ink/70">完了済みです。次に家族ルームをつなげます。</p>
                </div>
                <div className="rounded-3xl bg-white px-4 py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">2</span>
                    家族ルーム作成 / 参加
                  </div>
                  <p className="mt-2 text-sm text-ink/70">完了すると自分のルームへ移動します。</p>
                </div>
              </div>
            </div>

            <form action={createFamilyRoomAction} className="rounded-4xl bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <HeartHandshake className="h-4 w-4" />
                家族ルームを新しく作る
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
                <div className="rounded-[28px] bg-cream p-4">
                  <p className="text-sm font-semibold">初期オンボーディング</p>
                  <p className="mt-1 text-sm text-ink/70">メニュー、ショートカット、よく使う機能を最初から整えます。</p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm font-semibold">メニューに出す機能</p>
                      <div className="mt-2 grid gap-2">
                        {menuItemOptions.map((item) => (
                          <label key={item.id} className="flex items-start gap-3 rounded-3xl bg-white px-4 py-3">
                            <input type="checkbox" name="menuItemIds" value={item.id} defaultChecked={defaultFamilyPreferences.menuItemIds.includes(item.id)} className="mt-1 h-4 w-4 accent-coral" />
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
                            <input type="checkbox" name="shortcutItemIds" value={item.id} defaultChecked={defaultFamilyPreferences.shortcutItemIds.includes(item.id)} className="mt-1 h-4 w-4 accent-coral" />
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
                            <input type="checkbox" name="favoriteItemIds" value={item.id} defaultChecked={defaultFamilyPreferences.favoriteItemIds.includes(item.id)} className="mt-1 h-4 w-4 accent-coral" />
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
                <button className="rounded-3xl bg-coral px-4 py-3 font-semibold text-white shadow-sticker">ルームを作成してIDを発行</button>
              </div>
            </form>

            <form action={joinFamilyAction} className="rounded-4xl bg-cream p-5" id="join">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4" />
                招待コードで参加する
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
                <button className="rounded-3xl bg-lavender px-4 py-3 font-semibold shadow-sticker">参加して自分のルームへ進む</button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
              <Link href="/auth" className="font-semibold text-coral">
                アカウント画面へ戻る
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
