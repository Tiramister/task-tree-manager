## Why

タスクツリーマネージャーはブラウザ完結型の Web アプリケーションであり、スマホでも利用される。PWA に対応することで、ホーム画面への追加・オフライン利用・ネイティブアプリに近い体験を提供できる。

## What Changes

- Web App Manifest (`manifest.webmanifest`) を作成し、アプリ名・アイコン・テーマカラー等を設定する
- Service Worker を導入し、オフラインキャッシュを有効にする
- `index.html` にマニフェストリンクと `theme-color` メタタグを追加する
- Vite の PWA プラグイン（`vite-plugin-pwa`）を導入してビルド統合する

## Capabilities

### New Capabilities

- `pwa`: Progressive Web App 対応（マニフェスト、Service Worker、オフラインキャッシュ、インストール可能性）

### Modified Capabilities

- `project-foundation`: PWA 関連のメタタグ・マニフェストリンクの追加

## Impact

- `index.html`: マニフェストリンク、`theme-color` メタタグの追加
- `vite.config.ts`: PWA プラグインの追加
- `package.json`: `vite-plugin-pwa` の依存追加
- `assets/icons/`: 既存アイコンをマニフェストから参照
