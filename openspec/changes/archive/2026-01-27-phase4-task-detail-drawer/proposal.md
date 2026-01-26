## Why

現在、タスクツリー画面ではタスクのタイトルとステータスのみが表示されている。ユーザーがタスクの詳細（説明、期限、作業記録など）を確認・編集するためのインターフェースが必要。

## What Changes

- タスクをクリックしたときに右側からドロワー（Sheet）が表示される
- ドロワー内でタスクの全フィールド（タイトル、詳細説明、期限、ステータス、完了日、作業記録）を表示
- ドロワー内でタスクの各フィールドを編集できる

## Capabilities

### New Capabilities

- `task-detail-drawer`: タスク詳細をドロワー形式で表示・編集する機能

### Modified Capabilities

- `task-tree-view`: タスククリック時にドロワーを開く機能を追加

## Impact

- `src/features/tasks/components/TaskTreeItem.tsx`: クリックイベントの追加
- `src/features/tasks/components/TaskTreeView.tsx`: ドロワー状態管理の追加
- 新規コンポーネント: `TaskDetailDrawer.tsx`（ドロワー本体）
- Shadcn/ui の Sheet コンポーネントを導入
