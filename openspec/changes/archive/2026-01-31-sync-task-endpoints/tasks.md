## 1. authMiddleware の拡張

- [x] 1.1 `authMiddleware` でセッション検証時に `user_id` を取得し、`context.Context` に格納する
- [x] 1.2 context からユーザー ID を取得するヘルパー関数を実装する

## 2. タスク一覧取得

- [x] 2.1 `GET /tasks` ハンドラーを `task.go` に実装する（ユーザーの全タスクをフラット配列で返す）
- [x] 2.2 `main.go` にルーティングを追加する

## 3. タスク作成

- [x] 3.1 `POST /tasks` ハンドラーを実装する（title 必須バリデーション、parent_id の所有者検証、sort_order の自動計算を含む）
- [x] 3.2 `main.go` にルーティングを追加する

## 4. タスク更新

- [x] 4.1 `PATCH /tasks/{id}` ハンドラーを実装する（部分更新、所有者検証を含む）
- [x] 4.2 `main.go` にルーティングを追加する

## 5. タスク削除

- [x] 5.1 `DELETE /tasks/{id}` ハンドラーを実装する（所有者検証、CASCADE 削除を含む）
- [x] 5.2 `main.go` にルーティングを追加する

## 6. タスク並び替え

- [x] 6.1 `PATCH /tasks/{id}/reorder` ハンドラーを実装する（sort_order の更新、所有者検証を含む）
- [x] 6.2 `main.go` にルーティングを追加する
