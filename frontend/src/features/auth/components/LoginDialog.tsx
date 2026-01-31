import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../authStore";

interface LoginDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const login = useAuthStore((state) => state.login);

	const handleLogin = async () => {
		if (!username.trim() || !password) return;

		setError("");
		setSubmitting(true);
		try {
			await login(username.trim(), password);
			setUsername("");
			setPassword("");
			onOpenChange(false);
		} catch {
			setError("ユーザー名またはパスワードが正しくありません");
		} finally {
			setSubmitting(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setUsername("");
			setPassword("");
			setError("");
		}
		onOpenChange(open);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>ログイン</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="login-username">ユーザー名</Label>
						<Input
							id="login-username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.nativeEvent.isComposing)
									handleLogin();
							}}
							autoFocus
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="login-password">パスワード</Label>
						<Input
							id="login-password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.nativeEvent.isComposing)
									handleLogin();
							}}
						/>
					</div>
					{error && <p className="text-sm text-destructive">{error}</p>}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => handleOpenChange(false)}>
						キャンセル
					</Button>
					<Button
						onClick={handleLogin}
						disabled={!username.trim() || !password || submitting}
					>
						ログイン
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
