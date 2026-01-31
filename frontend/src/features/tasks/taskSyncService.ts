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
		...(task.description != null && { description: task.description }),
		...(task.dueDate != null && { due_date: task.dueDate }),
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
	return {
		...(input.title != null && { title: input.title }),
		...(input.description != null && { description: input.description }),
		...(input.dueDate != null && { due_date: input.dueDate }),
		...(input.notes != null && { notes: input.notes }),
		...(input.status != null && { status: input.status }),
		...(input.completedAt != null && { completed_at: input.completedAt }),
	};
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

export async function createTaskOnServer(task: Task): Promise<void> {
	await apiFetch("/tasks", {
		method: "POST",
		body: JSON.stringify(localTaskToCreateRequest(task)),
	});
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

export async function uploadLocalTasks(tasks: Task[]): Promise<void> {
	// 親タスク（parentId なし）から先に保存する
	const idMap = new Map<string, string>();

	// トポロジカル順にソート: 親がないものを先に、親があるものは親が処理済みになるまで待つ
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

		// 循環参照防止
		if (batch.length === 0) break;

		sorted.push(...batch);
		for (const t of batch) {
			processed.add(t.id);
		}
		remaining.length = 0;
		remaining.push(...nextRemaining);
	}

	for (const task of sorted) {
		const parentIdOverride = task.parentId
			? idMap.get(task.parentId)
			: undefined;

		const res = await apiFetch("/tasks", {
			method: "POST",
			body: JSON.stringify(localTaskToCreateRequest(task, parentIdOverride)),
		});

		if (res.ok) {
			const created: ServerTask = await res.json();
			idMap.set(task.id, created.id);
		}
	}
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
