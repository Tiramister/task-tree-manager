## Why

タスクツリーの折り畳み状態はメモリ上（React の useState）でのみ保持されており、ページをリロードすると全て展開状態にリセットされる。タスク数が多いユーザーにとって、毎回手動で折り畳み直す必要があり不便である。

## What Changes

- 折り畳み状態（どのタスクが折り畳まれているか）を localStorage に永続化する
- アプリ起動時に保存された折り畳み状態を復元する
- タスク削除時に、削除されたタスクの折り畳み状態をクリーンアップする

## Capabilities

### New Capabilities

- `collapse-state-persistence`: 折り畳み状態の永続化と復元。どのタスクIDが折り畳まれているかを localStorage に保存し、起動時に復元する。

### Modified Capabilities

- `task-tree-view`: 折り畳み状態の管理元がコンポーネントローカルの useState から永続化ストアに変更される。折り畳み/展開操作時に自動保存が行われるようになる。

## Impact

- **状態管理**: `TaskTreeView.tsx` の `collapsedIds` を useState からストア（Zustand）に移行
- **ストア**: `taskStore.ts` に折り畳み状態の管理アクションを追加
- **永続化**: 既存の Zustand persist ミドルウェアを活用して折り畳み状態も保存対象に含める
- **エクスポート/インポート**: 折り畳み状態はUI状態であり、タスクデータではないため、エクスポート/インポートの対象外とする
