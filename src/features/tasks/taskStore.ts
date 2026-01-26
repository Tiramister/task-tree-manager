import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/types/task";

interface TaskState {
  tasks: Task[];
  addTask: (input: CreateTaskInput) => Task;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (input) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title: input.title,
          status: "not_started",
          createdAt: new Date().toISOString(),
          description: input.description,
          dueDate: input.dueDate,
          notes: input.notes,
          parentId: input.parentId,
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        return newTask;
      },

      updateTask: (id, input) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;

            const updated = { ...task, ...input };

            // status が completed に変わったら completedAt を設定
            if (input.status === "completed" && task.status !== "completed") {
              updated.completedAt = new Date().toISOString();
            }

            // status が completed から他に変わったら completedAt を削除
            if (input.status && input.status !== "completed" && task.status === "completed") {
              delete updated.completedAt;
            }

            return updated;
          }),
        }));
      },

      deleteTask: (id) => {
        const collectDescendantIds = (taskId: string, tasks: Task[]): string[] => {
          const children = tasks.filter((t) => t.parentId === taskId);
          const childIds = children.map((c) => c.id);
          const descendantIds = children.flatMap((c) => collectDescendantIds(c.id, tasks));
          return [...childIds, ...descendantIds];
        };

        set((state) => {
          const idsToDelete = new Set([id, ...collectDescendantIds(id, state.tasks)]);
          return {
            tasks: state.tasks.filter((task) => !idsToDelete.has(task.id)),
          };
        });
      },

      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id);
      },
    }),
    {
      name: "task-tree-storage",
    }
  )
);
