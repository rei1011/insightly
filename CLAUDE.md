# CLAUDE.md

## プロジェクト概要

サラリーマンの給与データの検索・可視化を行うWebアプリケーション。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router) + React 19
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **ORM**: Prisma 5
- **データベース**: PostgreSQL
- **テスト**: Vitest + Storybook
- **Linter/Formatter**: ESLint + Prettier

## ディレクトリ構成

```
src/
  app/          # Next.js App Router (ページ・APIルート)
  components/   # UIコンポーネント
  lib/          # ライブラリの初期化 (Prismaクライアントなど)
  api/          # APIクライアント関数
  stories/      # Storybookサンプル
prisma/
  schema.prisma # DBスキーマ定義
  migrations/   # マイグレーションファイル
scripts/        # データ投入などの補助スクリプト
salary/         # 投入元の給与データ (HTMLファイル)
```

## 開発環境セットアップ

```bash
# 1. 依存パッケージのインストール
npm install

# 2. 環境変数の設定
cp .env.example .env
# .env の DATABASE_URL を適切な値に編集する

# 3. DBの起動
npm run db:start

# 4. マイグレーションの実行
npx prisma migrate dev

# 5. データの投入 (必須)
npm run import:salary

# 6. 開発サーバーの起動
npm run dev
```

## よく使うコマンド

```bash
npm run dev          # 開発サーバー起動 (http://localhost:3000)
npm run build        # プロダクションビルド
npm run lint         # ESLint実行
npm run test         # テスト実行 (Vitest)
npm run test:watch   # テストをウォッチモードで実行
npm run storybook    # Storybook起動 (http://localhost:6006)
npm run db:start     # DBコンテナ起動
npm run db:stop      # DBコンテナ停止
npm run db:studio    # Prisma Studio起動
```

## テスト方針

- **ユーティリティ関数には必ずテストを書くこと** (Vitest)
- **フロントエンドコンポーネントには必ずStorybookのテストを書くこと**
- **新機能追加時は必ずテストを追加すること**

## データベース方針

- マイグレーションには `npx prisma migrate dev` を使用する
- スキーマ変更時は既存データとの互換性を必ず確認すること
- **カラムのNULLは原則禁止**。他に方法がない場合のみ `?` (nullable) を許容する

## エージェント活用ルール

- **バックエンドの実装**（APIルート、DBクエリ、Prismaスキーマ変更）は必ず `backend-implementer` エージェントを使うこと
- **フロントエンドの実装**（コンポーネント、ページ、スタイリング）は必ず `frontend-developer` エージェントを使うこと
- 両方にまたがる機能は、バックエンドを先に `backend-implementer` で実装し、その結果を受けて `frontend-developer` でフロントエンドを実装すること

## 禁止事項

- **本サービスが依存している外部サービスの名称をコードやコミットメッセージに記載しないこと**
