## Context

`TaskCreateDialog` の `onKeyDown` で `e.key === "Enter"` をチェックしてタスク作成しているが、IME 変換確定時の Enter も検知してしまう。

## Goals / Non-Goals

**Goals:**
- IME 変換中の Enter キーでタスクが作成されないようにする

**Non-Goals:**
- ライブラリの追加（標準 API で対応可能）

## Decisions

- **`e.nativeEvent.isComposing` を使用する**: KeyboardEvent の `isComposing` プロパティで IME 変換中かどうかを判定できる。モダンブラウザで広くサポートされており、ライブラリ不要。`isComposing` が `true` の場合は Enter キーの処理をスキップする。

## Risks / Trade-offs

- 特になし。`isComposing` は主要ブラウザすべてでサポートされている。
