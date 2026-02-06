## Context

現在の更新フローでは、タスク詳細でフィールドを削除するとフロントエンド内部では `undefined` になるが、API 送信時に `undefined` がリクエストから除外される。その結果、バックエンドは「未指定 = 更新なし」と解釈し、既存値を保持するため、再取得時に削除前データが復活する。

この問題は以下の複数モジュールに跨って発生している。
- `TaskDetailDrawer`: フィールド削除時に `undefined` を渡す
- `taskStore`: status を `completed` から戻す際に `completedAt` をローカル削除するが、サーバー向けクリア値を明示しない
- `taskSyncService`: 更新リクエスト変換で `null`/`undefined` を同一視して除外する
- `task API (PATCH /tasks/{id})`: nullable フィールドで「未指定」と「null 明示」を区別できない

## Goals / Non-Goals

**Goals:**
- ログイン済みユーザーのフィールド削除操作が、再取得後も一貫して「空」で維持される。
- 更新 API で「未指定（変更しない）」と「明示クリア（NULL にする）」を区別できる。
- `completed` 解除時に `completed_at` がバックエンドでも確実にクリアされる。
- 既存の部分更新（変更した項目だけ送る）を維持する。

**Non-Goals:**
- タスク更新 API を PUT に変更する。
- DB スキーマやカラム定義を変更する。
- 期限・完了日の保存形式（RFC3339）を変更する。

## Decisions

### 1) 空更新の API 契約を `null` 明示に統一する
PATCH の nullable フィールド（`description`、`due_date`、`notes`、`completed_at`）は、次の 3 状態を区別する。
- キー未指定: 変更しない
- キーあり + 文字列: その値に更新
- キーあり + `null`: DB の `NULL` に更新

理由:
- JSON で明示クリアを表す標準的な表現が `null` であり、拡張フラグ不要で運用できる。

代替案:
- 空文字でクリアする: 空文字と未入力の意味が衝突するため不採用。
- `clear_description` のような別フラグを導入する: API 複雑化のため不採用。

### 2) フロントエンド内部モデルは `undefined` 維持、送信時のみ `null` へ変換する
UI と store の既存設計（オプショナル項目未設定 = `undefined`）は維持し、API 送信層でのみ変換する。
- 更新入力オブジェクトでキー存在を `"key" in input` で判定
- キーが存在し値が `undefined` の場合は `null` として送信
- キーが存在しない場合は送信しない

理由:
- 既存 UI/型定義への影響を最小化しつつ、送信契約だけを明確化できる。

代替案:
- フロントの型を全面的に `string | null` へ変更: 影響範囲が大きく、今回の不具合修正としては過剰。

### 3) status の完了解除時は `completed_at: null` を自動付与する
`taskStore.updateTask` で `status: completed -> 非completed` かつ `completedAt` 未指定の場合、ローカル削除に加えてサーバー入力にも `completedAt` キーを含める（値は `undefined`）。
その後、送信変換層で `null` に変換して PATCH に含める。

理由:
- 現在の自動削除ロジックを維持しつつ、サーバー側クリア漏れを防げる。

### 4) バックエンドは tri-state デコードで nullable フィールドを更新する
`PATCH /tasks/{id}` のリクエスト型を tri-state を表現できる形（未指定 / null / 値）に変更し、nullable フィールドへ適用する。
- 未指定: `existing` を保持
- `null`: `existing.<field> = nil`
- 値あり: パース・検証後に更新

理由:
- 部分更新の後方互換性を維持しながら、明示クリアを正確に扱える。

代替案:
- `map[string]any` を直接解釈: 型安全性・保守性が低下するため不採用。

## Risks / Trade-offs

- [Risk] tri-state 実装が複雑で、未指定と null の分岐を誤る可能性がある
  → Mitigation: nullable フィールドごとにテストケース（未指定/null/値）を用意し、分岐を明示する。

- [Risk] フロントエンドで「キー存在判定」が漏れると再発する可能性がある
  → Mitigation: 更新変換関数を一箇所に集約し、`in` 判定を共通ロジック化する。

- [Trade-off] 更新ペイロードに `null` キーが増える
  → 明示性を優先し、影響は軽微（数フィールド）として受容する。

## Migration Plan

1. 仕様差分（task-store/task-sync/task-api）を追加して契約を先に固定する。
2. フロントエンド更新変換を実装し、削除操作時に `null` を送るようにする。
3. バックエンド PATCH を tri-state 対応し、`null` で DB NULL 更新できるようにする。
4. 手動確認: フィールド入力 → 削除 → リロードで旧値が復活しないことを確認する。

ロールバックは、フロント・バックの変更を同時に戻せば従来挙動（クリア不可）へ戻る。DB 変更はないためデータマイグレーションは不要。

## Open Questions

- なし（本 change では nullable フィールドのみを対象にし、`title` の空文字禁止ルールは現状維持とする）。
