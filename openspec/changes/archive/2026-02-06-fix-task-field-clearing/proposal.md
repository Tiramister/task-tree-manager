## Why

ログイン済みユーザーがタスク詳細のオプション項目（詳細説明・期限・作業記録・完了日）を削除しても、バックエンドに空更新が反映されず、再取得時に削除前の値が復活する不整合が発生している。タスク編集結果の信頼性を保つため、空更新を明示的に扱う仕様へ統一する必要がある。

## What Changes

- タスク更新 API の「未指定」と「明示的なクリア（空にする）」を区別する仕様を定義する。
- フロントエンドの更新リクエスト変換を修正し、削除操作時は `null` を送ってフィールドクリアを明示する。
- ステータスを `completed` から他状態に戻した際、`completedAt` をローカルだけでなくバックエンドでも確実にクリアする。
- バックエンド `PATCH /tasks/{id}` を修正し、`null` 指定された nullable フィールドを DB の `NULL` に更新できるようにする。

## Capabilities

### New Capabilities
- なし

### Modified Capabilities
- `task-store`: フィールド削除・完了解除時に、ログイン済み環境でもローカルとバックエンドの状態が一致し続けるよう更新要件を変更する
- `task-sync`: 更新リクエスト変換で「未指定」と「クリア（null）」を区別できるよう要件を変更する
- `task-api`: `PATCH /tasks/{id}` で nullable フィールドに対する明示的クリア（null）を受け付ける要件を追加する

## Impact

- フロントエンド: `frontend/src/features/tasks/components/TaskDetailDrawer.tsx`, `frontend/src/features/tasks/taskStore.ts`, `frontend/src/features/tasks/taskSyncService.ts`
- バックエンド: `backend/task.go`（更新リクエストのパースと部分更新処理）
- API 契約: `PATCH /tasks/{id}` の nullable フィールドにおける `null` の意味を明確化
