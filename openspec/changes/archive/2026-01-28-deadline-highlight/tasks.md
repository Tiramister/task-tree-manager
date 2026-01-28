## 1. ユーティリティ関数の実装

- [x] 1.1 `getDeadlineHighlightClass(dueDate, status)` 関数を作成する（`src/features/tasks/utils/` 等に配置）
- [x] 1.2 期限なし・完了ステータス・7日以上先の場合は空文字列を返すことを確認する
- [x] 1.3 当日以前→`bg-red-50`、1〜2日後→`bg-orange-50`、3〜6日後→`bg-yellow-50` を返すことを確認する

## 2. TaskTreeItem への適用

- [x] 2.1 `TaskTreeItem` コンポーネントで `getDeadlineHighlightClass` を呼び出し、タスク行の背景色クラスに適用する

## 3. 検証

- [x] 3.1 `npm run check` と `npm run build` を実行してエラーがないことを確認する
