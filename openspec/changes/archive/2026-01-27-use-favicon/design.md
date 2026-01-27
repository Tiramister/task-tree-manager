## Context

現在 `index.html` の favicon は Vite デフォルトの `/vite.svg` を参照している。プロジェクト専用の `assets/icons/favicon.ico` が用意されたため、これに切り替える。

## Goals / Non-Goals

**Goals:**
- favicon をプロジェクト専用のアイコンに変更する

**Non-Goals:**
- PWA マニフェストのアイコン設定（別途対応）
- favicon の生成・デザイン（既に用意済み）

## Decisions

- `index.html` の `<link rel="icon">` を `type="image/x-icon"` に変更し、`href` を `/assets/icons/favicon.ico` にする
  - 理由: `.ico` ファイルなので適切な MIME タイプを指定する
  - Vite は `public/` 以外のアセットも扱えるが、favicon.ico は `assets/icons/` に配置済みなのでそのパスを使う

## Risks / Trade-offs

特になし。単純な HTML 属性変更のみ。
