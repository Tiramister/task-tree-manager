## 1. 依存関係の追加

- [x] 1.1 `vite-plugin-pwa` をインストールする

## 2. Vite 設定

- [x] 2.1 `vite.config.ts` に `VitePWA` プラグインを追加し、マニフェスト（name, short_name, start_url, display, theme_color, background_color, icons）と `registerType: 'autoUpdate'` を設定する

## 3. HTML メタタグ

- [x] 3.1 `index.html` に `<meta name="theme-color">` を追加する

## 4. アイコン配置

- [x] 4.1 `assets/icons/` のアイコンファイルが `public/` 配下からアクセスできるようにする（必要に応じてパスを調整）

## 5. 確認

- [x] 5.1 `npm run build` を実行し、`dist/` にマニフェストファイルと Service Worker が生成されることを確認する
