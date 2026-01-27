import { ChevronDown, ChevronRight } from "lucide-react";
import type { Task } from "@/types/task";

interface DescendantTaskNodeProps {
	task: Task;
	childrenMap: Map<string | undefined, Task[]>;
	expandedIds: Set<string>;
	onToggleExpand: (id: string) => void;
}

export function DescendantTaskNode({
	task,
	childrenMap,
	expandedIds,
	onToggleExpand,
}: DescendantTaskNodeProps) {
	const isExpanded = expandedIds.has(task.id);
	const children = childrenMap.get(task.id) ?? [];
	const hasChildren = children.length > 0;

	return (
		<div>
			<button
				type="button"
				className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded hover:bg-muted/50 transition-colors"
				onClick={() => onToggleExpand(task.id)}
			>
				{isExpanded ? (
					<ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
				) : (
					<ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
				)}
				<span className="text-sm truncate">{task.title}</span>
			</button>

			{isExpanded && (
				<div className="ml-6 mt-1">
					<p className="text-sm text-muted-foreground whitespace-pre-wrap px-2 py-1">
						{task.notes || "作業記録なし"}
					</p>

					{hasChildren && (
						<div className="mt-1">
							{children.map((child) => (
								<DescendantTaskNode
									key={child.id}
									task={child}
									childrenMap={childrenMap}
									expandedIds={expandedIds}
									onToggleExpand={onToggleExpand}
								/>
							))}
						</div>
					)}
				</div>
			)}

			{!isExpanded && hasChildren && (
				<div className="ml-6">
					{children.map((child) => (
						<DescendantTaskNode
							key={child.id}
							task={child}
							childrenMap={childrenMap}
							expandedIds={expandedIds}
							onToggleExpand={onToggleExpand}
						/>
					))}
				</div>
			)}
		</div>
	);
}
