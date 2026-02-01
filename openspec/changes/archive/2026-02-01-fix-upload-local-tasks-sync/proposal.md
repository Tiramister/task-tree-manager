## Why

初回ログイン時にローカルストレージのタスクをバックエンドにアップロードする処理 (`uploadLocalTasks`) で、タスクのステータス (`status`)、完了日 (`completedAt`)、作成日 (`createdAt`) が同期されない。原因は、`POST /tasks` エンドポイントのリクエストボディにこれらのフィールドが存在せず、フロントエンドの変換関数 (`localTaskToCreateRequest`) もこれらを含めていないため。結果として、完了済みタスクや進行中タスクがすべて `not_started` としてアップロードされ、元の作成日時も失われる。

## What Changes

- `POST /tasks` のリクエストボディに `status`（optional）、`completed_at`（optional）、`created_at`（optional）フィールドを追加する
- フロントエンドの `localTaskToCreateRequest` 関数に `status`、`completed_at`、`created_at` の変換を追加する

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `task-api`: `POST /tasks` のリクエストボディに `status`、`completed_at`、`created_at` を optional フィールドとして追加
- `task-sync`: ローカルタスクのアップロード時に `status`、`completed_at`、`created_at` を含める変換ロジックの追加

## Impact

- **バックエンド**: `backend/task.go` の `createTaskRequest` 構造体と `handleCreateTask` ハンドラーの変更
- **フロントエンド**: `frontend/src/features/tasks/taskSyncService.ts` の `localTaskToCreateRequest` 関数の変更
- **API**: `POST /tasks` のリクエストボディスキーマが拡張される（後方互換性あり、新フィールドは optional）
