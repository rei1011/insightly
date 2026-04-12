# API ドキュメント

## REST APIs

### GET /api/ranking
- **目的**: 会社別平均年収ランキング（上位30社）を取得
- **クエリパラメータ**:
  - `occupations` (任意): 職種UUID のカンマ区切りリスト
  - `ageFrom` (任意): 年齢下限
  - `ageTo` (任意): 年齢上限
- **レスポンス**:
  ```json
  {
    "data": [
      { "rank": 1, "companyName": "会社A", "avgSalary": 1200, "count": 42 }
    ]
  }
  ```
- **実装**: `src/app/api/ranking/route.ts` — Prisma $queryRawUnsafe でSQL直接実行

### GET /api/compensation
- **目的**: 個別給与データ一覧をページネーション付きで取得
- **クエリパラメータ**: page, limit, sort, order, occupations, ageFrom, ageTo, salaryFrom, salaryTo, baseSalaryFrom, baseSalaryTo, companyName

### GET /api/occupations
- **目的**: 職種一覧取得

### GET /api/companies
- **目的**: 会社一覧取得（フィルタ用）

## データモデル

### RankingRecord
```typescript
type RankingRecord = {
  rank: number;
  companyName: string;
  avgSalary: number;  // 万円単位（Math.round済み）
  count: number;
};
```

### DBスキーマ (Prisma)

**salary テーブル**
- id: String (PK)
- companyId: Int (FK -> company)
- occupationId: String UUID (FK -> occupation)
- age: Int
- annualSalary: Decimal (12,2) — 万円
- baseSalary: Decimal (12,2)
- bonus, stockOptions, rsu, overtimeHours: Decimal (任意)
- grade: String (任意)

**company テーブル**
- id: Int (PK)
- name: String (unique)

**occupation テーブル**
- id: String UUID (PK)
- name: String (unique)
