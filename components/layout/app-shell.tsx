"use client";

import { Bell, GitBranch, Home, MapPinned, MessageCircle, NotebookPen, Settings, UserRound, ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/domain";

const navItems = [
  { href: "/home", label: "ホーム", icon: Home },
  { href: "/reports", label: "報連相", icon: GitBranch },
  { href: "/messages", label: "メッセージ", icon: MessageCircle },
  { href: "/calendar", label: "予定", icon: NotebookPen },
  { href: "/locations", label: "場所", icon: MapPinned },
  { href: "/profile", label: "プロフィール", icon: UserRound },
  { href: "/settings", label: "設定", icon: Settings }
];

export function AppShell({
  children,
  familyName,
  inviteCode,
  profiles
}: {
  children: ReactNode;
  familyName: string;
  inviteCode: string;
  profiles: Profile[];
}) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const primaryMobileNav = navItems.slice(0, 3);
  const secondaryMobileNav = navItems.slice(3);

  return (
    <div className="min-h-screen bg-board-pattern px-3 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-7xl gap-4 lg:min-h-[calc(100vh-2rem)] lg:grid-cols-[280px_1fr]">
        <aside className="paper-card hidden p-5 lg:flex lg:flex-col">
          <div className="rounded-4xl bg-gradient-to-br from-blush/80 via-orange/75 to-sunny/70 p-4">
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/icons/icons.png"
                alt="KAZOQ icon"
                width={48}
                height={48}
                className="h-12 w-12 rounded-3xl bg-white/70 object-cover shadow-sticker"
              />
              <div>
                <p className="text-xl font-black tracking-[0.12em]">KAZOQ</p>
                <p className="text-xs font-semibold text-ink/65">カゾック</p>
              </div>
            </div>
            <p className="text-sm font-medium text-ink/70">家族グループ</p>
            <h1 className="mt-1 text-2xl font-bold">{familyName}</h1>
            <p className="mt-2 text-sm text-ink/75">招待コード: {inviteCode}</p>
          </div>
          <nav className="mt-5 flex flex-1 flex-col gap-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-3xl border-2 border-transparent px-4 py-3 text-base font-medium text-ink transition hover:border-orange/50 hover:bg-cream"
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="rounded-4xl bg-gradient-to-br from-mint/70 via-sky/50 to-lavender/55 p-4">
            <p className="text-sm font-medium">今日の家族メモ</p>
            <p className="mt-2 text-sm text-ink/75">「ご飯・予定・帰宅時間」がまとまっていると、みんなが安心して動けます。</p>
          </div>
        </aside>

        <main className="flex min-h-[calc(100vh-1.5rem)] flex-col overflow-hidden lg:min-h-[calc(100vh-2rem)] lg:paper-card">
          <header className="rounded-3xl bg-white/82 px-4 py-4 shadow-[0_8px_24px_rgba(83,70,45,0.08)] lg:rounded-none lg:bg-transparent lg:px-4 lg:py-4 lg:shadow-none lg:border-b lg:border-softline sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-xs font-bold tracking-[0.16em] text-ink/75">
                  <Image src="/icons/icons.png" alt="KAZOQ icon" width={14} height={14} className="h-3.5 w-3.5 rounded-sm object-cover" />
                  KAZOQ
                </div>
                <h2 className="mt-2 text-xl font-bold sm:text-2xl">{familyName}</h2>
                <p className="mt-1 text-sm text-ink/70 lg:block hidden">カゾックで、連絡ノート・予定帳・報連相をひとつに。</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <button className="playful-pill inline-flex items-center gap-2 bg-sunny px-4 py-2 text-sm font-semibold text-ink">
                  <Bell className="h-4 w-4" />
                  通知 3件
                </button>
                <div className="flex -space-x-2">
                  {profiles.map((profile) => (
                    <div
                      key={profile.userId}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 border-paper text-sm font-bold text-ink shadow-sticker",
                        profile.accentColor
                      )}
                    >
                      {profile.avatar}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-1 py-3 sm:px-6 sm:py-6 lg:px-4">{children}</div>

          <div className="lg:hidden">
            {isMoreOpen ? (
              <div className="mx-1 mb-2 rounded-3xl bg-white/90 p-3 shadow-[0_8px_22px_rgba(83,70,45,0.12)]">
                <div className="grid grid-cols-2 gap-2">
                  {secondaryMobileNav.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition",
                        pathname === href ? "bg-cream text-ink" : "bg-paper text-ink/80"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <nav className="mx-1 rounded-[28px] bg-paper/95 px-2 py-2 shadow-[0_-8px_28px_rgba(83,70,45,0.12)] backdrop-blur">
              <div className="grid grid-cols-4 gap-2">
                {primaryMobileNav.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex min-h-16 flex-col items-center justify-center rounded-3xl px-2 py-2 text-[11px] font-medium transition",
                      pathname === href ? "bg-cream text-ink" : "text-ink/80 hover:bg-white/70"
                    )}
                  >
                    <Icon className="mb-1 h-4 w-4" />
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => setIsMoreOpen((value) => !value)}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center rounded-3xl px-2 py-2 text-[11px] font-medium transition",
                    isMoreOpen ? "bg-cream text-ink" : "text-ink/80 hover:bg-white/70"
                  )}
                >
                  {isMoreOpen ? <ChevronDown className="mb-1 h-4 w-4" /> : <ChevronUp className="mb-1 h-4 w-4" />}
                  メニュー
                </button>
              </div>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}
