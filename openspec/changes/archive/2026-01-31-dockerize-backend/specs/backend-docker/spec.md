## ADDED Requirements

### Requirement: マルチステージビルドによるコンテナイメージ生成
backend の Dockerfile はマルチステージビルドを使用し、ビルドステージで Go バイナリをコンパイルし、実行ステージでは distroless イメージ上でバイナリのみを実行しなければならない (SHALL)。

#### Scenario: Dockerfile によるイメージビルド
- **WHEN** `docker build` を `backend/` ディレクトリで実行する
- **THEN** Go ソースコードがコンパイルされ、distroless ベースの軽量イメージが生成される

#### Scenario: ビルドステージの Go バージョン
- **WHEN** Dockerfile のビルドステージを確認する
- **THEN** Go のバージョンは go.mod と整合する 1.25 系が指定されている

### Requirement: コンテナの実行設定
backend コンテナはポート 8080 を EXPOSE し、非 root ユーザーで実行しなければならない (SHALL)。環境変数 `PORT` によるポート設定をサポートしなければならない (SHALL)。

#### Scenario: コンテナの起動
- **WHEN** backend コンテナを起動する
- **THEN** ポート 8080 でリクエストを受け付ける

#### Scenario: 環境変数によるポート変更
- **WHEN** 環境変数 `PORT=9090` を指定してコンテナを起動する
- **THEN** ポート 9090 でリクエストを受け付ける

#### Scenario: 非 root ユーザーでの実行
- **WHEN** コンテナ内のプロセスのユーザーを確認する
- **THEN** root ではない非特権ユーザーで実行されている

### Requirement: .dockerignore によるビルドコンテキストの最適化
backend ディレクトリに .dockerignore を配置し、不要なファイルをビルドコンテキストから除外しなければならない (SHALL)。

#### Scenario: 不要ファイルの除外
- **WHEN** Docker ビルドコンテキストが構成される
- **THEN** `.git`、`*.md`、`.mise.toml` などの不要ファイルがコンテキストに含まれない
