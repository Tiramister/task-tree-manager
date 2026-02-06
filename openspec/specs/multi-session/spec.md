### Requirement: セッション情報の永続化
システムは複数ユーザーのセッション情報を localStorage に保存しなければならない（SHALL）。キー `sessions` に `StoredSession[]` 形式の JSON を保存し、キー `activeSessionId` に現在アクティブなセッションIDを保存しなければならない（SHALL）。

#### Scenario: セッション情報の保存形式
- **WHEN** localStorage の `sessions` キーを確認する
- **THEN** `[{"sessionId": "...", "username": "..."}]` 形式のJSON配列が保存されている

#### Scenario: アクティブセッションの保存
- **WHEN** ユーザーがログイン済みの状態で localStorage を確認する
- **THEN** `activeSessionId` キーに現在のセッションIDが保存されている

### Requirement: ユーザー切り替え
システムはログイン済みの別ユーザーへ1クリックで切り替える機能を提供しなければならない（SHALL）。切り替え時は localStorage の `activeSessionId` を更新し、Cookie の `session` 値を該当セッションIDに書き換えなければならない（SHALL）。

#### Scenario: ユーザー切り替え実行
- **WHEN** ログイン済みユーザーA, Bが存在し、現在Aがアクティブな状態でBに切り替える
- **THEN** `activeSessionId` がBのセッションIDに更新され、Cookie `session` がBのセッションIDに書き換わり、UIがBのユーザー名を表示する

#### Scenario: 切り替え後のAPI呼び出し
- **WHEN** ユーザーBに切り替えた後にAPIを呼び出す
- **THEN** BのセッションIDがCookieとして送信され、Bとして認証される

### Requirement: セッションの自動クリーンアップ
API呼び出しで401エラーが返った場合、該当セッションを localStorage から削除しなければならない（SHALL）。他に有効なセッションがあれば自動的にそのセッションに切り替えなければならない（SHALL）。

#### Scenario: 期限切れセッションの削除
- **WHEN** アクティブセッションでAPI呼び出しを行い401が返る
- **THEN** そのセッションがlocalStorageから削除される

#### Scenario: 期限切れ後の自動切り替え
- **WHEN** アクティブセッションが期限切れになり、他に有効なセッションが存在する
- **THEN** 自動的に別の有効なセッションに切り替わり、UIが更新される

#### Scenario: 全セッション期限切れ
- **WHEN** すべてのセッションが期限切れになる
- **THEN** 未ログイン状態に遷移し、「ログイン」ボタンが表示される
