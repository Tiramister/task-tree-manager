## ADDED Requirements

### Requirement: Web App Manifest
アプリケーションは有効な Web App Manifest を提供しなければならない（SHALL）。マニフェストにはアプリ名、短縮名、開始 URL、表示モード、テーマカラー、背景色、アイコンが含まれる。

#### Scenario: マニフェストがビルド成果物に含まれる
- **WHEN** `npm run build` を実行する
- **THEN** `dist/` にマニフェストファイルが生成され、`index.html` からリンクされている

#### Scenario: マニフェストに必須フィールドが設定されている
- **WHEN** マニフェストファイルの内容を確認する
- **THEN** `name`、`short_name`、`start_url`、`display`、`theme_color`、`background_color`、`icons` が設定されている

#### Scenario: 表示モードが standalone である
- **WHEN** マニフェストの `display` フィールドを確認する
- **THEN** `standalone` が設定されている

### Requirement: PWA アイコン
マニフェストの `icons` 配列は、複数サイズの PNG アイコンを参照しなければならない（SHALL）。最低限 192px と 512px のアイコンを含む。

#### Scenario: 必須サイズのアイコンがマニフェストに含まれる
- **WHEN** マニフェストの `icons` 配列を確認する
- **THEN** 192x192 と 512x512 のアイコンエントリが存在する

### Requirement: Service Worker
アプリケーションは Service Worker を登録し、ビルド成果物を事前キャッシュしなければならない（SHALL）。

#### Scenario: Service Worker が登録される
- **WHEN** アプリケーションをブラウザで開く
- **THEN** Service Worker が登録される

#### Scenario: オフラインでアクセスできる
- **WHEN** Service Worker の登録後にネットワーク接続が切断される
- **THEN** アプリケーションがキャッシュから表示される

### Requirement: Service Worker の自動更新
新しいバージョンのアプリがデプロイされた場合、Service Worker は自動的に更新されなければならない（SHALL）。

#### Scenario: 新バージョンの自動適用
- **WHEN** 新しいバージョンの Service Worker が検出される
- **THEN** 自動的に新しい Service Worker がアクティブになる

### Requirement: インストール可能性
アプリケーションは PWA のインストール基準を満たし、ブラウザからホーム画面に追加できなければならない（SHALL）。

#### Scenario: インストールプロンプトが表示可能
- **WHEN** PWA のインストール基準を満たした状態でアプリにアクセスする
- **THEN** ブラウザのインストール機能（「ホーム画面に追加」等）が利用可能になる
