## ADDED Requirements

### Requirement: 環境変数によるデータベース接続情報の設定
バックエンドは以下の環境変数からデータベース接続情報を読み取らなければならない (SHALL)。

| 環境変数 | 説明 | デフォルト値 |
|----------|------|-------------|
| `DB_HOST` | データベースホスト | `localhost` |
| `DB_PORT` | データベースポート | `5432` |
| `DB_USER` | ユーザー名 | `postgres` |
| `DB_PASSWORD` | パスワード | (なし) |
| `DB_NAME` | データベース名 | `task_tree_manager` |
| `DB_SSLMODE` | SSL モード | `disable` |

#### Scenario: すべての環境変数が設定されている場合
- **WHEN** すべてのデータベース接続用環境変数が設定されている
- **THEN** 設定された値を使って PostgreSQL に接続する

#### Scenario: 環境変数が未設定の場合
- **WHEN** 一部の環境変数が設定されていない
- **THEN** 未設定の環境変数にはデフォルト値が使用される

### Requirement: pgx による PostgreSQL 接続
バックエンドは `jackc/pgx` v5 を使用して PostgreSQL に接続しなければならない (SHALL)。

#### Scenario: データベース接続の確立
- **WHEN** バックエンドが起動する
- **THEN** 環境変数に基づいて PostgreSQL への接続プールが確立される

#### Scenario: データベース接続の失敗
- **WHEN** PostgreSQL に接続できない状態でバックエンドが起動する
- **THEN** エラーメッセージを出力してプロセスが終了する

### Requirement: ヘルスチェック
バックエンドはデータベース接続の状態を確認できるヘルスチェック機能を提供しなければならない (SHALL)。

#### Scenario: データベースが正常な場合のヘルスチェック
- **WHEN** データベース接続が正常な状態で `/health` にアクセスする
- **THEN** HTTP 200 が返される

#### Scenario: データベースが異常な場合のヘルスチェック
- **WHEN** データベース接続が切れた状態で `/health` にアクセスする
- **THEN** HTTP 503 が返される
