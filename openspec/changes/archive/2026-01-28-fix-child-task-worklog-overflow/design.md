## Context

タスク詳細画面の `DescendantTaskNode` コンポーネントで、子タスクの作業記録表示に `whitespace-pre-wrap` が指定されているが、長い単語やURLなどの折り返し不可能な文字列がコンテナからはみ出す。`overflow-wrap: break-word` に相当するTailwind CSSクラスが不足している。

## Goals / Non-Goals

**Goals:**
- 子タスクの作業記録が親コンテナ内で正しく折り返されるようにする

**Non-Goals:**
- 親タスクの作業記録表示の変更（既に正しく動作している）
- レイアウトやデザインの変更

## Decisions

- `DescendantTaskNode.tsx` の作業記録表示要素に `break-words`（Tailwind CSS の `overflow-wrap: break-word`）クラスを追加する
- 既存の `whitespace-pre-wrap` はそのまま維持し、改行の保持と長文の折り返しを両立させる

## Risks / Trade-offs

- 特になし。CSS クラス1つの追加のみで、副作用のリスクは極めて低い
