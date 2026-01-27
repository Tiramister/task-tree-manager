## Context

Task Tree Manager は Vite + React + TypeScript で構築されたブラウザ完結型の SPA である。データは localStorage に保存されており、バックエンドは存在しない。アイコンは `assets/icons/` に各サイズ（48〜1024px）の PNG と favicon.ico が用意済み。

## Goals / Non-Goals

**Goals:**
- アプリをインストール可能（A2HS）にする
- Service Worker によるオフラインキャッシュを有効にする
- Web App Manifest を正しく設定する

**Non-Goals:**
- プッシュ通知
- バックグラウンド同期
- カスタムのインストール促進 UI

## Decisions

### 1. vite-plugin-pwa を使用する

**選定:** `vite-plugin-pwa`（Workbox ベース）
**代替案:**
- 手動で Service Worker を実装 → Workbox のキャッシュ戦略を自前で書く必要があり、保守コストが高い
- `@vite-pwa/assets-generator` → アイコンは既に用意済みなので不要

**理由:** Vite との統合がシームレスで、マニフェスト生成・Service Worker 登録・キャッシュ戦略をプラグイン設定だけで完結できる。公式推奨のアプローチ。

### 2. マニフェストは vite-plugin-pwa の設定内で定義する

別ファイル（`manifest.webmanifest`）を手書きせず、`vite.config.ts` の `VitePWA` プラグインオプションで `manifest` を定義する。プラグインがビルド時にマニフェストファイルを自動生成し、`index.html` にリンクを挿入する。

### 3. Service Worker の戦略

- **登録タイミング:** `registerType: 'autoUpdate'`（新しい SW が利用可能になったら自動更新）
- **キャッシュ戦略:** Workbox の generateSW（precache）を使用し、ビルド成果物を事前キャッシュする
- ランタイムキャッシュは不要（外部 API 呼び出しがないため）

### 4. テーマカラー

`index.html` に `<meta name="theme-color">` を追加する。マニフェストの `theme_color` と一致させる。色はアプリの背景色（`#ffffff`、ダークモード未対応のため白）とする。

## Risks / Trade-offs

- [Service Worker のキャッシュが古いまま残る] → `autoUpdate` により新バージョン検出時に自動更新される
- [開発中に SW がキャッシュを返してしまう] → vite-plugin-pwa はデフォルトで開発時に SW を無効にする
