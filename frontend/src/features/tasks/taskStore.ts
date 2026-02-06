import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/features/auth/authStore";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task";
import { sampleTasks } from "./sampleData";
import {
	createTaskOnServer,
	deleteTaskOnServer,
	overwriteTasksFromImport,
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
	importSyncError: string | null;
	importSyncing: boolean;
	replaceTaskId: (localId: string, serverId: string) => void;
	addTask: (input: CreateTaskInput) => Task;
	updateTask: (id: string, input: UpdateTaskInput) => void;
	deleteTask: (id: string) => void;
	moveTask: (id: string, direction: "up" | "down") => void;
	getTaskById: (id: string) => Task | undefined;
	getCompletedByDate: () => CompletedGroup[];
	getAncestorIds: (taskIds: string[]) => Set<string>;
	exportTasks: () => string;
	importTasks: (tasks: Task[]) => void;
	retryImportSync: () => Promise<void>;
	clearImportSyncError: () => void;
	syncFromServer: (tasks: Task[]) => void;
	toggleCollapse: (id: string) => void;
	collapseAll: (ids: string[]) => void;
	expandAll: () => void;
}

function isLoggedIn(): boolean {
	return useAuthStore.getState().username !== null;
}

const taskIdAliasMap = new Map<string, string>();

function resolveTaskId(id: string): string {
	let current = id;
	const visited = new Set<string>();

	while (taskIdAliasMap.has(current) && !visited.has(current)) {
		visited.add(current);
		current = taskIdAliasMap.get(current)!;
	}

	return current;
}

function rememberTaskIdAlias(localId: string, serverId: string): void {
	taskIdAliasMap.set(localId, serverId);

	for (const [from, to] of taskIdAliasMap.entries()) {
		if (to === localId) {
			taskIdAliasMap.set(from, serverId);
		}
	}
}

export const useTaskStore = create<TaskState>()(
	persist(
		(set, get) => ({
			tasks: sampleTasks,
			collapsedIds: [],
			importSyncError: null,
			importSyncing: false,

			replaceTaskId: (localId, serverId) => {
				if (localId === serverId) return;

				set((state) => ({
					tasks: state.tasks.map((task) => {
						if (task.id === localId) {
							return { ...task, id: serverId };
						}
						if (task.parentId === localId) {
							return { ...task, parentId: serverId };
						}
						return task;
					}),
					collapsedIds: Array.from(
						new Set(
							state.collapsedIds.map((id) => (id === localId ? serverId : id)),
						),
					),
				}));

				rememberTaskIdAlias(localId, serverId);
			},

			addTask: (input) => {
				const resolvedParentId = input.parentId
					? resolveTaskId(input.parentId)
					: undefined;
				const siblings = get().tasks.filter(
					(t) => t.parentId === resolvedParentId,
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
					parentId: resolvedParentId,
				};

				set((state) => ({
					tasks: [...state.tasks, newTask],
				}));

				if (isLoggedIn()) {
					void createTaskOnServer(newTask)
						.then((created) => {
							get().replaceTaskId(newTask.id, created.id);
						})
						.catch((error) => {
							console.error("タスク作成後の ID 同期に失敗しました", {
								error,
								localId: newTask.id,
							});
						});
				}

				return newTask;
			},

			updateTask: (id, input) => {
				const resolvedId = resolveTaskId(id);
				if (!get().tasks.some((task) => task.id === resolvedId)) {
					return;
				}
				let serverInput = { ...input };

				set((state) => ({
					tasks: state.tasks.map((task) => {
						if (task.id !== resolvedId) return task;

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
					void updateTaskOnServer(resolvedId, serverInput);
				}
			},

			deleteTask: (id) => {
				const resolvedId = resolveTaskId(id);
				if (!get().tasks.some((task) => task.id === resolvedId)) {
					return;
				}
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
						resolvedId,
						...collectDescendantIds(resolvedId, state.tasks),
					]);
					return {
						tasks: state.tasks.filter((task) => !idsToDelete.has(task.id)),
						collapsedIds: state.collapsedIds.filter(
							(cid) => !idsToDelete.has(cid),
						),
					};
				});

				if (isLoggedIn()) {
					void deleteTaskOnServer(resolvedId);
				}
			},

			moveTask: (id, direction) => {
				const resolvedId = resolveTaskId(id);
				const tasks = get().tasks;
				const target = tasks.find((t) => t.id === resolvedId);
				if (!target) return;

				const siblings = tasks
					.filter((t) => t.parentId === target.parentId)
					.sort((a, b) => b.sortOrder - a.sortOrder);

				const idx = siblings.findIndex((t) => t.id === resolvedId);
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
					void reorderTaskOnServer(target.id, swapTarget.sortOrder);
					void reorderTaskOnServer(swapTarget.id, target.sortOrder);
				}
			},

			getTaskById: (id) => {
				const resolvedId = resolveTaskId(id);
				return get().tasks.find((task) => task.id === resolvedId);
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
				set({ tasks, importSyncError: null });
				if (isLoggedIn()) {
					void get().retryImportSync();
				}
			},

			retryImportSync: async () => {
				if (!isLoggedIn()) {
					return;
				}

				const tasks = get().tasks;
				set({ importSyncing: true, importSyncError: null });

				try {
					const syncedTasks = await overwriteTasksFromImport(tasks);
					set({
						tasks: syncedTasks,
						importSyncing: false,
						importSyncError: null,
					});
				} catch (error) {
					console.error("JSON インポート後のバックエンド同期に失敗しました", {
						error,
						taskCount: tasks.length,
					});
					set({
						importSyncing: false,
						importSyncError:
							"バックエンドとの同期に失敗しました。インポート結果はローカルに保持されています。再試行してください。",
					});
				}
			},

			clearImportSyncError: () => {
				set({ importSyncError: null });
			},

			syncFromServer: (tasks) => {
				taskIdAliasMap.clear();
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
