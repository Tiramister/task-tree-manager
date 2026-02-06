## Why

現在、タスクの折り畳み状態は localStorage にのみ保存されており、バックエンドと同期されていない。そのため、異なるデバイスやブラウザからログインした際に折り畳み状態が共有されず、ユーザー体験が一貫しない。既存のタスクテーブルにカラムを追加して折り畳み状態をバックエンドに保存することで、複数デバイス間での状態同期を実現する。

## What Changes

- `tasks` テーブルに `is_collapsed` カラム（BOOLEAN, DEFAULT false）を追加
- タスク作成・更新APIで `isCollapsed` フィールドをサポート
- フロントエンドのタスク同期ロジックで折り畳み状態をバックエンドと同期
- ログイン時にサーバーから取得したタスクの折り畳み状態をフロントエンドに反映
- 折り畳み/展開操作時にバックエンドへ状態を送信

## Capabilities

### New Capabilities

（なし - 既存機能の拡張のみ）

### Modified Capabilities

- `collapse-state-persistence`: 折り畳み状態の保存先を localStorage からバックエンド（tasks テーブル）に変更。ログインユーザーの場合はバックエンドと同期し、未ログインユーザーは引き続き localStorage を使用。
- `task-table`: tasks テーブルに `is_collapsed` カラムを追加
- `task-api`: タスク作成・更新・取得APIで `isCollapsed` フィールドをサポート
- `task-sync`: タスク同期時に折り畳み状態も同期

## Impact

- **バックエンド**:
  - PostgreSQL マイグレーション（`is_collapsed` カラム追加）
  - Go の Task 構造体に `IsCollapsed` フィールド追加
  - タスクAPI（GET/POST/PATCH）で `isCollapsed` フィールドを処理
- **フロントエンド**:
  - Task 型に `isCollapsed` フィールド追加
  - taskStore の `collapsedIds` 配列を廃止し、各タスクの `isCollapsed` プロパティで管理
  - taskSyncService で折り畳み状態を同期
- **API**:
  - タスク取得レスポンスに `isCollapsed` フィールド追加
  - タスク更新リクエストで `isCollapsed` フィールドを受付
