## MODIFIED Requirements

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
