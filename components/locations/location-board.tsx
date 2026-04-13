import { Navigation, Plus, Radar } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { LocationBoardData } from "@/lib/repositories/locations";

export function LocationBoard({ data }: { data: LocationBoardData }) {
  const { familyLocations, places, profiles, schedules } = data;

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <SectionCard
        title="家族マップ"
        subtitle="MVPではモック表示。現在地と登録地点を同じ面で確認"
        action={
          <button className="inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-sm font-semibold">
            <Plus className="h-4 w-4" />
            地点を追加
          </button>
        }
      >
        <div className="relative min-h-[460px] overflow-hidden rounded-4xl bg-gradient-to-br from-sky/70 via-paper to-mint/70 p-6">
          <div className="absolute inset-6 rounded-[32px] border-2 border-dashed border-white/70" />
          <div className="absolute left-[18%] top-[20%] rounded-full bg-white/80 px-3 py-2 text-xs font-semibold">学校エリア</div>
          <div className="absolute left-[56%] top-[26%] rounded-full bg-white/80 px-3 py-2 text-xs font-semibold">駅前</div>
          <div className="absolute left-[34%] top-[62%] rounded-full bg-white/80 px-3 py-2 text-xs font-semibold">自宅周辺</div>

          <div className="map-dot left-[30%] top-[58%] bg-blush" />
          <div className="map-dot left-[62%] top-[30%] bg-sky" />
          <div className="map-dot left-[20%] top-[24%] bg-mint" />
          <div className="map-dot left-[74%] top-[44%] bg-lavender" />

          <div className="absolute bottom-4 left-4 rounded-3xl bg-white/85 px-4 py-3 text-sm">
            <p className="font-semibold">地図の将来拡張</p>
            <p className="mt-1 text-ink/70">Google Maps / MapLibre 差し替えを想定したプレースホルダーです。</p>
          </div>
        </div>
      </SectionCard>

      <div className="space-y-5">
        <SectionCard title="家族の位置" subtitle="見守り用途を意識したやさしい表示">
          <div className="space-y-3">
            {familyLocations.length === 0 ? (
              <div className="rounded-3xl bg-white px-4 py-6 text-sm text-ink/70">位置情報がまだありません。Supabase の `locations` にデータが入ると反映されます。</div>
            ) : null}
            {familyLocations.map((location) => {
              const profile = profiles.find((item) => item.userId === location.userId);
              return (
                <div key={location.id} className="flex items-start gap-3 rounded-3xl bg-white px-4 py-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full ${profile?.accentColor} font-bold`}>
                    {profile?.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{profile?.name}</p>
                      <Radar className="h-4 w-4 text-ink/55" />
                    </div>
                    <p className="mt-1 text-sm text-ink/75">{location.label}</p>
                    <p className="mt-1 text-xs text-ink/60">更新: {location.updatedAt}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="登録地点" subtitle="学校・習い事・旅行先などを家族単位で管理">
          <div className="space-y-3">
            {places.length === 0 ? (
              <div className="rounded-3xl bg-white px-4 py-6 text-sm text-ink/70">登録地点がまだありません。`place_registrations` に追加するとここへ出ます。</div>
            ) : null}
            {places.map((place) => (
              <div key={place.id} className="rounded-3xl bg-white px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className={`h-4 w-4 rounded-full ${place.color}`} />
                  <p className="font-semibold">{place.name}</p>
                </div>
                <p className="mt-1 text-sm text-ink/70">{place.category} / {place.address}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="予定と場所の連携" subtitle="カレンダーの予定から移動先を把握しやすく">
          <div className="space-y-3">
            {schedules.length === 0 ? (
              <div className="rounded-3xl bg-white px-4 py-6 text-sm text-ink/70">まだ予定がありません。予定と場所が紐づくとここで確認できます。</div>
            ) : null}
            {schedules.map((schedule) => {
              const place = places.find((item) => item.id === schedule.placeId);
              return (
                <div key={schedule.id} className="rounded-3xl bg-white px-4 py-4">
                  <p className="font-semibold">{schedule.title}</p>
                  <p className="mt-2 text-sm text-ink/70">
                    <Navigation className="mr-1 inline h-4 w-4" />
                    {place?.name ?? "場所未設定"} / {schedule.date} {schedule.startTime}
                  </p>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
