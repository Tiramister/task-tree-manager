## 1. バックエンド: GET /me エンドポイント

- [x] 1.1 `backend/auth.go` に `handleMe` ハンドラを追加する（セッションの user_id から username を取得して `{ "username": "..." }` を返す）
- [x] 1.2 `backend/main.go` に `GET /me` のルーティングを追加する

## 2. フロントエンド: 認証ストア

- [x] 2.1 `frontend/src/features/auth/authStore.ts` に Zustand ストアを作成する（username, loading, login, logout, checkAuth）
- [x] 2.2 `login` アクションを実装する（`POST /login` → `GET /me` でユーザー名取得）
- [x] 2.3 `logout` アクションを実装する（`POST /logout` → username を null にリセット）
- [x] 2.4 `checkAuth` アクションを実装する（`GET /me` で認証状態を確認、loading を制御）

## 3. フロントエンド: ログインダイアログ

- [x] 3.1 `frontend/src/features/auth/components/LoginDialog.tsx` を作成する（Radix UI Dialog 使用、ユーザー名・パスワード入力欄、ログインボタン）
- [x] 3.2 ログイン失敗時のエラーメッセージ表示を実装する
- [x] 3.3 ログイン成功時にダイアログを閉じる処理を実装する

## 4. フロントエンド: ヘッダーへの統合

- [x] 4.1 `frontend/src/App.tsx` のヘッダー右上に認証状態に応じた表示を追加する（未ログイン: ログインボタン、ログイン済み: ユーザー名、ローディング中: インジケーター）
- [x] 4.2 ユーザー名クリック時のドロップダウンメニューを実装する（Radix UI DropdownMenu 使用、ログアウト項目）
- [x] 4.3 アプリ起動時に `checkAuth` を呼び出す処理を追加する

## 5. 開発環境設定

- [x] 5.1 Vite の開発サーバーでバックエンドへのプロキシ設定を追加する（`/login`, `/logout`, `/me` 等の API パス）
