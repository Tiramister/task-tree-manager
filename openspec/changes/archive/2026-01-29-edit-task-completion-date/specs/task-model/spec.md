## MODIFIED Requirements

### Requirement: タスクはオプショナルフィールドを持てる

タスクは以下のオプショナルフィールドを持てる（MAY）：
- `description`: 詳細説明（string）
- `dueDate`: 期限（ISO 8601 形式の string）
- `completedAt`: 完了日時（ISO 8601 形式の string）
- `notes`: 作業記録（string）
- `parentId`: 親タスクの ID（string）

`UpdateTaskInput`は `completedAt` を含まなければならない（SHALL）。これにより、完了日を直接更新できる。

#### Scenario: タスクに詳細説明を設定できる
- **WHEN** タスクに description を設定する
- **THEN** タスクの description フィールドに値が保存される

#### Scenario: 親タスクを持たないタスクはルートタスク
- **WHEN** タスクの parentId が undefined
- **THEN** そのタスクはルートタスクとして扱われる

#### Scenario: UpdateTaskInput で completedAt を更新できる
- **WHEN** UpdateTaskInput に completedAt を指定してタスクを更新する
- **THEN** タスクの completedAt が指定した値で更新される
