## Context

現在の task-tree-manager は、プロジェクトルート直下に React + Vite のフロントエンドコードが配置された SPA 構成になっている。今後バックエンドを追加するにあたり、フロントエンドとバックエンドを分離したディレクトリ構成に移行する必要がある。

現在のルート直下のフロントエンド関連ファイル:
- ソースコード: `src/`, `public/`, `assets/`
- 設定ファイル: `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `biome.json`, `components.json`
- エントリポイント: `index.html`
- Docker: `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- その他: `.mise.toml`, `README.md`, `.gitignore`

ルートに残すべきもの:
- `.git/`, `.gitignore`
- `openspec/`
- `CLAUDE.md`
- `.claude/`
- `.idea/`

## Goals / Non-Goals

**Goals:**
- 既存のフロントエンドコードを `frontend/` ディレクトリに移動する
- `backend/` ディレクトリを空の状態で新設する
- 移動後もフロントエンドが正常にビルド・動作することを確認する

**Non-Goals:**
- バックエンドの実装やセットアップ
- ルートレベルのワークスペース管理ツール（npm workspaces, turborepo 等）の導入
- CI/CD パイプラインの構築
- フロントエンドコードのリファクタリング

## Decisions

### 1. `git mv` を使用してファイルを移動する

**理由**: 通常のファイル移動（`mv`）でも git は rename として検出できるが、`git mv` を使うことで意図が明確になり、ステージングも自動で行われる。

**代替案**: 手動で `mv` + `git add` する方法もあるが、`git mv` の方が操作がシンプルで確実。

### 2. フロントエンドの設定ファイルはそのまま移動する

**理由**: Vite, TypeScript, Biome の設定ファイルは相対パスベースで動作するため、`frontend/` に移動してもパスの書き換えは不要。`frontend/` ディレクトリ内で `npm install` と `npm run dev` を実行すれば、これまでと同じように動作する。

**代替案**: ルートに共通設定を置いてフロントエンド・バックエンドで継承する方式は、バックエンド実装時に検討する。

### 3. `node_modules` は移動せず、移動後に `npm install` で再生成する

**理由**: `node_modules` は `.gitignore` 対象であり、`git mv` の対象外。移動後に `frontend/` で `npm install` を実行して再生成する方が確実。

### 4. `dist/` は移動しない

**理由**: ビルド成果物はバージョン管理対象外であり、移動後にビルドし直せばよい。

### 5. ルートの `.gitignore` を更新し、共通設定をルートに残す

**理由**: `node_modules/` や `dist/` のパターンは `frontend/` と将来の `backend/` の両方に適用するため、ルートの `.gitignore` で管理するのが適切。

## Risks / Trade-offs

- **Git 差分が大量になる** → `git mv` を使うことで、GitHub 上でも rename として認識されやすくなる。1コミットにまとめることで差分のレビューをしやすくする。
- **既存の開発環境が壊れる** → 移動後に `npm install` と `npm run build` で動作確認を行うことで検証する。
- **パス参照の見落とし** → `Dockerfile` や `docker-compose.yml` 内のパス参照を確認し、必要に応じて更新する。
