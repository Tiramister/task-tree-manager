## MODIFIED Requirements

### Requirement: データ形式の変換

taskSyncService はバックエンド API のレスポンス（snake_case）をフロントエンドのタスク型（camelCase）に変換しなければならない（SHALL）。また、フロントエンドのタスクデータをバックエンド API のリクエスト形式に変換しなければならない（SHALL）。ローカルタスクの一括アップロード時には、`status`、`completedAt` → `completed_at`、`createdAt` → `created_at` の変換も含めなければならない（SHALL）。

更新リクエスト（`PATCH /tasks/{id}`）では、nullable フィールド（`description`、`dueDate`、`notes`、`completedAt`）について、次を満たさなければならない（SHALL）。
- フィールドが更新 input に含まれ、値が未定義の場合は `null` に変換して送信する
- フィールドが更新 input に含まれない場合はリクエストに含めない

#### Scenario: バックエンドのレスポンスをフロントエンド形式に変換する
- **WHEN** `GET /tasks` のレスポンスを受け取る
- **THEN** `sort_order` → `sortOrder`、`due_date` → `dueDate`、`completed_at` → `completedAt`、`parent_id` → `parentId`、`created_at` → `createdAt` に変換され、`user_id` フィールドは除外される

#### Scenario: フロントエンドのタスクデータをバックエンドのリクエスト形式に変換する
- **WHEN** フロントエンドのタスクデータをバックエンドに送信する
- **THEN** `sortOrder` → `sort_order`、`dueDate` → `due_date`、`completedAt` → `completed_at`、`parentId` → `parent_id` に変換される

#### Scenario: ローカルタスクのアップロード時にすべてのフィールドを変換する
- **WHEN** ローカルタスクの一括アップロードでタスクデータを変換する
- **THEN** `title`、`sortOrder` → `sort_order`、`description`、`dueDate` → `due_date`、`notes`、`parentId` → `parent_id` に加え、`status`、`completedAt` → `completed_at`、`createdAt` → `created_at` も変換される

#### Scenario: 更新リクエストで削除されたフィールドを null に変換する
- **WHEN** `updateTaskOnServer` に `description` キー付きで未定義値が渡される
- **THEN** `PATCH /tasks/{id}` のリクエストボディには `description: null` が含まれる

#### Scenario: 更新リクエストで未指定フィールドを送信しない
- **WHEN** `updateTaskOnServer` に `description` キーが含まれない更新入力が渡される
- **THEN** `PATCH /tasks/{id}` のリクエストボディには `description` フィールドが含まれない

#### Scenario: status 変更で完了日を自動削除した場合に null を送信する
- **WHEN** `completed` から他ステータスへの更新で `completedAt` キー付き未定義値が渡される
- **THEN** `PATCH /tasks/{id}` のリクエストボディには `completed_at: null` が含まれる
