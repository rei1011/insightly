# 要件ドキュメント

## インテント分析

- **ユーザーリクエスト**: ランキングページの平均年収データを縦棒グラフで可視化する
- **リクエストタイプ**: Enhancement（既存機能の拡張）
- **スコープ**: Single Component（RankingPageへのグラフコンポーネント追加）
- **複雑度**: Simple（新規コンポーネント追加、既存APIの変更なし）

---

## 機能要件

### FR-1: 縦棒グラフの表示
- `/ranking` ページのテーブル上部に縦棒グラフを追加する
- X軸: 会社名（順位順）
- Y軸: 平均年収（万円）
- 表示件数: 上位30社すべて

### FR-2: フィルタとの連動
- 職種フィルタ・年齢フィルタを変更したとき、グラフも同じデータで再描画する
- テーブルと同一のデータソース（`getRankingData()` のレスポンス）を使用する

### FR-3: グラフライブラリ
- **Recharts** を採用する
  - React専用設計（ネイティブReactコンポーネント）
  - GitHub stars: 約25,000（2026年4月時点）
  - 活発なメンテナンス継続中
  - Tailwind CSS との親和性が高い

---

## 非機能要件

### NFR-1: パフォーマンス
- 既存APIの変更なし。グラフはページ取得済みデータを再利用するため追加リクエストなし

### NFR-2: レスポンシブ対応
- グラフはモバイル・デスクトップ両方で適切に表示される（横スクロール or 縮小対応）

### NFR-3: テスト
- Storybookストーリーを作成する（既存コンポーネントの慣習に従う）
- Vitestユニットテストは任意（グラフコンポーネントはUIが主体のため）

### NFR-4: ダークモード対応
- 既存スタイル変数（`var(--foreground)`等）に準拠してダークモード対応する

---

## 実装スコープ（変更対象ファイル）

| ファイル | 変更種別 | 内容 |
|---------|---------|------|
| `src/components/RankingChart/RankingChart.tsx` | 新規作成 | 縦棒グラフコンポーネント |
| `src/components/RankingChart/RankingChart.stories.ts` | 新規作成 | Storybookストーリー |
| `src/app/ranking/page.tsx` | 変更 | RankingChartコンポーネントを追加 |
| `package.json` | 変更 | recharts パッケージを追加 |

---

## 拡張機能設定

| 拡張機能 | 有効 | 決定フェーズ |
|---------|------|------------|
| Security Baseline | 無効 | Requirements Analysis |
| Property-Based Testing | 無効 | Requirements Analysis |
