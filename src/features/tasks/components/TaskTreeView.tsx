import { useMemo, useState } from "react";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useTaskStore } from "../taskStore";
import { TaskTreeNode } from "./TaskTreeNode";
import type { Task } from "@/types/task";

export function TaskTreeView() {
  const tasks = useTaskStore((state) => state.tasks);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

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

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        タスクがありません
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleCollapseAll}
          className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-50"
        >
          <ChevronsDownUp className="w-4 h-4" />
          全て折り畳む
        </button>
        <button
          onClick={handleExpandAll}
          className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-50"
        >
          <ChevronsUpDown className="w-4 h-4" />
          全て展開
        </button>
      </div>
      <div>
        {rootTasks.map((task) => (
          <TaskTreeNode
            key={task.id}
            task={task}
            childrenMap={childrenMap}
            collapsedIds={collapsedIds}
            onToggleCollapse={handleToggleCollapse}
          />
        ))}
      </div>
    </div>
  );
}
