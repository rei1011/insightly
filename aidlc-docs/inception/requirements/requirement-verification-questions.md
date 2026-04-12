# 要件確認質問

ランキングのグラフ表示機能について、以下の質問にお答えください。  
各質問の `[Answer]:` タグの後にアルファベットを記入してください。  
選択肢に合うものがない場合は最後の選択肢（X/その他）を選び、内容を記述してください。

---

## Question 1
グラフの種類はどれにしますか？

A) 横棒グラフ（会社名を縦軸、年収を横軸）— ランキング表示に最適
B) 縦棒グラフ（会社名を横軸、年収を縦軸）
C) どちらでもよい（推奨を任せる）
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
グラフの表示位置はどこにしますか？

A) テーブルの上部にグラフを追加（グラフ → テーブルの順）
B) テーブルの下部にグラフを追加（テーブル → グラフの順）
C) グラフとテーブルをタブで切り替えられるようにする
D) テーブルを廃止してグラフのみにする
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
グラフに表示するデータ件数はどうしますか？

A) 現在と同じ上位30社すべて表示
B) 上位10社に絞る
C) 上位20社に絞る
D) ユーザーが件数を選択できるようにする
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
グラフのライブラリはどれを使いますか？（現在はグラフ用ライブラリは未導入）

A) Recharts（React向け、軽量でシンプル）
B) Chart.js + react-chartjs-2（多機能、実績豊富）
C) Nivo（高品質なビジュアライゼーション、Recharts系）
D) 任せる（推奨を採用）
X) Other (please describe after [Answer]: tag below)

[Answer]: D — メンテが頻繁でstarの数が多いものを優先

---

## Question 5
職種・年齢フィルタを変更したとき、グラフも連動して更新しますか？

A) はい、テーブルと同じくフィルタに連動して更新する
B) いいえ、グラフは固定表示でよい
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6（拡張機能: セキュリティ）
このプロジェクトにセキュリティ拡張ルールを適用しますか？

A) はい — セキュリティルールをブロッキング制約として適用する（本番向けアプリに推奨）
B) いいえ — セキュリティルールをスキップする（PoC・プロトタイプ向け）
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 7（拡張機能: Property-Based Testing）
Property-Based Testing ルールを適用しますか？

A) はい — PBTルールをブロッキング制約として適用する（ビジネスロジック・データ変換を含むプロジェクトに推奨）
B) 部分適用 — 純粋関数とシリアライゼーションのみ適用
C) いいえ — PBTルールをスキップする（シンプルなCRUD・UIのみのプロジェクト向け）
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

回答が完了したら「完了」とお知らせください。
