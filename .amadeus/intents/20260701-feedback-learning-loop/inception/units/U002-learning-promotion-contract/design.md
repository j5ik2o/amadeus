# Unit Design Brief

## 概要

この文書は Unit Design Brief である。
Inception では、Unit の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

## 設計戦略

- Intent 横断で再利用する学習の昇格条件を、Steering knowledge、Domain Map、Context Map、後続 Issue、後続 Intent、不採用に分ける。
- 成果物ごとの責務を分け、同じ内容を複数の成果物へ重複保持しない。
- validator は構造検出、evaluator は品質評価、人間判断は学習採用と昇格承認として扱う。
- Issue #257 は decision review の起動条件を扱い、この Unit は review 後の分類先を扱う。

## 責務境界

- 所有するもの: Intent 横断学習の昇格条件、成果物責務、validator/evaluator 結果の分類。
- 所有しないもの: 前段成果物へ戻す routing の詳細、Domain Map と Context Map の具体的なドメイン採用内容、実装手順。
- 依存してよいもの: Domain Map、Context Map、Steering knowledge、phase decisions、Issue #257。
- 後続で再確認が必要になる条件: Steering knowledge と dedicated knowledge ファイルの使い分けが Construction で変わる場合。

## 構成候補

- 横断 learning promotion 分類。
- 成果物責務の対応表。
- validator/evaluator 結果の分類表。
- Issue #257 との責務境界説明。

## データと契約候補

- 入力候補: 完了済み Intent、phase decisions、traceability、validator 結果、evaluator 結果、review comment。
- 出力候補: `steering_knowledge_candidate`、`domain_map_candidate`、`context_map_candidate`、`follow_up_issue_candidate`、`follow_up_intent_candidate`、`no_learning_action`。
- 状態候補: 候補、承認待ち、昇格済み、後続化候補、不採用。
- 事前条件候補: 昇格先ごとの根拠成果物が追跡できること。
- 事後条件候補: 採用済みの横断知識または後続化候補が適切な成果物または作業報告に残ること。
- 不変条件候補: Domain Map と Context Map に候補を載せないこと。

## 検証観点

- Steering knowledge と Domain Map または Context Map の昇格条件が分かれている。
- `学習候補`、`traceability.md`、`decisions.md`、`.amadeus/steering/knowledge.md` の責務が説明されている。
- validator と evaluator の結果が学習候補に直結せず、人間判断を経る。
- Issue #257 と Issue #259 の責務境界が残っている。

## Bolt 分割方針

- B002 で、横断 learning promotion 契約と成果物責務の分離を source skill、昇格先 skill、必要な eval に反映する。

## Construction への引き継ぎ

- Domain Design で確定する事項: Domain Map または Context Map へ昇格する具体的なドメイン内容がある場合の扱い。
- Logical Design で確定する事項: 成果物責務表と分類名をどの skill 節へ置くか。
- 実装時に確認する事項: source skill、昇格先 skill、steering knowledge、eval の整合。
- 検証時に確定する事項: validator、typecheck、関連 eval、diff check の結果。
