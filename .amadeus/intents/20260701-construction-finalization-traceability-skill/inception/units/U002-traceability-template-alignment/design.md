# Unit Design Brief

## 概要

この文書は Unit Design Brief である。
Inception では、Unit の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

## 設計戦略

- U001 で採用した guidance を基準に、template、example、source skill と昇格先成果物の整合を確認する。
- template に完了時表を追加する場合は、template eval の期待見出しも合わせる。
- example を更新しない場合は、既存 example の phase と状態に照らして対象外理由を残す。

## 責務境界

- 所有するもの: template、example、source skill と昇格先成果物の整合確認。
- 所有しないもの: validator の成果物契約変更、example snapshot の real provider 再生成。
- 依存してよいもの: U001 の guidance、validator eval、template eval、既存 examples。
- 後続で再確認が必要になる条件: template 更新が example snapshot に影響する場合。

## 構成候補

- Traceability Template Check
- Example Impact Check
- Skill Promotion Alignment Check
- Verification Evidence

## データと契約候補

- 入力候補: U001 design、template、example、eval、source skill、昇格先成果物。
- 出力候補: 更新対象または対象外判断、検証結果。
- 状態候補: `updated`、`not_required`、`verified`。
- 事前条件候補: U001 の guidance が決まっていること。
- 事後条件候補: R004 の受け入れ状態に必要な証拠を登録できること。
- 不変条件候補: validator の成果物契約を変更しないこと。

## 検証観点

- 対象 Intent の validator が pass する。
- template eval または `npm run test:all` が pass する。
- source skill と昇格先成果物の差分が意図どおりである。

## Bolt 分割方針

- B002 で template、example、source skill と昇格先成果物の整合確認を行う。
- B002 は B001 の guidance 更新を前提にする。

## Construction への引き継ぎ

- Domain Design で確定する事項: なし。
- Logical Design で確定する事項: template に完了時表を含めるか。
- 実装時に確認する事項: eval の期待見出し、example snapshot の更新要否。
- 検証時に確定する事項: validator、typecheck、diff check、必要な test all の結果。
