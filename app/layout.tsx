import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "家族共有アプリ MVP",
  description: "家族の連絡ノート・予定帳・交換日記・見守りをまとめた生活連携アプリ"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
