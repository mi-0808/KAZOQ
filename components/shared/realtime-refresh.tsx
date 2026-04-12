"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RealtimeRefresh({ tables }: { tables: string[] }) {
  const router = useRouter();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || tables.length === 0) {
      return;
    }

    const supabase = createClient();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const channel = supabase.channel(`kazoq-refresh-${tables.join("-")}`);

    tables.forEach((table) => {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table
        },
        () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          timeoutId = setTimeout(() => {
            router.refresh();
          }, 250);
        }
      );
    });

    channel.subscribe();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      supabase.removeChannel(channel);
    };
  }, [router, tables]);

  return null;
}
