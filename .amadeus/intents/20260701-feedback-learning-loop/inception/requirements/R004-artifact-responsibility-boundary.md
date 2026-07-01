# R004: 成果物責務の分離

## 要求

- `学習候補`、`traceability.md`、`decisions.md`、`.amadeus/steering/knowledge.md` の責務を重複なく説明できる。

## 受け入れ条件

- `ideation/ideation.md` の `学習候補` は、対象 Intent 内で検討する初期学習候補として説明されている。
- `traceability.md` は、前段から後段への追跡と、後段から前段へ戻す根拠を示す成果物として説明されている。
- `decisions.md` は、採用、置き換え、再確認条件、supersede 判断を記録する成果物として説明されている。
- `.amadeus/steering/knowledge.md` は、Intent 横断で再利用する知識の索引として説明されている。
- それぞれの成果物が同じ内容を重複して保持しないように、保持する情報の粒度が分けられている。

## 根拠

- Issue #259 の「既存成果物との関係」。
- `ideation/scope.md` の SC-IN-004。
- `.amadeus/steering/knowledge.md`。

## 未確認事項

- `decisions.md` に置く supersede 表現の詳細語彙は、Issue #257 の成果物が確定した後に再確認する。
