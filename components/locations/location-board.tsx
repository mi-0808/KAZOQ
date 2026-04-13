import { Navigation, Plus, Radar } from "lucide-react";
import { createPlaceRegistrationAction } from "@/app/(app)/locations/actions";
import { SectionCard } from "@/components/shared/section-card";
import { LocationAutoUpdater } from "@/components/locations/location-auto-updater";
import { LocationBoardData } from "@/lib/repositories/locations";

export function LocationBoard({ data }: { data: LocationBoardData }) {
  const { familyLocations, places, profiles, schedules, preferences } = data;
  const geoPoints = [
    ...places.filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lng)).map((place) => ({
      id: place.id,
      label: place.name,
      lat: place.lat,
      lng: place.lng,
      color: place.color,
      kind: "place" as const
    })),
    ...familyLocations
      .filter((location) => Number.isFinite(location.lat) && Number.isFinite(location.lng))
      .map((location) => ({
        id: location.id,
        label: location.label,
        lat: location.lat as number,
        lng: location.lng as number,
        color: profiles.find((profile) => profile.userId === location.userId)?.accentColor ?? "bg-sky",
        kind: "member" as const
      }))
  ];
  const latitudes = geoPoints.map((point) => point.lat);
  const longitudes = geoPoints.map((point) => point.lng);
  const minLat = latitudes.length ? Math.min(...latitudes) : 35.64;
  const maxLat = latitudes.length ? Math.max(...latitudes) : 35.66;
  const minLng = longitudes.length ? Math.min(...longitudes) : 139.64;
  const maxLng = longitudes.length ? Math.max(...longitudes) : 139.67;

  const toPercent = (value: number, min: number, max: number) => {
    if (max === min) {
      return 50;
    }

    return 12 + ((value - min) / (max - min)) * 76;
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <SectionCard
        title="家族マップ"
        subtitle="現在地と登録地点を同じ面で確認。外部地図にもそのまま開けます"
        action={
          <div className="inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-sm font-semibold">
            <Plus className="h-4 w-4" />
            地点を追加
          </div>
        }
      >
        <div className="mb-4 grid gap-4 xl:grid-cols-[1fr_0.92fr]">
          <LocationAutoUpdater mode={preferences.locationSharingMode} />
          <form action={createPlaceRegistrationAction} className="rounded-3xl bg-white/75 px-4 py-4">
            <p className="font-semibold">登録地点を追加</p>
            <div className="mt-3 grid gap-3">
              <input name="name" className="rounded-3xl border border-softline bg-white px-4 py-3 text-sm outline-none" placeholder="地点名" />
              <select name="category" defaultValue="その他" className="rounded-3xl border border-softline bg-white px-4 py-3 text-sm outline-none">
                {["学校", "習い事", "塾", "職場", "旅行先", "その他"].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input name="address" className="rounded-3xl border border-softline bg-white px-4 py-3 text-sm outline-none" placeholder="住所やメモ" />
              <button className="rounded-3xl bg-mint px-4 py-3 text-sm font-semibold">この地点を追加</button>
            </div>
          </form>
        </div>
        <div className="relative min-h-[460px] overflow-hidden rounded-4xl bg-gradient-to-br from-sky/70 via-paper to-mint/70 p-6">
          <div className="absolute inset-6 rounded-[32px] border-2 border-dashed border-white/70" />
          <div className="absolute inset-10 rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_rgba(255,255,255,0.2))]" />

          {geoPoints.map((point) => (
            <div
              key={point.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${toPercent(point.lng, minLng, maxLng)}%`,
                top: `${100 - toPercent(point.lat, minLat, maxLat)}%`
              }}
            >
              <div className={`h-4 w-4 rounded-full border-2 border-white shadow-sticker ${point.color}`} />
              <div className="mt-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold">{point.label}</div>
            </div>
          ))}

          <div className="absolute bottom-4 left-4 right-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-3xl bg-white/85 px-4 py-3 text-sm">
              <p className="font-semibold">位置共有モード</p>
              <p className="mt-1 text-ink/70">{preferences.locationSharingMode === "auto" ? "画面表示時に自動更新" : "必要なときだけ手動共有"}</p>
            </div>
            <div className="rounded-3xl bg-white/85 px-4 py-3 text-sm">
              <p className="font-semibold">外部地図</p>
              <p className="mt-1 text-ink/70">地点カードから Google Maps へそのまま開けます。</p>
            </div>
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
                  {location.lat != null && location.lng != null ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-xs font-semibold text-coral"
                    >
                      地図で開く
                    </a>
                  ) : null}
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
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex text-xs font-semibold text-coral"
                >
                  地図で開く
                </a>
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
