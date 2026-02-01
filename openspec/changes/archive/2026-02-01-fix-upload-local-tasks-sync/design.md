## Context

初回ログイン時のローカルタスク一括アップロード処理 (`uploadLocalTasks`) では、`POST /tasks` を使ってタスクを1件ずつ作成している。現在の `POST /tasks` は新規タスク作成用に設計されており、リクエストボディに `status`、`completed_at`、`created_at` フィールドを受け付けない。そのため、ローカルで完了済みや進行中だったタスクがすべて `not_started` / `completed_at=NULL` / `created_at=now()` でアップロードされてしまう。

## Goals / Non-Goals

**Goals:**

- `POST /tasks` に `status`、`completed_at`、`created_at` を optional フィールドとして追加し、指定された場合はその値を使用する
- フロントエンドの `localTaskToCreateRequest` に上記3フィールドの変換を追加する
- 既存のタスク作成フロー（通常の新規作成）に影響を与えない

**Non-Goals:**

- `POST /tasks` 以外のエンドポイントの変更
- アップロード時のエラーハンドリングの改善
- バルクアップロード用の専用エンドポイント作成

## Decisions

### `POST /tasks` に optional フィールドを追加する

通常の新規作成時にはこれらのフィールドを指定する必要がなく、指定しなければ従来と同じデフォルト値（`status='not_started'`、`completed_at=NULL`、`created_at=now()`）が適用される。一方、ローカルタスクのアップロード時には既存の状態をそのまま保持するために指定できる。

代替案として一括アップロード専用エンドポイント（`POST /tasks/bulk`）を追加する方法も検討したが、変更が大きくなる割にメリットが薄い。既存エンドポイントへの optional フィールド追加で十分対応できる。

### `status` のバリデーション

バックエンドで `status` フィールドを受け取る場合、DB の CHECK 制約 (`not_started`, `in_progress`, `waiting`, `completed`) に合致するかをバリデーションする。不正な値の場合は 400 を返す。

### `created_at` のデフォルト値の維持

`created_at` が指定されなかった場合は、DB の `DEFAULT now()` がそのまま適用される。INSERT クエリで `created_at` を明示的にパラメータとして渡し、値が `NULL` の場合は `COALESCE` で `now()` にフォールバックする。

## Risks / Trade-offs

- **任意のステータスでタスクを作成できるようになるリスク** → `status` のバリデーションを実装し、許可された値のみ受け付けることで対処する。通常の新規作成フローではフロントエンドが `status` を送信しないため、影響はない。
- **任意の `created_at` を設定できるリスク** → ローカルタスクのアップロード以外のユースケースでは送信されないため、実質的なリスクは低い。
