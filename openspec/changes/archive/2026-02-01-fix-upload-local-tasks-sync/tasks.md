## 1. バックエンド: `POST /tasks` のリクエストボディ拡張

- [x] 1.1 `createTaskRequest` 構造体に `Status *string`、`CompletedAt *string`、`CreatedAt *string` フィールドを追加する
- [x] 1.2 `handleCreateTask` に `status` のバリデーションを追加する（`not_started`, `in_progress`, `waiting`, `completed` のみ許可、不正な値は 400 を返す）
- [x] 1.3 `handleCreateTask` に `completed_at` のパース処理を追加する（`due_date` と同様に RFC3339 でパース）
- [x] 1.4 `handleCreateTask` に `created_at` のパース処理を追加する（RFC3339 でパース）
- [x] 1.5 INSERT クエリを修正し、`status`、`completed_at`、`created_at` をパラメータとして渡す（未指定時はデフォルト値を使用）

## 2. フロントエンド: `localTaskToCreateRequest` の拡張

- [x] 2.1 `localTaskToCreateRequest` に `status` フィールドの変換を追加する
- [x] 2.2 `localTaskToCreateRequest` に `completed_at` フィールドの変換を追加する（`completedAt` → `completed_at`）
- [x] 2.3 `localTaskToCreateRequest` に `created_at` フィールドの変換を追加する（`createdAt` → `created_at`）
