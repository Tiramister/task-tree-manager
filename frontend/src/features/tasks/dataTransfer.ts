import type { Task } from "@/types/task";

const REQUIRED_FIELDS: (keyof Task)[] = ["id", "title", "status", "createdAt"];

export function validateTasksData(data: unknown): Task[] {
	if (!Array.isArray(data)) {
		throw new Error("データはタスクの配列である必要があります。");
	}

	for (let i = 0; i < data.length; i++) {
		const item = data[i];
		if (typeof item !== "object" || item === null) {
			throw new Error(`タスク[${i}] がオブジェクトではありません。`);
		}
		for (const field of REQUIRED_FIELDS) {
			if (!(field in item)) {
				throw new Error(
					`タスク[${i}] に必須フィールド "${field}" がありません。`,
				);
			}
		}
	}

	return data as Task[];
}

export function exportToFile(jsonString: string): void {
	const now = new Date();
	const pad = (n: number) => String(n).padStart(2, "0");
	const timestamp = [
		now.getFullYear(),
		pad(now.getMonth() + 1),
		pad(now.getDate()),
		"-",
		pad(now.getHours()),
		pad(now.getMinutes()),
		pad(now.getSeconds()),
	].join("");
	const filename = `tasks-${timestamp}.json`;

	const blob = new Blob([jsonString], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export function importFromFile(onImport: (tasks: Task[]) => void): void {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".json";
	input.onchange = () => {
		const file = input.files?.[0];
		if (!file) return;

		if (
			!window.confirm(
				"インポートすると既存のタスクデータがすべて置き換えられます。続行しますか？",
			)
		) {
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			try {
				const parsed: unknown = JSON.parse(reader.result as string);
				const tasks = validateTasksData(parsed);
				onImport(tasks);
			} catch (e) {
				alert(
					e instanceof Error
						? `インポートに失敗しました: ${e.message}`
						: "インポートに失敗しました。",
				);
			}
		};
		reader.readAsText(file);
	};
	input.click();
}
