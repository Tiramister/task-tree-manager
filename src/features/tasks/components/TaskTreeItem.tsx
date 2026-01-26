import { ChevronRight, ChevronDown } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task";
import { cn } from "@/lib/utils";

const statusLabels: Record<TaskStatus, string> = {
  not_started: "未着手",
  in_progress: "作業中",
  waiting: "待ち",
  completed: "完了",
};

const statusColors: Record<TaskStatus, string> = {
  not_started: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  waiting: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
};

interface TaskTreeItemProps {
  task: Task;
  hasChildren: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function TaskTreeItem({
  task,
  hasChildren,
  isCollapsed,
  onToggleCollapse,
}: TaskTreeItemProps) {
  return (
    <div className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded">
      <button
        onClick={onToggleCollapse}
        className={cn(
          "w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200",
          !hasChildren && "invisible"
        )}
        aria-label={isCollapsed ? "展開" : "折り畳む"}
      >
        {hasChildren &&
          (isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          ))}
      </button>
      <span className="flex-1 truncate">{task.title}</span>
      <span
        className={cn(
          "text-xs px-2 py-0.5 rounded",
          statusColors[task.status]
        )}
      >
        {statusLabels[task.status]}
      </span>
    </div>
  );
}
