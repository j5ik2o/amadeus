# 開発手順

この文書は、Amadeus 本体を Amadeus DLC で開発するときの標準手順を扱う。

個別 Intent の詳細な Requirement、Acceptance、Traceability、Decision は、対象 Intent の成果物に記録する。

## 前提

- 作業は GitHub Issue を起点にする。
- target workspace は、Amadeus 本体リポジトリから切った別 `git worktree` を推奨する。
- build workspace、host environment、target workspace、target artifacts を分けて扱う。
- 対象 Intent の phase と gate を確認してから作業を進める。
- 変更種別ごとの完了条件は [steering/policies.md](steering/policies.md) に従う。

## 手順

1. GitHub Issue を確認する。
2. Issue の目的、対象、対象外、受け入れ条件を読み、作業範囲を決める。
3. target workspace を別 `git worktree` として用意する。
4. target workspace で `.amadeus/README.md`、`.amadeus/steering.md`、対象 Intent の `state.json` を読む。
5. 対応する Intent がなければ、Issue URL を根拠として Intent を初期化する。
6. Intent の phase に対応する Amadeus skill を使い、成果物を作成または更新する。
7. 実装や文書変更を行う前に、対象の変更種別と完了条件を確認する。
8. 変更後に、対象 Intent の traceability、decisions、state を必要に応じて更新する。
9. provenance の最低記録項目を、対象 Intent の traceability または decisions に残す。
10. validator と標準検証を実行し、結果を対象 Intent または PR 説明に記録する。
11. Pull Request を作成し、対応 Issue と対象 Intent をリンクする。
12. CI、review comment、review thread を確認し、妥当な指摘を反映する。
13. 指摘へ対応した場合は、GitHub 上で返信して review thread を解決済みにする。
14. merge は人間が実行する。
15. merge 後に、対象成果物を次回 stage0 として採用するかを人間が判断する。

## phase ごとの進め方

| phase | 目的 | 完了時に確認すること |
|---|---|---|
| Discovery | 入力テーマの粒度と Intent 化方針を整理する。 | Intent 化するか、既存 Intent に接続するかが決まっている。 |
| Ideation | 目的、範囲、実現可能性、初期確認を整理する。 | scope、ideation、mock、traceability、decision、state がそろっている。 |
| Inception | Requirement、Acceptance、User Story、Use Case、Unit、Bolt を整理する。 | Requirement から Bolt まで追跡でき、Inception gate の状態が説明できる。 |
| Construction | Bolt を Task に分解し、実装、検証、証拠化を進める。 | Task、検証結果、traceability、state、必要な PR 記録がそろっている。 |

## PR 準備条件

- 対応 Issue と対象 Intent がリンクされている。
- 対象 phase の成果物が validator で pass している。
- `npm run test:all` の結果が記録されている。
- 変更種別ごとの必須条件が満たされている。
- skill 変更では、挙動差分の要約、skill-forge 確認の記録、粒度制約の確認が必須条件に含まれる。詳細は [steering/policies.md](steering/policies.md) の変更種別表と判断基準に従う。
- provenance の最低記録項目が追跡できる。
- 後続 Intent に渡す項目が、scope、traceability、decisions のいずれかに記録されている。

## stage と workspace 対応記録

PR 作成前に、対象 Intent の traceability、decisions、または PR 説明から次の項目を追跡できる状態にする。

| 項目 | 記録先 | 用途 |
|---|---|---|
| build workspace | 対象 Intent の traceability、decisions、または PR 説明 | 利用した skill、validator、開発用スクリプトの実行場所を確認する。 |
| host environment | 対象 Intent の traceability、decisions、または PR 説明 | 昇格済み skill または生成された skill が動作する環境を確認する。 |
| target workspace | 対象 Intent の traceability、decisions、または PR 説明 | 変更差分と自己開発用 `.amadeus/` 成果物の更新場所を確認する。 |
| target artifacts | 対象 Intent の traceability、decisions、または PR 説明 | skill が生成、更新、検証した成果物集合を確認する。 |
| validator 結果 | 対象 Intent の検証成果物または PR 説明 | 対象 phase の成果物契約を満たすことを確認する。 |
| 標準検証結果 | 対象 Intent の検証成果物または PR 説明 | `npm run typecheck`、`npm run diff:check`、必要なテストの結果を確認する。 |

stage2 を次回 stage0 として扱う場合は、対象 PR の merge、基準 commit、build workspace の参照 commit、Maintainer の stage0 採用判断を追跡できるようにする。

## レビュー対応

- CI エラーがある場合は、コメント対応より先に CI エラーを解消する。
- review comment は、Issue と Intent の範囲に合うかを確認してから対応する。
- 妥当な指摘は、成果物またはコードへ反映してから返信する。
- 妥当でない指摘は、非対応の理由を返信する。
- 目的と異なるが有効な指摘は、後続 Issue 化してスコープ外にする。
- 対応済みの review thread は、返信後に解決済みにする。
