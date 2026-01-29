## 1. 型定義の変更

- [x] 1.1 `src/types/task.ts` の `UpdateTaskInput` に `completedAt` フィールドを追加する

## 2. ストアロジックの変更

- [x] 2.1 `src/features/tasks/taskStore.ts` の `updateTask` メソッドで、input に `completedAt` が明示的に含まれる場合はその値を優先し、自動設定ロジックをスキップするように変更する

## 3. UIの変更

- [x] 3.1 `TaskDetailDrawer.tsx` に完了日用の state (`completedDate`) を追加し、タスク変更時に初期化する
- [x] 3.2 完了日の読み取り専用テキスト表示を、`<Input type="date">` に置き換える（ステータスが `completed` のときのみ表示）
- [x] 3.3 完了日変更時のハンドラを実装し、`updateTask` で `completedAt` を更新する
