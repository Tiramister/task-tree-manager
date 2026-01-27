import type { Task } from "@/types/task";

const now = new Date().toISOString();

export const sampleTasks: Task[] = [
	{
		id: "sample-1",
		title: "ウェブサイトリニューアル",
		status: "in_progress",
		createdAt: now,
		sortOrder: 0,
	},
	{
		id: "sample-2",
		title: "デザイン作成",
		status: "completed",
		createdAt: now,
		completedAt: now,
		parentId: "sample-1",
		sortOrder: 0,
	},
	{
		id: "sample-3",
		title: "ワイヤーフレーム作成",
		status: "completed",
		createdAt: now,
		completedAt: now,
		parentId: "sample-2",
		sortOrder: 0,
	},
	{
		id: "sample-4",
		title: "ビジュアルデザイン作成",
		status: "in_progress",
		createdAt: now,
		parentId: "sample-2",
		sortOrder: 1,
	},
	{
		id: "sample-5",
		title: "フロントエンド実装",
		status: "not_started",
		createdAt: now,
		parentId: "sample-1",
		sortOrder: 1,
	},
	{
		id: "sample-6",
		title: "トップページ実装",
		status: "not_started",
		createdAt: now,
		parentId: "sample-5",
		sortOrder: 0,
	},
	{
		id: "sample-7",
		title: "テスト・公開",
		status: "waiting",
		createdAt: now,
		parentId: "sample-1",
		description: "フロントエンド実装完了後にテストと公開を行う",
		sortOrder: 2,
	},
];
