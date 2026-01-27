## Context

現在、App.tsx のハンバーガーメニュー内にエクスポート・インポートのテキストボタンがある。`public/export.png` と `public/import.png` にアイコン画像が用意されている。

## Goals / Non-Goals

**Goals:**
- エクスポート・インポートボタンのテキスト左側にアイコンを表示する

**Non-Goals:**
- アイコンのデザイン変更やサイズ調整の自動化

## Decisions

- `<img>` タグで直接 PNG を参照する。SVG コンポーネント化やアイコンライブラリは使用しない。シンプルな変更のため。
- アイコンサイズは 16x16px とし、テキストとの間隔は Tailwind の `gap-2` で確保する。
- パスは `/export.png`、`/import.png` を使用（public ディレクトリ直下のため）。

## Risks / Trade-offs

- 特になし。軽微な UI 変更のため。
