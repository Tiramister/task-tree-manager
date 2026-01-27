## Why

アプリケーションの基本機能（ツリービュー、詳細画面、タスク操作、レスポンシブ対応）は完成しているが、初回起動時にタスクが空のため使い方が分かりにくい。また、UI/UX の細かい調整が残っている。仕上げとして、サンプルデータと UI 改善を行う。

## What Changes

- 初回起動時（localStorage にデータがない場合）にサンプルタスクデータを自動投入する
- UI/UX の微調整（空状態の表示、視覚的フィードバック、全体的な使い勝手の向上）

## Capabilities

### New Capabilities
- `sample-data`: 初回起動時のサンプルデータ投入機能
- `ui-polish`: UI/UX の微調整（空状態表示、視覚的改善）

### Modified Capabilities

## Impact

- `src/features/tasks/taskStore.ts`: 初期データの投入ロジック追加
- 各 UI コンポーネント: 微調整
