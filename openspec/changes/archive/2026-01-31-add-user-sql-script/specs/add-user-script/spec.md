## ADDED Requirements

### Requirement: ユーザー追加 SQL の生成
システムは、ユーザー名とパスワードを引数として受け取り、users テーブルへの INSERT 文を標準出力に出力する CLI ツールを提供しなければならない（SHALL）。

#### Scenario: 正常なユーザー追加 SQL の生成
- **WHEN** `go run ./cmd/adduser <username> <password>` を実行する
- **THEN** パスワードが bcrypt でハッシュ化され、users テーブルへの INSERT 文が標準出力に出力される

#### Scenario: 出力された SQL の形式
- **WHEN** SQL が生成される
- **THEN** 出力は `INSERT INTO users (username, password_hash) VALUES ('<username>', '<bcrypt_hash>');` の形式である

### Requirement: 引数のバリデーション
システムは、引数が不足している場合にエラーメッセージと使用方法を標準エラー出力に表示しなければならない（SHALL）。

#### Scenario: 引数なしで実行
- **WHEN** 引数なしで `go run ./cmd/adduser` を実行する
- **THEN** 使用方法が標準エラー出力に表示され、終了コード 1 で終了する

#### Scenario: 引数が 1 つだけで実行
- **WHEN** `go run ./cmd/adduser <username>` のように引数が 1 つだけで実行する
- **THEN** 使用方法が標準エラー出力に表示され、終了コード 1 で終了する

### Requirement: SQL インジェクション対策
システムは、ユーザー名に含まれるシングルクォートをエスケープしなければならない（SHALL）。

#### Scenario: シングルクォートを含むユーザー名
- **WHEN** ユーザー名に `O'Brien` のようなシングルクォートが含まれる場合
- **THEN** 出力される SQL ではシングルクォートが `''` にエスケープされる

### Requirement: bcrypt 互換性
システムは、既存のログイン機能と互換性のある bcrypt ハッシュを生成しなければならない（SHALL）。

#### Scenario: 生成されたハッシュでログイン可能
- **WHEN** スクリプトで生成した SQL を実行してユーザーを追加する
- **THEN** そのユーザー名とパスワードでバックエンドのログインエンドポイントから認証できる
