## Why

現在、タスクの表示順序は配列内の位置に依存しており、ユーザーが任意に並び替えることができない。タスクの優先度や作業順序を反映するために、同じ階層内でタスクの順番を上下ボタンで変更できる機能が必要である。

## What Changes

- タスクモデルに表示順序を表す `sortOrder` フィールドを追加する
- 同一階層内（同じ parentId を持つタスク同士）でタスクの順番を上下に移動するボタンを追加する
- タスク作成時に `sortOrder` を自動設定する
- ストアにタスク移動アクションを追加する

## Capabilities

### New Capabilities

- `task-reorder`: タスクの並び替え機能（上下ボタンによる同一階層内の順序変更）

### Modified Capabilities

- `task-model`: タスクに `sortOrder` フィールドを追加する
- `task-store`: タスク移動アクション追加、作成時の `sortOrder` 自動設定
- `task-tree-view`: タスクの表示順序を `sortOrder` に基づいて決定する

## Impact

- `src/types/task.ts`: `sortOrder` フィールド追加
- `src/features/tasks/taskStore.ts`: 移動アクション追加、作成・削除ロジック修正
- `src/features/tasks/components/TaskTreeView.tsx`: ソート順の変更
- `src/features/tasks/components/TaskTreeNode.tsx`: 上下移動ボタンの追加
- localStorage に保存される既存データとの互換性（`sortOrder` 未設定のタスクへのフォールバック）
