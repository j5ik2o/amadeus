# U001 Unit Design Brief

## 概要

この文書は U001 の Unit Design Brief です。
Inception では、Discovery Brief の基本記録を Construction へ渡せる設計入力として整理します。

## 設計戦略

入力テーマ、確認した前提、判定、判定理由を、それぞれ独立した見出しとして扱います。
state.json の decision と Brief の判定を一致させます。

## 責務境界

所有するもの:

- Discovery Brief の基本見出し。
- state.json の discovery phase と decision。

所有しないもの:

- Intent 候補の initialized への遷移。
- Requirement、Use Case、Unit、Bolt、Task の生成。

## 構成候補

- Brief 基本記録。
- Discovery 状態記録。
- Discovery 一覧行。

## データと契約候補

入力候補:

- 入力テーマ。
- 確認した前提。
- 判定。

出力候補:

- brief.md。
- state.json。
- discoveries.md の行。

事前条件候補:

- Steering layer が存在する。

事後条件候補:

- decision が undecided ではない場合に判定理由が残る。

不変条件候補:

- state.json.decision と Brief の判定が一致する。

## 検証観点

- Discovery Brief の必須見出し。
- Discovery 状態ファイルの許可値。
- Discovery 一覧とのリンク整合。

## Bolt 分割方針

B001 で Brief の基本記録と状態整合を扱います。

## Construction への引き継ぎ

- どの入力を自動補完し、どの入力を grilling に戻すかを Construction で確定します。
