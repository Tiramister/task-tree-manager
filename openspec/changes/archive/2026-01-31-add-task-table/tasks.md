## 1. マイグレーションファイル作成

- [x] 1.1 `backend/migrations/000004_create_tasks.up.sql` を作成する（tasks テーブル定義、CHECK 制約、外部キー制約、インデックスを含む）
- [x] 1.2 `backend/migrations/000004_create_tasks.down.sql` を作成する（tasks テーブルの削除）

## 2. 動作確認

- [x] 2.1 バックエンドを起動してマイグレーションが正常に適用されることを確認する
- [x] 2.2 tasks テーブルの構造（カラム、制約、インデックス）が設計通りであることを確認する
