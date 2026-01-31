## ADDED Requirements

### Requirement: users テーブルのマイグレーション
`users` テーブルを作成するマイグレーションファイルが `backend/migrations/` に配置されなければならない（SHALL）。up マイグレーションは `users` テーブルを作成し、down マイグレーションは `users` テーブルを削除する。

#### Scenario: users テーブルの作成
- **WHEN** up マイグレーションが適用される
- **THEN** `users` テーブルが作成される

#### Scenario: users テーブルのロールバック
- **WHEN** down マイグレーションが適用される
- **THEN** `users` テーブルが削除される

### Requirement: sessions テーブルのマイグレーション
`sessions` テーブルを作成するマイグレーションファイルが `backend/migrations/` に配置されなければならない（SHALL）。up マイグレーションは `sessions` テーブルを作成し、down マイグレーションは `sessions` テーブルを削除する。`sessions` テーブルの作成は `users` テーブルの作成よりも後でなければならない（SHALL）。

#### Scenario: sessions テーブルの作成
- **WHEN** up マイグレーションが適用される
- **THEN** `sessions` テーブルが作成される（`users` テーブルへの外部キー制約を含む）

#### Scenario: sessions テーブルのロールバック
- **WHEN** down マイグレーションが適用される
- **THEN** `sessions` テーブルが削除される
