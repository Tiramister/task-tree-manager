import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Task } from "@/types/task";
import { useTaskStore } from "../taskStore";
import { DescendantTaskNode } from "./DescendantTaskNode";

interface DescendantTaskTreeProps {
	parentId: string;
}

function collectDescendantIds(
	parentId: string,
	childrenMap: Map<string | undefined, Task[]>,
): string[] {
	const ids: string[] = [];
	const children = childrenMap.get(parentId) ?? [];
	for (const child of children) {
		ids.push(child.id);
		ids.push(...collectDescendantIds(child.id, childrenMap));
	}
	return ids;
}

export function DescendantTaskTree({ parentId }: DescendantTaskTreeProps) {
	const tasks = useTaskStore((state) => state.tasks);
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

	const childrenMap = useMemo(() => {
		const map = new Map<string | undefined, Task[]>();
		for (const task of tasks) {
			const children = map.get(task.parentId) ?? [];
			children.push(task);
			map.set(task.parentId, children);
		}
		return map;
	}, [tasks]);

	const directChildren = childrenMap.get(parentId) ?? [];

	const allDescendantIds = useMemo(
		() => collectDescendantIds(parentId, childrenMap),
		[parentId, childrenMap],
	);

	const handleToggleExpand = useCallback((id: string) => {
		setExpandedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}, []);

	const handleExpandAll = useCallback(() => {
		setExpandedIds(new Set(allDescendantIds));
	}, [allDescendantIds]);

	const handleCollapseAll = useCallback(() => {
		setExpandedIds(new Set());
	}, []);

	if (directChildren.length === 0) {
		return null;
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<Label>子タスク</Label>
				<div className="flex gap-1">
					<Button
						variant="ghost"
						size="sm"
						className="h-7 px-2 text-xs"
						onClick={handleCollapseAll}
					>
						<ChevronsDownUp className="w-3.5 h-3.5" />
						折り畳む
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="h-7 px-2 text-xs"
						onClick={handleExpandAll}
					>
						<ChevronsUpDown className="w-3.5 h-3.5" />
						展開
					</Button>
				</div>
			</div>
			<div className="border rounded-md p-2">
				{directChildren.map((child) => (
					<DescendantTaskNode
						key={child.id}
						task={child}
						childrenMap={childrenMap}
						expandedIds={expandedIds}
						onToggleExpand={handleToggleExpand}
					/>
				))}
			</div>
		</div>
	);
}
