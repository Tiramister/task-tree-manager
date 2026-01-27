import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CompletedTasksHistoryView } from "./features/tasks/components/CompletedTasksHistoryView";
import { TaskTreeView } from "./features/tasks/components/TaskTreeView";
import { exportToFile, importFromFile } from "./features/tasks/dataTransfer";
import { useTaskStore } from "./features/tasks/taskStore";

type ViewTab = "list" | "history";

function App() {
	const [activeTab, setActiveTab] = useState<ViewTab>("list");
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const exportTasks = useTaskStore((s) => s.exportTasks);
	const importTasks = useTaskStore((s) => s.importTasks);

	const handleExport = () => {
		setMenuOpen(false);
		exportToFile(exportTasks());
	};

	const handleImport = () => {
		setMenuOpen(false);
		importFromFile(importTasks);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="border-b bg-white">
				<div className="container mx-auto px-2 py-4 sm:px-4 sm:max-w-3xl">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-bold sm:text-2xl">タスク管理</h1>
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
										className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
										onClick={handleExport}
									>
										エクスポート
									</button>
									<button
										type="button"
										className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
										onClick={handleImport}
									>
										インポート
									</button>
								</div>
							)}
						</div>
					</div>
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
