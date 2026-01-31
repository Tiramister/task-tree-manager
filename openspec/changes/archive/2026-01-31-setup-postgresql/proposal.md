## Why

現在、タスクデータはフロントエンドの localStorage にのみ保存されており、バックエンドにはデータストレージが存在しない。サーバーサイドでのデータ永続化を実現するため、データベースとして PostgreSQL を導入し、バックエンドからの接続基盤を整備する。

## What Changes

- バックエンドに PostgreSQL への接続機能を追加する
- データベースの接続情報（エンドポイント、ポート番号、ユーザー名、パスワード、データベース名）を環境変数で管理する
- ローカル開発用に docker-compose.yml へ PostgreSQL コンテナを追加する
- マイグレーション管理ツールを導入し、スキーマの変更を追跡可能にする

## Capabilities

### New Capabilities

- `database-connection`: PostgreSQL への接続管理。環境変数による接続情報の設定、接続プールの管理、ヘルスチェックを含む。
- `database-migration`: マイグレーション管理ツールの導入。マイグレーションファイルの作成・適用・ロールバックのワークフローを定義する。
- `local-database`: ローカル開発環境向けの PostgreSQL コンテナ構成。docker-compose.yml への追加、初期設定、データの永続化を含む。

### Modified Capabilities

- `compose-orchestration`: PostgreSQL サービスの追加に伴い、docker-compose.yml の構成が変更される。

## Impact

- **バックエンド**: Go の PostgreSQL ドライバおよびマイグレーションツールが新たな依存関係として追加される
- **Docker**: docker-compose.yml に PostgreSQL サービスが追加され、バックエンドサービスにデータベースへの依存関係が設定される
- **環境変数**: データベース接続に必要な環境変数（`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` など）が新たに必要になる
- **CI/CD**: 将来的にデプロイ環境でもデータベース接続情報の設定が必要になる（本変更のスコープ外）
