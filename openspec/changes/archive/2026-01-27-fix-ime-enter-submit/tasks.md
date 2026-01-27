## 1. IME 変換中の Enter キー対応

- [x] 1.1 `TaskCreateDialog.tsx` の `onKeyDown` ハンドラで `e.nativeEvent.isComposing` が `true` の場合に早期リターンする
