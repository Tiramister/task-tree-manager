package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"sort"
)

type task struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Status      string  `json:"status"`
	CreatedAt   string  `json:"createdAt"`
	SortOrder   int     `json:"sortOrder"`
	Description *string `json:"description,omitempty"`
	DueDate     *string `json:"dueDate,omitempty"`
	CompletedAt *string `json:"completedAt,omitempty"`
	Notes       *string `json:"notes,omitempty"`
	ParentID    *string `json:"parentId,omitempty"`
	IsCollapsed *bool   `json:"isCollapsed,omitempty"`
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, "Error:", err)
		os.Exit(1)
	}
}

func run() error {
	input, err := io.ReadAll(os.Stdin)
	if err != nil {
		return fmt.Errorf("failed to read stdin: %w", err)
	}

	var rawData any
	if err := json.Unmarshal(input, &rawData); err != nil {
		return fmt.Errorf("invalid JSON: %w", err)
	}

	rawArray, ok := rawData.([]any)
	if !ok {
		return fmt.Errorf("input must be a JSON array")
	}

	var tasks []task
	if err := json.Unmarshal(input, &tasks); err != nil {
		return fmt.Errorf("failed to parse tasks: %w", err)
	}

	originalTasks := make([]task, len(tasks))
	copy(originalTasks, tasks)

	fixSortOrder(tasks)

	if err := verifySortOrderOnly(originalTasks, tasks); err != nil {
		return err
	}

	output, err := json.MarshalIndent(tasks, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal output: %w", err)
	}

	// 空配列の場合は "[]" を出力
	if len(rawArray) == 0 {
		fmt.Println("[]")
		return nil
	}

	fmt.Println(string(output))
	return nil
}

func fixSortOrder(tasks []task) {
	groups := make(map[string][]int)

	for i, t := range tasks {
		key := ""
		if t.ParentID != nil {
			key = *t.ParentID
		}
		groups[key] = append(groups[key], i)
	}

	for _, indices := range groups {
		sort.SliceStable(indices, func(i, j int) bool {
			return tasks[indices[i]].SortOrder < tasks[indices[j]].SortOrder
		})

		for newOrder, idx := range indices {
			tasks[idx].SortOrder = newOrder
		}
	}
}

func verifySortOrderOnly(original, modified []task) error {
	if len(original) != len(modified) {
		return fmt.Errorf("verification failed: task count changed from %d to %d", len(original), len(modified))
	}

	originalMap := make(map[string]task)
	for _, t := range original {
		originalMap[t.ID] = t
	}

	for _, m := range modified {
		o, exists := originalMap[m.ID]
		if !exists {
			return fmt.Errorf("verification failed: task %s not found in original", m.ID)
		}

		if o.Title != m.Title {
			return fmt.Errorf("verification failed: task %s title changed", m.ID)
		}
		if o.Status != m.Status {
			return fmt.Errorf("verification failed: task %s status changed", m.ID)
		}
		if o.CreatedAt != m.CreatedAt {
			return fmt.Errorf("verification failed: task %s createdAt changed", m.ID)
		}
		if !ptrEqual(o.Description, m.Description) {
			return fmt.Errorf("verification failed: task %s description changed", m.ID)
		}
		if !ptrEqual(o.DueDate, m.DueDate) {
			return fmt.Errorf("verification failed: task %s dueDate changed", m.ID)
		}
		if !ptrEqual(o.CompletedAt, m.CompletedAt) {
			return fmt.Errorf("verification failed: task %s completedAt changed", m.ID)
		}
		if !ptrEqual(o.Notes, m.Notes) {
			return fmt.Errorf("verification failed: task %s notes changed", m.ID)
		}
		if !ptrEqual(o.ParentID, m.ParentID) {
			return fmt.Errorf("verification failed: task %s parentId changed", m.ID)
		}
		if !boolPtrEqual(o.IsCollapsed, m.IsCollapsed) {
			return fmt.Errorf("verification failed: task %s isCollapsed changed", m.ID)
		}
	}

	return nil
}

func ptrEqual(a, b *string) bool {
	if a == nil && b == nil {
		return true
	}
	if a == nil || b == nil {
		return false
	}
	return *a == *b
}

func boolPtrEqual(a, b *bool) bool {
	if a == nil && b == nil {
		return true
	}
	if a == nil || b == nil {
		return false
	}
	return *a == *b
}
