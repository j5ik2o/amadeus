# Git ブランチ戦略 steering policy 定義

## 目標プロファイル

| フィールド | 値 | 説明 |
|---|---|---|
| goalType | technical | Amadeus 自己開発の Git branch、PR、merge、worktree の扱いを steering policy として定義する技術目標である。 |
| scope | infra | 複数 Intent と複数 worktree の作業基準を `.amadeus/steering/policies/**` に整備する Intent である。 |
| labels | git, branching, steering, self-development, governance | Git ブランチ戦略、steering policy、自己開発、運用統制を表す。 |

## 目的

Git ブランチ戦略を Amadeus の steering policy として定義する。

この Intent は [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) を根拠にする。

## 成功条件

- Git ブランチ戦略を steering policy として扱うか判断できる。
- AGENTS.md の操作指示と `.amadeus/steering/policies/**` の責務分担を整理できる。
- branch 作成、`origin/main` 追従、PR 作成、merge 後処理の判断を追跡できる。
- Intent の traceability や acceptance から参照する policy を定義できる。
- validator または evaluator で検出する対象と、人間判断に残す対象を分けられる。
- 対象 Intent の validator が pass する。

## 範囲

含めるもの:

- Git ブランチ戦略を steering policy として扱う方針。
- `.amadeus/steering/policies.md` と `.amadeus/steering/policies/git-branching.md` の配置方針。
- agent 作業 branch prefix、1 Issue 1 branch、`origin/main` 追従、PR 作成前検証、merge 後処理、複数 worktree の衝突回避の判断項目。
- AGENTS.md の操作指示と steering policy の責務分担。
- Intent の traceability、acceptance、PR 説明から policy を参照する方針。
- validator または evaluator で検出する候補の整理。

含めないもの:

- GitHub branch protection 設定そのものの変更。
- CI workflow の変更。
- merge 操作の自動化。
- 既存 PR の branch 整理。
- Ideation の段階で要求、ユースケース、Unit、Bolt、Task、実装を作ること。
