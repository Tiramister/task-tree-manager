import type { TaskStatus } from "@/types/task";

export function getDeadlineHighlightClass(
	dueDate: string | undefined,
	status: TaskStatus,
): string {
	if (!dueDate || status === "completed") return "";

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const due = new Date(dueDate);
	due.setHours(0, 0, 0, 0);
	const diffDays = Math.ceil(
		(due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
	);

	if (diffDays <= 0) return "bg-red-50";
	if (diffDays <= 2) return "bg-orange-50";
	if (diffDays <= 6) return "bg-yellow-50";

	return "";
}
