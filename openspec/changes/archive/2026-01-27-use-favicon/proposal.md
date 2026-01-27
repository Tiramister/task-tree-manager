## Why

現在、favicon が Vite デフォルトの `vite.svg` を参照している。プロジェクト専用の favicon (`assets/icons/favicon.ico`) が用意されたので、これを使うようにする。

## What Changes

- `index.html` の favicon リンクを `assets/icons/favicon.ico` に変更する
- 不要になった `public/vite.svg` があれば削除する

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `project-foundation`: favicon のパス設定を変更

## Impact

- `index.html`: `<link rel="icon">` タグの `href` を変更
- ブラウザタブに表示されるアイコンが変わる
