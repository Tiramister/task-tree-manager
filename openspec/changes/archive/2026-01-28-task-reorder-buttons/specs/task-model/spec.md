## MODIFIED Requirements

### Requirement: タスクは必須フィールドを持つ

タスクは以下の必須フィールドを持たなければならない（SHALL）：
- `id`: 一意の識別子（string）
- `title`: タスク名（string）
- `status`: ステータス（"not_started" | "in_progress" | "waiting" | "completed"）
- `createdAt`: 作成日時（ISO 8601 形式の string）
- `sortOrder`: 表示順序（number）

#### Scenario: 新規タスクは必須フィールドを持つ
- **WHEN** 新しいタスクが作成される
- **THEN** id, title, status, createdAt, sortOrder がすべて設定されている
