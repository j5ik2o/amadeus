# D001: Ideation 完了判断

## 背景

- [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) は、Amadeus 自己開発で Git branch、PR、merge、worktree の扱いが複数 Intent にまたがることを扱う。
- 現状でも AGENTS.md に branch prefix、PR 監視、merge 操作の人間委譲などの操作指示がある。
- 一方で、Amadeus DLC の成果物契約として参照できる Git ブランチ戦略は `.amadeus/` の steering layer に明示されていない。

## 判断

- 対象境界、実行スコープ、成果物深度、検証戦略を採用する。
- Ideation を完了し、Inception へ進める。

## 理由

- Issue #254 の本文から、目的、推奨配置、検討対象、対象外を読み取れる。
- steering policy と AGENTS.md の責務分担は、要求と受け入れ状態として Inception で分解する必要がある。
- 初期確認モックにより、Issue から branch を作り、PR を出し、merge 後に次作業へ移る判断点を確認できる。

## 影響

- Inception では、Git ブランチ戦略を steering policy として扱う判断を Requirements と Acceptance にする。
- Inception では、AGENTS.md の操作指示と `.amadeus/steering/policies/**` の責務分担を整理する。
- Inception では、validator または evaluator で検出する違反と、人間判断に残す違反を分ける。
- `state.json` には、実行スコープ、成果物深度、検証戦略を保存しない。
- Inception 以降に `scope.md` を変更する場合は、影響を受ける Requirement、Story、Use Case、Unit、Bolt を確認する。
