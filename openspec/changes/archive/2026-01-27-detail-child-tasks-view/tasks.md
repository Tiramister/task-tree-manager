## 1. DescendantTaskTree コンポーネントの作成

- [x] 1.1 `DescendantTaskTree` コンポーネントを作成する。props として `parentId` を受け取り、`useTaskStore` から `childrenMap` を構築して子孫タスクをツリー表示する
- [x] 1.2 `DescendantTaskNode` コンポーネントを作成する。各タスクのタイトルをクリックで折り畳み/展開できるアコーディオン UI を実装し、展開時に作業記録（notes）を表示する。未設定の場合は「作業記録なし」を表示する。子タスクがあれば再帰的にインデントして描画する
- [x] 1.3 初期状態ですべての子孫タスクが折り畳まれた状態にする
- [x] 1.4 セクションヘッダーに「全て展開」「全て折り畳む」ボタンを追加する

## 2. TaskDetailDrawer への統合

- [x] 2.1 `TaskDetailDrawer` の作業記録セクションの下に `DescendantTaskTree` を配置する。子タスクが存在しない場合はセクションを非表示にする

## 3. 検証

- [x] 3.1 `npm run check` と `npm run build` を実行してエラーがないことを確認する
