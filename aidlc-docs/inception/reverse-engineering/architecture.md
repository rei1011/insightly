# システムアーキテクチャ

## システム概要

Next.js App Routerベースのフルスタックウェブアプリケーション。サーバーサイドでPrisma経由でPostgreSQLから給与データを取得し、クライアントサイドでフィルタリングUIを提供する。

## アーキテクチャ図

```
ブラウザ
  |
  | HTTP
  v
Next.js (App Router)
  ├── pages/
  │   ├── / (Home: 報酬一覧)          ... Server Component
  │   └── /ranking (ランキング)        ... Server Component
  ├── API Routes
  │   ├── /api/compensation           ... GET
  │   ├── /api/ranking                ... GET
  │   ├── /api/occupations            ... GET
  │   └── /api/companies              ... GET
  └── Components (Client Components)
      ├── AgeFilter
      ├── JobFilter
      ├── CompanyFilter
      ├── SalaryFilter
      ├── CompensationTable
      ├── RankingTable
      └── Navigation

Prisma ORM
  |
  v
PostgreSQL
  ├── salary テーブル
  ├── company テーブル
  └── occupation テーブル
```

## コンポーネント説明

### Next.js App (src/app/)
- **目的**: ページルーティングとデータフェッチ
- **責務**: Server Componentsでデータ取得、URLパラメータの解析
- **依存**: Prisma, API clients

### API Routes (src/app/api/)
- **目的**: データアクセス層のREST API
- **責務**: DBクエリ実行、レスポンス整形
- **依存**: Prisma

### Components (src/components/)
- **目的**: UIコンポーネント群（全て Client Components）
- **責務**: フィルタUI操作、データ表示
- **依存**: Next.js router, searchParams

### API Clients (src/api/)
- **目的**: APIルートへのHTTPクライアント
- **責務**: fetch呼び出し、型付きレスポンス返却
- **依存**: fetch API

## データフロー（ランキングページ）

```
1. ユーザーがURLにアクセス (searchParams付き)
2. RankingPage (Server Component) が searchParams を解析
3. getRankingData() でAPIをfetch
4. /api/ranking がPrisma $queryRawUnsafe でSQLを実行
5. PostgreSQLが集計クエリを実行 (AVG, GROUP BY, ORDER BY)
6. 結果をJSON変換してレスポンス
7. RankingTableコンポーネントでテーブル表示
```

## 統合ポイント

- **データベース**: PostgreSQL (Prisma ORM経由)
- **外部API**: なし
- **サードパーティサービス**: Vercel（デプロイ想定、VERCEL_URL環境変数）
