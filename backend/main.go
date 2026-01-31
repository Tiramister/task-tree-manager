package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
)

func main() {
	ctx := context.Background()

	// データベース接続
	pool, err := connectDB(ctx)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer pool.Close()

	// マイグレーション実行
	if err := runMigrations(); err != nil {
		fmt.Fprintf(os.Stderr, "Failed to run migrations: %v\n", err)
		os.Exit(1)
	}

	// ルーティング
	mux := http.NewServeMux()

	mux.HandleFunc("/health", handleHealth(pool))

	mux.HandleFunc("POST /login", handleLogin(pool))
	mux.HandleFunc("POST /logout", handleLogout(pool))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, world!")
	})

	// 認証ミドルウェアを適用
	handler := authMiddleware(pool, mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Listening on :%s\n", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}
