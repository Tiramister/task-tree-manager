## Why

スマホ画面でタスクツリービューの上部にあるボタン群（「全て折り畳む」「全て展開」「未完了のみ」「新規タスク」）が横一列に並んでおり、スマホの横幅を超えてレイアウトが崩れている。

## What Changes

- タスクツリービューのボタン群を `flex-wrap` で折り返し可能にする
- 前3つ（全て折り畳む・全て展開・未完了のみ）で1行、「新規タスク」が次の行に折り返されるレイアウトにする

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `responsive-layout`: スマホ幅でボタン群が適切に折り返されるようにする

## Impact

- `src/features/tasks/components/TaskTreeView.tsx` のボタンコンテナのCSSクラスを変更
