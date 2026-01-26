import { TaskTreeView } from "./features/tasks/components/TaskTreeView";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">タスク管理</h1>
        <TaskTreeView />
      </div>
    </div>
  );
}

export default App;
