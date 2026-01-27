## Why

右上の3点メニューにはエクスポート・インポート機能しかなく、プロジェクトの GitHub リポジトリへのリンクがない。ユーザーがアプリからソースコードやイシューにすぐアクセスできるようにしたい。

## What Changes

- 右上の3点メニューに「GitHub」リンクを追加する
- アイコンは `public/github.svg` を使用する
- クリックすると `https://github.com/Tiramister/task-tree-manager` を新しいタブで開く

## Capabilities

### New Capabilities

(なし — 既存のメニュー UI に項目を1つ追加するだけで、新しい仕様が必要な規模ではない)

### Modified Capabilities

(なし — メニューの動作自体は変わらず、項目が増えるだけ)

## Impact

- `src/App.tsx`: 3点メニューのドロップダウン内にメニュー項目を1つ追加
