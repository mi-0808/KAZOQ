import { CalendarPlus2, Clock3, MapPinned } from "lucide-react";
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
            <button className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-2 text-sm font-semibold">
              <CalendarPlus2 className="h-4 w-4" />
              予定を作成
            </button>
          }
        >
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
                <button className="rounded-full bg-cream px-4 py-2 text-sm font-semibold">編集</button>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
