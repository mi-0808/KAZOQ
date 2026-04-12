import { ArrowRight, GitBranch, House, LogIn, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function TopLanding() {
  return (
    <div className="min-h-screen bg-board-pattern px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="paper-card overflow-hidden p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blush px-4 py-2 text-sm font-semibold text-ink">
                <Image src="/icons/icons.png" alt="KAZOQ icon" width={18} height={18} className="h-[18px] w-[18px] rounded-md object-cover" />
                KAZOQ
              </div>
              <h1 className="mt-4 text-4xl font-black leading-tight text-ink sm:text-5xl">
                家族の毎日を
                <span className="block text-coral">報連相でやさしく回す。</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-ink/75">
                KAZOQ は、家族チャットでは流れやすい「ご飯の返事」「欠食届」「外泊届」「帰宅連絡」を、
                家庭の中で見やすく残せる生活連携アプリです。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/auth#login" className="inline-flex items-center gap-2 rounded-3xl bg-coral px-5 py-3 font-semibold text-white shadow-sticker">
                  <LogIn className="h-4 w-4" />
                  ログイン
                </Link>
                <Link href="/auth#login" className="inline-flex items-center gap-2 rounded-3xl bg-white px-5 py-3 font-semibold text-ink shadow-sticker">
                  <UserPlus className="h-4 w-4" />
                  新規登録
                </Link>
                <Link href="/auth" className="inline-flex items-center gap-2 rounded-3xl bg-cream px-5 py-3 font-semibold text-ink">
                  家族ルームを作る
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[30px] bg-white/80 p-3 shadow-sticker">
              <Image src="/icons/top.png" alt="KAZOQ top visual" width={1536} height={512} className="h-auto w-full rounded-[24px] object-cover" priority />
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "ご飯と届け出",
              icon: House,
              body: "できたよ、いらない、取り置き、外泊。家庭の判断が必要なことだけを迷わず整理します。 "
            },
            {
              title: "ツリーで追える",
              icon: GitBranch,
              body: "依頼、返答、承認、完了までが一本で残るので、あとから見返しても分かりやすいです。"
            },
            {
              title: "家族ルーム制",
              icon: Users,
              body: "最初に家族ルームを作っておけば、招待コードでメンバー追加と初期設定をまとめて進められます。"
            }
          ].map((item) => (
            <article key={item.title} className="paper-card p-5">
              <item.icon className="h-6 w-6" />
              <h2 className="mt-4 text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-ink/75">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="paper-card p-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { step: "1", title: "新規登録", body: "まずは保護者か代表メンバーとしてアカウントを作成します。" },
              { step: "2", title: "家族ルーム作成", body: "家族名、あなたの立場、ひとことを入れて最初の部屋を作ります。" },
              { step: "3", title: "招待して開始", body: "招待コードで家族を追加し、そのまま報連相とメッセージを始められます。" }
            ].map((item) => (
              <div key={item.step} className="rounded-4xl bg-white px-5 py-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream font-bold">{item.step}</div>
                <p className="mt-4 font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-ink/75">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
