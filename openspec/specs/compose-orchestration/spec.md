## ADDED Requirements

### Requirement: プロジェクトルートの docker-compose.yml で全サービスを管理
プロジェクトルートに docker-compose.yml を配置し、frontend、backend、および db の全サービスを定義しなければならない (SHALL)。

#### Scenario: 全サービスの一括起動
- **WHEN** プロジェクトルートで `docker compose up` を実行する
- **THEN** frontend、backend、および db の全サービスが起動する

#### Scenario: 全サービスの一括停止
- **WHEN** プロジェクトルートで `docker compose down` を実行する
- **THEN** frontend、backend、および db の全サービスが停止する

### Requirement: 各サービスのビルドコンテキスト設定
docker-compose.yml の各サービスは、対応するサブディレクトリをビルドコンテキストとして指定しなければならない (SHALL)。

#### Scenario: frontend サービスのビルド
- **WHEN** frontend サービスをビルドする
- **THEN** `frontend/` ディレクトリがビルドコンテキストとして使用され、`frontend/Dockerfile` でビルドされる

#### Scenario: backend サービスのビルド
- **WHEN** backend サービスをビルドする
- **THEN** `backend/` ディレクトリがビルドコンテキストとして使用され、`backend/Dockerfile` でビルドされる

### Requirement: ポートマッピング
frontend は `3521:3000`、backend は `8521:8080` でホストにマッピングしなければならない (SHALL)。

#### Scenario: frontend のポートマッピング
- **WHEN** frontend サービスが起動している状態でホストからアクセスする
- **THEN** `localhost:3521` で frontend にアクセスできる

#### Scenario: backend のポートマッピング
- **WHEN** backend サービスが起動している状態でホストからアクセスする
- **THEN** `localhost:8521` で backend にアクセスできる

### Requirement: サービスの自動再起動
各サービスは `restart: always` ポリシーを設定しなければならない (SHALL)。

#### Scenario: サービスのクラッシュ後の再起動
- **WHEN** いずれかのサービスが予期せず停止する
- **THEN** Docker が自動的にサービスを再起動する

### Requirement: バックエンドからデータベースへの依存関係
backend サービスは db サービスに依存しなければならない (SHALL)。

#### Scenario: サービスの起動順序
- **WHEN** `docker compose up` を実行する
- **THEN** db サービスが起動した後に backend サービスが起動する

### Requirement: バックエンドへのデータベース接続情報の注入
docker-compose.yml で backend サービスにデータベース接続用の環境変数を設定しなければならない (SHALL)。

#### Scenario: 環境変数の設定
- **WHEN** backend サービスが起動する
- **THEN** `DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PASSWORD`、`DB_NAME` の環境変数が設定されている
