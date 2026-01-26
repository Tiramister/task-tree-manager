## Why

現在のアプリケーションはタスクの表示と編集機能を持っているが、新規タスクの作成、タスクの削除、ツリービューからのステータス変更ができない。これらの基本的な操作機能がないと、実用的なタスク管理ができない。

## What Changes

- 新規タスク作成機能の追加（ルートタスク、子タスク両方に対応）
- タスク削除機能の追加（子タスクも含めて削除）
- ツリービューからの素早いステータス変更機能の追加

## Capabilities

### New Capabilities

- `task-create-ui`: 新規タスク作成のUI機能。ルートタスク追加ボタンとコンテキストメニューからの子タスク追加をカバー
- `task-delete-ui`: タスク削除のUI機能。削除確認ダイアログと子タスクを含めた削除をカバー
- `task-status-quick-change`: ツリービューからの素早いステータス変更機能。クリックでステータスをトグルする操作をカバー

### Modified Capabilities

（既存の機能要件は変更しない）

## Impact

- `src/features/tasks/components/TaskTreeView.tsx`: 新規タスク作成ボタンの追加
- `src/features/tasks/components/TaskTreeItem.tsx`: コンテキストメニュー、ステータス変更機能の追加
- `src/features/tasks/components/TaskDetailDrawer.tsx`: 削除ボタンの追加
- 新規コンポーネント: `TaskCreateDialog.tsx`, `TaskDeleteDialog.tsx`
- shadcn/ui コンポーネント: Button, Dialog, AlertDialog, DropdownMenu が必要になる可能性
