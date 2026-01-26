## Context

タスクツリーマネージャーの新規開発プロジェクト。現在は空のリポジトリ状態。future-spec.md に定義された技術スタックに従って基盤を構築する。

## Goals / Non-Goals

**Goals:**
- Vite + React + TypeScript の開発環境を構築する
- Tailwind CSS でスタイリング基盤を整える
- Shadcn/ui コンポーネントを導入する
- 今後の開発に適したディレクトリ構造を作成する

**Non-Goals:**
- アプリケーションのロジック実装（Phase 2 以降）
- 状態管理の実装（Phase 2）
- UIコンポーネントの作成（Phase 3 以降）

## Decisions

### 1. Node.js バージョン管理に mise を使用
**選択**: mise-en-place でバージョン管理
**理由**: CLAUDE.md で指定されている。プロジェクトで一貫したランタイムバージョンを保証できる。

### 2. プロジェクト初期化に公式 CLI を使用
**選択**: 各ツールの公式初期化コマンドを使用
- `npm create vite@latest` (Vite + React + TypeScript)
- `npx tailwindcss init` (Tailwind CSS)
- `npx shadcn@latest init` (Shadcn/ui)

**理由**: CLAUDE.md の指示に従い、設定ファイルは可能な限りライブラリが提供する初期化方法で生成する。手動設定は最小限に抑える。

### 3. ディレクトリ構造
**選択**: 機能ベースの構造
```
src/
  components/   # UIコンポーネント
  features/     # 機能別モジュール
  hooks/        # カスタムフック
  lib/          # ユーティリティ
  types/        # 型定義
```
**理由**: React プロジェクトの一般的なベストプラクティス。Shadcn/ui のデフォルト構造とも親和性が高い。

## Risks / Trade-offs

- **[依存関係の競合]** → 最新の安定版を使用し、各ツールの互換性を確認してから導入
- **[設定の複雑化]** → 公式初期化を優先し、カスタマイズは必要最小限に留める