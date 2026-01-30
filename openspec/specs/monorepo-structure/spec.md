### Requirement: frontend ディレクトリにフロントエンドコードが配置される

プロジェクトルートの `frontend/` ディレクトリに、React + Vite ベースのフロントエンドアプリケーションの全ファイルが配置されなければならない（SHALL）。

以下のファイル・ディレクトリが `frontend/` 配下に存在しなければならない:
- `src/` — ソースコード
- `public/` — 静的ファイル
- `assets/` — アセットファイル
- `index.html` — エントリポイント
- `package.json` — 依存関係定義
- `package-lock.json` — 依存関係ロック
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — TypeScript 設定
- `vite.config.ts` — Vite 設定
- `biome.json` — Biome 設定
- `components.json` — コンポーネント設定
- `Dockerfile`, `docker-compose.yml`, `.dockerignore` — Docker 設定
- `.mise.toml` — ランタイムバージョン管理
- `README.md` — ドキュメント

#### Scenario: frontend ディレクトリの存在確認
- **WHEN** プロジェクトルートを確認する
- **THEN** `frontend/` ディレクトリが存在し、上記のファイル・ディレクトリがすべて含まれている

#### Scenario: frontend でビルドが成功する
- **WHEN** `frontend/` ディレクトリで `npm run build` を実行する
- **THEN** ビルドがエラーなく完了する

#### Scenario: frontend でチェックが成功する
- **WHEN** `frontend/` ディレクトリで `npm run check` を実行する
- **THEN** lint・format チェックがエラーなく完了する

### Requirement: backend ディレクトリが存在する

プロジェクトルートの `backend/` ディレクトリが存在しなければならない（SHALL）。このディレクトリは将来のバックエンド実装のためのプレースホルダーであり、現時点では中身は空でよい。

#### Scenario: backend ディレクトリの存在確認
- **WHEN** プロジェクトルートを確認する
- **THEN** `backend/` ディレクトリが存在する

### Requirement: プロジェクトルートにフロントエンド固有のファイルが残らない

移動完了後、プロジェクトルートにはフロントエンド固有のソースコードや設定ファイルが残ってはならない（MUST NOT）。

ルートに残すファイル・ディレクトリ:
- `.git/` — Git リポジトリ
- `.gitignore` — Git 除外設定
- `openspec/` — OpenSpec 仕様管理
- `CLAUDE.md` — Claude 設定
- `.claude/` — Claude 設定ディレクトリ
- `frontend/` — フロントエンドコード
- `backend/` — バックエンドコード（プレースホルダー）

#### Scenario: ルートにフロントエンドファイルが残っていない
- **WHEN** プロジェクトルートの直下を確認する
- **THEN** `src/`, `public/`, `assets/`, `index.html`, `package.json`, `vite.config.ts` 等のフロントエンド固有ファイルが存在しない

### Requirement: .gitignore がモノレポ構成に対応する

プロジェクトルートの `.gitignore` は、`frontend/` および将来の `backend/` の両方に対して `node_modules/` や `dist/` を除外するパターンを含まなければならない（SHALL）。

#### Scenario: gitignore がサブディレクトリの node_modules を除外する
- **WHEN** `frontend/node_modules/` にファイルが存在する
- **THEN** git はそのファイルを追跡対象外とする
