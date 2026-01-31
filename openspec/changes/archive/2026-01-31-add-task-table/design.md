## Context

タスクデータは現在フロントエンドの localStorage（Zustand persist）で管理されている。バックエンドには PostgreSQL が稼働しており、`users` テーブルと `sessions` テーブルが存在する。マイグレーションは `golang-migrate/migrate` で管理し、`embed` パッケージでバイナリに埋め込む方式を採用している。

フロントエンドの `Task` 型は以下のフィールドを持つ:
- 必須: `id`(string), `title`(string), `status`(TaskStatus), `createdAt`(ISO 8601), `sortOrder`(number)
- オプショナル: `description`(string), `dueDate`(ISO 8601), `completedAt`(ISO 8601), `notes`(string), `parentId`(string)

## Goals / Non-Goals

**Goals:**
- フロントエンドの `Task` 型と対応する `tasks` テーブルを PostgreSQL に作成する
- ユーザーごとにタスクを管理できるようにする（`user_id` 外部キー）
- ツリー構造（親子関係）をサポートする
- 既存のマイグレーション規約に従う

**Non-Goals:**
- タスク CRUD の API エンドポイント実装（別の change で対応）
- フロントエンドのストアをバックエンド API に接続する変更
- タスクの共有・コラボレーション機能

## Decisions

### テーブル設計

`tasks` テーブルのカラムはフロントエンドの `Task` 型に対応させる。既存テーブルの命名規約（snake_case）に合わせる。

| カラム | 型 | 制約 | 対応する TS フィールド |
|---|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() | id |
| user_id | UUID | NOT NULL, FK → users(id) ON DELETE CASCADE | (新規) |
| title | VARCHAR(255) | NOT NULL | title |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'not_started' | status |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 | sortOrder |
| description | TEXT | NULL | description |
| due_date | TIMESTAMPTZ | NULL | dueDate |
| completed_at | TIMESTAMPTZ | NULL | completedAt |
| notes | TEXT | NULL | notes |
| parent_id | UUID | NULL, FK → tasks(id) ON DELETE CASCADE | parentId |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | createdAt |

**判断理由:**

- **id を UUID にする**: 既存の `users` テーブルが UUID を使用しており、フロントエンドでも UUID を生成しているため統一する。
- **status を VARCHAR(20) にする**: PostgreSQL の ENUM 型はマイグレーションでの変更が煩雑（ALTER TYPE が必要）。VARCHAR + CHECK 制約の方が柔軟。
- **CHECK 制約で status を制限する**: アプリケーションレベルだけでなく DB レベルでもデータ整合性を担保する。
- **parent_id に ON DELETE CASCADE**: フロントエンドの既存動作（親削除で子孫も削除）と一致させる。
- **user_id に ON DELETE CASCADE**: ユーザー削除時にタスクも削除する。
- **description と notes を TEXT にする**: 長さに上限を設けない。

### マイグレーション番号

既存の最新マイグレーションが `000003` なので、`000004_create_tasks` とする。

### インデックス

- `(user_id, parent_id)` の複合インデックス: ユーザーのタスクをツリー構造で取得する際のクエリを高速化する。
- `(user_id, status)` の複合インデックス: ステータスでのフィルタリングを高速化する。

## Risks / Trade-offs

- **CASCADE 削除の連鎖**: 親タスクの削除で深いツリー全体が消える。現状フロントエンドで同じ動作をしているため許容する。→ 将来的にソフトデリートを検討する余地あり。
- **sort_order の INTEGER**: 並び替え時にギャップが生じる可能性がある。→ 当面は問題にならない規模と想定。必要に応じて再採番ロジックを後から実装可能。
