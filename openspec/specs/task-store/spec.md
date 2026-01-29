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

### Requirement: タスクを更新できる

ストアは既存タスクの任意のフィールドを更新する機能を提供しなければならない（SHALL）。

completedAt の更新ルール：
- input に completedAt が明示的に含まれる場合、その値をそのまま使用しなければならない（SHALL）
- input に completedAt が含まれず、status が "completed" に変更される場合、completedAt に現在時刻を自動設定しなければならない（SHALL）
- input に completedAt が含まれず、status が "completed" から他に変更される場合、completedAt を削除しなければならない（SHALL）

#### Scenario: タスクのタイトルを更新
- **WHEN** 既存タスクの title を新しい値に更新する
- **THEN** タスクの title が更新され、他のフィールドは変更されない

#### Scenario: タスクを完了にする
- **WHEN** タスクの status を "completed" に更新する（completedAt を指定しない）
- **THEN** status が "completed" になり、completedAt に現在時刻が自動設定される

#### Scenario: 完了タスクを未完了に戻す
- **WHEN** status が "completed" のタスクを "not_started" に更新する
- **THEN** status が "not_started" になり、completedAt が削除される

#### Scenario: completedAt を明示的に指定して更新する
- **WHEN** completedAt に特定のISO 8601日時文字列を指定してタスクを更新する
- **THEN** completedAt が指定した値で上書きされる

#### Scenario: ステータス変更と completedAt を同時に指定する
- **WHEN** status を "completed" に変更しつつ、completedAt に特定の日時を指定する
- **THEN** 明示的に指定された completedAt の値が使用される（自動設定より優先）

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
