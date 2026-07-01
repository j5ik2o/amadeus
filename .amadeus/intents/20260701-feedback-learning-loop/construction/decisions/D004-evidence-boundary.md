# D004 Evidence Boundary

## 状態

accepted。

## 背景

validator と evaluator の結果を内容承認として扱うと、構造検出、品質評価、採用判断が混ざる。

## 判断

validator は構造検出を扱う。
evaluator は品質評価を扱う。
どちらの結果も、phase skill または人間判断で分類された後にだけ学習候補の根拠として扱う。

## 根拠

- R005。
- UC003。

## 影響

validator の `pass` は、実行時に参照できる最低限の構造条件を満たすことだけを意味する。
内容承認や横断学習の自動採用として扱わない。
