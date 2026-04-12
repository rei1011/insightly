# Code Generation Plan: 詳細データ表示機能（SalaryDetailModal）

## コンテキスト

- **機能**: ランキング行クリック → 平均年収計算に使ったデータをモーダル表示
- **表示項目**: 年齢・職種・年収（annual_salary）
- **並び順**: 年収降順・全件表示
- **フィルター**: ランキングページと同じ条件（職種・年齢）を適用

---

## Step 1: APIエンドポイント作成
**ファイル**: `src/app/api/ranking/[companyId]/route.ts`（新規作成）

- GET `/api/ranking/[companyId]` を実装
- クエリパラメータ: `occupations`（カンマ区切りUUID）、`ageFrom`、`ageTo`
- 既存 `/api/ranking/route.ts` と同様のバリデーション・フィルタロジックを流用
- 指定 `companyId` に対して `salary` テーブルを検索
- 返却フィールド: `age`・`occupationName`・`annualSalary`
- 年収降順で全件返す
- `data-testid` は不要（APIエンドポイント）

---

## Step 2: APIクライアント関数追加
**ファイル**: `src/api/ranking.ts`（既存ファイルを変更）

- `SalaryDetailRecord` 型と `SalaryDetailResponse` 型を追加
- `getSalaryDetail(companyId, occupationIds?, ageFrom?, ageTo?)` 関数を追加
- GET `/api/ranking/[companyId]` を呼び出す

---

## Step 3: SalaryDetailModal コンポーネント作成
**ファイル**: `src/components/SalaryDetailModal/SalaryDetailModal.tsx`（新規作成）

- `"use client"` ディレクティブ
- Props:
  - `companyId: number`
  - `companyName: string`
  - `occupationIds?: string[]`
  - `ageFrom?: number`
  - `ageTo?: number`
  - `onClose: () => void`
- マウント時に `getSalaryDetail()` を呼び出してデータ取得（useState + useEffect）
- ローディング・エラー・空データの各状態を表示
- テーブルカラム: 年齢・職種・年収（万円フォーマット）
- オーバーレイ背景クリックで `onClose` 呼び出し
- 閉じるボタン（×）を表示
- ダークモード対応（既存 `var(--foreground)` 変数を使用）
- `data-testid` を適切に設定:
  - モーダル全体: `salary-detail-modal`
  - 閉じるボタン: `salary-detail-modal-close`
  - オーバーレイ: `salary-detail-modal-overlay`

---

## Step 4: SalaryDetailModal Storybook ストーリー作成
**ファイル**: `src/components/SalaryDetailModal/SalaryDetailModal.stories.ts`（新規作成）

- 既存ストーリー（例: `RankingChart.stories.ts`）のパターンに準拠
- ストーリー: `Default`（データあり）、`Loading`、`Empty`（データなし）

---

## Step 5: RankingTable を Client Component に変更・クリックハンドラー追加
**ファイル**: `src/components/RankingTable/RankingTable.tsx`（既存ファイルを変更）

- ファイル先頭に `"use client"` を追加
- Props に `companyId: number` を追加（会社IDを保持）
- Props に `onRowClick?: (companyId: number, companyName: string) => void` を追加
- 各行の `<tr>` に `onClick` ハンドラーと `cursor-pointer` スタイルを追加
- `data-testid="ranking-table-row-{rank}"` を各行に追加

---

## Step 6: RankingPage でモーダル状態を管理
**ファイル**: `src/app/ranking/page.tsx`（既存ファイルを変更）

- モーダルの表示/非表示と選択会社を管理する Client Component ラッパーを作成するか、またはページを Client Component 化する
- `RankingTable` の `onRowClick` に選択会社情報をセット
- `SalaryDetailModal` を条件付きレンダリング
- モーダルに現在のフィルターパラメータ（`occupationIds`・`ageFrom`・`ageTo`）を渡す

**設計注意点**: Next.js App Router では Server Component がデフォルト。`ranking/page.tsx` はデータフェッチを Server Component で維持し、インタラクション部分のみを Client Component に切り出す。
- `RankingInteraction` などの Client Component ラッパーを `src/components/RankingInteraction/RankingInteraction.tsx` に作成し、`RankingTable` + モーダル状態を管理する

---

## Step 7: RankingInteraction コンポーネント作成
**ファイル**: `src/components/RankingInteraction/RankingInteraction.tsx`（新規作成）

- `"use client"` ディレクティブ
- Props: `data`（RankingRecord[]）・`occupationIds?`・`ageFrom?`・`ageTo?`
- `selectedCompany: { id: number; name: string } | null` の useState を管理
- `RankingTable` の `onRowClick` で `selectedCompany` をセット
- `selectedCompany` がある場合に `SalaryDetailModal` を表示
- モーダルの `onClose` で `selectedCompany` を null にリセット

---

## Step 8: ranking/page.tsx を更新
**ファイル**: `src/app/ranking/page.tsx`（既存ファイルを変更）

- `RankingTable` を `RankingInteraction` に置き換える
- `occupationIds`・`ageFrom`・`ageTo` を `RankingInteraction` に渡す

---

## チェックリスト

- [x] Step 1: `src/app/api/ranking/[companyId]/route.ts` 作成
- [x] Step 2: `src/api/ranking.ts` 更新
- [x] Step 3: `src/components/SalaryDetailModal/SalaryDetailModal.tsx` 作成
- [x] Step 4: `src/components/SalaryDetailModal/SalaryDetailModal.stories.ts` 作成
- [x] Step 5: `src/components/RankingTable/RankingTable.tsx` 更新
- [x] Step 6: `src/components/RankingInteraction/RankingInteraction.tsx` 作成
- [x] Step 7: `src/app/ranking/page.tsx` 更新
