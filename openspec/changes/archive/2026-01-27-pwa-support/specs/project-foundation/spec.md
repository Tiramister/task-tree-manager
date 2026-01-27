## MODIFIED Requirements

### Requirement: Favicon 設定
アプリケーションは `assets/icons/favicon.ico` をファビコンとして表示しなければならない（SHALL）。また、`theme-color` メタタグを設定しなければならない（SHALL）。

#### Scenario: ブラウザタブにファビコンが表示される
- **WHEN** ユーザーがアプリケーションをブラウザで開く
- **THEN** ブラウザタブに `assets/icons/favicon.ico` のアイコンが表示される

#### Scenario: テーマカラーが設定される
- **WHEN** `index.html` の `<head>` を確認する
- **THEN** `<meta name="theme-color">` タグが存在する
