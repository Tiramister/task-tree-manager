## Context

現在、タスクの表示順序は `tasks` 配列内の位置で決まっており、ユーザーが並び替える手段がない。タスクモデルに順序フィールドがなく、ストアにも移動操作がない。

タスクは `zustand` + `persist`（localStorage）で管理され、ツリー表示は `TaskTreeView` → `TaskTreeNode` の再帰構造で描画されている。同一階層のタスクは `childrenMap`（`parentId` でグループ化した `Map`）から取得され、配列順で表示される。

## Goals / Non-Goals

**Goals:**
- 同一階層内でタスクの順序を上下ボタンで変更できるようにする
- 新規タスクは同一階層の先頭に挿入する
- 既存データとの後方互換性を維持する

**Non-Goals:**
- ドラッグ＆ドロップによる並び替え
- 異なる階層間でのタスク移動
- sortOrder の永続化以外の UI 状態保存

## Decisions

### 1. sortOrder フィールドの追加

Task 型に `sortOrder: number` を追加する。

- `sortOrder` は必須フィールド（`number`）とする
- 表示順は `sortOrder` 降順（値が大きいほど上に表示）
- 新規タスク作成時、同一階層内の最大 `sortOrder` より大きい値（`max + 1`、存在しない場合は `0`）を設定し、先頭に配置する
- 既存データへの一回限りのマイグレーション: `sortOrder` が未設定のタスクに対し、`createdAt` 昇順で 0, 1, 2, ... を振る。zustand persist の `migrate` で実装し、マイグレーション完了後に削除可能とする

### 2. 移動操作の実装

ストアに `moveTask(id: string, direction: "up" | "down")` アクションを追加する。

- 同一 `parentId` のタスクを `sortOrder` 降順で取得し、隣接するタスクと `sortOrder` を入れ替える
- 先頭のタスクを上に移動、末尾のタスクを下に移動する場合は何もしない

### 3. UI 配置

各 `TaskTreeNode` にコンパクトな上下矢印ボタンを配置する。ステータス変更ボタンの近くに配置し、タスク行内に収める。

## Risks / Trade-offs

- [既存データの互換性] zustand persist の `migrate` で一括付与。利用者が1人のため、マイグレーション完了後にマイグレーションコード自体を削除してよい
- [sortOrder の値の衝突・歯抜け] 移動を繰り返すと値が離散的になる → 整数のスワップなので問題にならない。大量操作後も隣接タスクのスワップのため値域は制限されない
