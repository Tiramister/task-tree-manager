## Context

`task-reorder-buttons` の変更で `sortOrder` フィールドを追加した際、既存データに `sortOrder` を付与するためのマイグレーションコードを `taskStore.ts` の zustand persist 設定に追加した。マイグレーションが完了したため、このコードは不要になった。

## Goals / Non-Goals

**Goals:**
- マイグレーションコード（`migrate` 関数、`version` 設定）を削除する
- persist 設定を簡素化する

**Non-Goals:**
- `sortOrder` フィールド自体の削除（引き続き使用する）
- persist のストレージキー名の変更

## Decisions

### persist の version を削除する

マイグレーションが完了し、今後のマイグレーションの予定もないため、`version` と `migrate` の両方を削除する。将来マイグレーションが必要になった場合は再度追加すればよい。

## Risks / Trade-offs

- **リスク**: マイグレーション未完了のブラウザが存在する可能性 → ユーザーに全端末でのマイグレーション完了を確認済みであることを前提とする。
