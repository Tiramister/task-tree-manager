## Why

現在、users テーブルにユーザーを追加する手段がない。バックエンドにはログイン機能が実装されているが、ユーザーの登録エンドポイントや管理画面は存在しない。運用時に新規ユーザーを追加するために、bcrypt ハッシュ化されたパスワードを含む INSERT SQL を構築する CLI スクリプトが必要である。

## What Changes

- ユーザー名とパスワードを受け取り、パスワードを bcrypt でハッシュ化し、users テーブルへの INSERT 文を標準出力に出力するスクリプトを追加する
- スクリプトは `backend/` 配下に配置し、既存の Go 環境で実行できるようにする

## Capabilities

### New Capabilities

- `add-user-script`: ユーザー追加用の SQL を構築する CLI スクリプト。ユーザー名とパスワードを引数で受け取り、bcrypt ハッシュ化した INSERT 文を出力する。

### Modified Capabilities

（なし）

## Impact

- `backend/` に新しい Go ファイルまたはスクリプトが追加される
- 既存の users テーブルスキーマ（`id UUID`, `username VARCHAR(255)`, `password_hash VARCHAR(255)`, `created_at TIMESTAMPTZ`）に準拠した SQL を生成する
- 既存のコードやAPIへの変更はない
