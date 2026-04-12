# テクノロジースタック

## プログラミング言語
- TypeScript ^5 — アプリ全体
- SQL — Prisma $queryRawUnsafe（ランキングクエリ）

## フレームワーク・ライブラリ

| ライブラリ | バージョン | 用途 |
|----------|-----------|------|
| Next.js | 16.1.6 | フルスタックフレームワーク（App Router） |
| React | 19.2.3 | UIライブラリ |
| Prisma | ^5.22.0 | ORM |
| Tailwind CSS | ^4 | スタイリング |

## テストツール

| ツール | バージョン | 用途 |
|-------|-----------|------|
| Vitest | ^4.0.18 | ユニットテスト |
| Storybook | ^10.2.12 | コンポーネント開発・ビジュアルテスト |
| Playwright | ^1.58.2 | E2Eテスト（@vitest/browser-playwright）|

## ビルドツール

| ツール | バージョン | 用途 |
|-------|-----------|------|
| npm | — | パッケージ管理 |
| tsx | ^4.21.0 | TypeScript スクリプト実行（データインポート） |
| ESLint | ^9 | Linting |
| Prettier | ^3.8.1 | フォーマット |

## インフラ
- **DB**: PostgreSQL（Docker Compose でローカル起動）
- **デプロイ**: Vercel（想定）
