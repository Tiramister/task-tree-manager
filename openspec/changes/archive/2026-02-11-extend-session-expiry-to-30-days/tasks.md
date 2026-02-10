## 1. セッション有効期限の実装更新

- [x] 1.1 `backend/auth.go` の `sessionDuration` を `24 * time.Hour` から `30 * 24 * time.Hour` に変更する
- [x] 1.2 バックエンド内で 24 時間を前提にしたセッション期限のハードコードが残っていないか確認し、必要なら 30 日基準に統一する

## 2. セッション期限の挙動検証

- [x] 2.1 ログイン時に保存される `sessions.expires_at` がログイン時刻から 30 日後になっていることを確認する
- [x] 2.2 認証判定が「30 日以内は成功」「30 日超過は 401」となることを確認する
- [x] 2.3 `switch-session` で再設定される Cookie の `Expires` が対象セッションの `expires_at` をそのまま使用していることを確認する

## 3. 完了確認

- [x] 3.1 変更後に `go test ./...`（backend）を実行してビルド・既存挙動に問題がないことを確認する
- [x] 3.2 `openspec status --change "extend-session-expiry-to-30-days"` でアーティファクトがすべて完了状態であることを確認する
