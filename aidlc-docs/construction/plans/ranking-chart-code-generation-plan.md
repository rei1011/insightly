# コード生成計画: ranking-chart

## ユニット概要
- **ユニット名**: ranking-chart
- **目的**: ランキングページへの縦棒グラフ（Recharts）追加
- **ワークスペースルート**: /Users/mizobuchirei/Projects/insightly

## 実装するストーリー
- ユーザーが `/ranking` ページで会社別平均年収を縦棒グラフで視覚的に確認できる
- 職種・年齢フィルタを変更するとグラフも連動して更新される

---

## 実行ステップ

### Step 1: recharts パッケージのインストール
- [x] `package.json` に recharts を追加
- [x] `npm install recharts` を実行
- **対象ファイル**: `package.json`

### Step 2: RankingChart コンポーネントの作成
- [x] `src/components/RankingChart/RankingChart.tsx` を新規作成
- [ ] `BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer` を使用
- [ ] X軸: 会社名（上位30社）
- [ ] Y軸: 平均年収（万円）
- [ ] ダークモード対応（`var(--foreground)` CSS変数使用）
- [ ] `data-testid` 属性を追加
- [ ] Props型: `RankingTableProps` と同一データ形式を受け取る
- **対象ファイル**: `src/components/RankingChart/RankingChart.tsx`（新規）

### Step 3: RankingChart Storybook ストーリーの作成
- [x] `src/components/RankingChart/RankingChart.stories.ts` を新規作成
- [ ] Default / WithFewItems / Empty の3ストーリーを作成
- [ ] 既存コンポーネント（RankingTable.stories.ts）の慣習に合わせる
- **対象ファイル**: `src/components/RankingChart/RankingChart.stories.ts`（新規）

### Step 4: ranking/page.tsx への組み込み
- [x] `src/app/ranking/page.tsx` を修正
- [ ] `RankingChart` をインポート
- [ ] `RankingTable` の上部（テーブルより前）に `<RankingChart data={data} />` を追加
- **対象ファイル**: `src/app/ranking/page.tsx`（変更）

### Step 5: コード生成サマリードキュメントの作成
- [x] `aidlc-docs/construction/ranking-chart/code/summary.md` を作成
- **対象ファイル**: `aidlc-docs/construction/ranking-chart/code/summary.md`（新規）

---

## 依存関係
- recharts（新規追加）
- 既存: `RankingRecord` 型（`src/api/ranking.ts`）
- 既存: `/api/ranking` エンドポイント（変更なし）
