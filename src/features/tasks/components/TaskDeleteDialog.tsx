import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	taskTitle: string;
	hasChildren: boolean;
	onConfirm: () => void;
}

export function TaskDeleteDialog({
	open,
	onOpenChange,
	taskTitle,
	hasChildren,
	onConfirm,
}: TaskDeleteDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>タスクを削除</AlertDialogTitle>
					<AlertDialogDescription>
						「{taskTitle}」を削除しますか？
						{hasChildren && (
							<>
								<br />
								このタスクと子タスクも削除されます。
							</>
						)}
						この操作は取り消せません。
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>キャンセル</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>削除</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
