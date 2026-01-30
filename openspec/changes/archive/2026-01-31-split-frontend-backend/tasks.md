## 1. frontend ディレクトリの作成とファイル移動

- [x] 1.1 `frontend/` ディレクトリを作成する
- [x] 1.2 `git mv` でソースコードディレクトリを移動する（`src/`, `public/`, `assets/`）
- [x] 1.3 `git mv` でエントリポイントを移動する（`index.html`）
- [x] 1.4 `git mv` で設定ファイルを移動する（`package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `biome.json`, `components.json`）
- [x] 1.5 `git mv` で Docker 関連ファイルを移動する（`Dockerfile`, `docker-compose.yml`, `.dockerignore`）
- [x] 1.6 `git mv` でその他のファイルを移動する（`.mise.toml`, `README.md`）

## 2. backend ディレクトリの作成

- [x] 2.1 `backend/` ディレクトリを作成し、`.gitkeep` を配置する

## 3. ルートの .gitignore を更新する

- [x] 3.1 `.gitignore` のパターンがサブディレクトリの `node_modules/` と `dist/` を正しく除外するか確認し、必要に応じて更新する

## 4. 動作確認

- [x] 4.1 `frontend/` で `npm install` を実行し、依存関係を再インストールする
- [x] 4.2 `frontend/` で `npm run check` を実行し、lint・format チェックが通ることを確認する
- [x] 4.3 `frontend/` で `npm run build` を実行し、ビルドが成功することを確認する
