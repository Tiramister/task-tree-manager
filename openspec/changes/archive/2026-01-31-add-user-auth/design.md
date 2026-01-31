## Context

現在のバックエンドは Go の標準 `net/http` パッケージで構築されており、`/` と `/health` の 2 つのエンドポイントのみが存在する。データベースには `pgxpool` で PostgreSQL に接続しており、`golang-migrate` によるマイグレーション基盤が整っている。認証機能は一切実装されていない。

ユーザー追加のエンドポイントは作らず、ユーザーは DB への直接 INSERT で登録する運用とする。

## Goals / Non-Goals

**Goals:**

- ID/パスワードによるユーザー認証を実装する
- ログイン・ログアウトの HTTP エンドポイントを提供する
- セッション管理により認証状態を維持する
- パスワードを安全にハッシュ化して保存する

**Non-Goals:**

- ユーザー登録（サインアップ）エンドポイントの提供
- OAuth やトークンベース認証（JWT など）の実装
- フロントエンドのログイン UI の実装
- ロールベースのアクセス制御（RBAC）

## Decisions

### 1. パスワードハッシュ化: bcrypt を採用

`golang.org/x/crypto/bcrypt` を使用する。

- **理由**: Go の準標準ライブラリであり、ソルトの自動生成・検証が一体化した API を持つ。デフォルトコスト（10）で十分な安全性がある。
- **代替案**: argon2id はより新しいアルゴリズムだが、パラメータ調整が複雑であり、現段階では bcrypt で十分。

### 2. セッション管理: DB ベースのセッション + Cookie

セッション情報を `sessions` テーブルに保存し、セッション ID を HTTP Cookie で管理する。

- **理由**: サーバー側でセッションを管理するため、明示的な無効化（ログアウト）が確実に行える。既に PostgreSQL が稼働しているため追加のインフラが不要。
- **代替案**: JWT はステートレスだが、明示的な無効化が困難。Redis によるセッション管理はインフラが増える。Cookie ベースのセッション管理が最もシンプル。

### 3. セッション ID の生成: `crypto/rand` による安全な乱数

`crypto/rand` で 32 バイトの暗号学的に安全なランダムバイト列を生成し、hex エンコードして使用する。

- **理由**: 標準ライブラリで十分な安全性を確保でき、外部依存を増やさない。

### 4. Cookie の設定

- `HttpOnly: true` — JavaScript からのアクセスを防止
- `SameSite: Lax` — CSRF 対策
- `Secure`: 本番では `true`、開発では `false`（環境変数で制御）
- `Path: /` — 全パスで有効

### 5. 認証ミドルウェア

`net/http` の `HandlerFunc` をラップするミドルウェア関数を実装する。

- `/login` と `/health` は認証不要
- それ以外のエンドポイントは認証必須
- 未認証のリクエストには `401 Unauthorized` を返す

### 6. データベーススキーマ

**users テーブル:**

| カラム | 型 | 制約 |
|---|---|---|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| username | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() |

**sessions テーブル:**

| カラム | 型 | 制約 |
|---|---|---|
| id | VARCHAR(64) | PRIMARY KEY |
| user_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() |
| expires_at | TIMESTAMPTZ | NOT NULL |

### 7. API 設計

**POST /login**
- リクエスト: `{"username": "...", "password": "..."}`（JSON）
- 成功: `200 OK` + `Set-Cookie` ヘッダー
- 失敗: `401 Unauthorized`

**POST /logout**
- Cookie からセッション ID を取得し、DB から削除
- 成功: `200 OK` + Cookie 削除
- 未認証: `401 Unauthorized`

### 8. セッションの有効期限

セッションの有効期限を 24 時間とする。期限切れのセッションは認証ミドルウェアで検出し、401 を返す。期限切れセッションの定期削除は将来の課題とする。

## Risks / Trade-offs

- **セッションの肥大化**: 期限切れセッションが DB に蓄積する → 当面は手動削除で対応。将来的に定期クリーンアップを追加する。
- **単一サーバー前提**: セッションが DB に保存されるため複数サーバーでも動作するが、DB がボトルネックになる可能性がある → 現段階では単一サーバーなので問題なし。
- **ユーザー登録の運用負荷**: DB 直接 INSERT のためパスワードハッシュの事前生成が必要 → CLI ツールやスクリプトの提供は今回のスコープ外。
