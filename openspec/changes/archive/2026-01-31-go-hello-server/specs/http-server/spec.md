## ADDED Requirements

### Requirement: Hello world レスポンス
サーバーはルートパス (`/`) への GET リクエストに対して `Hello, world!` というテキストを返さなければならない（SHALL）。レスポンスの Content-Type は `text/plain` とする。

#### Scenario: ルートパスへの GET リクエスト
- **WHEN** クライアントが `GET /` にリクエストを送信する
- **THEN** ステータスコード 200 と本文 `Hello, world!` が返る

### Requirement: ポート 8080 でリッスン
サーバーはデフォルトでポート 8080 で HTTP リクエストを受け付けなければならない（SHALL）。環境変数 `PORT` が設定されている場合はその値を使用しなければならない（SHALL）。

#### Scenario: デフォルトポートで起動
- **WHEN** 環境変数 `PORT` が設定されていない状態でサーバーを起動する
- **THEN** サーバーはポート 8080 でリッスンする

#### Scenario: 環境変数でポートを指定
- **WHEN** 環境変数 `PORT=3000` が設定された状態でサーバーを起動する
- **THEN** サーバーはポート 3000 でリッスンする
