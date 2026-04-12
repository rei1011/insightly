# コード生成サマリー: ranking-chart

## 生成ファイル

### 新規作成
- `src/components/RankingChart/RankingChart.tsx` — 縦棒グラフコンポーネント（Recharts使用）
- `src/components/RankingChart/RankingChart.stories.ts` — Storybookストーリー（Default / WithFewItems / Empty）

### 変更
- `src/app/ranking/page.tsx` — RankingChart インポート・テーブル上部への配置
- `package.json` — recharts 追加

## 実装のポイント
- Recharts の `BarChart` + `ResponsiveContainer` でレスポンシブ対応
- 1〜3位に特別な色（金・銀・銅）、それ以外はインディゴ
- X軸ラベルを55度回転して会社名が重ならないよう配慮
- `minWidth` 設定で30社分のラベルが潰れないよう横スクロール対応
- カスタム `Tooltip` でダークモード対応
- `data-testid="ranking-chart"` で自動テスト対応
