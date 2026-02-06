## 1. フロントエンド更新契約の修正

- [x] 1.1 `taskSyncService` の更新リクエスト変換を修正し、nullable フィールドで「キー未指定」と「キーあり未定義（null 送信）」を区別する
- [x] 1.2 `taskStore.updateTask` を修正し、`completed -> 非completed` の自動クリア時に `completedAt` をサーバー送信用 input にも明示する
- [x] 1.3 タスク詳細編集（詳細説明・期限・作業記録・完了日）の削除操作が `null` 送信ルートに乗ることを確認し、必要なコード調整を行う

## 2. バックエンド PATCH 処理の tri-state 対応

- [x] 2.1 `PATCH /tasks/{id}` のリクエストデコードを更新し、nullable フィールドで「未指定 / null / 値」を判定できるようにする
- [x] 2.2 `description`、`due_date`、`notes`、`completed_at` の更新処理を修正し、`null` 指定時に DB の `NULL` へ更新する
- [x] 2.3 日付パースのバリデーションを維持しつつ、`null` 指定時はパースせずクリアできることを確認する
