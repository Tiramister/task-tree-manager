## Why

現在、タスク一覧画面を開くとフィルタが無効（すべて表示）の状態がデフォルトになっている。実際の利用シーンでは未完了タスクだけを見たいケースがほとんどであり、毎回手動でフィルタを有効にする手間が発生している。デフォルトを「未完了のみ」に変更することで、日常的な操作を効率化する。

## What Changes

- タスク一覧画面の未完了フィルタの初期状態を「有効（未完了のみ表示）」に変更する

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `task-status-filter`: デフォルトのフィルタ状態を「無効（すべて表示）」から「有効（未完了のみ）」に変更する

## Impact

- `src/features/tasks/components/TaskTreeView.tsx` の `filterIncomplete` state の初期値変更
