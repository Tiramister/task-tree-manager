import { create } from "zustand";
import { useTaskStore } from "@/features/tasks/taskStore";
import { fetchTasks, syncOnLogin } from "@/features/tasks/taskSyncService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface AuthState {
	username: string | null;
	loading: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
	username: null,
	loading: true,

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

		const meRes = await fetch(`${API_BASE_URL}/me`, {
			credentials: "include",
		});
		if (!meRes.ok) {
			throw new Error("ユーザー情報の取得に失敗しました");
		}
		const data = await meRes.json();
		set({ username: data.username });

		const localTasks = useTaskStore.getState().tasks;
		const result = await syncOnLogin(localTasks);
		if (result) {
			useTaskStore.getState().syncFromServer(result.tasks);
		}
	},

	logout: async () => {
		await fetch(`${API_BASE_URL}/logout`, {
			method: "POST",
			credentials: "include",
		});
		set({ username: null });
	},

	checkAuth: async () => {
		try {
			const res = await fetch(`${API_BASE_URL}/me`, {
				credentials: "include",
			});
			if (res.ok) {
				const data = await res.json();
				set({ username: data.username, loading: false });

				const tasks = await fetchTasks();
				useTaskStore.getState().syncFromServer(tasks);
			} else {
				set({ username: null, loading: false });
			}
		} catch {
			set({ username: null, loading: false });
		}
	},
}));
