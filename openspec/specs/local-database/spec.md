## ADDED Requirements

### Requirement: ローカル開発用 PostgreSQL コンテナ
docker-compose.yml に PostgreSQL サービスを定義し、ローカル開発環境で使用できなければならない (SHALL)。

#### Scenario: PostgreSQL コンテナの起動
- **WHEN** `docker compose up` を実行する
- **THEN** PostgreSQL コンテナが起動し、バックエンドから接続可能になる

#### Scenario: PostgreSQL のバージョン
- **WHEN** PostgreSQL コンテナが起動する
- **THEN** PostgreSQL 17 系の公式イメージが使用される

### Requirement: ローカル開発用のデフォルト設定
PostgreSQL コンテナはローカル開発に適したデフォルト設定で起動しなければならない (SHALL)。

#### Scenario: デフォルトのデータベースとユーザー
- **WHEN** PostgreSQL コンテナが初回起動する
- **THEN** ユーザー `postgres`、パスワード `postgres`、データベース `task_tree_manager` が作成される

### Requirement: データの永続化
PostgreSQL のデータは Docker の名前付きボリュームで永続化しなければならない (SHALL)。

#### Scenario: コンテナ再作成時のデータ保持
- **WHEN** `docker compose down` 後に `docker compose up` を実行する
- **THEN** PostgreSQL のデータが保持されている

#### Scenario: ボリュームを含む完全な初期化
- **WHEN** `docker compose down -v` を実行する
- **THEN** PostgreSQL のデータボリュームが削除され、次回起動時に初期化される

### Requirement: ポートマッピング
PostgreSQL コンテナはホストの `5532` ポートにマッピングしなければならない (SHALL)。

#### Scenario: ホストからの接続
- **WHEN** PostgreSQL コンテナが起動している状態
- **THEN** ホストから `localhost:5532` で PostgreSQL に接続できる
