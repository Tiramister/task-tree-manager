# task-status-quick-change Specification

## Purpose
TBD - created by archiving change phase5-task-operations. Update Purpose after archive.
## Requirements
### Requirement: ステータスバッジからの変更

ツリービュー内の各タスクのステータスバッジをクリックすると、ステータス選択メニューが開かなければならない（SHALL）。タスク行の他の部分をクリックした場合は従来通りドロワーが開く。

#### Scenario: ステータスバッジをクリックしてメニューを開く

- **WHEN** ユーザーがタスクのステータスバッジをクリックする
- **THEN** ステータス選択ドロップダウンメニューが開く
- **AND** タスク詳細ドロワーは開かない

### Requirement: ステータス選択メニュー

ステータス選択メニューには4つのステータス（未着手、作業中、待ち、完了）が表示されなければならない（SHALL）。

#### Scenario: ステータスを変更する

- **WHEN** ユーザーがステータス選択メニューから別のステータスを選択する
- **THEN** タスクのステータスが変更され、バッジの表示が更新される

#### Scenario: 同じステータスを選択する

- **WHEN** ユーザーがステータス選択メニューから現在と同じステータスを選択する
- **THEN** メニューが閉じ、ステータスは変更されない

#### Scenario: メニュー外をクリックする

- **WHEN** ユーザーがステータス選択メニューの外をクリックする
- **THEN** メニューが閉じ、ステータスは変更されない

