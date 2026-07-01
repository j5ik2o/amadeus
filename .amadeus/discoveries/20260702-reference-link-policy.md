# Amadeus 成果物の参照リンク化方針 Discovery Brief

## 入力テーマ

- [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) を入力元にして、Amadeus 成果物に記載する ID、PR番号、Issue番号、ファイルパス、成果物名をリンクとして扱う方針を整理する。

## 確認した前提

- 入力元は GitHub Issue と会話である。
- [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) は、特定の Functional Design ファイルだけでなく、Amadeus 成果物に現れる参照表記全般を対象にしている。
- 対象分類は Amadeus DLC 契約と Amadeus 実装の両方である。
- 変更対象領域は lifecycle 契約、template、validator、eval、example、docs、既存成果物である。
- GitHub 上のファイルパスまたはコード参照は、commit SHA を含む permalink として扱う必要がある。
- workspace 内成果物への参照は、相対 Markdown リンクで扱う必要がある。
- 参照先が一意に決まる ID、PR番号、Issue番号、ファイルパス、成果物名は、記載場所に依存せずリンク化対象である。
- 既存の [20260701-self-development-cycle-stage-workspace](../intents/20260701-self-development-cycle-stage-workspace.md) は、今回の観察例を含むが、今回の主対象は既存 Intent の内容補修ではなく、後続 Intent として扱う参照リンク化方針である。

## 判定

single_intent

## 判定理由

- 入力テーマは、Amadeus 成果物の参照表記をリンクとして扱う方針を定義する単一の設計判断に集約できる。
- template、validator、example、既存成果物に影響するが、いずれも同じ参照リンク化方針の適用先であり、別々の Intent 候補へ分割する段階ではない。
- [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) には、目的、検討対象、リンク方針、対象外、受け入れ条件が記録されているため、Intent Record 作成に必要な入力がそろっている。
- 既存 Intent の成果物を観察例として使うが、既存 Intent 更新だけでは template、validator、example への方針適用を追跡しにくい。
- 参照リンク化の validator 判定は未確定だが、これは Ideation で扱う成功条件と範囲の論点であり、Discovery を `undecided` に残す理由ではない。

## Intent Draft

| 項目 | 内容 |
|---|---|
| タイトル | Amadeus 成果物の参照リンク化方針を定義する。 |
| 入力元 | [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) |
| 目的 | Amadeus 成果物に記載する ID、PR番号、Issue番号、ファイルパス、成果物名を、参照先へ移動できる Markdown リンクとして扱う方針を定義する。Task 生成、実装判断、review、traceability 確認時に、根拠へたどれる状態にする。 |
| 成功状態 | 参照先が一意に決まる ID、PR番号、Issue番号、ファイルパス、成果物名のリンク化方針が説明できる。GitHub 上のファイルパスまたはコード参照を commit SHA 付き permalink として扱う方針が説明できる。workspace 内成果物を相対 Markdown リンクとして扱う方針が説明できる。template、validator、example、既存成果物のどこへ方針を適用するかが整理されている。validator で検出する場合は、未リンク参照の検出対象と対象外が説明できる。 |
| 含めるもの | Amadeus 成果物に現れる参照 ID のリンク化方針。PR番号、Issue番号、ファイルパス、成果物名のリンク化方針。GitHub 上のファイルパスまたはコード参照に対する commit SHA 付き permalink の扱い。workspace 内成果物に対する相対 Markdown リンクの扱い。template、validator、eval、example、既存成果物への影響範囲整理。 |
| 含めないもの | Functional Design の内容そのものの変更。Unit と Bolt の再分割。Domain Map と Context Map の採用判断変更。machine-readable evidence の導入。実装 Task の分解。 |

## Intent 候補

| 候補 | 状態 | Intent | 課題 | 成功状態 | 除外範囲 | 依存 |
|---|---|---|---|---|---|---|
| Amadeus 成果物の参照リンク化方針を定義する | intent_record_created | [20260702-reference-link-policy](../intents/20260702-reference-link-policy.md) | ID、PR番号、Issue番号、ファイルパス、成果物名が素の文字列として書かれると、根拠成果物へ移動しにくく、traceability 確認時に参照先を追跡しづらい。 | 参照リンク化方針、GitHub permalink 方針、適用範囲、validator の扱いが整理され、後続の実装判断へ渡せる。 | Functional Design の内容変更、Unit と Bolt の再分割、Domain Map と Context Map の採用判断変更、machine-readable evidence の導入は含めない。 | [20260701-self-development-cycle-stage-workspace](../intents/20260701-self-development-cycle-stage-workspace.md) |

## 候補判断

- recommended は「Amadeus 成果物の参照リンク化方針を定義する」であり、[20260702-reference-link-policy](../intents/20260702-reference-link-policy.md) として Intent Record 作成済みである。
- この候補は、Issue #243 の目的と受け入れ条件をそのまま Intent Record に渡せる粒度である。
- 複数 Intent に分割すると、template、validator、example、既存成果物の適用判断が分散するため、まず単一 Intent で方針と適用範囲を確定する。
- validator 実装や既存成果物の一括補修は、Inception 以降の Unit または Bolt で分ける。

## 既存 Intent との関係

- [20260701-self-development-cycle-stage-workspace](../intents/20260701-self-development-cycle-stage-workspace.md) は、今回の観察例を含む既存 Intent である。
- 今回の Discovery は、この既存 Intent の成果物を観察例として使う。
- 今回の Discovery は、既存 Intent 更新ではなく、参照リンク化方針を定義する新規 Intent 候補として扱う。
- 新規 Intent は、自己開発 cycle と workspace 対応記録の前提を使うため、[20260701-self-development-cycle-stage-workspace](../intents/20260701-self-development-cycle-stage-workspace.md) の後続候補として扱う。

## 推奨次アクション

- この Discovery の Intent Draft と [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) を入力元にして、`amadeus-ideation` で Intent Record を作成する。
