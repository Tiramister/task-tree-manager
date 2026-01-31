## 1. データベースマイグレーション

- [x] 1.1 `backend/migrations/000002_create_users.up.sql` と `000002_create_users.down.sql` を作成し、`users` テーブルを定義する
- [x] 1.2 `backend/migrations/000003_create_sessions.up.sql` と `000003_create_sessions.down.sql` を作成し、`sessions` テーブルを定義する

## 2. 依存関係の追加

- [x] 2.1 `golang.org/x/crypto` を `go.mod` に追加する（bcrypt 用）

## 3. 認証機能の実装

- [x] 3.1 パスワードの bcrypt ハッシュ化・検証を行うヘルパー関数を実装する
- [x] 3.2 セッション ID 生成関数を実装する（`crypto/rand` で 32 バイト → hex エンコード）
- [x] 3.3 `POST /login` エンドポイントを実装する（JSON パース、ユーザー照合、パスワード検証、セッション作成、Cookie 設定）
- [x] 3.4 `POST /logout` エンドポイントを実装する（Cookie からセッション ID 取得、DB からセッション削除、Cookie 無効化）

## 4. 認証ミドルウェア

- [x] 4.1 認証ミドルウェアを実装する（Cookie からセッション ID 取得、DB でセッション検証、有効期限チェック）
- [x] 4.2 `/login` と `/health` を認証不要、それ以外を認証必須としてルーティングに適用する

## 5. 動作確認

- [x] 5.1 Docker Compose でサービスを起動し、マイグレーションが正常に適用されることを確認する
- [x] 5.2 テスト用ユーザーを DB に直接 INSERT し、ログイン・ログアウトの動作を確認する
