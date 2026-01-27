import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task";
import { sampleTasks } from "./sampleData";

interface CompletedGroup {
	date: string;
	taskIds: string[];
}

interface TaskState {
	tasks: Task[];
	addTask: (input: CreateTaskInput) => Task;
	updateTask: (id: string, input: UpdateTaskInput) => void;
	deleteTask: (id: string) => void;
	getTaskById: (id: string) => Task | undefined;
	getCompletedByDate: () => CompletedGroup[];
	getAncestorIds: (taskIds: string[]) => Set<string>;
}

export const useTaskStore = create<TaskState>()(
	persist(
		(set, get) => ({
			tasks: sampleTasks,

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
						if (
							input.status &&
							input.status !== "completed" &&
							task.status === "completed"
						) {
							delete updated.completedAt;
						}

						return updated;
					}),
				}));
			},

			deleteTask: (id) => {
				const collectDescendantIds = (
					taskId: string,
					tasks: Task[],
				): string[] => {
					const children = tasks.filter((t) => t.parentId === taskId);
					const childIds = children.map((c) => c.id);
					const descendantIds = children.flatMap((c) =>
						collectDescendantIds(c.id, tasks),
					);
					return [...childIds, ...descendantIds];
				};

				set((state) => {
					const idsToDelete = new Set([
						id,
						...collectDescendantIds(id, state.tasks),
					]);
					return {
						tasks: state.tasks.filter((task) => !idsToDelete.has(task.id)),
					};
				});
			},

			getTaskById: (id) => {
				return get().tasks.find((task) => task.id === id);
			},

			getCompletedByDate: () => {
				const tasks = get().tasks;
				const grouped = new Map<string, string[]>();
				for (const task of tasks) {
					if (task.status === "completed" && task.completedAt) {
						const date = new Date(task.completedAt).toLocaleDateString("sv-SE");
						const ids = grouped.get(date) ?? [];
						ids.push(task.id);
						grouped.set(date, ids);
					}
				}
				return Array.from(grouped.entries())
					.sort(([a], [b]) => b.localeCompare(a))
					.map(([date, taskIds]) => ({ date, taskIds }));
			},

			getAncestorIds: (taskIds) => {
				const tasks = get().tasks;
				const taskMap = new Map<string, Task>();
				for (const t of tasks) {
					taskMap.set(t.id, t);
				}
				const ancestors = new Set<string>();
				for (const id of taskIds) {
					let current = taskMap.get(id);
					while (current?.parentId) {
						if (ancestors.has(current.parentId)) break;
						ancestors.add(current.parentId);
						current = taskMap.get(current.parentId);
					}
				}
				return ancestors;
			},
		}),
		{
			name: "task-tree-storage",
		},
	),
);
