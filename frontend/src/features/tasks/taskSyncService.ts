import type { Task } from "@/types/task";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface ServerTask {
	id: string;
	user_id: string;
	title: string;
	status: string;
	sort_order: number;
	description: string | null;
	due_date: string | null;
	completed_at: string | null;
	notes: string | null;
	parent_id: string | null;
	created_at: string;
}

function serverTaskToLocal(st: ServerTask): Task {
	return {
		id: st.id,
		title: st.title,
		status: st.status as Task["status"],
		sortOrder: st.sort_order,
		createdAt: st.created_at,
		...(st.description != null && { description: st.description }),
		...(st.due_date != null && { dueDate: st.due_date }),
		...(st.completed_at != null && { completedAt: st.completed_at }),
		...(st.notes != null && { notes: st.notes }),
		...(st.parent_id != null && { parentId: st.parent_id }),
	};
}

function localTaskToCreateRequest(task: Task, parentIdOverride?: string) {
	return {
		title: task.title,
		sort_order: task.sortOrder,
		status: task.status,
		created_at: task.createdAt,
		...(task.description != null && { description: task.description }),
		...(task.dueDate != null && { due_date: task.dueDate }),
		...(task.completedAt != null && { completed_at: task.completedAt }),
		...(task.notes != null && { notes: task.notes }),
		...((parentIdOverride ?? task.parentId) != null && {
			parent_id: parentIdOverride ?? task.parentId,
		}),
	};
}

function localTaskToUpdateRequest(
	input: Partial<
		Pick<
			Task,
			"title" | "description" | "dueDate" | "notes" | "status" | "completedAt"
		>
	>,
) {
	const request: Record<string, string | null> = {};

	if ("title" in input && input.title !== undefined) {
		request.title = input.title;
	}
	if ("status" in input && input.status !== undefined) {
		request.status = input.status;
	}
	if ("description" in input) {
		request.description = input.description ?? null;
	}
	if ("dueDate" in input) {
		request.due_date = input.dueDate ?? null;
	}
	if ("notes" in input) {
		request.notes = input.notes ?? null;
	}
	if ("completedAt" in input) {
		request.completed_at = input.completedAt ?? null;
	}

	return request;
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
	return fetch(`${API_BASE_URL}${path}`, {
		...init,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...init?.headers,
		},
	});
}

export async function fetchTasks(): Promise<Task[]> {
	const res = await apiFetch("/tasks");
	if (!res.ok) {
		throw new Error("タスクの取得に失敗しました");
	}
	const data: ServerTask[] = await res.json();
	return data.map(serverTaskToLocal);
}

export async function createTaskOnServer(task: Task): Promise<{ id: string }> {
	const res = await apiFetch("/tasks", {
		method: "POST",
		body: JSON.stringify(localTaskToCreateRequest(task)),
	});

	if (!res.ok) {
		throw new Error(
			`タスク作成に失敗しました (status: ${res.status} ${res.statusText})`,
		);
	}

	const created: ServerTask = await res.json();
	return { id: created.id };
}

export async function updateTaskOnServer(
	id: string,
	input: Partial<
		Pick<
			Task,
			"title" | "description" | "dueDate" | "notes" | "status" | "completedAt"
		>
	>,
): Promise<void> {
	await apiFetch(`/tasks/${id}`, {
		method: "PATCH",
		body: JSON.stringify(localTaskToUpdateRequest(input)),
	});
}

export async function deleteTaskOnServer(id: string): Promise<void> {
	await apiFetch(`/tasks/${id}`, {
		method: "DELETE",
	});
}

export async function reorderTaskOnServer(
	id: string,
	sortOrder: number,
): Promise<void> {
	await apiFetch(`/tasks/${id}/reorder`, {
		method: "PATCH",
		body: JSON.stringify({ sort_order: sortOrder }),
	});
}

function orderTasksForCreation(tasks: Task[]): Task[] {
	const sorted: Task[] = [];
	const remaining = [...tasks];
	const processed = new Set<string>();

	while (remaining.length > 0) {
		const batch: Task[] = [];
		const nextRemaining: Task[] = [];

		for (const task of remaining) {
			if (!task.parentId || processed.has(task.parentId)) {
				batch.push(task);
			} else {
				nextRemaining.push(task);
			}
		}

		if (batch.length === 0) {
			throw new Error("親子関係を解決できないタスクがあるため同期できません");
		}

		sorted.push(...batch);
		for (const t of batch) {
			processed.add(t.id);
		}
		remaining.length = 0;
		remaining.push(...nextRemaining);
	}

	return sorted;
}

function orderTasksForDeletion(tasks: Task[]): Task[] {
	const sorted: Task[] = [];
	const remaining = [...tasks];

	while (remaining.length > 0) {
		const leaves = remaining.filter(
			(task) => !remaining.some((candidate) => candidate.parentId === task.id),
		);

		if (leaves.length === 0) {
			throw new Error("削除順を決定できないタスク構造です");
		}

		sorted.push(...leaves);
		const leafIds = new Set(leaves.map((task) => task.id));
		for (let i = remaining.length - 1; i >= 0; i--) {
			if (leafIds.has(remaining[i].id)) {
				remaining.splice(i, 1);
			}
		}
	}

	return sorted;
}

async function createTasksWithMapping(tasks: Task[]): Promise<void> {
	const idMap = new Map<string, string>();
	const sorted = orderTasksForCreation(tasks);

	for (const task of sorted) {
		const parentIdOverride = task.parentId
			? idMap.get(task.parentId)
			: undefined;
		if (task.parentId && !parentIdOverride) {
			throw new Error("親タスクの ID 変換に失敗しました");
		}

		const res = await apiFetch("/tasks", {
			method: "POST",
			body: JSON.stringify(localTaskToCreateRequest(task, parentIdOverride)),
		});

		if (!res.ok) {
			throw new Error(
				`タスク作成に失敗しました (status: ${res.status} ${res.statusText})`,
			);
		}

		const created: ServerTask = await res.json();
		idMap.set(task.id, created.id);
	}
}

export async function uploadLocalTasks(tasks: Task[]): Promise<void> {
	await createTasksWithMapping(tasks);
}

export async function overwriteTasksFromImport(tasks: Task[]): Promise<Task[]> {
	const remoteTasks = await fetchTasks();
	const deleteOrder = orderTasksForDeletion(remoteTasks);

	for (const task of deleteOrder) {
		const res = await apiFetch(`/tasks/${task.id}`, {
			method: "DELETE",
		});
		if (!res.ok) {
			throw new Error(
				`既存タスク削除に失敗しました (status: ${res.status} ${res.statusText})`,
			);
		}
	}

	await createTasksWithMapping(tasks);
	return fetchTasks();
}

export async function syncOnLogin(
	localTasks: Task[],
): Promise<{ tasks: Task[] } | null> {
	const remoteTasks = await fetchTasks();

	if (remoteTasks.length > 0) {
		// DB にデータがある → DB のデータで上書き
		return { tasks: remoteTasks };
	}

	if (localTasks.length > 0) {
		// DB が空でローカルにデータがある → ローカルデータをアップロード
		await uploadLocalTasks(localTasks);
		const uploaded = await fetchTasks();
		return { tasks: uploaded };
	}

	// 両方空 → 何もしない
	return null;
}
