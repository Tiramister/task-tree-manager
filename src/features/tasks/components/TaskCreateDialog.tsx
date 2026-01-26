import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskStore } from "../taskStore";

interface TaskCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string;
}

export function TaskCreateDialog({
  open,
  onOpenChange,
  parentId,
}: TaskCreateDialogProps) {
  const [title, setTitle] = useState("");
  const [capturedParentId, setCapturedParentId] = useState<string | undefined>(
    undefined
  );
  const addTask = useTaskStore((state) => state.addTask);

  // ダイアログが開いた時点の parentId をキャプチャする
  useEffect(() => {
    if (open) {
      setCapturedParentId(parentId);
    }
  }, [open, parentId]);

  const handleCreate = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    addTask({ title: trimmed, parentId: capturedParentId });
    setTitle("");
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTitle("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {capturedParentId ? "子タスクを追加" : "新規タスク"}
          </DialogTitle>
        </DialogHeader>
        <Input
          placeholder="タスクのタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
          autoFocus
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            作成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
