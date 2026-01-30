## Why

backend サーバー (Go) にはまだ Docker 環境が用意されていない。frontend は既に Dockerfile と docker-compose.yml で Docker 化されており、同様に backend もコンテナ化することで、開発・デプロイ環境を統一し、再現性のある実行環境を確保する。

## What Changes

- backend 用の Dockerfile を追加し、マルチステージビルドで Go バイナリをビルド・実行する
- プロジェクトルートに docker-compose.yml を追加し、frontend と backend の両サービスを一括管理する
- backend 用の .dockerignore を追加する

## Capabilities

### New Capabilities

- `backend-docker`: backend サーバーの Docker コンテナ化 (Dockerfile、.dockerignore)
- `compose-orchestration`: プロジェクトルートの docker-compose.yml による frontend・backend の統合管理

### Modified Capabilities

(なし)

## Impact

- **コード**: `backend/` に Dockerfile と .dockerignore を追加。プロジェクトルートに docker-compose.yml を追加
- **依存関係**: Docker および Docker Compose が実行環境に必要
- **既存の frontend Docker 設定**: frontend 側の docker-compose.yml は、プロジェクトルートの docker-compose.yml に統合される
- **ポート**: backend は 8080 番ポートを公開 (frontend は既存の 3521:3000 マッピングを維持)
