## MODIFIED Requirements

### Requirement: Hello world レスポンス
サーバーはルートパス (`/`) への GET リクエストに対して `Hello, world!` というテキストを返さなければならない（SHALL）。レスポンスの Content-Type は `text/plain` とする。このエンドポイントは認証ミドルウェアによって保護されなければならない（SHALL）。

#### Scenario: 認証済みユーザーによるルートパスへの GET リクエスト
- **WHEN** 有効なセッション Cookie を持つクライアントが `GET /` にリクエストを送信する
- **THEN** ステータスコード 200 と本文 `Hello, world!` が返る

#### Scenario: 未認証ユーザーによるルートパスへの GET リクエスト
- **WHEN** セッション Cookie を持たないクライアントが `GET /` にリクエストを送信する
- **THEN** ステータスコード 401 が返る
