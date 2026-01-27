import type { Task, TaskStatus } from "@/types/task";
import { useTaskStore } from "../taskStore";
import { TaskTreeItem } from "./TaskTreeItem";

interface TaskTreeNodeProps {
	task: Task;
	childrenMap: Map<string | undefined, Task[]>;
	collapsedIds: Set<string>;
	onToggleCollapse: (id: string) => void;
	onSelectTask: (id: string) => void;
	onAddChild: (parentId: string) => void;
	onStatusChange: (taskId: string, status: TaskStatus) => void;
	highlightedIds?: Set<string>;
	filterFn?: (taskId: string) => boolean;
}

export function TaskTreeNode({
	task,
	childrenMap,
	collapsedIds,
	onToggleCollapse,
	onSelectTask,
	onAddChild,
	onStatusChange,
	highlightedIds,
	filterFn,
}: TaskTreeNodeProps) {
	const moveTask = useTaskStore((state) => state.moveTask);
	const allChildren = childrenMap.get(task.id) ?? [];
	const children = filterFn
		? allChildren.filter((child) => filterFn(child.id))
		: allChildren;
	const hasChildren = children.length > 0;
	const isCollapsed = collapsedIds.has(task.id);

	return (
		<div>
			<TaskTreeItem
				task={task}
				hasChildren={hasChildren}
				isCollapsed={isCollapsed}
				onToggleCollapse={() => onToggleCollapse(task.id)}
				onSelect={() => onSelectTask(task.id)}
				onAddChild={() => onAddChild(task.id)}
				onStatusChange={(status) => onStatusChange(task.id, status)}
				onMoveUp={() => moveTask(task.id, "up")}
				onMoveDown={() => moveTask(task.id, "down")}
				highlighted={highlightedIds?.has(task.id)}
			/>
			{hasChildren && !isCollapsed && (
				<div className="ml-4 sm:ml-6">
					{children.map((child) => (
						<TaskTreeNode
							key={child.id}
							task={child}
							childrenMap={childrenMap}
							collapsedIds={collapsedIds}
							onToggleCollapse={onToggleCollapse}
							onSelectTask={onSelectTask}
							onAddChild={onAddChild}
							onStatusChange={onStatusChange}
							highlightedIds={highlightedIds}
							filterFn={filterFn}
						/>
					))}
				</div>
			)}
		</div>
	);
}
