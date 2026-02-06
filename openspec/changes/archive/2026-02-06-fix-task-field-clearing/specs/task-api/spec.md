## MODIFIED Requirements

### Requirement: タスク更新

システムは `PATCH /tasks/{id}` エンドポイントを提供し、認証済みユーザーが自身のタスクを部分更新できなければならない（SHALL）。更新可能なフィールドは `title`、`description`、`due_date`、`notes`、`status`、`completed_at` とする。

nullable フィールド（`description`、`due_date`、`notes`、`completed_at`）は次の 3 状態を区別して処理しなければならない（SHALL）。
- フィールド未指定: 既存値を保持する
- 文字列値を指定: 指定値で更新する
- `null` を指定: `NULL` に更新する

#### Scenario: タスクのステータスを更新する
- **WHEN** 認証済みユーザーが `PATCH /tasks/{id}` に `{ "status": "completed", "completed_at": "2026-01-31T12:00:00Z" }` を送信する
- **THEN** ステータスコード 200 と、更新後のタスクの JSON が返される

#### Scenario: description を null でクリアする
- **WHEN** 認証済みユーザーが `PATCH /tasks/{id}` に `{ "description": null }` を送信する
- **THEN** ステータスコード 200 と、`description` が `null` の更新後タスク JSON が返される

#### Scenario: due_date を null でクリアする
- **WHEN** 認証済みユーザーが `PATCH /tasks/{id}` に `{ "due_date": null }` を送信する
- **THEN** ステータスコード 200 と、`due_date` が `null` の更新後タスク JSON が返される

#### Scenario: completed_at を null でクリアする
- **WHEN** 認証済みユーザーが `PATCH /tasks/{id}` に `{ "completed_at": null }` を送信する
- **THEN** ステータスコード 200 と、`completed_at` が `null` の更新後タスク JSON が返される

#### Scenario: nullable フィールドを未指定で更新する
- **WHEN** 認証済みユーザーが `PATCH /tasks/{id}` に `{ "status": "in_progress" }` を送信する
- **THEN** 指定されていない `description`、`due_date`、`notes`、`completed_at` は既存値が保持される

#### Scenario: 存在しないタスクを更新しようとする
- **WHEN** 認証済みユーザーが存在しない ID に対して `PATCH /tasks/{id}` を送信する
- **THEN** ステータスコード 404 が返される

#### Scenario: 他のユーザーのタスクを更新しようとする
- **WHEN** 認証済みユーザーが他のユーザーが所有するタスクに対して `PATCH /tasks/{id}` を送信する
- **THEN** ステータスコード 404 が返される
