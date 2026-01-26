export type TaskStatus = "not_started" | "in_progress" | "waiting" | "completed";

export interface Task {
  // 必須フィールド
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string; // ISO 8601

  // オプショナルフィールド
  description?: string;
  dueDate?: string; // ISO 8601
  completedAt?: string; // ISO 8601
  notes?: string;
  parentId?: string;
}

export type CreateTaskInput = Pick<Task, "title"> &
  Partial<Pick<Task, "description" | "dueDate" | "notes" | "parentId">>;

export type UpdateTaskInput = Partial<
  Pick<Task, "title" | "description" | "dueDate" | "notes" | "status">
>;
