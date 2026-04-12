# 実行計画

## 詳細分析サマリー

### 変更スコープ
- **変更タイプ**: Single Component（新規UIコンポーネント追加）
- **主な変更**: `RankingChart` コンポーネント新規作成、`ranking/page.tsx` への組み込み
- **関連コンポーネント**: RankingTable（同一ページに共存）、AgeFilter・JobFilter（フィルタ連動）

### 変更影響評価
- **ユーザー向け変更**: あり — ランキングページにグラフが追加される
- **構造変更**: なし — 既存アーキテクチャに変更なし
- **データモデル変更**: なし — 既存APIをそのまま利用
- **API変更**: なし — `/api/ranking` エンドポイントは変更なし
- **NFR影響**: なし — グラフはページ取得済みデータを再利用するため追加リクエストなし

### リスク評価
- **リスクレベル**: Low
- **ロールバック難易度**: 容易（コンポーネント削除のみ）
- **テスト複雑度**: シンプル（Storybookストーリーで確認）

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
        WP["Workflow Planning\n🔄 実行中"]
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
    style WP fill:#FFA726,stroke:#E65100,stroke-width:3px,stroke-dasharray:5 5,color:#000
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
- [x] Workflow Planning — 実行中
- [ ] User Stories — **SKIP** *シンプルなUIコンポーネント追加のためユーザーストーリー不要*
- [ ] Application Design — **SKIP** *新規コンポーネントのスコープが明確なため設計ドキュメント不要*
- [ ] Units Generation — **SKIP** *作業単位が1つのため分解不要*

### 🟢 CONSTRUCTION PHASE
- [ ] Functional Design — **SKIP** *UIのみの変更でビジネスロジックなし*
- [ ] NFR Requirements — **SKIP** *既存NFR設定で十分、追加要件なし*
- [ ] NFR Design — **SKIP** *NFR Requirementsをスキップするため*
- [ ] Infrastructure Design — **SKIP** *インフラ変更なし*
- [ ] **Code Generation — EXECUTE** *Rechartsコンポーネント実装*
- [ ] **Build and Test — EXECUTE** *ビルド確認・Storybook確認*

### 🟡 OPERATIONS PHASE
- [ ] Operations — PLACEHOLDER

---

## 成功基準

- **主目標**: `/ranking` ページに縦棒グラフが表示され、職種・年齢フィルタと連動して更新される
- **主要成果物**:
  - `src/components/RankingChart/RankingChart.tsx`
  - `src/components/RankingChart/RankingChart.stories.ts`
  - `src/app/ranking/page.tsx`（更新）
  - `package.json`（recharts 追加）
- **品質ゲート**:
  - TypeScript エラーなし
  - Storybook でグラフが正常表示
  - フィルタ変更時にグラフが再描画される
  - ダークモード対応
