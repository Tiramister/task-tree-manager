## MODIFIED Requirements

### Requirement: ローカルタスクの一括アップロード

初期同期で localStorage のデータをバックエンドに保存する際、親子関係を維持するために親タスクから先に保存しなければならない（SHALL）。保存時に旧 ID から新 ID へのマッピングを管理し、子タスクの `parent_id` を新しい ID に変換する。各タスクの `status`、`completed_at`、`created_at` をバックエンドに送信し、ローカルの状態を保持しなければならない（SHALL）。

#### Scenario: 親子関係のあるタスクをアップロードする

- **WHEN** 親タスク A とその子タスク B が localStorage に存在し、DB が空の状態でログインする
- **THEN** 親タスク A が先に `POST /tasks` で保存され、子タスク B の `parent_id` は A の新しい DB 上の ID に変換されてから保存される

#### Scenario: ルートタスクのみが存在する場合

- **WHEN** 親を持たないタスクのみが localStorage に存在し、DB が空の状態でログインする
- **THEN** 全タスクが `POST /tasks` で保存され、保存後に `GET /tasks` のデータで taskStore が上書きされる

#### Scenario: 完了済みタスクをアップロードする

- **WHEN** ステータスが `completed` で `completedAt` が設定されたタスクが localStorage に存在し、DB が空の状態でログインする
- **THEN** `POST /tasks` のリクエストに `status` と `completed_at` が含まれ、バックエンドに保存されたタスクのステータスと完了日が元のローカルデータと一致する

#### Scenario: 進行中タスクをアップロードする

- **WHEN** ステータスが `in_progress` のタスクが localStorage に存在し、DB が空の状態でログインする
- **THEN** `POST /tasks` のリクエストに `status: "in_progress"` が含まれ、バックエンドに保存されたタスクのステータスが `in_progress` となる

#### Scenario: 作成日時を保持してアップロードする

- **WHEN** `createdAt` が `2026-01-01T00:00:00Z` のタスクが localStorage に存在し、DB が空の状態でログインする
- **THEN** `POST /tasks` のリクエストに `created_at: "2026-01-01T00:00:00Z"` が含まれ、バックエンドに保存されたタスクの `created_at` が元の日時と一致する

### Requirement: データ形式の変換

taskSyncService はバックエンド API のレスポンス（snake_case）をフロントエンドのタスク型（camelCase）に変換しなければならない（SHALL）。また、フロントエンドのタスクデータをバックエンド API のリクエスト形式に変換しなければならない（SHALL）。ローカルタスクの一括アップロード時には、`status`、`completedAt` → `completed_at`、`createdAt` → `created_at` の変換も含めなければならない（SHALL）。

#### Scenario: バックエンドのレスポンスをフロントエンド形式に変換する

- **WHEN** `GET /tasks` のレスポンスを受け取る
- **THEN** `sort_order` → `sortOrder`、`due_date` → `dueDate`、`completed_at` → `completedAt`、`parent_id` → `parentId`、`created_at` → `createdAt` に変換され、`user_id` フィールドは除外される

#### Scenario: フロントエンドのタスクデータをバックエンドのリクエスト形式に変換する

- **WHEN** フロントエンドのタスクデータをバックエンドに送信する
- **THEN** `sortOrder` → `sort_order`、`dueDate` → `due_date`、`completedAt` → `completed_at`、`parentId` → `parent_id` に変換される

#### Scenario: ローカルタスクのアップロード時にすべてのフィールドを変換する

- **WHEN** ローカルタスクの一括アップロードでタスクデータを変換する
- **THEN** `title`、`sortOrder` → `sort_order`、`description`、`dueDate` → `due_date`、`notes`、`parentId` → `parent_id` に加え、`status`、`completedAt` → `completed_at`、`createdAt` → `created_at` も変換される
