## ADDED Requirements

### Requirement: データは自動的に保存される

タスクストアの状態が変更されたとき、自動的に localStorage に保存されなければならない（SHALL）。

#### Scenario: タスク作成時に自動保存
- **WHEN** 新しいタスクを作成する
- **THEN** localStorage にデータが保存される

#### Scenario: タスク更新時に自動保存
- **WHEN** タスクを更新する
- **THEN** localStorage のデータが更新される

#### Scenario: タスク削除時に自動保存
- **WHEN** タスクを削除する
- **THEN** localStorage のデータが更新される

### Requirement: データは起動時に自動復元される

アプリケーション起動時に localStorage からデータを自動的に読み込まなければならない（SHALL）。

#### Scenario: 保存済みデータがある状態で起動
- **WHEN** localStorage にデータが保存された状態でアプリを起動する
- **THEN** 保存されていたタスクがストアに復元される

#### Scenario: 保存済みデータがない状態で起動
- **WHEN** localStorage にデータがない状態でアプリを起動する
- **THEN** ストアは空の状態で初期化される

### Requirement: データは JSON 形式で保存される

localStorage への保存は JSON 形式で行わなければならない（SHALL）。

#### Scenario: データは JSON としてシリアライズされる
- **WHEN** データが localStorage に保存される
- **THEN** JSON.stringify でシリアライズされた形式で保存される

#### Scenario: データは JSON からデシリアライズされる
- **WHEN** localStorage からデータを読み込む
- **THEN** JSON.parse でデシリアライズされてオブジェクトに復元される
