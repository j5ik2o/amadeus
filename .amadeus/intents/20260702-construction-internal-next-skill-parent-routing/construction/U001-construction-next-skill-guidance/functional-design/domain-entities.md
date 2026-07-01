# Domain Entities

## 目的

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

この Unit で扱う次工程案内の要素を、Construction 成果物内の domain model として整理する。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | Parent Skill Routing Guidance | 次工程へ進む目的を親 skill 呼び出しとして伝える。 | BR001, BR002 |
| DE002 | Direct Delegation Condition | 内部 skill を直接呼ぶ条件を限定する。 | BR003 |
| DE003 | Construction Completion Sequence | 実装、検証、traceability finalization の順序を示す。 | BR004 |
| DE004 | Skill Promotion Alignment | source skill と昇格先成果物の説明整合を扱う。 | BR005 |

## 関係

`Parent Skill Routing Guidance` は `Construction Completion Sequence` の各工程を agent に伝える。

`Direct Delegation Condition` は、親 skill から明示的に委譲された場合だけ内部 skill を直接呼べることを表す。

`Skill Promotion Alignment` は、source skill で採用した案内を昇格先成果物へ反映する。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| なし | Domain Map | 新しい共有境界はない。 | 更新しない | Unit Design Brief |
| なし | Context Map | 新しいコンテキスト依存はない。 | 更新しない | Unit Design Brief |

## 未確認事項

なし。
