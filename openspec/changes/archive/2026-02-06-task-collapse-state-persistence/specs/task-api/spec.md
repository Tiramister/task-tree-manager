## MODIFIED Requirements

### Requirement: タスク一覧取得

システムは `GET /tasks` エンドポイントを提供し、認証済みユーザーの全タスクをフラットな配列として返さなければならない（SHALL）。レスポンスは JSON 形式で、各タスクのすべてのフィールド（`is_collapsed` を含む）を含む。

#### Scenario: 認証済みユーザーがタスク一覧を取得する

- **WHEN** 認証済みユーザーが `GET /tasks` にリクエストを送信する
- **THEN** ステータスコード 200 と、そのユーザーが所有する全タスクの JSON 配列が返され、各タスクに `is_collapsed` フィールドが含まれる

#### Scenario: タスクが存在しないユーザーが一覧を取得する

- **WHEN** タスクを持たない認証済みユーザーが `GET /tasks` にリクエストを送信する
- **THEN** ステータスコード 200 と空の JSON 配列 `[]` が返される

#### Scenario: 未認証ユーザーがタスク一覧を取得しようとする

- **WHEN** 未認証ユーザーが `GET /tasks` にリクエストを送信する
- **THEN** ステータスコード 401 が返される

### Requirement: タスク作成

システムは `POST /tasks` エンドポイントを提供し、認証済みユーザーが新しいタスクを作成できなければならない（SHALL）。リクエストボディには `title`（必須）、`description`、`due_date`、`notes`、`parent_id`、`status`、`completed_at`、`created_at`、`is_collapsed` を含めることができる。`is_collapsed` はリクエストに含まれない場合 `false` をデフォルト値とする。

#### Scenario: 必須フィールドのみでタスクを作成する

- **WHEN** 認証済みユーザーが `POST /tasks` に `{ "title": "新しいタスク" }` を送信する
- **THEN** ステータスコード 201 と、生成された UUID・デフォルトステータス `not_started`・`is_collapsed: false`・自動計算された `sort_order`・`created_at` を含む作成済みタスクの JSON が返される

#### Scenario: is_collapsed を指定してタスクを作成する

- **WHEN** 認証済みユーザーが `POST /tasks` に `{ "title": "折り畳みタスク", "is_collapsed": true }` を送信する
- **THEN** ステータスコード 201 と、`is_collapsed: true` を含む作成済みタスクの JSON が返される

#### Scenario: title なしでタスクを作成しようとする

- **WHEN** 認証済みユーザーが `POST /tasks` に `title` を含まないリクエストを送信する
- **THEN** ステータスコード 400 が返される

### Requirement: タスク更新

システムは `PATCH /tasks/{id}` エンドポイントを提供し、認証済みユーザーが自身のタスクを部分更新できなければならない（SHALL）。更新可能なフィールドは `title`、`description`、`due_date`、`notes`、`status`、`completed_at`、`is_collapsed` とする。

#### Scenario: タスクの折り畳み状態を更新する

- **WHEN** 認証済みユーザーが `PATCH /tasks/{id}` に `{ "is_collapsed": true }` を送信する
- **THEN** ステータスコード 200 と、`is_collapsed: true` の更新後タスクの JSON が返される

#### Scenario: タスクの折り畳み状態を展開に更新する

- **WHEN** 認証済みユーザーが `PATCH /tasks/{id}` に `{ "is_collapsed": false }` を送信する
- **THEN** ステータスコード 200 と、`is_collapsed: false` の更新後タスクの JSON が返される

#### Scenario: is_collapsed を指定せずに他フィールドを更新する

- **WHEN** 認証済みユーザーが `PATCH /tasks/{id}` に `{ "title": "新タイトル" }` を送信する
- **THEN** `is_collapsed` は既存値が保持される

#### Scenario: 存在しないタスクを更新しようとする

- **WHEN** 認証済みユーザーが存在しない ID に対して `PATCH /tasks/{id}` を送信する
- **THEN** ステータスコード 404 が返される

#### Scenario: 他のユーザーのタスクを更新しようとする

- **WHEN** 認証済みユーザーが他のユーザーが所有するタスクに対して `PATCH /tasks/{id}` を送信する
- **THEN** ステータスコード 404 が返される
