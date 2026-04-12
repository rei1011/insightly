# コード構造

## ビルドシステム
- **タイプ**: npm
- **設定ファイル**: package.json, next.config.ts, tsconfig.json

## 既存ファイル一覧

### ページ
- `src/app/page.tsx` - 報酬一覧ページ（Server Component）
- `src/app/ranking/page.tsx` - 会社別平均年収ランキングページ（Server Component）
- `src/app/layout.tsx` - アプリ共通レイアウト（Navigation含む）

### API Routes
- `src/app/api/compensation/route.ts` - 給与データ一覧API
- `src/app/api/ranking/route.ts` - 平均年収ランキングAPI（$queryRawUnsafe使用）
- `src/app/api/occupations/route.ts` - 職種一覧API
- `src/app/api/companies/route.ts` - 会社一覧API

### APIクライアント
- `src/api/compensation.ts` - 給与データ取得クライアント（型: CompensationRecord）
- `src/api/ranking.ts` - ランキングデータ取得クライアント（型: RankingRecord, RankingResponse）
- `src/api/occupations.ts` - 職種一覧取得クライアント
- `src/api/companies.ts` - 会社一覧取得クライアント

### コンポーネント
- `src/components/RankingTable/RankingTable.tsx` - ランキングテーブル表示
- `src/components/CompensationTable/CompensationTable.tsx` - 給与一覧テーブル
- `src/components/AgeFilter/AgeFilter.tsx` - 年齢フィルタ（Client Component）
- `src/components/JobFilter/JobFilter.tsx` - 職種フィルタ（Client Component）
- `src/components/CompanyFilter/CompanyFilter.tsx` - 会社名フィルタ（Client Component）
- `src/components/SalaryFilter/SalaryFilter.tsx` - 年収フィルタ（Client Component）
- `src/components/Navigation/Navigation.tsx` - ナビゲーションバー

### ユーティリティ
- `src/lib/prisma.ts` - Prismaクライアントシングルトン
- `src/lib/searchParams.ts` - URLサーチパラメータのパースユーティリティ

## デザインパターン

### Server Components + Client Components パターン
- **場所**: 全ページ
- **目的**: サーバーでデータフェッチ、クライアントでインタラクション管理

### URLパラメータによる状態管理
- **場所**: 全フィルターコンポーネント
- **目的**: ページリロード後もフィルタ状態を維持

## 重要な依存関係

| 依存 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 16.1.6 | フレームワーク |
| React | 19.2.3 | UIライブラリ |
| Prisma | ^5.22.0 | ORM |
| Tailwind CSS | ^4 | スタイリング |
| Vitest | ^4.0.18 | テスト |
| Storybook | ^10.2.12 | コンポーネント開発 |
