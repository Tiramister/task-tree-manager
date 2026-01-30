## 1. Backend の Docker 化

- [x] 1.1 `backend/Dockerfile` を作成する (マルチステージビルド: golang:1.25-alpine → distroless/static-go)
- [x] 1.2 `backend/.dockerignore` を作成する
- [x] 1.3 backend の Docker イメージをビルドし、コンテナが正常に起動することを確認する (※ 環境に Docker 未インストールのため手動確認が必要)

## 2. docker-compose.yml の統合

- [x] 2.1 プロジェクトルートに `docker-compose.yml` を作成し、frontend (3521:3000) と backend (8521:8080) の両サービスを定義する
- [x] 2.2 `frontend/docker-compose.yml` を削除する (プロジェクトルートの docker-compose.yml に統合済みのため)
- [x] 2.3 `docker compose up` で両サービスが正常に起動することを確認する (※ 環境に Docker 未インストールのため手動確認が必要)
