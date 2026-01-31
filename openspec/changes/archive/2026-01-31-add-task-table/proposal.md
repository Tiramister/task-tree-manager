## Why

タスクデータは現在フロントエンドの localStorage にのみ保存されており、デバイス間での共有やサーバーサイドでの管理ができない。タスクデータをバックエンドの PostgreSQL に移行するための第一歩として、DB にタスク用のテーブルを作成する。

## What Changes

- タスクを保存する `tasks` テーブルを作成するマイグレーションファイルを追加する
- フロントエンドの `Task` 型定義に合わせたカラム構成とする（id, title, status, created_at, sort_order, description, due_date, completed_at, notes, parent_id）
- タスクはユーザーに紐づく（user_id 外部キー）
- ツリー構造を表現するため、parent_id で自己参照する
- 親タスク削除時に子タスクもカスケード削除される

## Capabilities

### New Capabilities

- `task-table`: タスクデータを格納する PostgreSQL テーブルの定義（マイグレーション）

### Modified Capabilities

- `database-migration`: tasks テーブルのマイグレーションが追加される

## Impact

- **DB**: `tasks` テーブルが新規作成される
- **バックエンド**: `backend/migrations/` にマイグレーションファイルが追加される
- **依存関係**: `users` テーブルへの外部キー制約を持つため、users テーブルが先に存在する必要がある
