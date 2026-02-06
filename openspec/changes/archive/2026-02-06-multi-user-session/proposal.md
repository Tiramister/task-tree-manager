## Why

現在のシステムでは1つのブラウザで1人のユーザーにしかログインできない。複数のユーザーアカウントを持つ場合（例：仕事用と個人用）、切り替えるたびにログアウト→ログインが必要で手間がかかる。複数ユーザーへの同時ログインと簡単な切り替え機能により、ユーザー体験を向上させる。

## What Changes

- ブラウザ側で複数のセッションを保持できるようにする
- ヘッダーのユーザー名クリック時にユーザー切り替えメニューを表示
- 現在のユーザー以外のログイン済みユーザーをリスト表示
- 1クリックでユーザーを切り替え可能
- 「別のアカウントでログイン」オプションを追加

## Capabilities

### New Capabilities

- `multi-session`: 複数ユーザーのセッションを同時に保持し、切り替える機能

### Modified Capabilities

- `auth-store`: 複数セッションの管理、アクティブユーザーの切り替えアクションを追加
- `login-ui`: ユーザー切り替えメニュー、別アカウントでのログインUIを追加

## Impact

- **フロントエンド**
  - `packages/frontend/src/stores/authStore.ts`: 複数セッション管理に拡張
  - `packages/frontend/src/components/Header.tsx`: ユーザー切り替えUIの追加
  - `packages/frontend/src/components/LoginDialog.tsx`: 別アカウントログイン対応
- **バックエンド**
  - セッションCookieの扱い変更（複数セッションIDの保持）
  - `GET /me` の拡張または新規エンドポイント追加
- **データモデル**
  - Cookie形式の変更（単一セッションID → 複数セッションIDのリスト）
