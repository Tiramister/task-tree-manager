## Context

タスク詳細画面の子タスクノード（`DescendantTaskNode`）は、展開時に `task.notes`（作業記録）のみを表示している。`Task` 型には `description`（詳細説明）フィールドも存在するが、子タスクノードでは表示されていない。

対象ファイル: `src/features/tasks/components/DescendantTaskNode.tsx`（38〜40行目）

## Goals / Non-Goals

**Goals:**
- 子タスクノード展開時に `description` と `notes` を両方表示する
- ラベルなしで本文をそのまま表示する
- 両方ある場合は空行で区切る

**Non-Goals:**
- 詳細説明の編集機能（閲覧専用のまま）
- 表示のスタイル変更（既存の CSS クラスを踏襲）

## Decisions

**表示ロジック**: `description` と `notes` を配列に集め、`\n\n` で結合して1つの `<p>` 要素で表示する。両方未設定の場合のみ「作業記録なし」を表示する。

理由: 既存の単一 `<p>` 要素の構造を維持でき、`whitespace-pre-wrap` により空行がそのまま視覚的な区切りになる。複数要素に分割するより簡潔。

## Risks / Trade-offs

特になし。変更は表示ロジックのみで、影響範囲が限定的。
