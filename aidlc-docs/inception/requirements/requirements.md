# 要件ドキュメント

## インテント分析

- **ユーザーリクエスト**: ランキングページの行をクリックすると、平均年収計算に使用された個別データをモーダルで表示する
- **リクエストタイプ**: Enhancement（既存機能の拡張）
- **スコープ**: Multiple Components（新規APIエンドポイント + 新規モーダルコンポーネント + RankingTable変更）
- **複雑度**: Moderate（新規APIエンドポイント追加、クライアントコンポーネントへの変換を含む）

---

## 機能要件

### FR-1: 行クリックによるモーダル表示
- `RankingTable` の各行をクリックするとモーダルが開く
- モーダルには選択した会社名をタイトルとして表示する
- モーダルはオーバーレイ背景を持ち、外側クリックまたは閉じるボタンで閉じられる

### FR-2: 個別データの表示項目
- モーダル内にテーブルを表示する
- 表示カラム: **年齢**・**職種**・**年収**（annual_salary）の3項目
- 年収は万円単位にフォーマットして表示する

### FR-3: データの並び順
- 年収（annual_salary）の**降順**で表示する

### FR-4: データ件数
- **上限なし**（その会社の対象データを全件表示）

### FR-5: フィルター条件の適用
- ランキングページに設定されている職種フィルター・年齢フィルターと**同じ条件**で絞り込んだデータを表示する
- フィルターが変わればモーダル内のデータも変わる

---

## 非機能要件

### NFR-1: パフォーマンス
- モーダルを開いた時点でAPIを呼び出す（遅延ロード）
- 全社分を事前ロードしない（必要な1社分のみ取得）

### NFR-2: テスト
- Storybookストーリーを作成する（既存コンポーネントの慣習に従う）

### NFR-3: ダークモード対応
- 既存スタイル変数（`var(--foreground)` 等）に準拠してダークモード対応する

---

## 実装スコープ（変更対象ファイル）

| ファイル | 変更種別 | 内容 |
|---------|---------|------|
| `src/app/api/ranking/[companyId]/route.ts` | 新規作成 | 会社ごとの個別給与データを返すAPIエンドポイント |
| `src/api/ranking.ts` | 変更 | 詳細データ取得APIクライアント関数を追加 |
| `src/components/SalaryDetailModal/SalaryDetailModal.tsx` | 新規作成 | モーダルコンポーネント |
| `src/components/SalaryDetailModal/SalaryDetailModal.stories.ts` | 新規作成 | Storybookストーリー |
| `src/components/RankingTable/RankingTable.tsx` | 変更 | 行クリック → モーダル表示対応（Client Component化） |

---

## 拡張機能設定

| 拡張機能 | 有効 | 決定フェーズ |
|---------|------|------------|
| Security Baseline | 無効 | Requirements Analysis |
| Property-Based Testing | 無効 | Requirements Analysis |
