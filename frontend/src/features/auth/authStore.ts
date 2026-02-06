import { create } from "zustand";
import { useTaskStore } from "@/features/tasks/taskStore";
import { fetchTasks, syncOnLogin } from "@/features/tasks/taskSyncService";
import {
	type StoredSession,
	addSession,
	getActiveSessionId,
	getSessions,
	removeSession,
	saveActiveSessionId,
} from "./sessionStorage";

async function switchSessionCookie(sessionId: string): Promise<boolean> {
	const res = await fetch(`${API_BASE_URL}/switch-session`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ session_id: sessionId }),
	});
	return res.ok;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface AuthState {
	username: string | null;
	loading: boolean;
	sessions: StoredSession[];
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
	switchUser: (sessionId: string) => Promise<void>;
	handleAuthError: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
	username: null,
	loading: true,
	sessions: getSessions(),

	login: async (username: string, password: string) => {
		const res = await fetch(`${API_BASE_URL}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ username, password }),
		});
		if (!res.ok) {
			throw new Error("ログインに失敗しました");
		}

		const loginData = await res.json();
		const sessionId = loginData.session_id;

		const meRes = await fetch(`${API_BASE_URL}/me`, {
			credentials: "include",
		});
		if (!meRes.ok) {
			throw new Error("ユーザー情報の取得に失敗しました");
		}
		const data = await meRes.json();

		if (sessionId) {
			addSession({ sessionId, username: data.username });
			set({ username: data.username, sessions: getSessions() });
		} else {
			set({ username: data.username });
		}

		const localTasks = useTaskStore.getState().tasks;
		const result = await syncOnLogin(localTasks);
		if (result) {
			useTaskStore.getState().syncFromServer(result.tasks);
		}
	},

	logout: async () => {
		const activeSessionId = getActiveSessionId();

		await fetch(`${API_BASE_URL}/logout`, {
			method: "POST",
			credentials: "include",
		});

		if (activeSessionId) {
			const remainingSessions = removeSession(activeSessionId);
			if (remainingSessions.length > 0) {
				// 他のセッションに切り替え
				const nextSession = remainingSessions[0];
				const switched = await switchSessionCookie(nextSession.sessionId);
				if (switched) {
					saveActiveSessionId(nextSession.sessionId);
					set({ username: nextSession.username, sessions: remainingSessions });

					// タスクを再取得
					const tasks = await fetchTasks();
					useTaskStore.getState().syncFromServer(tasks);
				} else {
					set({ username: null, sessions: [] });
				}
			} else {
				set({ username: null, sessions: [] });
			}
		} else {
			set({ username: null, sessions: [] });
		}
	},

	checkAuth: async () => {
		const sessions = getSessions();
		const activeSessionId = getActiveSessionId();

		if (sessions.length === 0) {
			set({ username: null, loading: false, sessions: [] });
			return;
		}

		// アクティブセッションがあればそれを使用、なければ最初のセッションを使用
		const sessionToUse =
			sessions.find((s) => s.sessionId === activeSessionId) ?? sessions[0];
		const switched = await switchSessionCookie(sessionToUse.sessionId);
		if (!switched) {
			// セッション無効 - 削除して次を試行
			const remainingSessions = removeSession(sessionToUse.sessionId);
			set({ sessions: remainingSessions });

			if (remainingSessions.length > 0) {
				await get().checkAuth();
			} else {
				set({ username: null, loading: false, sessions: [] });
			}
			return;
		}
		saveActiveSessionId(sessionToUse.sessionId);

		try {
			const res = await fetch(`${API_BASE_URL}/me`, {
				credentials: "include",
			});
			if (res.ok) {
				const data = await res.json();
				set({ username: data.username, loading: false, sessions });

				const tasks = await fetchTasks();
				useTaskStore.getState().syncFromServer(tasks);
			} else {
				// セッション無効 - 削除して次を試行
				const remainingSessions = removeSession(sessionToUse.sessionId);
				set({ sessions: remainingSessions });

				if (remainingSessions.length > 0) {
					// 再帰的に次のセッションを試行
					await get().checkAuth();
				} else {
					set({ username: null, loading: false, sessions: [] });
				}
			}
		} catch {
			set({ username: null, loading: false, sessions });
		}
	},

	switchUser: async (sessionId: string) => {
		const sessions = get().sessions;
		const session = sessions.find((s) => s.sessionId === sessionId);
		if (!session) return;

		const switched = await switchSessionCookie(sessionId);
		if (!switched) {
			// セッション無効
			await get().handleAuthError();
			return;
		}
		saveActiveSessionId(sessionId);
		set({ username: session.username });

		// 新しいユーザーのタスクを取得
		try {
			const tasks = await fetchTasks();
			useTaskStore.getState().syncFromServer(tasks);
		} catch {
			// 401の場合はhandleAuthErrorで処理される
		}
	},

	handleAuthError: async () => {
		const activeSessionId = getActiveSessionId();
		if (activeSessionId) {
			const remainingSessions = removeSession(activeSessionId);
			if (remainingSessions.length > 0) {
				const nextSession = remainingSessions[0];
				const switched = await switchSessionCookie(nextSession.sessionId);
				if (switched) {
					saveActiveSessionId(nextSession.sessionId);
					set({ username: nextSession.username, sessions: remainingSessions });
				} else {
					set({ username: null, sessions: [] });
				}
			} else {
				set({ username: null, sessions: [] });
			}
		} else {
			set({ username: null, sessions: [] });
		}
	},
}));
