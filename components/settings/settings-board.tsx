"use client";

import { LayoutPanelTop, Settings2, Star, UsersRound } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { favoriteFeatureOptions, menuItemOptions, shortcutOptions } from "@/lib/family-preferences";
import { FamilyPreferences } from "@/types/domain";

export function SettingsBoard({
  familyName,
  preferences,
  action
}: {
  familyName: string;
  preferences: FamilyPreferences;
  action: (formData: FormData) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionCard title="家族ホーム設定" subtitle={`${familyName} に合わせて、初期導線と表示をカスタマイズできます。`}>
        <form action={action} className="space-y-5">
          <div className="rounded-4xl bg-white p-5">
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5" />
              <p className="font-semibold">メニューに出す機能</p>
            </div>
            <p className="mt-2 text-sm text-ink/70">ホームと設定は固定表示です。ここではそのほかの導線を選べます。</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {menuItemOptions.map((item) => (
                <label key={item.id} className="flex items-start gap-3 rounded-3xl bg-cream px-4 py-4">
                  <input
                    type="checkbox"
                    name="menuItemIds"
                    value={item.id}
                    defaultChecked={preferences.menuItemIds.includes(item.id)}
                    className="mt-1 h-4 w-4 accent-coral"
                  />
                  <span>
                    <span className="block font-semibold">{item.label}</span>
                    <span className="mt-1 block text-sm text-ink/70">{item.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-4xl bg-white p-5">
            <div className="flex items-center gap-2">
              <LayoutPanelTop className="h-5 w-5" />
              <p className="font-semibold">ホームのショートカット</p>
            </div>
            <p className="mt-2 text-sm text-ink/70">家族が最初に触る入口を選びます。未選択時は標準セットに戻ります。</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {shortcutOptions.map((item) => (
                <label key={item.id} className="flex items-start gap-3 rounded-3xl bg-cream px-4 py-4">
                  <input
                    type="checkbox"
                    name="shortcutItemIds"
                    value={item.id}
                    defaultChecked={preferences.shortcutItemIds.includes(item.id)}
                    className="mt-1 h-4 w-4 accent-coral"
                  />
                  <span>
                    <span className="block font-semibold">{item.label}</span>
                    <span className="mt-1 block text-sm text-ink/70">{item.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-4xl bg-white p-5">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <p className="font-semibold">よく使う機能</p>
            </div>
            <p className="mt-2 text-sm text-ink/70">ホーム上部に表示する、おすすめの機能カードです。</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {favoriteFeatureOptions.map((item) => (
                <label key={item.id} className="flex items-start gap-3 rounded-3xl bg-cream px-4 py-4">
                  <input
                    type="checkbox"
                    name="favoriteItemIds"
                    value={item.id}
                    defaultChecked={preferences.favoriteItemIds.includes(item.id)}
                    className="mt-1 h-4 w-4 accent-coral"
                  />
                  <span>
                    <span className="block font-semibold">{item.label}</span>
                    <span className="mt-1 block text-sm text-ink/70">{item.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-4xl bg-cream px-5 py-4">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              <p className="text-sm font-semibold text-ink/80">保存するとホームとメニューにすぐ反映されます。</p>
            </div>
            <button className="rounded-3xl bg-coral px-5 py-3 font-semibold text-white shadow-sticker">設定を保存</button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="使い方の目安" subtitle="迷ったときは、家族の連絡頻度に合わせて絞ると見やすくなります。">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "報連相が多い家族は、メニューとショートカットの両方に報連相を入れる",
            "学校や通院の共有が多い家族は、予定と場所を残す",
            "小さく始めたい場合は、よく使う機能を3〜4個に絞る"
          ].map((text) => (
            <div key={text} className="rounded-3xl bg-white px-4 py-4 text-sm leading-6 text-ink/75">
              {text}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
