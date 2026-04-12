import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaProvider } from "@/components/shared/pwa-provider";

export const metadata: Metadata = {
  title: "KAZOQ（カゾック）",
  description: "KAZOQは、家族の連絡ノート・予定帳・交換日記・見守りをまとめた生活連携アプリです",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icons.png", type: "image/png" }
    ],
    apple: [{ url: "/icons/icons.png", type: "image/png" }],
    shortcut: ["/icons/icons.png"]
  },
  appleWebApp: {
    capable: true,
    title: "KAZOQ",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#FFB24D"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <PwaProvider />
        {children}
      </body>
    </html>
  );
}
