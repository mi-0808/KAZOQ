# KAZOQ MVP

KAZOQ（カゾック）は、家族向けの「連絡ノート・予定帳・交換日記・見守り」をひとつにまとめた生活連携アプリです。  
Next.js App Router、TypeScript、Tailwind CSS、Supabase を前提に、まずはダミーデータで画面を成立させ、そのまま Supabase 連携へ拡張しやすい構成で実装しています。

## 1. 要件の簡易整理

- メッセージを基盤に、予定・場所・プロフィール・交換日記がつながる家族向けハブにする
- 子どもからシニアまで迷わないよう、文字サイズ・余白・押しやすさを優先する
- 通常メッセージとテンプレート投稿を同じタイムラインで扱い、生活連絡をしやすくする
- ホームでは「今日必要な情報」をまとめて見せる
- ロケーションは MVP ではモック表示にしつつ、予定と地点の連携構造を先に作る
- 今後の家事タスク、公開範囲、通知優先度、介護向け導線を追加しやすい責務分離にする

## 2. 画面設計

- 認証: ログイン、新規登録、家族招待コード参加
- ホーム: 今日の予定、最新メッセージ、食事、家族状態、日記、ショートカット
- メッセージ: 家族チャット、カテゴリ、テンプレート投稿カード
- カレンダー: 週ボード風の予定一覧と作成導線
- ロケーション: 家族の現在地モック、登録地点、予定と地点の対応
- 交換日記: 気分付き日記一覧、投稿導線、リアクション
- プロフィール: 家族内役割・所属・一言・活動情報
- 設定: 表示項目、通知、家族設定、将来の出し分け準備

## 3. DB設計

主要テーブル:

- `users`: Auth に紐づくアプリ利用者
- `families`: 家族グループ本体
- `family_members`: `users` と `families` の中間。役割・参加状態を保持
- `profiles`: 表示名、アイコン、所属、習い事、一言などの詳細
- `message_templates`: テンプレート種別定義
- `messages`: 通常投稿とテンプレ投稿を共通管理
- `message_reads`: 簡易既読状態
- `schedules`: 家族予定 / 個人予定 / メッセージ起点予定
- `locations`: 現在地スナップショット
- `place_registrations`: 学校・塾・職場などの地点マスタ
- `diary_entries`: 交換日記本文と感情
- `diary_reactions`: 家族からの反応

リレーション:

- `families` 1 : N `family_members`
- `users` 1 : N `family_members`
- `users` 1 : 1 `profiles`
- `families` 1 : N `messages`
- `message_templates` 1 : N `messages`
- `families` 1 : N `schedules`
- `place_registrations` 1 : N `schedules`
- `users` 1 : N `locations`
- `families` 1 : N `diary_entries`
- `diary_entries` 1 : N `diary_reactions`

詳細 SQL は `supabase/migrations/001_init_family_app.sql` を参照してください。

## 4. ディレクトリ構成

```text
app/
  (auth)/auth/
  (app)/home/
  (app)/messages/
  (app)/calendar/
  (app)/locations/
  (app)/diary/
  (app)/profile/
  (app)/settings/
components/
  layout/
  shared/
  home/ messages/ calendar/ locations/ diary/ profile/ settings/
data/
  mock-data.ts
lib/
  utils.ts
  supabase/
types/
  domain.ts
supabase/
  migrations/
```

## 5. 実装方針

- 先に `types/domain.ts` でドメイン型を固定
- `data/mock-data.ts` で全画面をダミーデータ駆動にする
- 各画面はコンテナコンポーネントからセクションコンポーネントを組み合わせる
- Supabase 接続は `lib/supabase` に隔離し、データ取得層を差し替えやすくする

## 6. 今後の拡張ポイント

- メッセージ種別追加: `message_templates` と `payload` で吸収
- 報連相ツリー: `family_reports` と `family_report_actions` で家庭内承認フローを追加済み
- 家事タスク管理: `tasks` と `task_logs` を追加しやすい timeline 拡張
- 公開範囲付き日記: `diary_entries.visibility_scope` を追加
- 通知優先度: `notifications.priority` を別テーブルで追加
- ホームの出し分け: `family_feature_settings` を追加し、役割ごとに表示制御
- AI 機能: 献立提案や文章補助を server actions / edge functions で追加

## 7. 起動準備

1. `npm install`
2. `.env.example` を `.env.local` にコピーして Supabase の値を設定
3. `npm run dev`

## 8. 注意

- この段階ではダミーデータを優先し、UI の完成度と構造整理を重視しています
- Supabase 連携時は `mock-data.ts` を repository 層へ置き換える形を想定しています
- `home` と `reports` は Supabase 未設定時にモック、設定済みなら Repository 経由でDBを読む構成です
