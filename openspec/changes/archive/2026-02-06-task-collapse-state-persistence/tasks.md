## 1. データベースマイグレーション

- [x] 1.1 `backend/migrations/` に `is_collapsed` カラム追加のマイグレーションファイルを作成する（up: ALTER TABLE tasks ADD COLUMN is_collapsed BOOLEAN NOT NULL DEFAULT false）
- [x] 1.2 down マイグレーションファイルを作成する（ALTER TABLE tasks DROP COLUMN is_collapsed）
- [x] 1.3 マイグレーションを適用して動作確認する

## 2. バックエンド API 実装

- [x] 2.1 `backend/task.go` の Task 構造体に `IsCollapsed bool` フィールドを追加する
- [x] 2.2 タスク取得クエリ（`GET /tasks`）で `is_collapsed` カラムを取得するように修正する
- [x] 2.3 タスク作成（`POST /tasks`）で `is_collapsed` フィールドを受け付けるように修正する
- [x] 2.4 タスク更新（`PATCH /tasks/{id}`）で `is_collapsed` フィールドを更新できるように修正する
- [x] 2.5 JSON レスポンスに `is_collapsed` フィールドが含まれることを確認する

## 3. フロントエンド型定義

- [x] 3.1 `frontend/src/types/task.ts` の Task 型に `isCollapsed?: boolean` フィールドを追加する
- [x] 3.2 `CreateTaskInput` 型に `isCollapsed?: boolean` を追加する
- [x] 3.3 `UpdateTaskInput` 型に `isCollapsed?: boolean` を追加する

## 4. フロントエンド同期サービス

- [x] 4.1 `taskSyncService.ts` の `toFrontendTask` で `is_collapsed` → `isCollapsed` 変換を追加する
- [x] 4.2 `taskSyncService.ts` の `toBackendTask` で `isCollapsed` → `is_collapsed` 変換を追加する
- [x] 4.3 `updateTaskOnServer` で `isCollapsed` フィールドを送信できるように修正する
- [x] 4.4 `createTaskOnServer` で `isCollapsed` フィールドを送信できるように修正する

## 5. フロントエンドストア

- [x] 5.1 `taskStore.ts` から `collapsedIds` 状態を削除する
- [x] 5.2 `toggleCollapse` アクションを修正し、タスクの `isCollapsed` フィールドを更新するように変更する
- [x] 5.3 `collapseAll` アクションを修正し、対象タスクの `isCollapsed` を `true` に設定するように変更する
- [x] 5.4 `expandAll` アクションを修正し、全タスクの `isCollapsed` を `false` に設定するように変更する
- [x] 5.5 ログイン時の同期で `is_collapsed` を取得できることを確認する
- [x] 5.6 折り畳み操作時にバックエンドへ `is_collapsed` を送信するように `updateTaskOnServer` を呼び出す

## 6. フロントエンド UI 修正

- [x] 6.1 タスクツリービューで折り畳み状態の判定を `collapsedIds.includes(id)` から `task.isCollapsed` に変更する
- [x] 6.2 新規タスク作成時に `isCollapsed: false` をデフォルト値として設定する

## 7. 動作確認

- [x] 7.1 未ログイン状態で折り畳み操作が localStorage に保存されることを確認する
- [x] 7.2 ログイン状態で折り畳み操作がバックエンドに保存されることを確認する
- [x] 7.3 ページリロード後に折り畳み状態が復元されることを確認する
- [x] 7.4 異なるブラウザ/デバイスからログインして折り畳み状態が同期されることを確認する
