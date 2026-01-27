import { TaskTreeView } from "./features/tasks/components/TaskTreeView";

function App() {
	return (
		<div className="min-h-screen bg-gray-50">
			<header className="border-b bg-white">
				<div className="container mx-auto px-2 py-4 sm:px-4 sm:max-w-3xl">
					<h1 className="text-xl font-bold sm:text-2xl">タスク管理</h1>
				</div>
			</header>
			<div className="container mx-auto px-2 py-6 sm:px-4 sm:max-w-3xl">
				<TaskTreeView />
			</div>
		</div>
	);
}

export default App;
