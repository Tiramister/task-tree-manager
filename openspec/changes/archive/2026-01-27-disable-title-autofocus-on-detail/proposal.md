## Why

タスク詳細ドロワーを開くと、Radix UI の Sheet コンポーネントがドロワー内の最初のフォーカス可能な要素（タイトル入力欄）に自動フォーカスする。詳細を閲覧したいだけのときにキーボードが表示されたりカーソルが入力欄に移動するのは不便である。タスク追加ダイアログでは引き続きタイトルにフォーカスしたい。

## What Changes

- タスク詳細ドロワー（Sheet）を開いたときに、タイトル入力欄に自動フォーカスしないようにする

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `task-detail-drawer`: ドロワーを開いたときにタイトル入力欄にフォーカスしない

## Impact

- **コード**: TaskDetailDrawer コンポーネントまたは Sheet コンポーネントのフォーカス制御を変更
