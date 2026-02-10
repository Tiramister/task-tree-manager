package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type contextKey string

const userIDKey contextKey = "userID"

const sessionCookieName = "session_id"
const sessionDuration = 30 * 24 * time.Hour

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := os.Getenv("CORS_ORIGIN")
		if origin == "" {
			next.ServeHTTP(w, r)
			return
		}

		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// authMiddleware は /health と /login 以外のエンドポイントに認証を要求する
func authMiddleware(pool *pgxpool.Pool, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 認証不要のパス
		if r.URL.Path == "/health" ||
			(r.URL.Path == "/login" && r.Method == http.MethodPost) ||
			(r.URL.Path == "/switch-session" && r.Method == http.MethodPost) {
			next.ServeHTTP(w, r)
			return
		}

		cookie, err := r.Cookie(sessionCookieName)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var userID string
		var expiresAt time.Time
		err = pool.QueryRow(r.Context(),
			"SELECT user_id, expires_at FROM sessions WHERE id = $1", cookie.Value,
		).Scan(&userID, &expiresAt)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if time.Now().After(expiresAt) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), userIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func handleLogin(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req loginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}
		if req.Username == "" || req.Password == "" {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		var userID string
		var passwordHash string
		err := pool.QueryRow(r.Context(),
			"SELECT id, password_hash FROM users WHERE username = $1", req.Username,
		).Scan(&userID, &passwordHash)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		sessionID, err := generateSessionID()
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		expiresAt := time.Now().Add(sessionDuration)
		_, err = pool.Exec(r.Context(),
			"INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
			sessionID, userID, expiresAt,
		)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     sessionCookieName,
			Value:    sessionID,
			Path:     "/",
			Expires:  expiresAt,
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
			Secure:   os.Getenv("COOKIE_SECURE") == "true",
		})
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"session_id": sessionID})
	}
}

type switchSessionRequest struct {
	SessionID string `json:"session_id"`
}

func handleSwitchSession(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req switchSessionRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}
		if req.SessionID == "" {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		// セッションが有効かどうかを検証
		var userID string
		var expiresAt time.Time
		err := pool.QueryRow(r.Context(),
			"SELECT user_id, expires_at FROM sessions WHERE id = $1", req.SessionID,
		).Scan(&userID, &expiresAt)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if time.Now().After(expiresAt) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// 新しい HttpOnly Cookie を設定
		http.SetCookie(w, &http.Cookie{
			Name:     sessionCookieName,
			Value:    req.SessionID,
			Path:     "/",
			Expires:  expiresAt,
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
			Secure:   os.Getenv("COOKIE_SECURE") == "true",
		})

		w.WriteHeader(http.StatusOK)
	}
}

func handleLogout(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(sessionCookieName)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		result, err := pool.Exec(r.Context(),
			"DELETE FROM sessions WHERE id = $1", cookie.Value,
		)
		if err != nil || result.RowsAffected() == 0 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     sessionCookieName,
			Value:    "",
			Path:     "/",
			MaxAge:   -1,
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
			Secure:   os.Getenv("COOKIE_SECURE") == "true",
		})
		w.WriteHeader(http.StatusOK)
	}
}

func handleMe(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := getUserID(r)
		if userID == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var username string
		err := pool.QueryRow(r.Context(),
			"SELECT username FROM users WHERE id = $1", userID,
		).Scan(&username)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"username": username})
	}
}

func getUserID(r *http.Request) string {
	if v, ok := r.Context().Value(userIDKey).(string); ok {
		return v
	}
	return ""
}

func generateSessionID() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
