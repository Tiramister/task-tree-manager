### Requirement: GitHub リンクメニュー項目
3点メニューに「GitHub」というテキストのメニュー項目が存在しなければならない（SHALL）。アイコンは `public/github.svg` を使用する。

#### Scenario: GitHub リンクをクリックする
- **WHEN** ユーザーが「GitHub」メニュー項目をクリックする
- **THEN** `https://github.com/Tiramister/task-tree-manager` が新しいタブで開かれる

#### Scenario: メニュー項目の表示
- **WHEN** ユーザーが3点メニューを開く
- **THEN** エクスポート・インポートの下に GitHub アイコンと「GitHub」テキストが表示される
