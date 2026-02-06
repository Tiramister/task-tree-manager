## MODIFIED Requirements

### Requirement: タスクを更新できる

ストアは既存タスクの任意のフィールドを更新する機能を提供しなければならない（SHALL）。ログイン済みユーザーの場合、更新後にバックエンド API にデータを送信しなければならない（SHALL）。

completedAt の更新ルール：
- input に completedAt が明示的に含まれる場合、その値をそのまま使用しなければならない（SHALL）
- input に completedAt が含まれず、status が "completed" に変更される場合、completedAt に現在時刻を自動設定しなければならない（SHALL）
- input に completedAt が含まれず、status が "completed" から他に変更される場合、completedAt を削除しなければならない（SHALL）
- ログイン済みユーザーで completedAt が削除された場合、バックエンド更新では `completed_at: null` を明示的に送信しなければならない（SHALL）

オプショナルフィールドのクリア送信ルール：
- `description`、`dueDate`、`notes`、`completedAt` を削除する更新では、ログイン済みユーザーに対するバックエンド更新で対象フィールドを `null` として送信しなければならない（SHALL）
- 未指定フィールドはバックエンド更新で送信してはならない（MUST NOT）

#### Scenario: タスクのタイトルを更新
- **WHEN** 既存タスクの title を新しい値に更新する
- **THEN** タスクの title が更新され、他のフィールドは変更されない

#### Scenario: タスクを完了にする
- **WHEN** タスクの status を "completed" に更新する（completedAt を指定しない）
- **THEN** status が "completed" になり、completedAt に現在時刻が自動設定される

#### Scenario: 完了タスクを未完了に戻す
- **WHEN** status が "completed" のタスクを "not_started" に更新する
- **THEN** status が "not_started" になり、completedAt が削除され、ログイン済みユーザーでは `PATCH /tasks/{id}` に `completed_at: null` が送信される

#### Scenario: completedAt を明示的に指定して更新する
- **WHEN** completedAt に特定のISO 8601日時文字列を指定してタスクを更新する
- **THEN** completedAt が指定した値で上書きされる

#### Scenario: ステータス変更と completedAt を同時に指定する
- **WHEN** status を "completed" に変更しつつ、completedAt に特定の日時を指定する
- **THEN** 明示的に指定された completedAt の値が使用される（自動設定より優先）

#### Scenario: 詳細説明をクリアする
- **WHEN** description が設定済みのタスクに対して description を削除して更新する
- **THEN** ローカルの description が削除され、ログイン済みユーザーでは `PATCH /tasks/{id}` に `description: null` が送信される

#### Scenario: 期限をクリアする
- **WHEN** dueDate が設定済みのタスクに対して dueDate を削除して更新する
- **THEN** ローカルの dueDate が削除され、ログイン済みユーザーでは `PATCH /tasks/{id}` に `due_date: null` が送信される

#### Scenario: 作業記録をクリアする
- **WHEN** notes が設定済みのタスクに対して notes を削除して更新する
- **THEN** ローカルの notes が削除され、ログイン済みユーザーでは `PATCH /tasks/{id}` に `notes: null` が送信される

#### Scenario: 完了日をクリアする
- **WHEN** completedAt が設定済みの完了タスクに対して completedAt を削除して更新する
- **THEN** ローカルの completedAt が削除され、ログイン済みユーザーでは `PATCH /tasks/{id}` に `completed_at: null` が送信される

#### Scenario: ログイン済みユーザーがタスクを更新
- **WHEN** ログイン済みユーザーがタスクを更新する
- **THEN** localStorage のタスクが更新された後、バックエンド API に更新データが送信され、削除されたオプショナルフィールドは `null` で送信される
