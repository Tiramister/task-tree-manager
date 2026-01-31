import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/features/auth/authStore";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task";
import { sampleTasks } from "./sampleData";
import {
	createTaskOnServer,
	deleteTaskOnServer,
	reorderTaskOnServer,
	updateTaskOnServer,
} from "./taskSyncService";

interface CompletedGroup {
	date: string;
	taskIds: string[];
}

interface TaskState {
	tasks: Task[];
	collapsedIds: string[];
	addTask: (input: CreateTaskInput) => Task;
	updateTask: (id: string, input: UpdateTaskInput) => void;
	deleteTask: (id: string) => void;
	moveTask: (id: string, direction: "up" | "down") => void;
	getTaskById: (id: string) => Task | undefined;
	getCompletedByDate: () => CompletedGroup[];
	getAncestorIds: (taskIds: string[]) => Set<string>;
	exportTasks: () => string;
	importTasks: (tasks: Task[]) => void;
	syncFromServer: (tasks: Task[]) => void;
	toggleCollapse: (id: string) => void;
	collapseAll: (ids: string[]) => void;
	expandAll: () => void;
}

function isLoggedIn(): boolean {
	return useAuthStore.getState().username !== null;
}

export const useTaskStore = create<TaskState>()(
	persist(
		(set, get) => ({
			tasks: sampleTasks,
			collapsedIds: [],

			addTask: (input) => {
				const siblings = get().tasks.filter(
					(t) => t.parentId === input.parentId,
				);
				const maxSortOrder =
					siblings.length > 0
						? Math.max(...siblings.map((t) => t.sortOrder))
						: -1;

				const newTask: Task = {
					id: crypto.randomUUID(),
					title: input.title,
					status: "not_started",
					createdAt: new Date().toISOString(),
					sortOrder: maxSortOrder + 1,
					description: input.description,
					dueDate: input.dueDate,
					notes: input.notes,
					parentId: input.parentId,
				};

				set((state) => ({
					tasks: [...state.tasks, newTask],
				}));

				if (isLoggedIn()) {
					createTaskOnServer(newTask);
				}

				return newTask;
			},

			updateTask: (id, input) => {
				let serverInput = { ...input };

				set((state) => ({
					tasks: state.tasks.map((task) => {
						if (task.id !== id) return task;

						const updated = { ...task, ...input };

						// completedAt が明示的に指定されていない場合のみ自動設定
						if (!("completedAt" in input)) {
							// status が completed に変わったら completedAt を設定
							if (input.status === "completed" && task.status !== "completed") {
								updated.completedAt = new Date().toISOString();
								serverInput = {
									...serverInput,
									completedAt: updated.completedAt,
								};
							}

							// status が completed から他に変わったら completedAt を削除
							if (
								input.status &&
								input.status !== "completed" &&
								task.status === "completed"
							) {
								delete updated.completedAt;
							}
						}

						return updated;
					}),
				}));

				if (isLoggedIn()) {
					updateTaskOnServer(id, serverInput);
				}
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
						collapsedIds: state.collapsedIds.filter(
							(cid) => !idsToDelete.has(cid),
						),
					};
				});

				if (isLoggedIn()) {
					deleteTaskOnServer(id);
				}
			},

			moveTask: (id, direction) => {
				const tasks = get().tasks;
				const target = tasks.find((t) => t.id === id);
				if (!target) return;

				const siblings = tasks
					.filter((t) => t.parentId === target.parentId)
					.sort((a, b) => b.sortOrder - a.sortOrder);

				const idx = siblings.findIndex((t) => t.id === id);
				const swapIdx = direction === "up" ? idx - 1 : idx + 1;
				if (swapIdx < 0 || swapIdx >= siblings.length) return;

				const swapTarget = siblings[swapIdx];
				set((state) => ({
					tasks: state.tasks.map((t) => {
						if (t.id === target.id)
							return { ...t, sortOrder: swapTarget.sortOrder };
						if (t.id === swapTarget.id)
							return { ...t, sortOrder: target.sortOrder };
						return t;
					}),
				}));

				if (isLoggedIn()) {
					reorderTaskOnServer(target.id, swapTarget.sortOrder);
					reorderTaskOnServer(swapTarget.id, target.sortOrder);
				}
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

			exportTasks: () => {
				return JSON.stringify(get().tasks);
			},

			importTasks: (tasks) => {
				set({ tasks });
			},

			syncFromServer: (tasks) => {
				set({ tasks, collapsedIds: [] });
			},

			toggleCollapse: (id) => {
				set((state) => {
					const index = state.collapsedIds.indexOf(id);
					if (index >= 0) {
						return {
							collapsedIds: state.collapsedIds.filter((cid) => cid !== id),
						};
					}
					return { collapsedIds: [...state.collapsedIds, id] };
				});
			},

			collapseAll: (ids) => {
				set({ collapsedIds: ids });
			},

			expandAll: () => {
				set({ collapsedIds: [] });
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
