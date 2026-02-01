## MODIFIED Requirements

### Requirement: タスク作成

システムは `POST /tasks` エンドポイントを提供し、認証済みユーザーが新しいタスクを作成できなければならない（SHALL）。リクエストボディには `title`（必須）、`description`、`due_date`、`notes`、`parent_id`、`status`、`completed_at`、`created_at` を含めることができる。`sort_order` はリクエストに含まれる場合はその値を使用し、含まれない場合は同一親の兄弟タスクの最大 `sort_order` + 1 をデフォルト値とする。`status` はリクエストに含まれない場合 `not_started` をデフォルト値とする。`completed_at` はリクエストに含まれない場合 `NULL` をデフォルト値とする。`created_at` はリクエストに含まれない場合、現在時刻をデフォルト値とする。

#### Scenario: 必須フィールドのみでタスクを作成する

- **WHEN** 認証済みユーザーが `POST /tasks` に `{ "title": "新しいタスク" }` を送信する
- **THEN** ステータスコード 201 と、生成された UUID・デフォルトステータス `not_started`・自動計算された `sort_order`・`created_at` を含む作成済みタスクの JSON が返される

#### Scenario: オプショナルフィールドを含めてタスクを作成する

- **WHEN** 認証済みユーザーが `POST /tasks` に `title`、`description`、`due_date`、`notes`、`parent_id`、`status`、`completed_at`、`created_at` を含むリクエストを送信する
- **THEN** ステータスコード 201 と、すべてのフィールドが反映された作成済みタスクの JSON が返される

#### Scenario: title なしでタスクを作成しようとする

- **WHEN** 認証済みユーザーが `POST /tasks` に `title` を含まないリクエストを送信する
- **THEN** ステータスコード 400 が返される

#### Scenario: 他のユーザーのタスクを parent_id に指定する

- **WHEN** 認証済みユーザーが `POST /tasks` に他のユーザーが所有するタスクの `parent_id` を指定して送信する
- **THEN** ステータスコード 400 が返される

#### Scenario: 不正な status 値でタスクを作成しようとする

- **WHEN** 認証済みユーザーが `POST /tasks` に `{ "title": "タスク", "status": "invalid" }` を送信する
- **THEN** ステータスコード 400 が返される

#### Scenario: status と completed_at を指定してタスクを作成する

- **WHEN** 認証済みユーザーが `POST /tasks` に `{ "title": "完了タスク", "status": "completed", "completed_at": "2026-01-15T10:00:00Z" }` を送信する
- **THEN** ステータスコード 201 と、`status` が `completed`、`completed_at` が指定した日時の作成済みタスクの JSON が返される

#### Scenario: created_at を指定してタスクを作成する

- **WHEN** 認証済みユーザーが `POST /tasks` に `{ "title": "過去のタスク", "created_at": "2026-01-01T00:00:00Z" }` を送信する
- **THEN** ステータスコード 201 と、`created_at` が指定した日時の作成済みタスクの JSON が返される
