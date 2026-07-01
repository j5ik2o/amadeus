# Business Rules

## 目的

skill 変更レビュー支援契約の判断規則と Intent Contracts を定義する。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | skill 変更 PR の説明には、挙動差分の3観点（変わる判断、変わる成果物構造、影響する後続 phase）を必須の最低ラインとして記録し、補足は自由記述とする。 | R001, UC001 | accepted |
| BR002 | skill 変更 PR の作成前に skill-forge による確認を必ず実施し、PR 説明の固定見出し「skill-forge 確認」へ、確認した観点（skill 境界、trigger description、本文指示、eval coverage、存在する場合は Codex metadata。該当しない観点は「該当なし」）と確認結果を記録する。 | R002, UC001 | accepted |
| BR003 | skill 変更 PR は skill 変更だけで構成することを既定とし、source skill と昇格先成果物の同期は skill 変更の一部として常に同一 PR に含める。 | R003, UC001 | accepted |
| BR004 | 他の変更種別は、分割するとどちらかの PR 単独で検証が fail する不可分な場合だけ、同一 PR に含めてよい。 | R003, UC001 | accepted |
| BR005 | 例外を使う場合は、理由と後続確認先を PR 説明へ記録する。記録の型は Git Branching Policy の例外記録に合わせる。 | R003, UC003 | accepted |
| BR006 | README（英語、日本語）は skill-forge 確認が必須であることを示し、必須条件の詳細は steering policies を定義元として参照する。 | R004 | accepted |

## 例外

| 条件 | 扱い | 根拠 |
|---|---|---|
| 分割するとどちらかの PR 単独で検証が fail する。 | 例外として同一 PR に含め、理由と後続確認先を PR 説明へ記録する。 | R003 |
| 緊急修正で通常の確認を完了できない。 | Git Branching Policy の例外記録に従い、未実行の確認、理由、後続確認先を PR 説明または対象 Intent の成果物へ記録する。 | R003 |

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | PR の変更種別が判別できる。 | R003 | accepted |
| PRE002 | 事前条件 | skill-forge を利用できる。 | R002 | accepted |
| POST001 | 事後条件 | Reviewer が PR 説明から変更の影響と確認済み観点を判断できる。 | R001, R002 | accepted |
| POST002 | 事後条件 | Maintainer が例外の妥当性を記録から判断できる。 | R003 | accepted |
| INV001 | 不変条件 | source skill と昇格先成果物の同期は、skill 変更の一部として同一 PR に含まれる。 | R003 | accepted |
| INV002 | 不変条件 | 記録の存在確認はレビュー判断の入力であり、内容承認そのものではない。 | R001, R002 | accepted |

## 未確認事項

なし。
