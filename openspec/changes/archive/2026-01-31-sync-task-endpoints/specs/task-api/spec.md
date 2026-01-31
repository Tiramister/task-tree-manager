## ADDED Requirements

### Requirement: タスク一覧取得

システムは `GET /tasks` エンドポイントを提供し、認証済みユーザーの全タスクをフラットな配列として返さなければならない（SHALL）。レスポンスは JSON 形式で、各タスクのすべてのフィールドを含む。

#### Scenario: 認証済みユーザーがタスク一覧を取得する

- **WHEN** 認証済みユーザーが `GET /tasks` にリクエストを送信する
- **THEN** ステータスコード 200 と、そのユーザーが所有する全タスクの JSON 配列が返される

#### Scenario: タスクが存在しないユーザーが一覧を取得する

- **WHEN** タスクを持たない認証済みユーザーが `GET /tasks` にリクエストを送信する
- **THEN** ステータスコード 200 と空の JSON 配列 `[]` が返される

#### Scenario: 未認証ユーザーがタスク一覧を取得しようとする

- **WHEN** 未認証ユーザーが `GET /tasks` にリクエストを送信する
- **THEN** ステータスコード 401 が返される

### Requirement: タスク作成

システムは `POST /tasks` エンドポイントを提供し、認証済みユーザーが新しいタスクを作成できなければならない（SHALL）。リクエストボディには `title`（必須）、`description`、`due_date`、`notes`、`parent_id` を含めることができる。`sort_order` はリクエストに含まれる場合はその値を使用し、含まれない場合は同一親の兄弟タスクの最大 `sort_order` + 1 をデフォルト値とする。

#### Scenario: 必須フィールドのみでタスクを作成する

- **WHEN** 認証済みユーザーが `POST /tasks` に `{ "title": "新しいタスク" }` を送信する
- **THEN** ステータスコード 201 と、生成された UUID・デフォルトステータス `not_started`・自動計算された `sort_order`・`created_at` を含む作成済みタスクの JSON が返される

#### Scenario: オプショナルフィールドを含めてタスクを作成する

- **WHEN** 認証済みユーザーが `POST /tasks` に `title`、`description`、`due_date`、`notes`、`parent_id` を含むリクエストを送信する
- **THEN** ステータスコード 201 と、すべてのフィールドが反映された作成済みタスクの JSON が返される

#### Scenario: title なしでタスクを作成しようとする

- **WHEN** 認証済みユーザーが `POST /tasks` に `title` を含まないリクエストを送信する
- **THEN** ステータスコード 400 が返される

#### Scenario: 他のユーザーのタスクを parent_id に指定する

- **WHEN** 認証済みユーザーが `POST /tasks` に他のユーザーが所有するタスクの `parent_id` を指定して送信する
- **THEN** ステータスコード 400 が返される

### Requirement: タスク更新

システムは `PATCH /tasks/{id}` エンドポイントを提供し、認証済みユーザーが自身のタスクを部分更新できなければならない（SHALL）。更新可能なフィールドは `title`、`description`、`due_date`、`notes`、`status`、`completed_at` とする。

#### Scenario: タスクのステータスを更新する

- **WHEN** 認証済みユーザーが `PATCH /tasks/{id}` に `{ "status": "completed", "completed_at": "2026-01-31T12:00:00Z" }` を送信する
- **THEN** ステータスコード 200 と、更新後のタスクの JSON が返される

#### Scenario: 存在しないタスクを更新しようとする

- **WHEN** 認証済みユーザーが存在しない ID に対して `PATCH /tasks/{id}` を送信する
- **THEN** ステータスコード 404 が返される

#### Scenario: 他のユーザーのタスクを更新しようとする

- **WHEN** 認証済みユーザーが他のユーザーが所有するタスクに対して `PATCH /tasks/{id}` を送信する
- **THEN** ステータスコード 404 が返される

### Requirement: タスク削除

システムは `DELETE /tasks/{id}` エンドポイントを提供し、認証済みユーザーが自身のタスクを削除できなければならない（SHALL）。対象タスクの子孫タスクも CASCADE で削除される。

#### Scenario: タスクを削除する

- **WHEN** 認証済みユーザーが `DELETE /tasks/{id}` にリクエストを送信する
- **THEN** ステータスコード 204 が返され、対象タスクとその子孫タスクが削除される

#### Scenario: 存在しないタスクを削除しようとする

- **WHEN** 認証済みユーザーが存在しない ID に対して `DELETE /tasks/{id}` を送信する
- **THEN** ステータスコード 404 が返される

#### Scenario: 他のユーザーのタスクを削除しようとする

- **WHEN** 認証済みユーザーが他のユーザーが所有するタスクに対して `DELETE /tasks/{id}` を送信する
- **THEN** ステータスコード 404 が返される

### Requirement: タスク並び替え

システムは `PATCH /tasks/{id}/reorder` エンドポイントを提供し、認証済みユーザーが自身のタスクの `sort_order` を変更できなければならない（SHALL）。

#### Scenario: タスクの sort_order を変更する

- **WHEN** 認証済みユーザーが `PATCH /tasks/{id}/reorder` に `{ "sort_order": 3 }` を送信する
- **THEN** ステータスコード 200 と、更新後のタスクの JSON が返される

#### Scenario: 存在しないタスクの sort_order を変更しようとする

- **WHEN** 認証済みユーザーが存在しない ID に対して `PATCH /tasks/{id}/reorder` を送信する
- **THEN** ステータスコード 404 が返される

### Requirement: ユーザー ID の context 伝搬

`authMiddleware` は認証成功時にセッションから `user_id` を取得し、`context.Context` に格納しなければならない（SHALL）。タスク関連の各ハンドラーは context からユーザー ID を取り出して使用する。

#### Scenario: 認証成功時にユーザー ID が context に格納される

- **WHEN** 有効なセッション Cookie を持つリクエストが `authMiddleware` を通過する
- **THEN** リクエストの context にそのセッションに紐づく `user_id` が格納される

#### Scenario: ハンドラーが context からユーザー ID を取得する

- **WHEN** タスク関連のハンドラーがリクエストを処理する
- **THEN** `r.Context()` からユーザー ID を取得できる
