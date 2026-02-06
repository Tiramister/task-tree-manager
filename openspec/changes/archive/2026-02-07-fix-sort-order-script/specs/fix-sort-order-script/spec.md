## ADDED Requirements

### Requirement: sortOrder を正規化した JSON を出力できる

CLI ツールは標準入力からタスクの JSON 配列を読み込み、各階層の sortOrder を正規化した JSON を標準出力に出力しなければならない（SHALL）。

#### Scenario: 正常な JSON を入力する
- **WHEN** 有効なタスク JSON 配列を標準入力に渡す
- **THEN** sortOrder が正規化された JSON が標準出力に出力される

#### Scenario: 空の配列を入力する
- **WHEN** 空の配列 `[]` を標準入力に渡す
- **THEN** 空の配列 `[]` が標準出力に出力される

### Requirement: 各階層内で sortOrder が 0 から連番になる

同じ parentId を持つタスク群（ルートタスクは parentId が null/undefined）において、sortOrder が 0, 1, 2, ... と連番に振り直されなければならない（SHALL）。

#### Scenario: ルートタスクの sortOrder を正規化する
- **WHEN** parentId を持たないタスクが 3 つあり、sortOrder が [5, 2, 8] である
- **THEN** 元の順序を維持しつつ、sortOrder が [0, 1, 2] に振り直される（sortOrder 2 → 0, 5 → 1, 8 → 2）

#### Scenario: 子タスクの sortOrder を正規化する
- **WHEN** 同じ parentId を持つタスクが 2 つあり、sortOrder が [10, 5] である
- **THEN** 元の順序を維持しつつ、sortOrder が [0, 1] に振り直される（sortOrder 5 → 0, 10 → 1）

#### Scenario: 複数の階層を独立して正規化する
- **WHEN** parentId=A のタスク群と parentId=B のタスク群がある
- **THEN** 各グループは独立して 0 から連番が振られる

### Requirement: 元の sortOrder 順でソートされる

sortOrder の振り直しは、元の sortOrder の昇順でソートした後に行われなければならない（SHALL）。

#### Scenario: sortOrder が重複している場合
- **WHEN** 同じ階層に sortOrder が同じ値のタスクが複数存在する
- **THEN** 同じ sortOrder のタスクは入力順（配列内の順序）を維持してソートされる

### Requirement: sortOrder 以外のフィールドが変更されていないことを検証する

CLI ツールは、出力前に sortOrder 以外のすべてのフィールドが入力と同一であることを検証しなければならない（SHALL）。

#### Scenario: 検証に成功する
- **WHEN** sortOrder のみが変更された JSON を出力する
- **THEN** 検証に成功し、JSON が正常に出力される

#### Scenario: 検証に失敗する
- **WHEN** sortOrder 以外のフィールドが何らかの理由で変更された
- **THEN** エラーメッセージを出力し、異常終了する（exit code 1）

### Requirement: 無効な入力に対してエラーを返す

CLI ツールは無効な JSON や不正なデータに対してエラーを返さなければならない（SHALL）。

#### Scenario: 無効な JSON を入力する
- **WHEN** JSON としてパースできない文字列を入力する
- **THEN** エラーメッセージを標準エラー出力に出力し、異常終了する（exit code 1）

#### Scenario: 配列以外の JSON を入力する
- **WHEN** オブジェクトなど配列以外の JSON を入力する
- **THEN** エラーメッセージを標準エラー出力に出力し、異常終了する（exit code 1）
