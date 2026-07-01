# Business Rules

## 目的

U001 の業務ルールは、参照リンク化対象、リンク先規則、対象外制約を固定する。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | Requirement ID、Story ID、Use Case ID、Unit ID、Bolt ID、Task ID、Bounded Context ID など、参照先が一意に決まる ID は Markdown リンクとして扱う。 | [R001](../../../inception/requirements/R001-reference-targets.md) | adopted |
| BR002 | workspace 内成果物名とファイルパスは、参照元 Markdown から見た相対 Markdown リンクとして扱う。 | [R002](../../../inception/requirements/R002-link-target-rules.md) | adopted |
| BR003 | GitHub 上のファイルパスまたはコード参照は、commit SHA 付き permalink として扱う。 | [R002](../../../inception/requirements/R002-link-target-rules.md) | adopted |
| BR004 | PR番号は対象 repository の GitHub Pull Request URL として扱う。 | [B001](../../../inception/bolts/B001-reference-link-rules.md) | adopted |
| BR005 | Issue番号は対象 repository の GitHub Issue URL として扱う。 | [B001](../../../inception/bolts/B001-reference-link-rules.md) | adopted |
| BR006 | 参照先が一意に決まらない一般語、内容変更、既存成果物の意味変更、validator の検出詳細は B001 の対象外にする。 | [U001 Unit Design](../../../inception/units/U001-reference-link-contract/design.md) | adopted |
| BR007 | source skill の template を更新した場合は、昇格スクリプトで `.agents/skills` の昇格先成果物へ反映する。 | [R003](../../../inception/requirements/R003-artifact-application-scope.md) | adopted |
| BR008 | example snapshot は手作業で部分補修せず、source skill と validator の契約が揃った後の再生成対象として扱う。 | [R003](../../../inception/requirements/R003-artifact-application-scope.md) | adopted |
| BR009 | 既存 `.amadeus/` 成果物は、内容意味を変えずに参照リンク化だけを補修対象にする。 | [R003](../../../inception/requirements/R003-artifact-application-scope.md) | adopted |

## 例外

同一ファイル内アンカーは、見出し安定性と生成成果物の構造が確定している場合だけ使う。

外部 GitHub URL は、対象 repository と commit SHA が確定できない場合に `未確認` と記録し、branch URL で代替しない。

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | 参照先が一意に決まるか、対象外理由を説明できる。 | [R001](../../../inception/requirements/R001-reference-targets.md) | adopted |
| PRE002 | 事前条件 | GitHub 上のファイルパスまたはコード参照では、対象 repository と commit SHA が確定している。 | [R002](../../../inception/requirements/R002-link-target-rules.md) | adopted |
| POST001 | 事後条件 | 読み手は成果物内の ID、PR番号、Issue番号、ファイルパス、成果物名から参照先へ移動できる。 | [UC001](../../../inception/use-cases/UC001-define-reference-link-rules.md) | adopted |
| POST002 | 事後条件 | source skill、昇格先成果物、example snapshot、既存成果物の扱いを区別して読める。 | [UC002](../../../inception/use-cases/UC002-apply-artifact-scope.md) | adopted |
| INV001 | 不変条件 | GitHub 上のファイルパスまたはコード参照は branch URL を使わず、commit SHA 付き permalink を使う。 | [B001](../../../inception/bolts/B001-reference-link-rules.md) | adopted |
| INV002 | 不変条件 | 参照リンク化は成果物の意味変更、Unit と Bolt の再分割、Domain Map と Context Map の採用判断変更を含まない。 | [R003](../../../inception/requirements/R003-artifact-application-scope.md) | adopted |

## 未確認事項

- 同一ファイル内アンカーを必須にする範囲は B003 以降で確定する。
