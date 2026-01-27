import { useState } from "react";
import { cn } from "@/lib/utils";
import { CompletedTasksHistoryView } from "./features/tasks/components/CompletedTasksHistoryView";
import { TaskTreeView } from "./features/tasks/components/TaskTreeView";

type ViewTab = "list" | "history";

function App() {
	const [activeTab, setActiveTab] = useState<ViewTab>("list");

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="border-b bg-white">
				<div className="container mx-auto px-2 py-4 sm:px-4 sm:max-w-3xl">
					<h1 className="text-xl font-bold sm:text-2xl">タスク管理</h1>
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
