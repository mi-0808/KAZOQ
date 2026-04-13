import { CalendarPlus2, Clock3, MapPinned } from "lucide-react";
import { createScheduleAction, updateScheduleAction } from "@/app/(app)/calendar/actions";
import { Chip } from "@/components/shared/chip";
import { SectionCard } from "@/components/shared/section-card";
import { CalendarBoardData } from "@/lib/repositories/calendar";

export function CalendarBoard({ data }: { data: CalendarBoardData }) {
  const { weekDays, schedules, places, profiles } = data;

  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionCard
          title="家族カレンダー"
          subtitle="家族予定と個人予定を一緒に整理"
          action={
            <div className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-2 text-sm font-semibold">
              <CalendarPlus2 className="h-4 w-4" />
              予定を作成
            </div>
          }
        >
          <form action={createScheduleAction} className="mb-4 grid gap-3 rounded-4xl bg-white p-4 md:grid-cols-2">
            <input name="title" className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none" placeholder="予定名" />
            <select name="type" defaultValue="家族" className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none">
              <option value="家族">家族</option>
              <option value="個人">個人</option>
            </select>
            <input type="date" name="date" className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input type="time" name="startTime" className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none" />
              <input type="time" name="endTime" className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none" />
            </div>
            <select name="ownerId" className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none">
              <option value="">担当者なし</option>
              {profiles.map((profile) => (
                <option key={profile.userId} value={profile.userId}>
                  {profile.name}
                </option>
              ))}
            </select>
            <select name="placeId" className="rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none">
              <option value="">場所未設定</option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
            </select>
            <textarea name="note" className="min-h-24 rounded-3xl border border-softline bg-paper px-4 py-3 text-sm outline-none md:col-span-2" placeholder="メモ（任意）" />
            <button className="rounded-3xl bg-sky px-4 py-3 text-sm font-semibold md:col-span-2">この内容で予定を追加</button>
          </form>
          <div className="grid gap-3 md:grid-cols-4">
            {weekDays.map((day) => (
              <div key={day.date} className="rounded-4xl bg-white p-4">
                <p className="text-sm text-ink/60">{day.day}</p>
                <p className="text-xl font-bold">{day.date}</p>
                <div className="mt-4 space-y-3">
                  {schedules
                    .filter((item) => item.date === day.date)
                    .map((item) => (
                      <div key={item.id} className="rounded-3xl bg-cream px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Chip color={item.type === "家族" ? "bg-orange text-ink" : "bg-mint text-ink"}>{item.type}</Chip>
                        </div>
                        <p className="mt-2 text-sm font-semibold">{item.title}</p>
                        <p className="mt-1 text-xs text-ink/70">
                          {item.startTime} - {item.endTime}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="予定作成のしやすさ" subtitle="メッセージ起点で追加できる構造">
          <div className="space-y-3">
            {[
              "ご飯テンプレから夕飯予定へ",
              "部活投稿から終了予定へ",
              "買い物メモから週末タスクへ"
            ].map((text) => (
              <div key={text} className="rounded-3xl bg-white px-4 py-4">
                <p className="font-semibold">{text}</p>
                <p className="mt-1 text-sm text-ink/70">`source_message_id` を持てるので後から遷移しやすい設計です。</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <SectionCard title="家族予定一覧" subtitle="場所情報と所有者も合わせて確認">
        <div className="grid gap-3">
          {schedules.length === 0 ? (
            <div className="rounded-4xl bg-white px-4 py-6 text-sm text-ink/70">まだ予定がありません。実データの予定が入るとここに表示されます。</div>
          ) : null}
          {schedules.map((item) => {
            const owner = profiles.find((profile) => profile.userId === item.ownerId);
            const place = places.find((value) => value.id === item.placeId);
            return (
              <div key={item.id} className="grid gap-4 rounded-4xl bg-white px-4 py-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{item.title}</p>
                    <Chip color={item.type === "家族" ? "bg-orange text-ink" : "bg-mint text-ink"}>{item.type}</Chip>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink/70">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-4 w-4" />
                      {item.date} {item.startTime} - {item.endTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPinned className="h-4 w-4" />
                      {place?.name ?? "未設定"}
                    </span>
                    <span>{owner ? `${owner.name}の予定` : "家族みんな"}</span>
                  </div>
                </div>
                <details className="rounded-3xl bg-cream px-4 py-3">
                  <summary className="cursor-pointer text-sm font-semibold">編集</summary>
                  <form action={updateScheduleAction} className="mt-3 grid gap-3">
                    <input type="hidden" name="scheduleId" value={item.id} />
                    <input name="title" defaultValue={item.title} className="rounded-3xl border border-softline bg-white px-4 py-3 text-sm outline-none" />
                    <select name="type" defaultValue={item.type} className="rounded-3xl border border-softline bg-white px-4 py-3 text-sm outline-none">
                      <option value="家族">家族</option>
                      <option value="個人">個人</option>
                    </select>
                    <input type="date" name="date" defaultValue={item.dateValue} className="rounded-3xl border border-softline bg-white px-4 py-3 text-sm outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="time" name="startTime" defaultValue={item.startTime} className="rounded-3xl border border-softline bg-white px-4 py-3 text-sm outline-none" />
                      <input type="time" name="endTime" defaultValue={item.endTime} className="rounded-3xl border border-softline bg-white px-4 py-3 text-sm outline-none" />
                    </div>
                    <select name="ownerId" defaultValue={item.ownerId ?? ""} className="rounded-3xl border border-softline bg-white px-4 py-3 text-sm outline-none">
                      <option value="">担当者なし</option>
                      {profiles.map((profile) => (
                        <option key={profile.userId} value={profile.userId}>
                          {profile.name}
                        </option>
                      ))}
                    </select>
                    <select name="placeId" defaultValue={item.placeId ?? ""} className="rounded-3xl border border-softline bg-white px-4 py-3 text-sm outline-none">
                      <option value="">場所未設定</option>
                      {places.map((place) => (
                        <option key={place.id} value={place.id}>
                          {place.name}
                        </option>
                      ))}
                    </select>
                    <textarea name="note" defaultValue={item.note ?? ""} className="min-h-20 rounded-3xl border border-softline bg-white px-4 py-3 text-sm outline-none" />
                    <button className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold">更新する</button>
                  </form>
                </details>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
