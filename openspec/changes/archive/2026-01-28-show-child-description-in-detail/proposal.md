## Why

タスク詳細画面の子タスク一覧では作業記録（`notes`）のみ表示されているが、詳細説明（`description`）は表示されていない。子タスクの内容を把握するために詳細説明も併せて確認できるようにしたい。

## What Changes

- 子タスクノード（`DescendantTaskNode`）に、`description` フィールドの表示を追加する
- `description` と `notes` の両方がある場合は、間に空行を挟んで連続表示する
- 片方のみの場合はその内容だけを表示し、両方ない場合は「作業記録なし」を表示する
- ラベル（「詳細説明:」等）は付けず、本文をそのまま表示する

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `detail-descendant-tasks`: 子タスクノードに詳細説明の表示を追加する

## Impact

- `src/features/tasks/components/DescendantTaskNode.tsx` の表示ロジックを変更
