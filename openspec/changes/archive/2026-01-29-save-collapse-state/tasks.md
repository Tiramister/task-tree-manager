## 1. ストアへの折り畳み状態の追加

- [x] 1.1 `TaskState` インターフェースに `collapsedIds: string[]` と3つのアクション（`toggleCollapse`, `collapseAll`, `expandAll`）を追加する
- [x] 1.2 ストアの実装に `collapsedIds: []` の初期値と3つのアクションのロジックを追加する
- [x] 1.3 `deleteTask` アクション内で、削除対象タスク（子孫を含む）の ID を `collapsedIds` から除去するクリーンアップ処理を追加する
- [x] 1.4 `exportTasks` が `collapsedIds` を含まないこと、`importTasks` が `collapsedIds` を変更しないことを確認する

## 2. コンポーネントの移行

- [x] 2.1 `TaskTreeView.tsx` から `collapsedIds` の `useState` を削除し、ストアから `collapsedIds` を取得するように変更する
- [x] 2.2 `handleToggleCollapse` をストアの `toggleCollapse` アクションに置き換える
- [x] 2.3 `handleCollapseAll` をストアの `collapseAll` アクションに置き換える
- [x] 2.4 `handleExpandAll` をストアの `expandAll` アクションに置き換える
- [x] 2.5 ストアの `collapsedIds`（`string[]`）を `Set<string>` に変換して `TaskTreeNode` に渡す処理を追加する

## 3. 動作確認

- [x] 3.1 `npm run check` と `npm run build` を実行し、型エラー・ビルドエラーがないことを確認する
