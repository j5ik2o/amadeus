# スコープ

## 対象境界

### 対象

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-IN-001 | Amadeus 本体リポジトリの root `.amadeus/` を、自己開発用 steering layer として導入する。 | [20260629-self-dev-steering-layer.md](../../20260629-self-dev-steering-layer.md) | 採用 |
| SC-IN-002 | GitHub Issue と Intent の接続方針を記録する。 | [20260629-self-dev-steering-layer.md](../../20260629-self-dev-steering-layer.md) | 採用 |
| SC-IN-003 | 開発時にどのように進めるかを手順として記録する。 | [development.md](../../../development.md) | 採用 |
| SC-IN-004 | build workspace、host environment、target workspace、target artifacts の分離方針を記録する。 | [steering.md](../../../steering.md) | 採用 |
| SC-IN-005 | stage0、stage1、stage2 の初期方針と、次回 stage0 採用条件を記録する。 | [steering.md](../../../steering.md) | 採用 |
| SC-IN-006 | 変更種別ごとの完了条件の初期版を記録する。 | [policies.md](../../../steering/policies.md) | 採用 |

### 対象外

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-OUT-001 | 個別 skill の改善。 | [20260629-self-dev-steering-layer.md](../../20260629-self-dev-steering-layer.md) | 採用 |
| SC-OUT-002 | validator の大きな拡張。 | [20260629-self-dev-steering-layer.md](../../20260629-self-dev-steering-layer.md) | 採用 |
| SC-OUT-003 | example snapshot の再生成。 | [20260629-self-dev-steering-layer.md](../../20260629-self-dev-steering-layer.md) | 採用 |
| SC-OUT-004 | ハーネス実装。 | [20260629-self-dev-steering-layer.md](../../20260629-self-dev-steering-layer.md) | 採用 |
| SC-OUT-005 | provenance の自動収集。 | [20260629-self-dev-steering-layer.md](../../20260629-self-dev-steering-layer.md) | 採用 |
| SC-OUT-006 | `git submodule` 構成。 | [20260629-self-dev-steering-layer.md](../../20260629-self-dev-steering-layer.md) | 採用 |
| SC-OUT-007 | `CONTEXT.md` への stage0、stage1、stage2 の追加。 | [20260629-self-dev-steering-layer.md](../../20260629-self-dev-steering-layer.md) | 採用 |

## 実行制御

| 項目 | 値 | 理由 |
|---|---|---|
| 実行スコープ | feature | root `.amadeus/` steering layer を導入する新規機能相当の Intent であるため。 |
| 省略 stage | Inception、Construction | 初回導入の完了条件は Ideation gate passed であり、Inception 以降は後続 Issue と後続 Intent に渡すため。 |

## 成果物深度

| 項目 | 値 | 理由 |
|---|---|---|
| 深度 | standard | 初回導入は Ideation gate passed までを詳細化し、Requirement、Acceptance、Traceability、Decision の詳細は後続 Intent に分けるため。 |
| 変更種別 | skill 変更、validator 変更、example 更新、語彙追加、docs 更新 | 初期版では5分類だけを固定し、個別 Intent の PR 準備条件の根拠にするため。 |

## 検証戦略

| 項目 | 値 | 理由 |
|---|---|---|
| 戦略 | standard | steering layer、対象 Intent、既存の標準検証を確認するため。 |
| 検証方法 | validator、対象 Intent 指定 validator、`npm run test:all` | steering layer の必須成果物、Ideation 成果物、既存検証の維持を確認するため。 |

## Inception への引き継ぎ

- [Issue #233](https://github.com/amadeus-dlc/amadeus/issues/233) では、stage 判定と build workspace / target workspace の対応記録に範囲を限定する。
- ハーネス設計は後続 Intent に分ける。
- validator が target workspace の root `.amadeus/` と成果物ステージを扱えるかは後続 Intent で確認する。
- provenance の自動収集は後続 Intent に分ける。
- stage0、stage1、stage2 を `CONTEXT.md` に追加するかは、複数 Intent で継続的に使うことが確定した後に判断する。
