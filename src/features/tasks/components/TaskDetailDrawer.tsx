import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { TaskStatus } from "@/types/task";
import { useTaskStore } from "../taskStore";
import { TaskDeleteDialog } from "./TaskDeleteDialog";

const statusLabels: Record<TaskStatus, string> = {
	not_started: "未着手",
	in_progress: "作業中",
	waiting: "待ち",
	completed: "完了",
};

interface TaskDetailDrawerProps {
	taskId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TaskDetailDrawer({
	taskId,
	open,
	onOpenChange,
}: TaskDetailDrawerProps) {
	const task = useTaskStore((state) =>
		taskId ? state.tasks.find((t) => t.id === taskId) : undefined,
	);
	const tasks = useTaskStore((state) => state.tasks);
	const updateTask = useTaskStore((state) => state.updateTask);
	const deleteTask = useTaskStore((state) => state.deleteTask);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [notes, setNotes] = useState("");
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// タスクが変更されたらフォームを更新
	useEffect(() => {
		if (task) {
			setTitle(task.title);
			setDescription(task.description ?? "");
			setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
			setNotes(task.notes ?? "");
		}
	}, [task]);

	const hasChildren = task ? tasks.some((t) => t.parentId === task.id) : false;

	const handleDelete = () => {
		if (!task) return;
		deleteTask(task.id);
		setIsDeleteDialogOpen(false);
		onOpenChange(false);
	};

	if (!task) {
		return null;
	}

	const handleTitleBlur = () => {
		if (title.trim() === "") {
			// 空のタイトルは許可しない
			setTitle(task.title);
			return;
		}
		if (title !== task.title) {
			updateTask(task.id, { title });
		}
	};

	const handleStatusChange = (value: TaskStatus) => {
		updateTask(task.id, { status: value });
	};

	const handleDescriptionBlur = () => {
		const newValue = description || undefined;
		if (newValue !== task.description) {
			updateTask(task.id, { description: newValue });
		}
	};

	const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setDueDate(value);
		const newValue = value ? `${value}T00:00:00.000Z` : undefined;
		updateTask(task.id, { dueDate: newValue });
	};

	const handleNotesBlur = () => {
		const newValue = notes || undefined;
		if (newValue !== task.notes) {
			updateTask(task.id, { notes: newValue });
		}
	};

	const formatDate = (isoString: string) => {
		return new Date(isoString).toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="overflow-y-auto w-full sm:max-w-lg">
				<SheetHeader>
					<SheetTitle>タスク詳細</SheetTitle>
					<SheetDescription>タスクの詳細を表示・編集します</SheetDescription>
				</SheetHeader>

				<div className="space-y-6 p-4 text-base">
					{/* タイトル */}
					<div className="space-y-2">
						<Label htmlFor="title">タイトル</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							onBlur={handleTitleBlur}
						/>
					</div>

					{/* ステータス */}
					<div className="space-y-2">
						<Label htmlFor="status">ステータス</Label>
						<Select value={task.status} onValueChange={handleStatusChange}>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
									<SelectItem key={status} value={status}>
										{statusLabels[status]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* 詳細説明 */}
					<div className="space-y-2">
						<Label htmlFor="description">詳細説明</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							onBlur={handleDescriptionBlur}
							placeholder="タスクの詳細を入力..."
							rows={3}
						/>
					</div>

					{/* 期限 */}
					<div className="space-y-2">
						<Label htmlFor="dueDate">期限</Label>
						<Input
							id="dueDate"
							type="date"
							value={dueDate}
							onChange={handleDueDateChange}
						/>
					</div>

					{/* 作業記録 */}
					<div className="space-y-2">
						<Label htmlFor="notes">作業記録</Label>
						<Textarea
							id="notes"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							onBlur={handleNotesBlur}
							placeholder="作業の記録やメモを入力..."
							rows={5}
						/>
					</div>

					{/* 読み取り専用情報 */}
					<div className="space-y-4 pt-4 border-t">
						<div>
							<Label className="text-muted-foreground">作成日</Label>
							<p className="text-sm mt-1">{formatDate(task.createdAt)}</p>
						</div>

						{task.completedAt && (
							<div>
								<Label className="text-muted-foreground">完了日</Label>
								<p className="text-sm mt-1">{formatDate(task.completedAt)}</p>
							</div>
						)}
					</div>

					{/* 削除ボタン */}
					<div className="pt-4 border-t">
						<Button
							variant="destructive"
							className="w-full"
							onClick={() => setIsDeleteDialogOpen(true)}
						>
							タスクを削除
						</Button>
					</div>
				</div>

				<TaskDeleteDialog
					open={isDeleteDialogOpen}
					onOpenChange={setIsDeleteDialogOpen}
					taskTitle={task.title}
					hasChildren={hasChildren}
					onConfirm={handleDelete}
				/>
			</SheetContent>
		</Sheet>
	);
}
