## ADDED Requirements

### Requirement: タスクは必須フィールドを持つ

タスクは以下の必須フィールドを持たなければならない（SHALL）：
- `id`: 一意の識別子（string）
- `title`: タスク名（string）
- `status`: ステータス（"not_started" | "in_progress" | "waiting" | "completed"）
- `createdAt`: 作成日時（ISO 8601 形式の string）

#### Scenario: 新規タスクは必須フィールドを持つ
- **WHEN** 新しいタスクが作成される
- **THEN** id, title, status, createdAt がすべて設定されている

### Requirement: タスクはオプショナルフィールドを持てる

タスクは以下のオプショナルフィールドを持てる（MAY）：
- `description`: 詳細説明（string）
- `dueDate`: 期限（ISO 8601 形式の string）
- `completedAt`: 完了日時（ISO 8601 形式の string）
- `notes`: 作業記録（string）
- `parentId`: 親タスクの ID（string）

#### Scenario: タスクに詳細説明を設定できる
- **WHEN** タスクに description を設定する
- **THEN** タスクの description フィールドに値が保存される

#### Scenario: 親タスクを持たないタスクはルートタスク
- **WHEN** タスクの parentId が undefined
- **THEN** そのタスクはルートタスクとして扱われる

### Requirement: ステータスは4種類のみ

タスクのステータスは以下の4種類のみ許可される（SHALL）：
- `not_started`: 未着手
- `in_progress`: 作業中
- `waiting`: 待ち
- `completed`: 完了

#### Scenario: 無効なステータスは設定できない
- **WHEN** 定義外のステータス値を設定しようとする
- **THEN** TypeScript の型エラーとなる
