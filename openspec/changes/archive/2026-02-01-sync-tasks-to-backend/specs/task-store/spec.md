## MODIFIED Requirements

### Requirement: タスクを作成できる

ストアは新しいタスクを作成する機能を提供しなければならない（SHALL）。タスク作成時に id、createdAt、sortOrder は自動生成される。ログイン済みユーザーの場合、作成後にバックエンド API にデータを送信しなければならない（SHALL）。

#### Scenario: 最小限の情報でタスクを作成

- **WHEN** title のみを指定してタスクを作成する
- **THEN** id が自動生成され、status は "not_started"、createdAt は現在時刻、sortOrder は同一階層内の最大値 + 1 で作成される

#### Scenario: 子タスクを作成

- **WHEN** parentId を指定してタスクを作成する
- **THEN** 指定した親タスクの子としてタスクが作成され、sortOrder はその親の子タスク内の最大値 + 1 で設定される

#### Scenario: 同一階層にタスクが存在しない場合

- **WHEN** 同一階層にタスクが1つも存在しない状態でタスクを作成する
- **THEN** sortOrder は 0 で作成される

#### Scenario: ログイン済みユーザーがタスクを作成

- **WHEN** ログイン済みユーザーがタスクを作成する
- **THEN** localStorage にタスクが追加された後、バックエンド API にタスクデータが送信される

#### Scenario: 未ログインユーザーがタスクを作成

- **WHEN** 未ログインユーザーがタスクを作成する
- **THEN** localStorage にのみタスクが追加され、バックエンドへの送信は行われない

### Requirement: タスクを更新できる

ストアは既存タスクの任意のフィールドを更新する機能を提供しなければならない（SHALL）。ログイン済みユーザーの場合、更新後にバックエンド API にデータを送信しなければならない（SHALL）。

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

#### Scenario: ログイン済みユーザーがタスクを更新

- **WHEN** ログイン済みユーザーがタスクを更新する
- **THEN** localStorage のタスクが更新された後、バックエンド API に更新データが送信される

### Requirement: タスクを削除できる

ストアはタスクを削除する機能を提供しなければならない（SHALL）。ログイン済みユーザーの場合、削除後にバックエンド API にデータを送信しなければならない（SHALL）。子孫タスクの削除はバックエンド側の CASCADE に任せ、フロントエンドからはルートの削除対象のみ送信する。

#### Scenario: タスクを削除

- **WHEN** タスクを削除する
- **THEN** そのタスクはストアから削除される

#### Scenario: 子タスクを持つタスクを削除

- **WHEN** 子タスクを持つ親タスクを削除する
- **THEN** 親タスクと全ての子孫タスクが削除される

#### Scenario: ログイン済みユーザーがタスクを削除

- **WHEN** ログイン済みユーザーがタスクを削除する
- **THEN** localStorage からタスクが削除された後、`DELETE /tasks/{id}` でバックエンドにリクエストが送信される（子孫タスクの削除は CASCADE に任せる）

### Requirement: タスクを移動できる

ストアはタスクの表示順序を変更する機能を提供しなければならない（SHALL）。ログイン済みユーザーの場合、移動後にバックエンド API にデータを送信しなければならない（SHALL）。

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

#### Scenario: ログイン済みユーザーがタスクを移動

- **WHEN** ログイン済みユーザーが moveTask でタスクを移動する
- **THEN** localStorage の sortOrder が更新された後、入れ替わった2つのタスクそれぞれについて `PATCH /tasks/{id}/reorder` でバックエンドにリクエストが送信される
