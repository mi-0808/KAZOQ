import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaProvider } from "@/components/shared/pwa-provider";

export const metadata: Metadata = {
  title: "KAZOQ（カゾック）",
  description: "KAZOQは、家族の連絡ノート・予定帳・交換日記・見守りをまとめた生活連携アプリです",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icons.png", sizes: "1024x1024", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icons/favicon-32.png"]
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
