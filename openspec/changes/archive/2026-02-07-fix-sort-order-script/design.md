## Context

タスク管理アプリでは、タスクの表示順序を `sortOrder` フィールドで管理している。同一 `parentId` を持つタスク群が一つの「階層」となり、その中で `sortOrder` 順にソートされる。

何らかの原因で sortOrder が重複したり、飛び番になることがある。エクスポートされた JSON ファイルを修正し、再インポートすることで復旧したい。

### 現在のデータ構造

```typescript
interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  sortOrder: number;
  description?: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  parentId?: string;
  isCollapsed?: boolean;
}
```

## Goals / Non-Goals

**Goals:**
- エクスポートされたタスク JSON の sortOrder を正規化する
- 同一階層内で sortOrder が 0, 1, 2, ... と連番になるようにする
- 元の sortOrder 順を維持する（同じ値の場合は安定ソート）
- sortOrder 以外のフィールドが変更されていないことを検証する

**Non-Goals:**
- データベースへの直接操作
- アプリケーション内での自動修復機能
- sortOrder がおかしくなる根本原因の調査・修正

## Decisions

### 1. CLI ツールの入出力

**決定**: 標準入力から JSON を読み、標準出力に修正後の JSON を出力する。

**理由**:
- パイプラインで他のツールと組み合わせやすい
- ファイル指定の引数処理を省略できる
- `cat input.json | fixsortorder > output.json` のように使える

**代替案**:
- ファイルパスを引数で指定 → 柔軟性が下がる
- インプレース編集 → データ損失のリスク

### 2. sortOrder の振り直しロジック

**決定**: 各階層（同じ parentId を持つタスク群）ごとに、現在の sortOrder でソートし、0 から連番を振り直す。

**処理フロー**:
1. JSON をパースしてタスク配列を取得
2. parentId ごとにタスクをグループ化
3. 各グループ内で sortOrder の昇順にソート（stable sort）
4. ソート後、0 から連番を振り直す
5. 修正後の JSON を出力

**理由**:
- 階層構造を保持しつつ、順序を正規化できる
- stable sort により、同じ sortOrder のタスクは元の配列順を維持

### 3. 検証ロジック

**決定**: 修正前後で sortOrder 以外のフィールドが同一であることを検証する。

**検証方法**:
- 各タスクの sortOrder を一時的に固定値（0）に置き換え、JSON 文字列化して比較
- または、sortOrder 以外のフィールドのみを持つ構造体でディープ比較

**理由**:
- 誤ったフィールド変更を防止
- スクリプトのバグによるデータ破損を早期発見

### 4. 出力フォーマット

**決定**: インデント付き JSON（2スペース）で出力する。

**理由**:
- 人間が読みやすい
- diff での比較がしやすい
- エクスポート機能と同じフォーマット

## Risks / Trade-offs

**[リスク] タスク ID の参照整合性** → スクリプトは sortOrder のみを変更するため、参照整合性には影響しない。検証ロジックでも確認する。

**[リスク] 大量タスクでのメモリ使用** → 全タスクをメモリに読み込むが、通常の使用規模（数千タスク）では問題ない。必要に応じてストリーミング処理に変更可能。

**[トレードオフ] stable sort の必要性** → Go の sort.SliceStable を使用。unstable sort だと同じ sortOrder のタスクの順序が不定になる。
