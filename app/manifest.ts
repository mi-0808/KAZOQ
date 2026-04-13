import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KAZOQ（カゾック）",
    short_name: "KAZOQ",
    description: "家族の連絡ノート・予定帳・交換日記・見守りをまとめた生活連携アプリ",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF7CC",
    theme_color: "#FFB24D",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/icons/icons.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
