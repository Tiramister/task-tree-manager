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
	mux.HandleFunc("POST /switch-session", handleSwitchSession(pool))
	mux.HandleFunc("GET /me", handleMe(pool))

	mux.HandleFunc("GET /tasks", handleGetTasks(pool))
	mux.HandleFunc("POST /tasks", handleCreateTask(pool))
	mux.HandleFunc("PATCH /tasks/{id}", handleUpdateTask(pool))
	mux.HandleFunc("DELETE /tasks/{id}", handleDeleteTask(pool))
	mux.HandleFunc("PATCH /tasks/{id}/reorder", handleReorderTask(pool))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, world!")
	})

	// CORS・認証ミドルウェアを適用
	handler := corsMiddleware(authMiddleware(pool, mux))

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
