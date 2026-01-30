import { useMemo, useState } from "react";
import type { Task, TaskStatus } from "@/types/task";
import { useTaskStore } from "../taskStore";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { TaskTreeNode } from "./TaskTreeNode";

function formatDateHeading(dateStr: string): string {
	const date = new Date(`${dateStr}T00:00:00`);
	return date.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
		weekday: "short",
	});
}

export function CompletedTasksHistoryView() {
	const tasks = useTaskStore((state) => state.tasks);
	const getCompletedByDate = useTaskStore((state) => state.getCompletedByDate);
	const getAncestorIds = useTaskStore((state) => state.getAncestorIds);
	const updateTask = useTaskStore((state) => state.updateTask);
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

	const completedGroups = getCompletedByDate();

	const handleSelectTask = (id: string) => {
		setSelectedTaskId(id);
		setIsDrawerOpen(true);
	};

	const handleToggleCollapse = (id: string) => {
		setCollapsedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	const handleStatusChange = (taskId: string, status: TaskStatus) => {
		updateTask(taskId, { status });
	};

	const handleDrawerOpenChange = (open: boolean) => {
		setIsDrawerOpen(open);
		if (!open) {
			setSelectedTaskId(null);
		}
	};

	if (completedGroups.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<p className="text-gray-400 text-lg mb-2">完了したタスクがありません</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{completedGroups.map((group) => (
				<DateSection
					key={group.date}
					date={group.date}
					completedTaskIds={group.taskIds}
					tasks={tasks}
					getAncestorIds={getAncestorIds}
					collapsedIds={collapsedIds}
					onToggleCollapse={handleToggleCollapse}
					onSelectTask={handleSelectTask}
					onStatusChange={handleStatusChange}
				/>
			))}

			<TaskDetailDrawer
				taskId={selectedTaskId}
				open={isDrawerOpen}
				onOpenChange={handleDrawerOpenChange}
			/>
		</div>
	);
}

interface DateSectionProps {
	date: string;
	completedTaskIds: string[];
	tasks: Task[];
	getAncestorIds: (taskIds: string[]) => Set<string>;
	collapsedIds: Set<string>;
	onToggleCollapse: (id: string) => void;
	onSelectTask: (id: string) => void;
	onStatusChange: (taskId: string, status: TaskStatus) => void;
}

function DateSection({
	date,
	completedTaskIds,
	tasks,
	getAncestorIds,
	collapsedIds,
	onToggleCollapse,
	onSelectTask,
	onStatusChange,
}: DateSectionProps) {
	const { rootTasks, childrenMap, highlightedIds } = useMemo(() => {
		const ancestorIds = getAncestorIds(completedTaskIds);
		const relevantIds = new Set([...completedTaskIds, ...ancestorIds]);

		const relevantTasks = tasks.filter((t) => relevantIds.has(t.id));

		const cMap = new Map<string | undefined, Task[]>();
		const roots: Task[] = [];

		for (const task of relevantTasks) {
			if (!task.parentId || !relevantIds.has(task.parentId)) {
				roots.push(task);
			} else {
				const children = cMap.get(task.parentId) ?? [];
				children.push(task);
				cMap.set(task.parentId, children);
			}
		}

		cMap.set(undefined, roots);

		return {
			rootTasks: roots,
			childrenMap: cMap,
			highlightedIds: new Set(completedTaskIds),
		};
	}, [completedTaskIds, tasks, getAncestorIds]);

	return (
		<div>
			<h2 className="text-sm font-semibold text-gray-600 mb-2">
				{formatDateHeading(date)}
			</h2>
			<div className="bg-white rounded-lg border shadow-sm divide-y">
				{rootTasks.map((task) => (
					<TaskTreeNode
						key={task.id}
						task={task}
						childrenMap={childrenMap}
						collapsedIds={collapsedIds}
						onToggleCollapse={onToggleCollapse}
						onSelectTask={onSelectTask}
						onAddChild={() => undefined}
						onStatusChange={onStatusChange}
						highlightedIds={highlightedIds}
					/>
				))}
			</div>
		</div>
	);
}
