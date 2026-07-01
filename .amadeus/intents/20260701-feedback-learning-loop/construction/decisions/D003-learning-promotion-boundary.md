# D003 Learning Promotion Boundary

## 状態

accepted。

## 背景

Intent 内の `学習候補`、phase の `traceability.md`、phase の `decisions.md`、Steering knowledge、Domain Map、Context Map が同じ情報を扱うと、候補と採用済みの現在状態が混ざる。

## 判断

`ideation/ideation.md` の `学習候補` は Intent 内の初期候補を扱う。
phase の `traceability.md` は証拠の前後関係を扱う。
phase の `decisions.md` は採用、非採用、上書き、再確認対象の判断を扱う。
`.amadeus/steering/knowledge.md` は複数 Intent で再利用する知見の索引を扱う。
Domain Map と Context Map は候補を扱わず、承認済みの `adopted` と `retired` の現在の索引だけを扱う。

## 根拠

- R003。
- R004。
- UC002。

## 影響

横断学習候補は、承認されるまで Domain Map と Context Map へ書かない。
