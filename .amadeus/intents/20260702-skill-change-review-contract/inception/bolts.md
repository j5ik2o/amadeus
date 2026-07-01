# ボルト

## 一覧

| 識別子 | 概要 | ユニット | 要求 | 設計 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| B001 | `steering/policies.md` にレビュー支援契約の本文（必須条件、粒度制約、例外一般則）を定義する。 | U001 | R001, R002, R003 | [design.md](units/U001-skill-change-review-contract/design.md) | なし | [B001-policies-review-support-contract.md](bolts/B001-policies-review-support-contract.md) |
| B002 | `development.md` の PR 準備条件へ反映し、README（英語、日本語）との整合を確認する。 | U001 | R004 | [design.md](units/U001-skill-change-review-contract/design.md) | B001 | [B002-development-and-readme-alignment.md](bolts/B002-development-and-readme-alignment.md) |

## 依存関係

| ボルト | 依存 | 理由 |
|---|---|---|
| B001 | なし | 契約本文の確定が、参照と整合確認の前提であるため。 |
| B002 | B001 | PR 準備条件と README の整合は、policies の契約本文が確定してから行うため。 |

## 未確認事項

- なし。
