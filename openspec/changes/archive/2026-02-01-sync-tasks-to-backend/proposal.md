## Why

現在、フロントエンドのタスクデータは localStorage のみで管理されており、バックエンドの API・DB と連携していない。ログインユーザーのタスクデータをバックエンドに同期させることで、デバイス間でのデータ共有やデータ保全を実現する。

## What Changes

- ログインユーザーのタスク操作（作成・更新・削除・並べ替え）時に、バックエンド API にデータを送信する
- ログイン時の初期同期ロジックを追加する：
  - DB にタスクデータがない場合 → localStorage のデータを DB に保存
  - DB にタスクデータがある場合 → DB のデータで localStorage を上書き
- ページリロード時にバックエンドのデータで localStorage を更新する
- 未ログインユーザーは従来通り localStorage のみで動作する（変更なし）
- タスク操作時はバックエンドへの送信のみ行い、バックエンドからの応答で localStorage を上書きしない（リロード時のみ同期）

## Capabilities

### New Capabilities

- `task-sync`: ログインユーザーのタスクデータをバックエンドと同期する機能。ログイン時の初期同期、操作時のバックエンド送信、リロード時のデータ取得を含む

### Modified Capabilities

- `task-store`: タスク操作時にバックエンド API を呼び出すロジックを追加。未ログイン時は従来の localStorage のみの動作を維持する

## Impact

- **フロントエンド**:
  - `taskStore.ts`: 各アクション（addTask, updateTask, deleteTask, moveTask）にバックエンド API 呼び出しを追加
  - `authStore.ts`: ログイン成功後にタスク同期処理を呼び出す
  - バックエンド API との通信用 fetch ロジックの追加
- **バックエンド**: 既存の API エンドポイント（GET/POST/PATCH/DELETE /tasks）をそのまま利用。バックエンド側の変更は不要
- **データフロー**: localStorage が引き続き唯一の状態ソース（single source of truth）として機能し、バックエンドはバックアップ・同期先として扱う
