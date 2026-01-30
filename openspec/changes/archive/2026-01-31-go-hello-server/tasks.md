## 1. プロジェクトセットアップ

- [x] 1.1 `backend/` で `go mod init` を実行し Go モジュールを初期化する
- [x] 1.2 mise の設定で Go のバージョンを指定する

## 2. HTTP サーバー実装

- [x] 2.1 `backend/main.go` を作成し、`net/http` を使って `/` に `Hello, world!` を返すハンドラを実装する
- [x] 2.2 環境変数 `PORT` が設定されていればそのポート、なければ 8080 でリッスンするようにする

## 3. 動作確認

- [x] 3.1 `go build` でビルドが通ることを確認する
- [x] 3.2 サーバーを起動し `curl http://localhost:8080/` で `Hello, world!` が返ることを確認する
