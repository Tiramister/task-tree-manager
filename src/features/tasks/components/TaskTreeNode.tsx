import type { Task, TaskStatus } from "@/types/task";
import { TaskTreeItem } from "./TaskTreeItem";

interface TaskTreeNodeProps {
  task: Task;
  childrenMap: Map<string | undefined, Task[]>;
  collapsedIds: Set<string>;
  onToggleCollapse: (id: string) => void;
  onSelectTask: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function TaskTreeNode({
  task,
  childrenMap,
  collapsedIds,
  onToggleCollapse,
  onSelectTask,
  onAddChild,
  onStatusChange,
}: TaskTreeNodeProps) {
  const children = childrenMap.get(task.id) ?? [];
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
      />
      {hasChildren && !isCollapsed && (
        <div className="ml-4">
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
