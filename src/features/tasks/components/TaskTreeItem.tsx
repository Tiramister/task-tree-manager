import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { useRef } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/task";

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

const allStatuses: TaskStatus[] = [
	"not_started",
	"in_progress",
	"waiting",
	"completed",
];

interface TaskTreeItemProps {
	task: Task;
	hasChildren: boolean;
	isCollapsed: boolean;
	onToggleCollapse: () => void;
	onSelect: () => void;
	onAddChild: () => void;
	onStatusChange: (status: TaskStatus) => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
	highlighted?: boolean;
}

export function TaskTreeItem({
	task,
	hasChildren,
	isCollapsed,
	onToggleCollapse,
	onSelect,
	onAddChild,
	onStatusChange,
	onMoveUp,
	onMoveDown,
	highlighted,
}: TaskTreeItemProps) {
	const dropdownOpenRef = useRef(false);

	const handleRowClick = () => {
		if (dropdownOpenRef.current) return;
		onSelect();
	};

	const handleDropdownOpenChange = (open: boolean) => {
		dropdownOpenRef.current = open;
		if (!open) {
			// メニューが閉じた直後のクリックイベントを無視するため少し遅延
			setTimeout(() => {
				dropdownOpenRef.current = false;
			}, 100);
			dropdownOpenRef.current = true;
		}
	};

	return (
		<div
			className={cn(
				"group flex items-center gap-2 py-1 px-2 min-h-[44px] [@media(hover:hover)]:hover:bg-gray-50 rounded cursor-pointer",
				highlighted && "bg-green-50",
			)}
			onClick={handleRowClick}
		>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onToggleCollapse();
				}}
				className={cn(
					"w-11 h-11 flex items-center justify-center rounded [@media(hover:hover)]:hover:bg-gray-200",
					!hasChildren && "invisible",
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
			<DropdownMenu onOpenChange={handleDropdownOpenChange}>
				<DropdownMenuTrigger asChild>
					<button
						onClick={(e) => e.stopPropagation()}
						className={cn(
							"text-xs px-2 py-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded cursor-pointer hover:opacity-80",
							statusColors[task.status],
						)}
					>
						{statusLabels[task.status]}
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{allStatuses.map((status) => (
						<DropdownMenuItem
							key={status}
							onClick={() => {
								if (status !== task.status) {
									onStatusChange(status);
								}
							}}
						>
							<span
								className={cn(
									"text-xs px-2 py-0.5 rounded",
									statusColors[status],
								)}
							>
								{statusLabels[status]}
							</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			<DropdownMenu onOpenChange={handleDropdownOpenChange}>
				<DropdownMenuTrigger asChild>
					<button
						onClick={(e) => e.stopPropagation()}
						className="w-11 h-11 flex items-center justify-center rounded [@media(hover:hover)]:hover:bg-gray-200 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
						aria-label="アクション"
					>
						<MoreHorizontal className="w-4 h-4" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={onMoveUp}>上に移動</DropdownMenuItem>
					<DropdownMenuItem onClick={onMoveDown}>下に移動</DropdownMenuItem>
					<DropdownMenuItem onClick={onAddChild}>
						子タスクを追加
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
