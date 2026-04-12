# ビルド手順

## 前提条件
- **ビルドツール**: npm
- **Node.js**: 20以上
- **依存パッケージ**: recharts（追加済み）
- **環境変数**: `DATABASE_URL`（PostgreSQL接続文字列）

## ビルド手順

### 1. 依存パッケージのインストール
```bash
npm install
```

### 2. DBの起動（ローカル開発時）
```bash
npm run db:start
```

### 3. プロダクションビルド
```bash
npm run build
```

### 4. ビルド成功の確認
- `/ranking` ルートが Dynamic として出力されること
- TypeScript エラーが 0 件であること

## 開発サーバーでの確認
```bash
npm run dev
# http://localhost:3000/ranking でグラフが表示されることを確認
```
