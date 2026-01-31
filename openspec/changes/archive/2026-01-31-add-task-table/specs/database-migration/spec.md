## ADDED Requirements

### Requirement: tasks テーブルのマイグレーション

`tasks` テーブルを作成するマイグレーションファイルが `backend/migrations/` に配置されなければならない（SHALL）。up マイグレーションは `tasks` テーブルを作成し、down マイグレーションは `tasks` テーブルを削除する。`tasks` テーブルの作成は `sessions` テーブルの作成よりも後でなければならない（SHALL）。

#### Scenario: tasks テーブルの作成
- **WHEN** up マイグレーションが適用される
- **THEN** `tasks` テーブルが作成される（`users` テーブルおよび自己参照の外部キー制約、CHECK 制約、インデックスを含む）

#### Scenario: tasks テーブルのロールバック
- **WHEN** down マイグレーションが適用される
- **THEN** `tasks` テーブルが削除される
