# ビルドステージ
FROM node:24-alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY package.json package-lock.json ./
RUN npm ci

# ソースコードのコピーとビルド
COPY . .
RUN npm run build

# 本番ステージ
FROM node:24-alpine AS production

WORKDIR /app

# serve パッケージをグローバルインストール
RUN npm install -g serve

# ビルド成果物をコピー
COPY --from=builder /app/dist ./dist

# 非 root ユーザーで実行
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
