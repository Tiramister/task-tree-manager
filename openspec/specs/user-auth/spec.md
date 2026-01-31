### Requirement: users テーブル
システムは PostgreSQL に `users` テーブルを持たなければならない（SHALL）。テーブルは以下のカラムを持つ: `id`（UUID, PRIMARY KEY, DEFAULT gen_random_uuid()）、`username`（VARCHAR(255), UNIQUE, NOT NULL）、`password_hash`（VARCHAR(255), NOT NULL）、`created_at`（TIMESTAMPTZ, NOT NULL, DEFAULT now()）。

#### Scenario: users テーブルの存在
- **WHEN** マイグレーションが適用された状態でデータベースを確認する
- **THEN** `users` テーブルが存在し、上記のカラムと制約を持つ

### Requirement: sessions テーブル
システムは PostgreSQL に `sessions` テーブルを持たなければならない（SHALL）。テーブルは以下のカラムを持つ: `id`（VARCHAR(64), PRIMARY KEY）、`user_id`（UUID, NOT NULL, REFERENCES users(id) ON DELETE CASCADE）、`created_at`（TIMESTAMPTZ, NOT NULL, DEFAULT now()）、`expires_at`（TIMESTAMPTZ, NOT NULL）。

#### Scenario: sessions テーブルの存在
- **WHEN** マイグレーションが適用された状態でデータベースを確認する
- **THEN** `sessions` テーブルが存在し、上記のカラムと制約を持つ

#### Scenario: ユーザー削除時のセッションカスケード削除
- **WHEN** `users` テーブルからユーザーが削除される
- **THEN** そのユーザーに紐づく `sessions` テーブルのレコードもすべて削除される

### Requirement: パスワードの bcrypt ハッシュ化
パスワードは `bcrypt` アルゴリズムでハッシュ化して `password_hash` カラムに保存しなければならない（SHALL）。平文のパスワードをデータベースに保存してはならない（SHALL NOT）。

#### Scenario: パスワードの保存形式
- **WHEN** ユーザーのパスワードハッシュがデータベースに保存されている
- **THEN** `password_hash` カラムの値は bcrypt ハッシュ形式（`$2a$` または `$2b$` プレフィックス）である

### Requirement: ログインエンドポイント
サーバーは `POST /login` エンドポイントを提供しなければならない（SHALL）。リクエストボディは JSON 形式で `username` と `password` フィールドを含む。認証成功時はセッションを作成し、セッション ID を Cookie に設定する。

#### Scenario: 正しい認証情報でのログイン
- **WHEN** クライアントが `POST /login` に正しい `username` と `password` を JSON で送信する
- **THEN** ステータスコード 200 が返り、`Set-Cookie` ヘッダーでセッション ID が設定される

#### Scenario: 誤ったパスワードでのログイン
- **WHEN** クライアントが `POST /login` に存在するユーザー名と誤ったパスワードを送信する
- **THEN** ステータスコード 401 が返る

#### Scenario: 存在しないユーザーでのログイン
- **WHEN** クライアントが `POST /login` に存在しないユーザー名を送信する
- **THEN** ステータスコード 401 が返る

#### Scenario: 不正なリクエストボディ
- **WHEN** クライアントが `POST /login` に不正な JSON を送信する
- **THEN** ステータスコード 400 が返る

### Requirement: ログアウトエンドポイント
サーバーは `POST /logout` エンドポイントを提供しなければならない（SHALL）。Cookie からセッション ID を取得し、対応するセッションをデータベースから削除する。

#### Scenario: 認証済みユーザーのログアウト
- **WHEN** 有効なセッション Cookie を持つクライアントが `POST /logout` を送信する
- **THEN** ステータスコード 200 が返り、セッションがデータベースから削除され、Cookie が無効化される

#### Scenario: 未認証ユーザーのログアウト
- **WHEN** セッション Cookie を持たないクライアントが `POST /logout` を送信する
- **THEN** ステータスコード 401 が返る

### Requirement: セッション Cookie の設定
セッション Cookie は以下の属性を持たなければならない（SHALL）: `HttpOnly: true`、`SameSite: Lax`、`Path: /`。`Secure` 属性は環境変数 `COOKIE_SECURE` が `true` の場合に有効にしなければならない（SHALL）。

#### Scenario: Cookie のセキュリティ属性
- **WHEN** ログイン成功時に Set-Cookie ヘッダーが返される
- **THEN** Cookie は `HttpOnly` と `SameSite=Lax` の属性を持つ

#### Scenario: 本番環境での Secure 属性
- **WHEN** 環境変数 `COOKIE_SECURE=true` が設定された状態でログインする
- **THEN** Cookie は `Secure` 属性を持つ

### Requirement: セッション ID の生成
セッション ID は `crypto/rand` で 32 バイトの暗号学的に安全なランダムバイト列を生成し、hex エンコードした 64 文字の文字列でなければならない（SHALL）。

#### Scenario: セッション ID の形式
- **WHEN** 新しいセッションが作成される
- **THEN** セッション ID は 64 文字の 16 進数文字列である

### Requirement: セッションの有効期限
セッションの有効期限は作成時から 24 時間でなければならない（SHALL）。期限切れのセッションは認証時に無効と判定しなければならない（SHALL）。

#### Scenario: 有効期限内のセッション
- **WHEN** 作成から 24 時間以内のセッション Cookie でリクエストを送信する
- **THEN** 認証が成功する

#### Scenario: 有効期限切れのセッション
- **WHEN** 作成から 24 時間を超えたセッション Cookie でリクエストを送信する
- **THEN** ステータスコード 401 が返る

### Requirement: 認証ミドルウェア
`/login` と `/health` 以外のエンドポイントは認証ミドルウェアで保護しなければならない（SHALL）。未認証のリクエストにはステータスコード 401 を返さなければならない（SHALL）。

#### Scenario: 認証不要のエンドポイント
- **WHEN** セッション Cookie なしで `GET /health` にリクエストを送信する
- **THEN** ステータスコード 200 が返る

#### Scenario: 認証必須エンドポイントへの未認証アクセス
- **WHEN** セッション Cookie なしで `GET /` にリクエストを送信する
- **THEN** ステータスコード 401 が返る

#### Scenario: 認証必須エンドポイントへの認証済みアクセス
- **WHEN** 有効なセッション Cookie を持つクライアントが `GET /` にリクエストを送信する
- **THEN** 正常なレスポンスが返る
