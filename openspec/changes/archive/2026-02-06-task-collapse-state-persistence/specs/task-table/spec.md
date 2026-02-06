## MODIFIED Requirements

### Requirement: tasks テーブルが存在する

PostgreSQL に `tasks` テーブルが存在しなければならない（SHALL）。テーブルは以下のカラムを持つ：

- `id`: UUID, PRIMARY KEY, DEFAULT gen_random_uuid()
- `user_id`: UUID, NOT NULL, users テーブルへの外部キー
- `title`: VARCHAR(255), NOT NULL
- `status`: VARCHAR(20), NOT NULL, DEFAULT 'not_started'
- `sort_order`: INTEGER, NOT NULL, DEFAULT 0
- `description`: TEXT, NULL
- `due_date`: TIMESTAMPTZ, NULL
- `completed_at`: TIMESTAMPTZ, NULL
- `notes`: TEXT, NULL
- `parent_id`: UUID, NULL, tasks テーブルへの自己参照外部キー
- `created_at`: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- `is_collapsed`: BOOLEAN, NOT NULL, DEFAULT false

#### Scenario: tasks テーブルが存在する

- **WHEN** データベースにマイグレーションが適用された状態
- **THEN** `tasks` テーブルが存在し、`is_collapsed` カラムを含む
