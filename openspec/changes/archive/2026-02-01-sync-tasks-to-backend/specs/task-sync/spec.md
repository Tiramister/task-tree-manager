## ADDED Requirements

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

初期同期で localStorage のデータをバックエンドに保存する際、親子関係を維持するために親タスクから先に保存しなければならない（SHALL）。保存時に旧 ID から新 ID へのマッピングを管理し、子タスクの `parent_id` を新しい ID に変換する。

#### Scenario: 親子関係のあるタスクをアップロードする

- **WHEN** 親タスク A とその子タスク B が localStorage に存在し、DB が空の状態でログインする
- **THEN** 親タスク A が先に `POST /tasks` で保存され、子タスク B の `parent_id` は A の新しい DB 上の ID に変換されてから保存される

#### Scenario: ルートタスクのみが存在する場合

- **WHEN** 親を持たないタスクのみが localStorage に存在し、DB が空の状態でログインする
- **THEN** 全タスクが `POST /tasks` で保存され、保存後に `GET /tasks` のデータで taskStore が上書きされる

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

taskSyncService はバックエンド API のレスポンス（snake_case）をフロントエンドのタスク型（camelCase）に変換しなければならない（SHALL）。また、フロントエンドのタスクデータをバックエンド API のリクエスト形式に変換しなければならない（SHALL）。

#### Scenario: バックエンドのレスポンスをフロントエンド形式に変換する

- **WHEN** `GET /tasks` のレスポンスを受け取る
- **THEN** `sort_order` → `sortOrder`、`due_date` → `dueDate`、`completed_at` → `completedAt`、`parent_id` → `parentId`、`created_at` → `createdAt` に変換され、`user_id` フィールドは除外される

#### Scenario: フロントエンドのタスクデータをバックエンドのリクエスト形式に変換する

- **WHEN** フロントエンドのタスクデータをバックエンドに送信する
- **THEN** `sortOrder` → `sort_order`、`dueDate` → `due_date`、`completedAt` → `completed_at`、`parentId` → `parent_id` に変換される
