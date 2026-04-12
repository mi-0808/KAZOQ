import { HeartHandshake, KeyRound, Mail, Users } from "lucide-react";
import Link from "next/link";

export function AuthScreen() {
  return (
    <div className="min-h-screen bg-board-pattern px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="paper-card overflow-hidden p-8">
          <div className="playful-pill inline-flex items-center gap-2 bg-blush px-4 py-2 text-sm font-semibold text-ink">
            <HeartHandshake className="h-4 w-4" />
            家族の生活連携アプリ
          </div>
          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight text-ink">
            連絡ノート、予定帳、交換日記を
            <span className="block text-coral">ひとつのやさしい掲示板に。</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink/75">
            家族の会話だけでなく、ご飯、予定、見守り、気持ちの共有までまとめて見えるようにしたMVPです。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "ご飯や買い物", color: "bg-orange" },
              { label: "予定と場所", color: "bg-sky" },
              { label: "交換日記", color: "bg-mint" }
            ].map((item) => (
              <div key={item.label} className={`rounded-4xl border-2 border-white/70 p-4 ${item.color}`}>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-2 text-sm text-ink/75">テンプレで迷わず投稿できる設計です。</p>
              </div>
            ))}
          </div>
        </section>

        <section className="paper-card p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">ログイン</h2>
              <p className="mt-1 text-sm text-ink/70">Supabase Auth に差し替えやすいダミーフォームです。</p>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  メールアドレス
                </span>
                <input className="w-full rounded-3xl border border-softline bg-white px-4 py-3 outline-none" placeholder="family@example.com" />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <KeyRound className="h-4 w-4" />
                  パスワード
                </span>
                <input
                  type="password"
                  className="w-full rounded-3xl border border-softline bg-white px-4 py-3 outline-none"
                  placeholder="••••••••"
                />
              </label>
              <button className="w-full rounded-3xl bg-coral px-4 py-3 text-base font-semibold text-white shadow-sticker">ログインして続ける</button>
            </div>

            <div className="rounded-4xl bg-cream p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4" />
                家族グループへ参加
              </div>
              <div className="mt-3 flex gap-3">
                <input className="flex-1 rounded-3xl border border-softline bg-white px-4 py-3 outline-none" placeholder="招待コードを入力" />
                <button className="rounded-3xl bg-lavender px-4 py-3 font-semibold shadow-sticker">参加</button>
              </div>
            </div>

            <p className="text-sm text-ink/70">
              デモとしてすぐ確認したい場合は、
              <Link href="/home" className="font-semibold text-coral">
                ホーム画面へ移動
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
