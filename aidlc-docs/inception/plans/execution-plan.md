# 実行計画（詳細データ表示機能）

## 詳細分析サマリー

### 変更スコープ
- **変更タイプ**: Multiple Components（新規APIエンドポイント + 新規モーダルコンポーネント + 既存コンポーネント変更）
- **主な変更**:
  - 新規APIエンドポイント `/api/ranking/[companyId]`
  - 新規モーダルコンポーネント `SalaryDetailModal`
  - `RankingTable` をClient Componentへ変更（クリックハンドラー追加）
  - `src/api/ranking.ts` に詳細データ取得クライアント関数追加

### 変更影響評価
- **ユーザー向け変更**: あり — ランキング行クリックで詳細データモーダルが表示される
- **構造変更**: 軽微 — `RankingTable` が Server Component → Client Component に変わる
- **データモデル変更**: なし — 既存 `salary` テーブルをそのまま利用
- **API変更**: あり — 新規エンドポイント `/api/ranking/[companyId]` を追加
- **NFR影響**: なし — モーダル開時のみAPIコール（遅延ロード）

### コンポーネント関係
- **変更対象**: `RankingTable`（Client Component化）
- **新規作成**: `SalaryDetailModal`、`/api/ranking/[companyId]/route.ts`
- **追加クライアント関数**: `src/api/ranking.ts`
- **依存先**: Prisma（DBアクセス）、既存フィルターパラメータ

### リスク評価
- **リスクレベル**: Low-Medium
- **ロールバック難易度**: 容易（新規ファイルの削除 + RankingTable の戻し）
- **テスト複雑度**: 軽微（Storybookストーリー + APIエンドポイント確認）

---

## ワークフロー可視化

```mermaid
flowchart TD
    Start(["ユーザーリクエスト"])

    subgraph INCEPTION["🔵 INCEPTION PHASE"]
        WD["Workspace Detection\n✅ 完了"]
        RE["Reverse Engineering\n✅ 完了"]
        RA["Requirements Analysis\n✅ 完了"]
        US["User Stories\n⏭ SKIP"]
        WP["Workflow Planning\n✅ 完了"]
        AD["Application Design\n⏭ SKIP"]
        UG["Units Generation\n⏭ SKIP"]
    end

    subgraph CONSTRUCTION["🟢 CONSTRUCTION PHASE"]
        FD["Functional Design\n⏭ SKIP"]
        NFRA["NFR Requirements\n⏭ SKIP"]
        NFRD["NFR Design\n⏭ SKIP"]
        ID["Infrastructure Design\n⏭ SKIP"]
        CG["Code Generation\n▶ EXECUTE"]
        BT["Build and Test\n▶ EXECUTE"]
    end

    subgraph OPERATIONS["🟡 OPERATIONS PHASE"]
        OPS["Operations\n📌 PLACEHOLDER"]
    end

    Start --> WD --> RE --> RA --> WP
    WP --> CG --> BT --> End(["完了"])

    style WD fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style RE fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style RA fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style WP fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style CG fill:#FFA726,stroke:#E65100,stroke-width:3px,stroke-dasharray:5 5,color:#000
    style BT fill:#FFA726,stroke:#E65100,stroke-width:3px,stroke-dasharray:5 5,color:#000
    style US fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray:5 5,color:#000
    style AD fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray:5 5,color:#000
    style UG fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray:5 5,color:#000
    style FD fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray:5 5,color:#000
    style NFRA fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray:5 5,color:#000
    style NFRD fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray:5 5,color:#000
    style ID fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray:5 5,color:#000
    style OPS fill:#FFF59D,stroke:#F57F17,stroke-width:2px,stroke-dasharray:5 5,color:#000
    style Start fill:#CE93D8,stroke:#6A1B9A,stroke-width:3px,color:#000
    style End fill:#CE93D8,stroke:#6A1B9A,stroke-width:3px,color:#000
    style INCEPTION fill:#BBDEFB,stroke:#1565C0,stroke-width:3px,color:#000
    style CONSTRUCTION fill:#C8E6C9,stroke:#2E7D32,stroke-width:3px,color:#000
    style OPERATIONS fill:#FFF59D,stroke:#F57F17,stroke-width:3px,color:#000
    linkStyle default stroke:#333,stroke-width:2px
```

---

## 実行フェーズ

### 🔵 INCEPTION PHASE
- [x] Workspace Detection — 完了
- [x] Reverse Engineering — 完了
- [x] Requirements Analysis — 完了
- [x] Workflow Planning — 完了
- [ ] User Stories — **SKIP** *UIコンポーネント追加＋APIエンドポイント追加のみで複数ペルソナ不要*
- [ ] Application Design — **SKIP** *コンポーネント構成が要件から明確なため設計ドキュメント不要*
- [ ] Units Generation — **SKIP** *作業単位が1つのため分解不要*

### 🟢 CONSTRUCTION PHASE
- [ ] Functional Design — **SKIP** *ビジネスロジックはシンプル（DB SELECT + フォーマット）*
- [ ] NFR Requirements — **SKIP** *既存NFR設定で十分*
- [ ] NFR Design — **SKIP** *NFR Requirements をスキップするため*
- [ ] Infrastructure Design — **SKIP** *インフラ変更なし（既存Prisma・DB構成を流用）*
- [ ] **Code Generation — EXECUTE** *APIエンドポイント・モーダルコンポーネント・RankingTable変更の実装*
- [ ] **Build and Test — EXECUTE** *ビルド確認・Storybook確認・動作確認*

### 🟡 OPERATIONS PHASE
- [ ] Operations — PLACEHOLDER

---

## 成功基準

- **主目標**: ランキング行クリックで、フィルター適用済みの個別給与データ（年齢・職種・年収）がモーダルで表示される
- **主要成果物**:
  - `src/app/api/ranking/[companyId]/route.ts`（新規）
  - `src/api/ranking.ts`（更新）
  - `src/components/SalaryDetailModal/SalaryDetailModal.tsx`（新規）
  - `src/components/SalaryDetailModal/SalaryDetailModal.stories.ts`（新規）
  - `src/components/RankingTable/RankingTable.tsx`（更新）
- **品質ゲート**:
  - TypeScript エラーなし
  - Storybook でモーダルが正常表示
  - クリックでモーダルが開閉できる
  - フィルター条件が詳細データに反映される
  - ダークモード対応
