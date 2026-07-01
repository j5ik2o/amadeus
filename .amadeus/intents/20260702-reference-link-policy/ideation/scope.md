# スコープ

## 対象境界

### 対象

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-IN-001 | Amadeus 成果物に現れる参照 ID を Markdown リンクとして扱う方針を定義する。 | [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) | 採用 |
| SC-IN-002 | PR番号、Issue番号、ファイルパス、成果物名をリンク化対象として扱う方針を定義する。 | [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) | 採用 |
| SC-IN-003 | GitHub 上のファイルパスまたはコード参照を commit SHA 付き permalink として扱う方針を定義する。 | [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) | 採用 |
| SC-IN-004 | workspace 内成果物を相対 Markdown リンクとして扱う方針を定義する。 | [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) | 採用 |
| SC-IN-005 | template、validator、eval、example、既存成果物への影響範囲を整理する。 | [Discovery](../../../discoveries/20260702-reference-link-policy.md) | 採用 |
| SC-IN-006 | validator で検出する未リンク参照の対象と対象外を整理する。 | [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) | 採用 |

### 対象外

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-OUT-001 | Functional Design の内容そのものを変更する。 | [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) | 採用 |
| SC-OUT-002 | 既存の Inception 分割を組み替える。 | [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) | 採用 |
| SC-OUT-003 | 共有ドメイン索引の採用判断を変更する。 | [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) | 採用 |
| SC-OUT-004 | machine-readable evidence を導入する。 | [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) | 採用 |
| SC-OUT-005 | Ideation の段階で Inception 以降の成果物や実装を作る。 | [amadeus-ideation](../../../.agents/skills/amadeus-ideation/SKILL.md) | 採用 |

## 実行制御

| 項目 | 値 | 理由 |
|---|---|---|
| 実行スコープ | refactor | 既存成果物の意味を変えず、参照表記の扱いと検出方針を整理するため。 |
| 省略 stage | なし | Inception で適用対象と受け入れ条件を整理し、Construction で template、validator、eval、example、既存成果物へ反映する必要があるため。 |

## 成果物深度

| 項目 | 値 | 理由 |
|---|---|---|
| 深度 | standard | 参照種別、リンク先、適用対象、validator 判定の境界を追跡できる粒度が必要であるため。 |

## 検証戦略

| 項目 | 値 | 理由 |
|---|---|---|
| 戦略 | standard | validator、必要な eval、typecheck、diff check で、参照リンク化方針と生成成果物の整合を確認するため。 |

## Inception への引き継ぎ

- 参照先が一意に決まる ID、PR番号、Issue番号、ファイルパス、成果物名の扱いを Requirement と Acceptance にする。
- GitHub 上のファイルパスまたはコード参照を commit SHA 付き permalink として扱う条件を整理する。
- workspace 内成果物への相対 Markdown リンクの扱いを整理する。
- Functional Design、traceability、decisions、template、example など、適用対象の成果物範囲を整理する。
- validator で fail、warning、対象外のどれとして扱うかを、参照種別ごとに判断する。
