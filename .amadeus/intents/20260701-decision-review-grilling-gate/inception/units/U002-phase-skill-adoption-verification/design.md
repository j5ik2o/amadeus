# U002 Phase Skill Adoption Verification Design

## 概要

この文書は U002 の Unit Design Brief である。

Inception では、公開 phase skill への反映方針、検証境界、Construction へ渡す設計入力だけを扱う。

## 設計戦略

Ideation、Inception、Construction の公開 phase skill に、decision review を起動時の共通前処理として参照する契約を追加する。

Skill Contract、validator、evaluator は、decision review の入力または確認候補として扱い、decision review の結果そのものとは分ける。

## 責務境界

所有するもの:

- 公開 phase skill の共通参照規則。
- `guided`、`refine`、`repair` と decision review の関係。
- Skill Contract、validator、evaluator の責務境界。
- template eval または contract eval で確認する候補。

所有しないもの:

- Discovery、Event Storming、Steering への初期一括適用。
- evaluator の本格実装。
- validator の意味検証化。

依存してよいもの:

- U001 の decision review gate contract。
- Skill Contract catalog。
- 既存 phase skill の実行モード。
- validator の構造検出。

後続で再確認が必要になる条件:

- `amadeus-decision-review` を内部 skill にしない判断へ変わる場合。
- evaluator の評価範囲を初期 Construction に含める場合。

## 構成候補

| 構成候補 | 役割 |
|---|---|
| Phase Skill Entry Rule | 起動時に decision review を通す条件を表す。 |
| Mode Interaction | `guided`、`refine`、`repair` と decision review の関係を表す。 |
| Contract Boundary | Skill Contract、validator、evaluator との責務境界を表す。 |
| Verification Hook | template eval または contract eval の確認項目を表す。 |

## データと契約候補

| 種別 | 候補 |
|---|---|
| 入力候補 | phase skill 名、実行モード、対象 Intent、Skill Contract、validator 結果。 |
| 出力候補 | 共通規則の説明、反映対象 skill、検証対象、後続 Issue 候補。 |
| 状態候補 | 初期対象、対象外、後続候補。 |
| 事前条件候補 | U001 の outcome が定義されている。 |
| 事後条件候補 | 公開 phase skill が同じ判断規則を参照できる。 |
| 不変条件候補 | validator の `pass` を内容承認として扱わない。 |

## 検証観点

- source skill と昇格先 skill の説明が同期している。
- template eval または contract eval が、共通規則の欠落を検出できる。
- Skill Contract の consumer `decision-review` と矛盾しない。

## Bolt 分割方針

- B002 は公開 phase skill への反映を扱う。
- B003 は Skill Contract、validator、evaluator、eval の境界確認を扱う。

## Construction への引き継ぎ

- 初期対象は `amadeus-ideation`、`amadeus-inception`、`amadeus-construction` に限定する。
- source skill と `.agents/skills` の昇格先を同期する。
- evaluator の本格実装は、必要なら後続 Issue 候補にする。
