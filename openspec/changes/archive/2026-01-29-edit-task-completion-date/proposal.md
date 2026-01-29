## Why

タスクを完了にすると、完了日は自動的に現在時刻が設定される。しかし、実際には過去に完了していたタスクを後からまとめて記録したいケースがあり、その場合に正しい完了日を設定できない。完了日を後から編集できるようにすることで、作業記録の正確性を向上させる。

## What Changes

- タスク詳細ドロワーの完了日表示を、読み取り専用から編集可能なdate入力に変更する
- `UpdateTaskInput`型に`completedAt`フィールドを追加し、完了日の直接編集を可能にする
- 完了日の編集はステータスが`completed`のタスクに限定する

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `task-detail-drawer`: 完了日フィールドを読み取り専用テキストから編集可能なdate入力に変更する
- `task-model`: `UpdateTaskInput`型に`completedAt`を追加する
- `task-store`: `updateTask`で`completedAt`の直接更新を受け付けるようにする

## Impact

- `src/types/task.ts`: `UpdateTaskInput`型の変更
- `src/features/tasks/taskStore.ts`: `updateTask`メソッドの完了日自動設定ロジックの調整
- `src/features/tasks/components/TaskDetailDrawer.tsx`: 完了日の編集UIの追加
