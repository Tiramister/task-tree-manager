## Context

本プロジェクトは frontend (React + Vite) と backend (Go) のモノレポ構成で、frontend は既に Docker 化されている。backend は Go 1.25.6 の標準ライブラリのみで構成されたシンプルな HTTP サーバーで、外部依存はない。

現在 frontend の docker-compose.yml は `frontend/` 内に配置されており、backend を追加するにあたりプロジェクトルートで両サービスを統合管理する構成に移行する。

## Goals / Non-Goals

**Goals:**

- backend サーバーを Docker コンテナとして実行可能にする
- frontend と backend を一括で起動・停止できる docker-compose.yml を提供する
- 本番用に最適化された軽量なコンテナイメージを生成する

**Non-Goals:**

- CI/CD パイプラインの構築
- リバースプロキシ (nginx 等) の導入
- 開発時のホットリロード対応
- Kubernetes マニフェストの作成

## Decisions

### 1. マルチステージビルドの採用

**選択**: Go のマルチステージビルド (ビルドステージ + 実行ステージ)

**理由**: frontend の Dockerfile と同様のパターンを踏襲し、一貫性を保つ。ビルドステージで Go バイナリをコンパイルし、実行ステージでは最小限のイメージにバイナリのみをコピーする。

**代替案**:
- シングルステージビルド → イメージサイズが大きくなる
- 事前ビルドしたバイナリを COPY → ホスト環境依存が発生する

### 2. 実行ステージのベースイメージ

**選択**: `gcr.io/distroless/static-go` (distroless)

**理由**: Go はスタティックバイナリを生成できるため、シェルやパッケージマネージャを含まない distroless イメージで十分。frontend は Node.js ランタイムが必要なため alpine を使っているが、backend は実行バイナリのみで動作するため、よりセキュアで軽量な distroless が適切。

**代替案**:
- `golang:1.25-alpine` → ビルドツールが含まれイメージが大きい
- `alpine` → Go バイナリの実行には不要なパッケージが含まれる
- `scratch` → distroless と同等に軽量だが、CA 証明書やタイムゾーン情報が含まれない

### 3. docker-compose.yml の配置場所

**選択**: プロジェクトルートに統合 docker-compose.yml を配置

**理由**: frontend と backend を一括で管理できる。各サービスの `build.context` でサブディレクトリを指定する。

**代替案**:
- 各ディレクトリに個別の docker-compose.yml → サービス間連携が煩雑になる

### 4. ポートマッピング

**選択**: backend は `8521:8080` でマッピング

**理由**: frontend は既に `3521:3000` を使用しているため、同じ規則 (ホスト側は x521 系) に合わせ、backend のデフォルトポート 8080 に対して 8521 を割り当てる。

## Risks / Trade-offs

- **Go バージョンの追従**: Dockerfile 内の Go バージョン (1.25) を `go.mod` と手動で同期する必要がある → mise.toml と go.mod を参照して更新する運用ルールで対応
- **distroless イメージのデバッグ制約**: シェルがないためコンテナ内のデバッグが困難 → 開発時はローカル実行、本番問題はログで対応
