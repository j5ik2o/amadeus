# Construction Notes

## 対象タスク

- B002/T001
- B002/T002

## 実行方針

- Intent 内の学習候補と、Intent 横断に昇格する知見を分離する。
- Steering knowledge は横断知見の索引、Domain Map と Context Map は承認済みの現在の索引として扱う。
- validator は構造検出、evaluator は品質評価として扱い、自動採用しない。

## 対象外

- Domain Map と Context Map には候補を追加しない。
- `.amadeus/domain/**` は作らない。
- evaluator の実装変更は行わない。

## 未確認事項

なし。
