import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuthStore } from "./features/auth/authStore";
import { LoginDialog } from "./features/auth/components/LoginDialog";
import { CompletedTasksHistoryView } from "./features/tasks/components/CompletedTasksHistoryView";
import { TaskTreeView } from "./features/tasks/components/TaskTreeView";
import { exportToFile, importFromFile } from "./features/tasks/dataTransfer";
import { useTaskStore } from "./features/tasks/taskStore";

type ViewTab = "list" | "history";

function App() {
	const [activeTab, setActiveTab] = useState<ViewTab>("list");
	const [menuOpen, setMenuOpen] = useState(false);
	const [loginDialogOpen, setLoginDialogOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const exportTasks = useTaskStore((s) => s.exportTasks);
	const importTasks = useTaskStore((s) => s.importTasks);
	const importSyncError = useTaskStore((s) => s.importSyncError);
	const importSyncing = useTaskStore((s) => s.importSyncing);
	const retryImportSync = useTaskStore((s) => s.retryImportSync);
	const clearImportSyncError = useTaskStore((s) => s.clearImportSyncError);
	const { username, loading, logout, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	const handleExport = () => {
		setMenuOpen(false);
		exportToFile(exportTasks());
	};

	const handleImport = () => {
		setMenuOpen(false);
		importFromFile(importTasks, { isLoggedIn: username !== null });
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="border-b bg-white">
				<div className="container mx-auto px-2 py-4 sm:px-4 sm:max-w-3xl">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-bold sm:text-2xl">タスク管理</h1>
						<div className="flex items-center gap-2">
							{loading ? (
								<span className="text-sm text-gray-400">...</span>
							) : username ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm">
											{username}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={logout}>
											ログアウト
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setLoginDialogOpen(true)}
								>
									ログイン
								</Button>
							)}
							<div className="relative" ref={menuRef}>
								<button
									type="button"
									className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
									onClick={() => setMenuOpen(!menuOpen)}
									aria-label="メニュー"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<circle cx="10" cy="4" r="1.5" />
										<circle cx="10" cy="10" r="1.5" />
										<circle cx="10" cy="16" r="1.5" />
									</svg>
								</button>
								{menuOpen && (
									<div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
										<button
											type="button"
											className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
											onClick={handleExport}
										>
											<img src="/export.png" alt="" width={16} height={16} />
											エクスポート
										</button>
										<button
											type="button"
											className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
											onClick={handleImport}
										>
											<img src="/import.png" alt="" width={16} height={16} />
											インポート
										</button>
										<button
											type="button"
											className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
											onClick={() => {
												setMenuOpen(false);
												window.open(
													"https://github.com/Tiramister/task-tree-manager",
													"_blank",
												);
											}}
										>
											<img src="/github.svg" alt="" width={16} height={16} />
											GitHub
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
					<LoginDialog
						open={loginDialogOpen}
						onOpenChange={setLoginDialogOpen}
					/>
					<div className="flex gap-4 mt-3">
						<button
							className={cn(
								"text-sm pb-1 border-b-2 cursor-pointer",
								activeTab === "list"
									? "border-gray-900 text-gray-900 font-semibold"
									: "border-transparent text-gray-500 hover:text-gray-700",
							)}
							onClick={() => setActiveTab("list")}
						>
							一覧
						</button>
						<button
							className={cn(
								"text-sm pb-1 border-b-2 cursor-pointer",
								activeTab === "history"
									? "border-gray-900 text-gray-900 font-semibold"
									: "border-transparent text-gray-500 hover:text-gray-700",
							)}
							onClick={() => setActiveTab("history")}
						>
							履歴
						</button>
					</div>
					{importSyncError && (
						<div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
							<p>{importSyncError}</p>
							<div className="mt-2 flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => void retryImportSync()}
									disabled={importSyncing}
								>
									{importSyncing ? "再試行中..." : "再試行"}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={clearImportSyncError}
									disabled={importSyncing}
								>
									閉じる
								</Button>
							</div>
						</div>
					)}
				</div>
			</header>
			<div className="container mx-auto px-2 py-6 sm:px-4 sm:max-w-3xl">
				{activeTab === "list" ? (
					<TaskTreeView />
				) : (
					<CompletedTasksHistoryView />
				)}
			</div>
		</div>
	);
}

export default App;
