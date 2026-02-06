## Requirements

### Requirement: ログイン時の初期同期

システムはログイン成功後に、バックエンドとフロントエンドのタスクデータを同期しなければならない（SHALL）。

同期ロジック:
1. `GET /tasks` でバックエンドのタスクを取得する
2. レスポンスが空配列の場合、localStorage の全タスクをバックエンドに保存し、保存後に `GET /tasks` で取得したデータで localStorage を上書きする
3. レスポンスにタスクが存在する場合、バックエンドのデータで localStorage（taskStore）を上書きする

#### Scenario: DB にデータがない状態でログインする

- **WHEN** ユーザーがログインし、`GET /tasks` のレスポンスが空配列である
- **THEN** localStorage の全タスクが `POST /tasks` でバックエンドに保存され、保存完了後に `GET /tasks` で取得したデータで taskStore が上書きされる

#### Scenario: DB にデータがある状態でログインする

- **WHEN** ユーザーがログインし、`GET /tasks` のレスポンスにタスクが含まれる
- **THEN** バックエンドのタスクデータで taskStore が上書きされる

#### Scenario: localStorage にデータがない状態で DB が空のままログインする

- **WHEN** ユーザーが localStorage にタスクがない状態でログインし、`GET /tasks` のレスポンスも空配列である
- **THEN** taskStore は空の状態のままとなり、バックエンドへの保存処理は実行されない

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

### Requirement: リロード時のデータ取得

ページリロード時にログイン済みユーザーであることが確認できた場合、`GET /tasks` でバックエンドのデータを取得し、taskStore を上書きしなければならない（SHALL）。

#### Scenario: ログイン済みユーザーがリロードする

- **WHEN** ログイン済みユーザーがページをリロードし、`checkAuth` で認証が確認される
- **THEN** `GET /tasks` でバックエンドのタスクデータが取得され、taskStore が上書きされる

#### Scenario: 未ログインユーザーがリロードする

- **WHEN** 未ログインユーザーがページをリロードする
- **THEN** バックエンドへのリクエストは行われず、localStorage のデータがそのまま使用される

### Requirement: タスク操作時のバックエンド送信

ログイン済みユーザーがタスクを操作した場合、対応するバックエンド API にデータを送信しなければならない（SHALL）。送信はバックグラウンドで行い、バックエンドのレスポンスで localStorage を上書きしない。

対応する操作と API のマッピング:
- タスク作成 → `POST /tasks`
- タスク更新 → `PATCH /tasks/{id}`
- タスク削除 → `DELETE /tasks/{id}`
- タスク並べ替え → `PATCH /tasks/{id}/reorder`

#### Scenario: ログイン済みユーザーがタスクを作成する

- **WHEN** ログイン済みユーザーがタスクを作成する
- **THEN** taskStore にタスクが追加された後、`POST /tasks` でバックエンドにデータが送信される

#### Scenario: ログイン済みユーザーがタスクを更新する

- **WHEN** ログイン済みユーザーがタスクを更新する
- **THEN** taskStore のタスクが更新された後、`PATCH /tasks/{id}` でバックエンドにデータが送信される

#### Scenario: ログイン済みユーザーがタスクを削除する

- **WHEN** ログイン済みユーザーがタスクを削除する
- **THEN** taskStore からタスクが削除された後、`DELETE /tasks/{id}` でバックエンドにデータが送信される

#### Scenario: ログイン済みユーザーがタスクを並べ替える

- **WHEN** ログイン済みユーザーが moveTask でタスクを並べ替える
- **THEN** taskStore の sortOrder が更新された後、対象の2つのタスクそれぞれについて `PATCH /tasks/{id}/reorder` でバックエンドにデータが送信される

#### Scenario: 未ログインユーザーがタスクを操作する

- **WHEN** 未ログインユーザーがタスクを作成・更新・削除・並べ替えする
- **THEN** バックエンドへのリクエストは送信されず、localStorage のみが更新される

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

### Requirement: JSON インポート時にバックエンドタスクを全件上書きする

ログイン済みユーザーが JSON インポートを確定した場合、システムはバックエンド上の当該ユーザータスクをインポートデータで全件上書きしなければならない（SHALL）。上書き後は `GET /tasks` の取得結果でローカル taskStore を確定し、最終状態を一致させなければならない（SHALL）。

#### Scenario: JSON インポートでバックエンド上書きが成功する
- **WHEN** ログイン済みユーザーがインポート確認を承認し、上書き処理が成功する
- **THEN** バックエンドのタスク集合がインポートデータと一致し、`GET /tasks` の結果で taskStore が更新される

#### Scenario: JSON インポートでバックエンド上書きが失敗する
- **WHEN** ログイン済みユーザーのインポート処理中にバックエンド更新が途中で失敗する
- **THEN** 同期失敗がユーザーに通知され、再同期または再試行の導線が提供される
