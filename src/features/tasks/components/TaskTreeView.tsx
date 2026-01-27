import { ChevronsDownUp, ChevronsUpDown, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "@/types/task";
import { useTaskStore } from "../taskStore";
import { TaskCreateDialog } from "./TaskCreateDialog";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { TaskTreeNode } from "./TaskTreeNode";

export function TaskTreeView() {
	const tasks = useTaskStore((state) => state.tasks);
	const updateTask = useTaskStore((state) => state.updateTask);
	const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [createParentId, setCreateParentId] = useState<string | undefined>(
		undefined,
	);

	const childrenMap = useMemo(() => {
		const map = new Map<string | undefined, Task[]>();
		tasks.forEach((task) => {
			const children = map.get(task.parentId) ?? [];
			children.push(task);
			map.set(task.parentId, children);
		});
		return map;
	}, [tasks]);

	const rootTasks = childrenMap.get(undefined) ?? [];

	const parentIds = useMemo(() => {
		const ids = new Set<string>();
		tasks.forEach((task) => {
			if (task.parentId) {
				ids.add(task.parentId);
			}
		});
		return ids;
	}, [tasks]);

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

	const handleCollapseAll = () => {
		setCollapsedIds(new Set(parentIds));
	};

	const handleExpandAll = () => {
		setCollapsedIds(new Set());
	};

	const handleSelectTask = (id: string) => {
		setSelectedTaskId(id);
		setIsDrawerOpen(true);
	};

	const handleAddChild = (parentId: string) => {
		setCreateParentId(parentId);
		setIsCreateDialogOpen(true);
	};

	const handleCreateDialogOpenChange = (open: boolean) => {
		setIsCreateDialogOpen(open);
		if (!open) {
			setCreateParentId(undefined);
		}
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

	if (tasks.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<p className="text-gray-400 text-lg mb-2">タスクがありません</p>
				<p className="text-gray-400 text-sm mb-6">
					最初のタスクを作成して始めましょう
				</p>
				<Button onClick={() => setIsCreateDialogOpen(true)}>
					<Plus className="w-4 h-4" />
					新規タスク
				</Button>
				<TaskCreateDialog
					open={isCreateDialogOpen}
					onOpenChange={handleCreateDialogOpenChange}
					parentId={createParentId}
				/>
			</div>
		);
	}

	return (
		<div>
			<div className="flex gap-2 mb-4">
				<Button variant="outline" size="sm" onClick={handleCollapseAll}>
					<ChevronsDownUp className="w-4 h-4" />
					全て折り畳む
				</Button>
				<Button variant="outline" size="sm" onClick={handleExpandAll}>
					<ChevronsUpDown className="w-4 h-4" />
					全て展開
				</Button>
				<Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
					<Plus className="w-4 h-4" />
					新規タスク
				</Button>
			</div>
			<div className="bg-white rounded-lg border shadow-sm divide-y">
				{rootTasks.map((task) => (
					<TaskTreeNode
						key={task.id}
						task={task}
						childrenMap={childrenMap}
						collapsedIds={collapsedIds}
						onToggleCollapse={handleToggleCollapse}
						onSelectTask={handleSelectTask}
						onAddChild={handleAddChild}
						onStatusChange={handleStatusChange}
					/>
				))}
			</div>

			<TaskDetailDrawer
				taskId={selectedTaskId}
				open={isDrawerOpen}
				onOpenChange={handleDrawerOpenChange}
			/>

			<TaskCreateDialog
				open={isCreateDialogOpen}
				onOpenChange={handleCreateDialogOpenChange}
				parentId={createParentId}
			/>
		</div>
	);
}
