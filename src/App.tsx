import { TaskTreeView } from "./features/tasks/components/TaskTreeView";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 py-8 sm:px-4 sm:max-w-3xl">
        <h1 className="text-xl font-bold mb-6 sm:text-2xl">タスク管理</h1>
        <TaskTreeView />
      </div>
    </div>
  );
}

export default App;
