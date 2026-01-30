## Context

タスクツリーマネージャーのバックエンドはまだ空の状態（`.gitkeep` のみ）。Go 言語で HTTP サーバーを構築し、将来的に App Runner 上で Docker コンテナとして実行する予定。本 change ではまず最小限の Hello, world! サーバーを実装する。

## Goals / Non-Goals

**Goals:**
- Go モジュールの初期化とプロジェクト構成の確立
- 標準ライブラリ `net/http` のみで HTTP サーバーを実装する
- ポート 8080 で起動し、ルートパスに `Hello, world!` を返す

**Non-Goals:**
- Docker 化（次の change で対応）
- ルーティングフレームワークの導入
- API エンドポイントの設計
- データベース接続やミドルウェア

## Decisions

### Go モジュール名
- `github.com/tiramister/task-tree-manager/backend` とする（リポジトリのパスに合わせる）

### エントリーポイントの配置
- `backend/main.go` にエントリーポイントを配置する
- 現時点ではシンプルに単一ファイルとし、`cmd/` ディレクトリ構成は規模が拡大した段階で検討する

### ポート番号
- App Runner のデフォルトポート 8080 を使用する
- 環境変数 `PORT` が設定されている場合はそちらを優先する（App Runner の慣習に合わせる）

### HTTP ハンドラ
- `net/http` 標準ライブラリの `http.HandleFunc` と `http.ListenAndServe` を使用する
- 外部ルーターは導入しない

## Risks / Trade-offs

- [単一ファイル構成] → 規模が小さいため現時点では問題ない。機能追加時にパッケージ分割を検討する
- [エラーハンドリングが最小限] → Hello, world! サーバーのため許容範囲。本格的な API 実装時に整備する
