## Why

データのマイグレーションが完了したため、`task-reorder-buttons` で追加した `sortOrder` フィールドの初期化マイグレーションコードが不要になった。不要なコードを削除してコードベースをクリーンに保つ。

## What Changes

- `taskStore.ts` の zustand persist `migrate` 関数と関連するバージョン管理コードを削除する
- persist の `version` 設定を削除する（マイグレーション不要のため）

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `task-persistence`: マイグレーション処理の削除。persist 設定からバージョン管理とマイグレーション関数を除去する。

## Impact

- `src/features/tasks/taskStore.ts`: persist 設定の簡素化
