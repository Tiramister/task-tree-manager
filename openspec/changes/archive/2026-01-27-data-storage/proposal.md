## Why

Phase 1 で UI フレームワークの基盤が完成したが、タスクデータを扱う仕組みがない。アプリケーションの中核となるデータモデルと状態管理を実装し、ブラウザを閉じてもデータが保持されるようにする必要がある。

## What Changes

- タスクの TypeScript 型定義を作成（木構造対応）
- Zustand によるタスクストアを実装（CRUD 操作）
- localStorage を使ったデータ永続化を実装

## Capabilities

### New Capabilities

- `task-model`: タスクの型定義。タスク名、詳細説明、期限、ステータス、完了日、作業記録、親子関係を含む
- `task-store`: Zustand によるタスク状態管理。タスクの作成・読取・更新・削除操作を提供
- `task-persistence`: localStorage を使った永続化。ストア変更時に自動保存、アプリ起動時に自動読み込み

### Modified Capabilities

（なし）

## Impact

- `src/types/`: タスク型定義ファイルを追加
- `src/features/tasks/`: タスクストア・永続化ロジックを追加
- 依存パッケージ: Zustand を追加
