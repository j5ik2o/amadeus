# D003: Unit と Bolt の粒度判断

## 背景

- Issue #245 は skill guidance の欠落を扱うが、source skill、昇格先成果物、template、example の確認も受け入れ条件に関係する。
- Ideation は、`amadeus-construction` と `amadeus-construction-traceability-finalization` のどちらへ何を明記するかを Inception へ引き継いでいる。

## 判断

- Unit は `U001 finalization skill guidance` と `U002 traceability template alignment` に分ける。
- Bolt は `B001 finalization skill guidance` と `B002 template and example alignment` に分ける。
- B002 は B001 に依存する。

## 理由

- skill guidance 更新と template/example alignment は、検証対象と判断内容が異なる。
- B001 は R001、R002、R003 を満たすための guidance 更新を扱う。
- B002 は R004 を満たすため、source skill、昇格先成果物、template、example の整合確認を扱う。
- 1つの Unit と Bolt にまとめると、template/example の更新要否判断が skill guidance 更新に埋もれる。

## 影響

- Construction では B001 を先に進め、B002 で template、example、eval の影響を確認する。
- B002 で更新しない対象がある場合は、対象外理由を traceability または decisions に残す。
