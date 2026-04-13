# KAZOQ Architecture Flow

このドキュメントは、KAZOQ の現在の全体フローを「画面遷移」「認証」「データ同期」「家族ルーム作成」「実データ / デモ切替」の観点でまとめたものです。

## 1. 全体像

KAZOQ は大きく次の層で構成されています。

- `app/`
  App Router のページと server actions
- `components/`
  画面表示用の UI コンポーネント
- `lib/repositories/`
  画面が必要とするデータを集約する取得層
- `lib/supabase/`
  Supabase クライアント生成
- `types/`
  ドメイン型と Supabase 型
- `supabase/migrations/`
  DB スキーマと RLS

考え方としては、

- UI は `components`
- ページごとのデータ組み立ては `repositories`
- 永続化は `Supabase`

に分けています。

## 2. モード切替

アプリは `demo` と `live` の2系統を持ちます。

- `demo`
  `data/mock-data.ts` を使う
- `live`
  Supabase を使う

判定は [lib/config.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/config.ts:1) にあります。

優先順は次です。

1. cookie `kazoq-mode`
2. 環境変数 `NEXT_PUBLIC_DEFAULT_APP_MODE`
3. Supabase の設定有無

ただし現在は、Supabase が設定済みなら stale な `demo` cookie が残っていても `live` を優先するようにしています。

## 3. 画面ルーティング

トップは [app/page.tsx](/Users/matsuiminato/Desktop/家族共有アプリ/app/page.tsx:1) で `/auth` にリダイレクトします。

主要ルートは次です。

- `/auth`
  認証と家族ルーム作成
- `/home`
  ホーム
- `/messages`
  メッセージ
- `/reports`
  報連相
- `/calendar`
  予定
- `/locations`
  場所
- `/diary`
  交換日記
- `/profile`
  プロフィール
- `/settings`
  設定

## 4. 認証フロー

認証基盤は Supabase Auth を使っています。

関係ファイル:

- [app/(auth)/auth/actions.ts](/Users/matsuiminato/Desktop/家族共有アプリ/app/(auth)/auth/actions.ts:1)
- [app/(auth)/auth/page.tsx](/Users/matsuiminato/Desktop/家族共有アプリ/app/(auth)/auth/page.tsx:1)
- [lib/repositories/app-context.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/repositories/app-context.ts:1)
- [middleware.ts](/Users/matsuiminato/Desktop/家族共有アプリ/middleware.ts:1)

### 4-1. 新規登録

流れ:

1. `/auth` でメールアドレス、パスワード、表示名を入力
2. `signUpAction` が `supabase.auth.signUp()` を呼ぶ
3. セッションが返らない場合は管理クライアントで `email_confirm: true` に寄せる
4. その後 `signInWithPassword()` を実行してログイン状態を作る
5. `getCurrentAppContext()` を通して `public.users` と `public.profiles` を同期
6. `family_members` の所属有無を見て遷移先を決定

遷移先:

- 家族未所属: `/auth`
- 家族所属済み: `/home`

### 4-2. ログイン

流れ:

1. `/auth` でメールアドレスとパスワードを入力
2. `signInAction` が `signInWithPassword()` を実行
3. `getCurrentAppContext()` でアプリ内ユーザー情報を同期
4. `family_members` の所属有無で遷移先を決める

### 4-3. 認証ガード

[middleware.ts](/Users/matsuiminato/Desktop/家族共有アプリ/middleware.ts:1) で保護ルートを制御しています。

対象:

- `/home`
- `/reports`
- `/messages`
- `/calendar`
- `/locations`
- `/diary`
- `/profile`
- `/settings`

未ログインの場合は `/auth` に戻します。

## 5. App Context 同期

[lib/repositories/app-context.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/repositories/app-context.ts:1) が、Auth ユーザーをアプリ内の `users` / `profiles` / `family_members` とつなぐ中心です。

### 役割

- Auth の `auth.users` と `public.users` を同期
- `public.profiles` の初期レコードを作成
- ログイン中ユーザーの `appUserId` を決定
- 所属家族があれば `familyId` / `familyName` / `inviteCode` を返す

### 返す値

- `appUserId`
- `familyId`
- `familyName`
- `inviteCode`

## 6. 家族ルーム作成フロー

関係ファイル:

- [components/shared/auth-screen.tsx](/Users/matsuiminato/Desktop/家族共有アプリ/components/shared/auth-screen.tsx:1)
- [app/(auth)/auth/actions.ts](/Users/matsuiminato/Desktop/家族共有アプリ/app/(auth)/auth/actions.ts:1)

### 現在のステップ

1. アカウント作成
2. 家族ルーム作成 または 招待コード参加

### 家族ルーム作成時に保存するもの

- `families`
  家族名、招待コード、作成者
- `family_members`
  作成者自身を最初のメンバーとして追加
- `profiles`
  家族内の役割、所属、ひとことを更新
- `families.menu_item_ids`
- `families.shortcut_item_ids`
- `families.favorite_item_ids`

### 招待コード参加時に保存するもの

- `family_members`
  対象家族へ自分を参加させる

## 7. ホーム設定フロー

関係ファイル:

- [lib/family-preferences.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/family-preferences.ts:1)
- [lib/repositories/family-preferences.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/repositories/family-preferences.ts:1)
- [components/settings/settings-board.tsx](/Users/matsuiminato/Desktop/家族共有アプリ/components/settings/settings-board.tsx:1)

家族ごとのホーム設定として、次を `families` に保存しています。

- `menu_item_ids`
- `shortcut_item_ids`
- `favorite_item_ids`

利用箇所:

- サイドメニュー / モバイルメニュー
- ホームのショートカット
- ホームの「よく使う機能」

## 8. データ取得フロー

ページは直接 Supabase を読むのではなく、基本的に `repositories` を通します。

主な取得元:

- [lib/repositories/home.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/repositories/home.ts:1)
- [lib/repositories/messages.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/repositories/messages.ts:1)
- [lib/repositories/family-reports.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/repositories/family-reports.ts:1)
- [lib/repositories/calendar.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/repositories/calendar.ts:1)
- [lib/repositories/diary.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/repositories/diary.ts:1)
- [lib/repositories/locations.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/repositories/locations.ts:1)
- [lib/repositories/profiles.ts](/Users/matsuiminato/Desktop/家族共有アプリ/lib/repositories/profiles.ts:1)

役割:

- familyId 解決
- DB row を UI 向けドメイン型へ変換
- `demo/live` の吸収
- 空データ時のフォールバックや空状態対応

## 9. DB と RLS

主要 migration:

- [001_init_family_app.sql](/Users/matsuiminato/Desktop/家族共有アプリ/supabase/migrations/001_init_family_app.sql:1)
- [002_family_reports.sql](/Users/matsuiminato/Desktop/家族共有アプリ/supabase/migrations/002_family_reports.sql:1)
- [003_auth_and_messages_rls.sql](/Users/matsuiminato/Desktop/家族共有アプリ/supabase/migrations/003_auth_and_messages_rls.sql:1)
- [004_family_preferences.sql](/Users/matsuiminato/Desktop/家族共有アプリ/supabase/migrations/004_family_preferences.sql:1)

RLS の基本思想:

- 自分自身のユーザー/プロフィールは読める
- 同じ家族のメンバーは相互に読める
- メッセージや報連相は同一 family のメンバーだけが扱える
- 家族更新は作成者中心

補助関数:

- `public.current_app_user_id()`
- `public.is_family_member(uuid)`

## 10. 現在のよくある詰まりどころ

### 認証で詰まる

- Email provider が OFF
- stale な demo cookie が残っている
- Auth は成功しているが family 未所属で `/auth` に戻る
- サーバーアクション例外が画面に見えない

### 実データ反映で詰まる

- `.env.local` 未設定
- migration 未適用
- Email provider は有効だが signUp 後の public 同期で落ちる

## 11. 推奨デバッグ順

1. `.env.local` の URL / anon / service role を確認
2. `Authentication > Providers > Email` を確認
3. migration が全て入っているか確認
4. `Authentication > Users` にユーザーができるか確認
5. `public.users / profiles / family_members` に反映されるか確認
6. `/auth?error=...` の文言を見る

## 12. 今後まとめたいもの

今後さらに整理するなら、次も別紙で分けると見やすくなります。

- ER図
- 認証シーケンス図
- 家族ルーム作成シーケンス図
- RLS ポリシー一覧
