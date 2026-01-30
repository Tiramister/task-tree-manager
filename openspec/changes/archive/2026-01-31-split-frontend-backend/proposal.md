## Why

現在のプロジェクトはフロントエンドのみの SPA として構成されている。今後バックエンドを追加してフロントエンド・バックエンドの分離構成にする予定があるため、既存のフロントエンドコードを `frontend/` ディレクトリに移動し、`backend/` ディレクトリを新設して、モノレポ構成の土台を整える。

## What Changes

- **BREAKING**: プロジェクトルート直下にあるフロントエンドのソースコード・設定ファイル一式を `frontend/` ディレクトリに移動する
- `backend/` ディレクトリを新設する（中身の実装は行わない）
- プロジェクトルートの構成をモノレポ形式に変更する

## Capabilities

### New Capabilities

- `monorepo-structure`: フロントエンドとバックエンドを分離したモノレポディレクトリ構成を定義する

### Modified Capabilities

（既存の spec に対する要件変更はなし。ディレクトリ移動のみで各機能の仕様は変わらない）

## Impact

- **ディレクトリ構成**: `src/`, `public/`, `assets/` などフロントエンド関連のファイル・ディレクトリがすべて `frontend/` 配下に移動する
- **設定ファイル**: `package.json`, `tsconfig.json`, `vite.config.ts`, `biome.json`, `components.json`, `Dockerfile`, `docker-compose.yml` などがルートから `frontend/` に移動する
- **開発フロー**: `npm run dev` 等のコマンドは `frontend/` ディレクトリ内で実行する形に変わる
- **Git 履歴**: ファイル移動により git の差分が大きくなるが、`git mv` を使うことで履歴を保持する
- **CI/CD**: パスの変更に伴い、Docker や CI の設定も `frontend/` を基準に更新が必要
