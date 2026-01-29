## Context

現在、タスクの完了日（`completedAt`）はステータスを`completed`に変更した際に自動設定され、ユーザーが直接編集することはできない。タスク詳細ドロワーでは読み取り専用のテキストとして表示されるのみである。

変更対象は3ファイル：
- `src/types/task.ts` — `UpdateTaskInput`型
- `src/features/tasks/taskStore.ts` — `updateTask`メソッド
- `src/features/tasks/components/TaskDetailDrawer.tsx` — 完了日の表示UI

## Goals / Non-Goals

**Goals:**
- 完了済みタスクの完了日をユーザーが後から変更できるようにする
- 既存の自動設定ロジック（ステータスを`completed`にしたときに現在時刻を設定）は維持する

**Non-Goals:**
- 未完了タスクに完了日を設定すること（ステータスが`completed`のときのみ編集可能）
- 完了日の時刻（時・分・秒）の編集（日付単位の変更のみ）

## Decisions

### 1. `UpdateTaskInput`に`completedAt`を追加する

`UpdateTaskInput`型に`completedAt`フィールドを追加し、ストア経由で完了日を直接更新できるようにする。

```typescript
export type UpdateTaskInput = Partial<
  Pick<Task, "title" | "description" | "dueDate" | "notes" | "status" | "completedAt">
>;
```

**理由:** 既存の`updateTask`の仕組みに自然に乗せられる。新しいAPIやメソッドを追加する必要がない。

### 2. `updateTask`の自動設定ロジックとの共存

`updateTask`内で`completedAt`が明示的に渡された場合は、その値をそのまま使用する。自動設定ロジックは、`completedAt`が入力に含まれない場合（つまり、ステータス変更のみの場合）にのみ適用する。

```
- input に completedAt がある → その値をそのまま使う
- input に completedAt がなく、status が completed に変わった → 自動で現在時刻を設定
- input に completedAt がなく、status が completed から他に変わった → completedAt を削除
```

**理由:** 既存の自動設定の挙動を壊さず、明示的な編集を優先するシンプルなルール。

### 3. UIは期限フィールドと同じdate入力パターンを採用

タスク詳細ドロワーの完了日フィールドを、既存の期限（`dueDate`）フィールドと同じ `<Input type="date">` パターンに変更する。ステータスが`completed`のときのみ表示する（現行と同じ条件）。

**理由:** 既存UIパターンとの一貫性。期限フィールドの実装（`handleDueDateChange`）をほぼそのまま流用でき、ユーザーにとっても操作方法が統一される。

## Risks / Trade-offs

- **完了タスク履歴ビューへの影響** → `getCompletedByDate()`は`completedAt`の日付部分でグルーピングしているため、完了日を編集するとグループが変わる。これは期待される動作であり、追加対応は不要。
- **未来日の設定が可能** → date入力では未来の日付も選択可能だが、ユーザーの自由度を優先し、バリデーションは設けない。
