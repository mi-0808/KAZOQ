"use client";

import { LocateFixed } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { captureLocationAction } from "@/app/(app)/locations/actions";

const initialState = { message: "" };

export function LocationAutoUpdater({ mode }: { mode: "manual" | "auto" }) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      await captureLocationAction(formData);
      return { message: "現在地を更新しました。" };
    },
    initialState
  );
  const [status, setStatus] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    if (mode !== "auto" || !navigator.geolocation || autoSubmittedRef.current) {
      return;
    }

    navigator.permissions?.query({ name: "geolocation" as PermissionName }).then((permission) => {
      if (permission.state === "granted") {
        autoSubmittedRef.current = true;
        requestLocation(true);
      }
    }).catch(() => undefined);
  }, [mode]);

  const requestLocation = (silent = false) => {
    if (!navigator.geolocation || !formRef.current) {
      setStatus("この端末では位置情報を取得できません。");
      return;
    }

    setStatus(silent ? "" : "位置情報を取得しています...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const form = formRef.current;
        if (!form) {
          return;
        }

        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        (form.elements.namedItem("lat") as HTMLInputElement).value = latitude;
        (form.elements.namedItem("lng") as HTMLInputElement).value = longitude;
        (form.elements.namedItem("label") as HTMLInputElement).value = `現在地 (${latitude}, ${longitude})`;
        form.requestSubmit();
      },
      () => {
        setStatus("位置情報の取得が許可されていません。");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000
      }
    );
  };

  return (
    <div className="rounded-3xl bg-white/75 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">現在地を自動更新</p>
          <p className="mt-1 text-sm text-ink/70">
            {mode === "auto" ? "位置情報の許可があると、この画面を開いた時にも自動で更新します。" : "現在は手動共有モードです。必要なときだけ現在地を送れます。"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => requestLocation()}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-2 text-sm font-semibold"
        >
          <LocateFixed className="h-4 w-4" />
          {isPending ? "更新中..." : "今すぐ更新"}
        </button>
      </div>
      <form ref={formRef} action={formAction} className="hidden">
        <input type="hidden" name="label" />
        <input type="hidden" name="lat" />
        <input type="hidden" name="lng" />
        <input type="hidden" name="shareMode" value={mode} />
      </form>
      <p className="mt-3 text-sm text-ink/70">{status || state.message}</p>
    </div>
  );
}
