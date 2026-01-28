## Why

タスク詳細画面で子タスクの作業記録を展開表示した際、一行が長いテキストが折り返されずにコンテナからはみ出してしまう。親タスク自身の作業記録は正しく折り返されるが、子タスクの作業記録には折り返し制御が不足している。

## What Changes

- 子タスクの作業記録表示部分に、長いテキストが正しく折り返されるようスタイルを修正する

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `detail-descendant-tasks`: 子タスクの作業記録表示において、長いテキストが折り返されるようにする

## Impact

- `src/features/tasks/components/DescendantTaskNode.tsx` の作業記録表示部分のスタイル修正
