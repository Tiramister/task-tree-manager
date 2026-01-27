## Why

タスク作成ダイアログでタイトルを日本語入力する際、IME の変換確定のために Enter キーを押すと、変換確定と同時にタスクが作成されてしまう。日本語・中国語・韓国語など IME を使う言語で正常に入力できない。

## What Changes

- タスク作成ダイアログの Enter キーハンドラで、IME 変換中（composing 状態）の Enter を無視するようにする

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `task-create-ui`: Enter キー送信時に IME 変換中でないことを確認する要件を追加

## Impact

- `src/features/tasks/components/TaskCreateDialog.tsx` の `onKeyDown` ハンドラを変更
