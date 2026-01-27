## Context

TaskDetailDrawer は Radix UI の Sheet（SheetContent）を使用している。Radix UI の Dialog/Sheet はデフォルトでドロワー内の最初のフォーカス可能な要素に自動フォーカスする。タイトル入力欄が最初のフォーカス可能な要素であるため、ドロワーを開くとタイトルにフォーカスが移る。

## Goals / Non-Goals

**Goals:**
- タスク詳細ドロワーを開いたときにタイトル入力欄にフォーカスしない

**Non-Goals:**
- タスク追加ダイアログのフォーカス動作の変更

## Decisions

### SheetContent の onOpenAutoFocus を使ってフォーカスを抑制する

**選択**: SheetContent の `onOpenAutoFocus` イベントで `event.preventDefault()` を呼び出し、自動フォーカスを無効にする。

**理由**: Radix UI が提供する公式の API であり、Sheet コンポーネント自体を変更する必要がない。TaskDetailDrawer 側で完結する。

**代替案**: Sheet コンポーネントに autoFocus={false} 的な prop を追加する → Radix UI の API としてはそのような prop は存在せず、onOpenAutoFocus が正式な方法。

## Risks / Trade-offs

- **アクセシビリティ**: 自動フォーカスを無効にすると、キーボードナビゲーションの開始位置がドロワー外になる可能性がある → ドロワーのコンテナ自体にはフォーカスが移るため、実用上問題ない
