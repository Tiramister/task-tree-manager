### Requirement: golang-migrate によるマイグレーション管理
バックエンドは `golang-migrate/migrate` を使用してデータベースマイグレーションを管理しなければならない (SHALL)。

#### Scenario: マイグレーションファイルの配置
- **WHEN** マイグレーションファイルを作成する
- **THEN** `backend/migrations/` ディレクトリに `NNNNNN_name.up.sql` と `NNNNNN_name.down.sql` のペアとして配置される

### Requirement: アプリケーション起動時のマイグレーション自動実行
バックエンドはアプリケーション起動時に未適用のマイグレーションを自動的に適用しなければならない (SHALL)。

#### Scenario: 未適用のマイグレーションがある場合
- **WHEN** 未適用のマイグレーションがある状態でバックエンドが起動する
- **THEN** 未適用のマイグレーションが順番に適用される

#### Scenario: すべてのマイグレーションが適用済みの場合
- **WHEN** すべてのマイグレーションが適用済みの状態でバックエンドが起動する
- **THEN** マイグレーションはスキップされ、サーバーが正常に起動する

#### Scenario: マイグレーションが失敗した場合
- **WHEN** マイグレーションの適用中にエラーが発生する
- **THEN** エラーメッセージを出力してプロセスが終了する

### Requirement: マイグレーションファイルのバイナリ埋め込み
マイグレーションファイルは Go の `embed` パッケージを使用してバイナリに埋め込まなければならない (SHALL)。

#### Scenario: バイナリ単体での実行
- **WHEN** バックエンドのバイナリのみがデプロイされる
- **THEN** マイグレーションファイルがバイナリに含まれているため、外部ファイルなしでマイグレーションが実行できる

### Requirement: users テーブルのマイグレーション
`users` テーブルを作成するマイグレーションファイルが `backend/migrations/` に配置されなければならない（SHALL）。up マイグレーションは `users` テーブルを作成し、down マイグレーションは `users` テーブルを削除する。

#### Scenario: users テーブルの作成
- **WHEN** up マイグレーションが適用される
- **THEN** `users` テーブルが作成される

#### Scenario: users テーブルのロールバック
- **WHEN** down マイグレーションが適用される
- **THEN** `users` テーブルが削除される

### Requirement: sessions テーブルのマイグレーション
`sessions` テーブルを作成するマイグレーションファイルが `backend/migrations/` に配置されなければならない（SHALL）。up マイグレーションは `sessions` テーブルを作成し、down マイグレーションは `sessions` テーブルを削除する。`sessions` テーブルの作成は `users` テーブルの作成よりも後でなければならない（SHALL）。

#### Scenario: sessions テーブルの作成
- **WHEN** up マイグレーションが適用される
- **THEN** `sessions` テーブルが作成される（`users` テーブルへの外部キー制約を含む）

#### Scenario: sessions テーブルのロールバック
- **WHEN** down マイグレーションが適用される
- **THEN** `sessions` テーブルが削除される
