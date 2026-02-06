## MODIFIED Requirements

### Requirement: データ形式の変換

taskSyncService はバックエンド API のレスポンス（snake_case）をフロントエンドのタスク型（camelCase）に変換しなければならない（SHALL）。また、フロントエンドのタスクデータをバックエンド API のリクエスト形式に変換しなければならない（SHALL）。

変換対象フィールド:
- `sort_order` ↔ `sortOrder`
- `due_date` ↔ `dueDate`
- `completed_at` ↔ `completedAt`
- `parent_id` ↔ `parentId`
- `created_at` ↔ `createdAt`
- `is_collapsed` ↔ `isCollapsed`

#### Scenario: バックエンドのレスポンスをフロントエンド形式に変換する

- **WHEN** `GET /tasks` のレスポンスを受け取る
- **THEN** `sort_order` → `sortOrder`、`due_date` → `dueDate`、`completed_at` → `completedAt`、`parent_id` → `parentId`、`created_at` → `createdAt`、`is_collapsed` → `isCollapsed` に変換され、`user_id` フィールドは除外される

#### Scenario: フロントエンドのタスクデータをバックエンドのリクエスト形式に変換する

- **WHEN** フロントエンドのタスクデータをバックエンドに送信する
- **THEN** `sortOrder` → `sort_order`、`dueDate` → `due_date`、`completedAt` → `completed_at`、`parentId` → `parent_id`、`isCollapsed` → `is_collapsed` に変換される

#### Scenario: ローカルタスクのアップロード時にすべてのフィールドを変換する

- **WHEN** ローカルタスクの一括アップロードでタスクデータを変換する
- **THEN** `title`、`sortOrder` → `sort_order`、`description`、`dueDate` → `due_date`、`notes`、`parentId` → `parent_id`、`status`、`completedAt` → `completed_at`、`createdAt` → `created_at`、`isCollapsed` → `is_collapsed` も変換される

### Requirement: 折り畳み操作時のバックエンド送信

ログイン済みユーザーが折り畳み操作を行った場合、対応するバックエンド API にデータを送信しなければならない（SHALL）。送信はバックグラウンドで行う（SHALL）。

#### Scenario: ログイン済みユーザーがタスクを折り畳む

- **WHEN** ログイン済みユーザーがタスクを折り畳む
- **THEN** taskStore のタスクの `isCollapsed` が更新された後、`PATCH /tasks/{id}` に `{ "is_collapsed": true }` が送信される

#### Scenario: ログイン済みユーザーがタスクを展開する

- **WHEN** ログイン済みユーザーがタスクを展開する
- **THEN** taskStore のタスクの `isCollapsed` が更新された後、`PATCH /tasks/{id}` に `{ "is_collapsed": false }` が送信される

#### Scenario: 未ログインユーザーが折り畳み操作を行う

- **WHEN** 未ログインユーザーがタスクの折り畳み/展開を行う
- **THEN** バックエンドへのリクエストは送信されず、localStorage のみが更新される
