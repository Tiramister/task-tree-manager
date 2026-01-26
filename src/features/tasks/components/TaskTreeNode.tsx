import type { Task } from "@/types/task";
import { TaskTreeItem } from "./TaskTreeItem";

interface TaskTreeNodeProps {
  task: Task;
  childrenMap: Map<string | undefined, Task[]>;
  collapsedIds: Set<string>;
  onToggleCollapse: (id: string) => void;
}

export function TaskTreeNode({
  task,
  childrenMap,
  collapsedIds,
  onToggleCollapse,
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
