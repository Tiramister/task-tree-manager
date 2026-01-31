## 1. taskSyncService の作成

- [x] 1.1 `frontend/src/features/tasks/taskSyncService.ts` を作成し、API ベース URL の設定と共通の fetch ヘルパーを実装する
- [x] 1.2 バックエンド→フロントエンドのデータ変換関数を実装する（snake_case → camelCase、`user_id` の除外）
- [x] 1.3 フロントエンド→バックエンドのデータ変換関数を実装する（camelCase → snake_case）
- [x] 1.4 `fetchTasks` 関数を実装する（`GET /tasks` を呼び出し、レスポンスを変換して返す）
- [x] 1.5 `createTaskOnServer` 関数を実装する（`POST /tasks` にタスクデータを送信する）
- [x] 1.6 `updateTaskOnServer` 関数を実装する（`PATCH /tasks/{id}` に更新データを送信する）
- [x] 1.7 `deleteTaskOnServer` 関数を実装する（`DELETE /tasks/{id}` を送信する）
- [x] 1.8 `reorderTaskOnServer` 関数を実装する（`PATCH /tasks/{id}/reorder` に sort_order を送信する）
- [x] 1.9 `uploadLocalTasks` 関数を実装する（親タスクから順に `POST /tasks` で保存し、旧 ID → 新 ID のマッピングで parentId を変換する）
- [x] 1.10 `syncOnLogin` 関数を実装する（`GET /tasks` の結果に応じて、ローカルデータのアップロードまたは DB データでの上書きを行う）

## 2. taskStore の修正

- [x] 2.1 `addTask` アクションに、ログイン済みの場合 `createTaskOnServer` を呼び出す処理を追加する
- [x] 2.2 `updateTask` アクションに、ログイン済みの場合 `updateTaskOnServer` を呼び出す処理を追加する
- [x] 2.3 `deleteTask` アクションに、ログイン済みの場合 `deleteTaskOnServer` を呼び出す処理を追加する
- [x] 2.4 `moveTask` アクションに、ログイン済みの場合、入れ替わった2つのタスクそれぞれについて `reorderTaskOnServer` を呼び出す処理を追加する
- [x] 2.5 taskStore にバックエンドのデータで上書きする関数（`syncFromServer` 等）を追加する

## 3. authStore との連携

- [x] 3.1 `authStore.login` のログイン成功後に `syncOnLogin` を呼び出す処理を追加する
- [x] 3.2 `authStore.checkAuth` で認証成功時に `fetchTasks` でバックエンドのデータを取得し taskStore を上書きする処理を追加する
