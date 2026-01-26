## ADDED Requirements

### Requirement: タスク一覧を取得できる

ストアはすべてのタスクの配列を提供しなければならない（SHALL）。

#### Scenario: 空の状態でタスク一覧を取得
- **WHEN** タスクが1つも存在しない状態でタスク一覧を取得する
- **THEN** 空の配列が返される

#### Scenario: 複数タスクが存在する状態で一覧を取得
- **WHEN** 3つのタスクが存在する状態でタスク一覧を取得する
- **THEN** 3つのタスクを含む配列が返される

### Requirement: タスクを作成できる

ストアは新しいタスクを作成する機能を提供しなければならない（SHALL）。タスク作成時に id と createdAt は自動生成される。

#### Scenario: 最小限の情報でタスクを作成
- **WHEN** title のみを指定してタスクを作成する
- **THEN** id が自動生成され、status は "not_started"、createdAt は現在時刻で作成される

#### Scenario: 子タスクを作成
- **WHEN** parentId を指定してタスクを作成する
- **THEN** 指定した親タスクの子としてタスクが作成される

### Requirement: タスクを更新できる

ストアは既存タスクの任意のフィールドを更新する機能を提供しなければならない（SHALL）。

#### Scenario: タスクのタイトルを更新
- **WHEN** 既存タスクの title を新しい値に更新する
- **THEN** タスクの title が更新され、他のフィールドは変更されない

#### Scenario: タスクを完了にする
- **WHEN** タスクの status を "completed" に更新する
- **THEN** status が "completed" になり、completedAt に現在時刻が自動設定される

#### Scenario: 完了タスクを未完了に戻す
- **WHEN** status が "completed" のタスクを "not_started" に更新する
- **THEN** status が "not_started" になり、completedAt が削除される

### Requirement: タスクを削除できる

ストアはタスクを削除する機能を提供しなければならない（SHALL）。

#### Scenario: タスクを削除
- **WHEN** タスクを削除する
- **THEN** そのタスクはストアから削除される

#### Scenario: 子タスクを持つタスクを削除
- **WHEN** 子タスクを持つ親タスクを削除する
- **THEN** 親タスクと全ての子孫タスクが削除される

### Requirement: ID でタスクを取得できる

ストアは ID を指定して単一のタスクを取得する機能を提供しなければならない（SHALL）。

#### Scenario: 存在するタスクを取得
- **WHEN** 存在するタスクの ID を指定して取得する
- **THEN** 該当するタスクが返される

#### Scenario: 存在しないタスクを取得
- **WHEN** 存在しない ID を指定して取得する
- **THEN** undefined が返される
