# ビルドステージ
FROM golang:1.25-alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY go.mod go.sum ./
RUN go mod download

# ソースコードのコピーとビルド
COPY . .
RUN CGO_ENABLED=0 go build -o server .

# 本番ステージ
FROM gcr.io/distroless/static:nonroot

WORKDIR /app

# ビルド成果物をコピー
COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]
