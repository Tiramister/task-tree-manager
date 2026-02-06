## Why

タスクの sortOrder がおかしくなることがある。エクスポートした JSON ファイルの sortOrder を修正するスクリプトを用意することで、問題発生時に手動で修復できるようにしたい。

## What Changes

- エクスポートされたタスク JSON ファイルを入力とし、sortOrder を正規化して出力する CLI ツールを新規追加
- 同一階層のタスクの sortOrder が重複している場合も適切に処理
- sortOrder 以外のフィールドが変更されていないことを検証

## Capabilities

### New Capabilities

- `fix-sort-order-script`: エクスポートされたタスク JSON の sortOrder を正規化する CLI スクリプト

### Modified Capabilities

(なし)

## Impact

- 新規ファイル: `backend/cmd/fixsortorder/main.go`
- 既存のコードベースへの影響なし（独立したユーティリティスクリプト）
