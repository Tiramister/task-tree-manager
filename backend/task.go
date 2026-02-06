package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type task struct {
	ID          string     `json:"id"`
	UserID      string     `json:"user_id"`
	Title       string     `json:"title"`
	Status      string     `json:"status"`
	SortOrder   int        `json:"sort_order"`
	Description *string    `json:"description"`
	DueDate     *time.Time `json:"due_date"`
	CompletedAt *time.Time `json:"completed_at"`
	Notes       *string    `json:"notes"`
	ParentID    *string    `json:"parent_id"`
	CreatedAt   time.Time  `json:"created_at"`
}

func handleGetTasks(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := getUserID(r)

		rows, err := pool.Query(r.Context(),
			`SELECT id, user_id, title, status, sort_order, description, due_date, completed_at, notes, parent_id, created_at
			 FROM tasks WHERE user_id = $1 ORDER BY sort_order`, userID,
		)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		tasks := []task{}
		for rows.Next() {
			var t task
			if err := rows.Scan(&t.ID, &t.UserID, &t.Title, &t.Status, &t.SortOrder, &t.Description, &t.DueDate, &t.CompletedAt, &t.Notes, &t.ParentID, &t.CreatedAt); err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
			tasks = append(tasks, t)
		}
		if err := rows.Err(); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(tasks)
	}
}

type createTaskRequest struct {
	Title       string  `json:"title"`
	Description *string `json:"description"`
	DueDate     *string `json:"due_date"`
	Notes       *string `json:"notes"`
	ParentID    *string `json:"parent_id"`
	SortOrder   *int    `json:"sort_order"`
	Status      *string `json:"status"`
	CompletedAt *string `json:"completed_at"`
	CreatedAt   *string `json:"created_at"`
}

func handleCreateTask(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := getUserID(r)

		var req createTaskRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}
		if req.Title == "" {
			http.Error(w, "Bad Request: title is required", http.StatusBadRequest)
			return
		}

		// status のバリデーション
		if req.Status != nil {
			switch *req.Status {
			case "not_started", "in_progress", "waiting", "completed":
			default:
				http.Error(w, "Bad Request: invalid status", http.StatusBadRequest)
				return
			}
		}

		// parent_id の所有者検証
		if req.ParentID != nil {
			var ownerID string
			err := pool.QueryRow(r.Context(),
				"SELECT user_id FROM tasks WHERE id = $1", *req.ParentID,
			).Scan(&ownerID)
			if err != nil || ownerID != userID {
				http.Error(w, "Bad Request: invalid parent_id", http.StatusBadRequest)
				return
			}
		}

		// sort_order の自動計算
		sortOrder := 0
		if req.SortOrder != nil {
			sortOrder = *req.SortOrder
		} else {
			var maxOrder *int
			if req.ParentID != nil {
				pool.QueryRow(r.Context(),
					"SELECT MAX(sort_order) FROM tasks WHERE user_id = $1 AND parent_id = $2", userID, *req.ParentID,
				).Scan(&maxOrder)
			} else {
				pool.QueryRow(r.Context(),
					"SELECT MAX(sort_order) FROM tasks WHERE user_id = $1 AND parent_id IS NULL", userID,
				).Scan(&maxOrder)
			}
			if maxOrder != nil {
				sortOrder = *maxOrder + 1
			}
		}

		// due_date のパース
		var dueDate *time.Time
		if req.DueDate != nil {
			parsed, err := time.Parse(time.RFC3339, *req.DueDate)
			if err != nil {
				http.Error(w, "Bad Request: invalid due_date format", http.StatusBadRequest)
				return
			}
			dueDate = &parsed
		}

		// completed_at のパース
		var completedAt *time.Time
		if req.CompletedAt != nil {
			parsed, err := time.Parse(time.RFC3339, *req.CompletedAt)
			if err != nil {
				http.Error(w, "Bad Request: invalid completed_at format", http.StatusBadRequest)
				return
			}
			completedAt = &parsed
		}

		// created_at のパース
		var createdAt *time.Time
		if req.CreatedAt != nil {
			parsed, err := time.Parse(time.RFC3339, *req.CreatedAt)
			if err != nil {
				http.Error(w, "Bad Request: invalid created_at format", http.StatusBadRequest)
				return
			}
			createdAt = &parsed
		}

		// status のデフォルト値
		status := "not_started"
		if req.Status != nil {
			status = *req.Status
		}

		var t task
		err := pool.QueryRow(r.Context(),
			`INSERT INTO tasks (user_id, title, description, due_date, notes, parent_id, sort_order, status, completed_at, created_at)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, now()))
			 RETURNING id, user_id, title, status, sort_order, description, due_date, completed_at, notes, parent_id, created_at`,
			userID, req.Title, req.Description, dueDate, req.Notes, req.ParentID, sortOrder, status, completedAt, createdAt,
		).Scan(&t.ID, &t.UserID, &t.Title, &t.Status, &t.SortOrder, &t.Description, &t.DueDate, &t.CompletedAt, &t.Notes, &t.ParentID, &t.CreatedAt)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(t)
	}
}

type updateTaskRequest struct {
	Title       *string          `json:"title"`
	Description *json.RawMessage `json:"description"`
	DueDate     *json.RawMessage `json:"due_date"`
	Notes       *json.RawMessage `json:"notes"`
	Status      *string          `json:"status"`
	CompletedAt *json.RawMessage `json:"completed_at"`
}

func decodeNullableString(raw *json.RawMessage) (present bool, value *string, err error) {
	if raw == nil {
		return false, nil, nil
	}

	trimmed := bytes.TrimSpace(*raw)
	if bytes.Equal(trimmed, []byte("null")) {
		return true, nil, nil
	}

	var decoded string
	if err := json.Unmarshal(trimmed, &decoded); err != nil {
		return true, nil, err
	}

	return true, &decoded, nil
}

func decodeNullableTime(raw *json.RawMessage) (present bool, value *time.Time, err error) {
	if raw == nil {
		return false, nil, nil
	}

	trimmed := bytes.TrimSpace(*raw)
	if bytes.Equal(trimmed, []byte("null")) {
		return true, nil, nil
	}

	var decoded string
	if err := json.Unmarshal(trimmed, &decoded); err != nil {
		return true, nil, err
	}

	parsed, err := time.Parse(time.RFC3339, decoded)
	if err != nil {
		return true, nil, err
	}

	return true, &parsed, nil
}

func handleUpdateTask(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := getUserID(r)
		taskID := r.PathValue("id")

		var req updateTaskRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		// 対象タスクの所有者検証
		var existing task
		err := pool.QueryRow(r.Context(),
			`SELECT id, user_id, title, status, sort_order, description, due_date, completed_at, notes, parent_id, created_at
			 FROM tasks WHERE id = $1 AND user_id = $2`, taskID, userID,
		).Scan(&existing.ID, &existing.UserID, &existing.Title, &existing.Status, &existing.SortOrder, &existing.Description, &existing.DueDate, &existing.CompletedAt, &existing.Notes, &existing.ParentID, &existing.CreatedAt)
		if err != nil {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		// 部分更新: リクエストに含まれるフィールドのみ更新
		if req.Title != nil {
			existing.Title = *req.Title
		}
		if present, value, err := decodeNullableString(req.Description); err != nil {
			http.Error(w, "Bad Request: invalid description format", http.StatusBadRequest)
			return
		} else if present {
			existing.Description = value
		}
		if present, value, err := decodeNullableString(req.Notes); err != nil {
			http.Error(w, "Bad Request: invalid notes format", http.StatusBadRequest)
			return
		} else if present {
			existing.Notes = value
		}
		if req.Status != nil {
			existing.Status = *req.Status
		}
		if present, value, err := decodeNullableTime(req.DueDate); err != nil {
			http.Error(w, "Bad Request: invalid due_date format", http.StatusBadRequest)
			return
		} else if present {
			existing.DueDate = value
		}
		if present, value, err := decodeNullableTime(req.CompletedAt); err != nil {
			http.Error(w, "Bad Request: invalid completed_at format", http.StatusBadRequest)
			return
		} else if present {
			existing.CompletedAt = value
		}

		var t task
		err = pool.QueryRow(r.Context(),
			`UPDATE tasks SET title = $1, description = $2, due_date = $3, notes = $4, status = $5, completed_at = $6
			 WHERE id = $7 AND user_id = $8
			 RETURNING id, user_id, title, status, sort_order, description, due_date, completed_at, notes, parent_id, created_at`,
			existing.Title, existing.Description, existing.DueDate, existing.Notes, existing.Status, existing.CompletedAt, taskID, userID,
		).Scan(&t.ID, &t.UserID, &t.Title, &t.Status, &t.SortOrder, &t.Description, &t.DueDate, &t.CompletedAt, &t.Notes, &t.ParentID, &t.CreatedAt)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(t)
	}
}

func handleDeleteTask(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := getUserID(r)
		taskID := r.PathValue("id")

		result, err := pool.Exec(r.Context(),
			"DELETE FROM tasks WHERE id = $1 AND user_id = $2", taskID, userID,
		)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if result.RowsAffected() == 0 {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

type reorderTaskRequest struct {
	SortOrder int `json:"sort_order"`
}

func handleReorderTask(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := getUserID(r)
		taskID := r.PathValue("id")

		var req reorderTaskRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		var t task
		err := pool.QueryRow(r.Context(),
			`UPDATE tasks SET sort_order = $1
			 WHERE id = $2 AND user_id = $3
			 RETURNING id, user_id, title, status, sort_order, description, due_date, completed_at, notes, parent_id, created_at`,
			req.SortOrder, taskID, userID,
		).Scan(&t.ID, &t.UserID, &t.Title, &t.Status, &t.SortOrder, &t.Description, &t.DueDate, &t.CompletedAt, &t.Notes, &t.ParentID, &t.CreatedAt)
		if err != nil {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(t)
	}
}
