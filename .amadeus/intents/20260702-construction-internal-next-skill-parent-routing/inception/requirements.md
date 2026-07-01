# 要求

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| R001 | 実装後は `amadeus-construction` を検証目的で呼ぶことを skill から判断できる。 | 採用済み | なし | [R001-implementation-to-parent-verification.md](requirements/R001-implementation-to-parent-verification.md) |
| R002 | 検証後は `amadeus-construction` をファイナライズ目的で呼ぶことを skill から判断できる。 | 採用済み | R001 | [R002-verification-to-parent-finalization.md](requirements/R002-verification-to-parent-finalization.md) |
| R003 | 内部 skill を直接呼ぶのは、親 skill から明示的に委譲されている場合だけであることを判断できる。 | 採用済み | R001, R002 | [R003-direct-internal-skill-delegation.md](requirements/R003-direct-internal-skill-delegation.md) |
| R004 | 実装完了だけでは Construction 完了ではなく、検証と traceability finalization が必要であることを判断できる。 | 採用済み | R001, R002, R003 | [R004-construction-completion-sequence.md](requirements/R004-construction-completion-sequence.md) |
| R005 | source skill と昇格先成果物が同じ次工程案内を説明し、周辺の Construction 内部 skill も確認されている。 | 採用済み | R001, R002, R003, R004 | [R005-source-promoted-and-surrounding-alignment.md](requirements/R005-source-promoted-and-surrounding-alignment.md) |

## 依存関係

| 要求 | 依存 | 理由 |
|---|---|---|
| R001 | なし | 実装後の継続目的が、後続案内の前提であるため。 |
| R002 | R001 | 検証後のファイナライズ案内は、実装後に検証へ進む流れを前提にするため。 |
| R003 | R001, R002 | 直接呼び出し条件は、親 skill 経由の継続目的を前提に説明するため。 |
| R004 | R001, R002, R003 | Construction 完了条件は、実装、検証、ファイナライズの順序と直接委譲条件を前提にするため。 |
| R005 | R001, R002, R003, R004 | source skill と昇格先成果物の整合確認は、採用する案内内容を前提にするため。 |

## 受け入れ状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 採用済み | 未登録 |
| R002 | 採用済み | 未登録 |
| R003 | 採用済み | 未登録 |
| R004 | 採用済み | 未登録 |
| R005 | 採用済み | 未登録 |
