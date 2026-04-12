import { Bell, LayoutPanelTop, ShieldCheck, SlidersHorizontal, UsersRound } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";

const settingGroups = [
  {
    title: "家族設定",
    icon: UsersRound,
    items: ["家族グループ名", "招待コード管理", "メンバーの役割設定"]
  },
  {
    title: "通知設定",
    icon: Bell,
    items: ["ご飯投稿だけ通知", "予定前の通知", "日記リアクション通知"]
  },
  {
    title: "表示項目",
    icon: LayoutPanelTop,
    items: ["ホームの表示カード", "テンプレ投稿の表示", "見守り表示のON/OFF"]
  },
  {
    title: "将来拡張",
    icon: ShieldCheck,
    items: ["公開範囲付き日記", "介護向けモード", "緊急通知の優先度"]
  }
];

export function SettingsBoard() {
  return (
    <div className="space-y-5">
      <SectionCard title="設定" subtitle="家族構成に応じて必要な機能を出し分けしやすくする">
        <div className="grid gap-4 md:grid-cols-2">
          {settingGroups.map((group) => (
            <div key={group.title} className="rounded-4xl bg-white p-5">
              <div className="flex items-center gap-2">
                <group.icon className="h-5 w-5" />
                <p className="font-semibold">{group.title}</p>
              </div>
              <div className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <label key={item} className="flex items-center justify-between rounded-3xl bg-cream px-4 py-3">
                    <span className="text-sm">{item}</span>
                    <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#6f6abf]" />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="MVP後の拡張しやすさ" subtitle="責務を分けているので機能追加をしやすい構造です">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "家事タスク管理を `tasks` と timeline 連携で追加",
            "買い物共同編集をテンプレ投稿から分離してリスト化",
            "家族タイプ別ホームを feature settings で出し分け"
          ].map((text) => (
            <div key={text} className="rounded-3xl bg-white px-4 py-4">
              <SlidersHorizontal className="h-5 w-5" />
              <p className="mt-3 text-sm leading-6 text-ink/75">{text}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
