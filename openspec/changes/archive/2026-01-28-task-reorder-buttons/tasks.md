## 1. タスクモデルの変更

- [x] 1.1 `src/types/task.ts` の `Task` 型に `sortOrder: number` を必須フィールドとして追加する
- [x] 1.2 サンプルデータ (`sampleData.ts`) に `sortOrder` を付与する

## 2. ストアの変更

- [x] 2.1 `taskStore.ts` の `addTask` で、同一階層内の最大 `sortOrder + 1`（存在しない場合は `0`）を設定する
- [x] 2.2 `taskStore.ts` に `moveTask(id: string, direction: "up" | "down")` アクションを追加する
- [x] 2.3 zustand persist の `migrate` で、`sortOrder` 未設定のタスクに `createdAt` 昇順で 0, 1, 2, ... を付与する

## 3. 表示順の変更

- [x] 3.1 `TaskTreeView.tsx` の `childrenMap` 構築時に `sortOrder` 降順でソートする

## 4. UI の追加

- [x] 4.1 `TaskTreeNode.tsx` に上下移動ボタンを追加する（`moveTask` を呼び出す）
