### Requirement: tasks テーブルが存在する

PostgreSQL に `tasks` テーブルが存在しなければならない（SHALL）。テーブルは以下のカラムを持つ：

- `id`: UUID, PRIMARY KEY, DEFAULT gen_random_uuid()
- `user_id`: UUID, NOT NULL, users テーブルへの外部キー
- `title`: VARCHAR(255), NOT NULL
- `status`: VARCHAR(20), NOT NULL, DEFAULT 'not_started'
- `sort_order`: INTEGER, NOT NULL, DEFAULT 0
- `description`: TEXT, NULL
- `due_date`: TIMESTAMPTZ, NULL
- `completed_at`: TIMESTAMPTZ, NULL
- `notes`: TEXT, NULL
- `parent_id`: UUID, NULL, tasks テーブルへの自己参照外部キー
- `created_at`: TIMESTAMPTZ, NOT NULL, DEFAULT now()

#### Scenario: tasks テーブルが存在する
- **WHEN** データベースにマイグレーションが適用された状態
- **THEN** `tasks` テーブルが存在する

### Requirement: タスクはユーザーに紐づく

すべてのタスクは `user_id` を通じてユーザーに紐づかなければならない（SHALL）。`user_id` は `users` テーブルの `id` への外部キーである。

#### Scenario: ユーザーに紐づくタスクを作成できる
- **WHEN** 有効な user_id を指定してタスクを作成する
- **THEN** タスクが作成され、user_id が設定される

#### Scenario: 存在しないユーザーのタスクは作成できない
- **WHEN** 存在しない user_id を指定してタスクを作成する
- **THEN** 外部キー制約違反でエラーになる

### Requirement: ユーザー削除時にタスクがカスケード削除される

ユーザーが削除されたとき、そのユーザーのすべてのタスクも削除されなければならない（SHALL）。

#### Scenario: ユーザー削除でタスクも削除される
- **WHEN** タスクを持つユーザーを削除する
- **THEN** そのユーザーのすべてのタスクも削除される

### Requirement: タスクはツリー構造を持てる

タスクは `parent_id` を通じて親子関係を持てる（MAY）。`parent_id` は同一テーブルの `id` への自己参照外部キーである。`parent_id` が NULL のタスクはルートタスクとなる。

#### Scenario: ルートタスクを作成できる
- **WHEN** parent_id を NULL にしてタスクを作成する
- **THEN** ルートタスクとして作成される

#### Scenario: 子タスクを作成できる
- **WHEN** 有効な parent_id を指定してタスクを作成する
- **THEN** 指定した親タスクの子として作成される

#### Scenario: 存在しない親タスクは指定できない
- **WHEN** 存在しない parent_id を指定してタスクを作成する
- **THEN** 外部キー制約違反でエラーになる

### Requirement: 親タスク削除時に子タスクがカスケード削除される

親タスクが削除されたとき、その子タスク（およびすべての子孫タスク）も削除されなければならない（SHALL）。

#### Scenario: 親タスク削除で子孫タスクも削除される
- **WHEN** 子タスクを持つ親タスクを削除する
- **THEN** その親タスクのすべての子孫タスクも再帰的に削除される

### Requirement: ステータスは CHECK 制約で制限される

`status` カラムは CHECK 制約により、'not_started', 'in_progress', 'waiting', 'completed' のいずれかでなければならない（SHALL）。

#### Scenario: 有効なステータスを設定できる
- **WHEN** status に 'not_started', 'in_progress', 'waiting', 'completed' のいずれかを指定する
- **THEN** タスクが正常に作成・更新される

#### Scenario: 無効なステータスは設定できない
- **WHEN** status に定義外の値を指定する
- **THEN** CHECK 制約違反でエラーになる

### Requirement: インデックスが作成される

クエリパフォーマンスのため、以下のインデックスが作成されなければならない（SHALL）：
- `(user_id, parent_id)` の複合インデックス
- `(user_id, status)` の複合インデックス

#### Scenario: ユーザーのタスクをツリー構造で取得する
- **WHEN** 特定ユーザーの特定の親タスクの子タスクを取得するクエリを実行する
- **THEN** `(user_id, parent_id)` インデックスが使用される

#### Scenario: ユーザーのタスクをステータスでフィルタする
- **WHEN** 特定ユーザーの特定ステータスのタスクを取得するクエリを実行する
- **THEN** `(user_id, status)` インデックスが使用される
