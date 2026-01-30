## Why

タスクツリーマネージャーのバックエンドを Go 言語で構築する。最初のステップとして、App Runner での実行を見据えた最小限の HTTP サーバーを用意する。

## What Changes

- Go 言語のプロジェクトを新規作成する（`go mod init`）
- `Hello, world!` を返すだけの HTTP サーバーを実装する
- ポート 8080 で HTTP リクエストを受け付ける

## Capabilities

### New Capabilities

- `http-server`: Go 言語による HTTP サーバーの基盤。ルートパスへの GET リクエストに対して `Hello, world!` を返す。

### Modified Capabilities

（なし）

## Impact

- `backend/` ディレクトリ配下に Go プロジェクトが新規追加される
- `go.mod` および `main.go` が作成される
- 外部ライブラリへの依存はなし（標準ライブラリのみ使用）
