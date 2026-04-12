"use client";

import { Pencil, School, Sparkles, UserRound } from "lucide-react";
import { updateProfileAction } from "@/app/(app)/profile/actions";
import { Chip } from "@/components/shared/chip";
import { SectionCard } from "@/components/shared/section-card";
import { Family, Profile } from "@/types/domain";

export function ProfileBoard({ family, profiles, currentProfile }: { family: Family; profiles: Profile[]; currentProfile: Profile }) {
  const primary = currentProfile;

  return (
    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <SectionCard
        title="プロフィール"
        subtitle="名前・役割・所属・一言を家族向けに見やすく"
        action={
          <button className="inline-flex items-center gap-2 rounded-full bg-blush px-4 py-2 text-sm font-semibold">
            <Pencil className="h-4 w-4" />
            編集
          </button>
        }
      >
        <form action={updateProfileAction} className="rounded-4xl bg-white p-5">
          <div className={`flex h-20 w-20 items-center justify-center rounded-full ${primary.accentColor} text-3xl font-bold`}>
            {primary.avatar}
          </div>
          <h2 className="mt-4 text-2xl font-bold">{primary.name}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip color="bg-cream text-ink">{primary.familyRole}</Chip>
            <Chip color="bg-mint text-ink">{primary.organization}</Chip>
          </div>
          <p className="mt-4 text-sm leading-7 text-ink/80">{primary.bio}</p>
          <div className="mt-5 grid gap-3">
            <input name="name" defaultValue={primary.name} className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none" placeholder="表示名" />
            <div className="grid gap-3 md:grid-cols-2">
              <select name="familyRole" defaultValue={primary.familyRole} className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none">
                {["親", "子", "祖父母", "保護者", "その他"].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <input
                name="organization"
                defaultValue={primary.organization}
                className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none"
                placeholder="学校名や所属"
              />
            </div>
            <input
              name="activities"
              defaultValue={primary.activities.join("、")}
              className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none"
              placeholder="部活、習い事、担当など"
            />
            <textarea
              name="bio"
              defaultValue={primary.bio}
              className="min-h-24 rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none"
              placeholder="家族への一言"
            />
          </div>
          <div className="mt-5 rounded-4xl bg-cream p-4">
            <p className="text-sm font-semibold">今日のひとこと</p>
            <input
              name="status"
              defaultValue={primary.status}
              className="mt-2 w-full rounded-3xl border border-softline bg-white px-4 py-3 text-sm text-ink/75 outline-none"
              placeholder="今日の様子"
            />
          </div>
          <button className="mt-4 w-full rounded-3xl bg-blush px-4 py-3 text-sm font-semibold">プロフィールを保存</button>
        </form>
      </SectionCard>

      <div className="space-y-5">
        <SectionCard title="家族メンバー" subtitle="役割や所属をやさしく整理">
          <div className="grid gap-3 md:grid-cols-2">
            {family.members.map((member) => {
              const profile = profiles.find((item) => item.userId === member.userId);
              return (
                <div key={member.id} className="rounded-4xl bg-white px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${profile?.accentColor} font-bold`}>
                      {profile?.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{profile?.name}</p>
                      <p className="text-sm text-ink/65">{member.relationLabel}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Chip color="bg-lavender text-ink">{member.roleLabel}</Chip>
                    <Chip color="bg-cream text-ink">{profile?.organization}</Chip>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="入力項目設計" subtitle="プロフィール編集で保持したい情報">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { title: "基本情報", icon: UserRound, text: "名前、家族内役割、アイコン画像" },
              { title: "所属", icon: School, text: "学校名、勤務先、習い事、部活" },
              { title: "一言コメント", icon: Sparkles, text: "体調や帰宅時間など毎日の状態" }
            ].map((item) => (
              <div key={item.title} className="rounded-3xl bg-white px-4 py-4">
                <item.icon className="h-5 w-5" />
                <p className="mt-3 font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-ink/70">{item.text}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="活動タグ" subtitle="子どもの部活や大人の担当も見える化">
          <div className="space-y-3">
            {profiles.map((profile) => (
              <div key={profile.userId} className="rounded-3xl bg-white px-4 py-4">
                <p className="font-semibold">{profile.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.activities.map((activity) => (
                    <Chip key={activity} color="bg-sky text-ink">
                      {activity}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
