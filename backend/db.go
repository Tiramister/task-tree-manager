package main

import (
	"context"
	"embed"
	"errors"
	"fmt"
	"net/url"
	"os"
	"time"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/jackc/pgx/v5/pgxpool"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func databaseURL() string {
	host := getEnvOrDefault("DB_HOST", "localhost")
	port := getEnvOrDefault("DB_PORT", "5432")
	user := getEnvOrDefault("DB_USER", "postgres")
	password := os.Getenv("DB_PASSWORD")
	dbname := getEnvOrDefault("DB_NAME", "task_tree_manager")
	sslmode := getEnvOrDefault("DB_SSLMODE", "disable")

	u := &url.URL{
		Scheme:   "postgres",
		User:     url.UserPassword(user, password),
		Host:     fmt.Sprintf("%s:%s", host, port),
		Path:     dbname,
		RawQuery: fmt.Sprintf("sslmode=%s", sslmode),
	}
	return u.String()
}

func connectDB(ctx context.Context) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, databaseURL())
	if err != nil {
		return nil, fmt.Errorf("create connection pool: %w", err)
	}

	const maxRetries = 10
	for i := range maxRetries {
		if err := pool.Ping(ctx); err == nil {
			fmt.Println("Connected to database")
			return pool, nil
		} else {
			fmt.Printf("Waiting for database... (%d/%d): %v\n", i+1, maxRetries, err)
		}
		time.Sleep(time.Second)
	}

	pool.Close()
	return nil, fmt.Errorf("database not ready after %d retries", maxRetries)
}

func runMigrations() error {
	source, err := iofs.New(migrationsFS, "migrations")
	if err != nil {
		return fmt.Errorf("create migration source: %w", err)
	}

	m, err := migrate.NewWithSourceInstance("iofs", source, databaseURL())
	if err != nil {
		return fmt.Errorf("create migrate instance: %w", err)
	}
	defer m.Close()

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return fmt.Errorf("run migrations: %w", err)
	}

	fmt.Println("Migrations complete")
	return nil
}
