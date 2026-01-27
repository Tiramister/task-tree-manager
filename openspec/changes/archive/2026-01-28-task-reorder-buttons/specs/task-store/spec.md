## MODIFIED Requirements

### Requirement: タスクを作成できる

ストアは新しいタスクを作成する機能を提供しなければならない（SHALL）。タスク作成時に id、createdAt、sortOrder は自動生成される。

#### Scenario: 最小限の情報でタスクを作成
- **WHEN** title のみを指定してタスクを作成する
- **THEN** id が自動生成され、status は "not_started"、createdAt は現在時刻、sortOrder は同一階層内の最大値 + 1 で作成される

#### Scenario: 子タスクを作成
- **WHEN** parentId を指定してタスクを作成する
- **THEN** 指定した親タスクの子としてタスクが作成され、sortOrder はその親の子タスク内の最大値 + 1 で設定される

#### Scenario: 同一階層にタスクが存在しない場合
- **WHEN** 同一階層にタスクが1つも存在しない状態でタスクを作成する
- **THEN** sortOrder は 0 で作成される

## ADDED Requirements

### Requirement: タスクを移動できる

ストアはタスクの表示順序を変更する機能を提供しなければならない（SHALL）。

#### Scenario: タスクを上に移動する
- **WHEN** moveTask(id, "up") を実行する
- **THEN** 対象タスクと同一階層内で1つ上のタスクの sortOrder が入れ替わる

#### Scenario: タスクを下に移動する
- **WHEN** moveTask(id, "down") を実行する
- **THEN** 対象タスクと同一階層内で1つ下のタスクの sortOrder が入れ替わる

#### Scenario: 先頭のタスクを上に移動しようとする
- **WHEN** 同一階層の先頭のタスクに対して moveTask(id, "up") を実行する
- **THEN** 何も変更されない

#### Scenario: 末尾のタスクを下に移動しようとする
- **WHEN** 同一階層の末尾のタスクに対して moveTask(id, "down") を実行する
- **THEN** 何も変更されない

### Requirement: 既存データのマイグレーション

sortOrder が未設定の既存データに対し、zustand persist の migrate で sortOrder を一括付与しなければならない（SHALL）。

#### Scenario: sortOrder 未設定のデータをマイグレーションする
- **WHEN** localStorage から sortOrder のないタスクデータを読み込む
- **THEN** createdAt 昇順で 0, 1, 2, ... の sortOrder が付与される
