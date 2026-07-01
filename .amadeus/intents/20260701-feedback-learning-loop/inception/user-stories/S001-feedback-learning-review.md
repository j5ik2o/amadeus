# S001: feedback learning review

## ストーリー

- ACT001 Maintainer として、後段で見つかった発見と Intent 横断の学習を分類し、現在 Intent 修正、横断 knowledge、後続 Issue、後続 Intent のどれで扱うかを承認したい。

## 受け入れ条件

- 前段へ戻すべき発見と、現在 phase 内で直せる発見を分けられる。
- Steering knowledge、Domain Map、Context Map へ昇格できる学習と、後続 Issue または後続 Intent に切る学習を分けられる。
- validator と evaluator の結果を、内容承認ではなく判断材料として扱える。
- Issue #257 の decision review と、この Intent の学習分類を分けて確認できる。

## 根拠

- Issue #259 の目的と受け入れ条件。
- `.amadeus/steering/actors.md` の ACT001 Maintainer。

## 未確認事項

- Maintainer が承認する UI や command は、Construction では定義せず、skill 契約として扱う。
