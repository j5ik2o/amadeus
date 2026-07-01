# UC003: 検証後案内を更新する

## 概要

Agent は、`amadeus-construction-verification-hardening` の `次の skill` 欄を、検証後は親 skill をファイナライズ目的で呼ぶ案内へ更新する。

## アクター

- ACT002 Agent

## 外部システム

- なし

## 事前条件

- UC001 で現在の案内を確認している。
- UC002 で親 skill 経由の表現方針を決めている。

## 基本フロー

1. Agent は source skill の `amadeus-construction-verification-hardening` を更新対象にする。
2. Agent は追跡と状態確定へ進む場合に、`amadeus-construction` をファイナライズ目的で呼ぶ説明を追加する。
3. Agent は親 skill が `amadeus-construction-traceability-finalization` に委譲する説明を追加する。
4. Agent は直接 `amadeus-construction-traceability-finalization` を呼ぶ条件を、親 skill から明示的に委譲されている場合だけにする。

## 代替フロー

- `test-results.md` 作成後に止まる誤読が残る場合は、Construction 完了には traceability finalization が必要である説明を補足する。

## 対象要求

- R002
- R003
- R004
- R005

## 未確認事項

- `amadeus-construction-traceability-finalization` 側にも補足が必要かは Construction で確認する。
