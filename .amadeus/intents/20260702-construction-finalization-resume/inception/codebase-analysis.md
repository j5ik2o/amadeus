# 既存コード分析

## 対象コード

| 対象 | 種別 | 確認内容 |
|---|---|---|
| `skills/amadeus-construction/SKILL.md` | source skill | auto 判定表、Decision Review 記述、内部プロセス順序を確認した。 |
| `.agents/skills/amadeus-construction/SKILL.md` | 昇格先成果物 | host environment で使う Construction 入口の現状を確認した。source と同期済みである。 |
| `skills/amadeus-construction/` 配下 | source skill 構成 | `evals/`、`references/`、`templates/` があり、`scripts/` は存在しない。検出スクリプトは新設になる。 |
| `dev-scripts/promote-skill.ts` | 開発用スクリプト | `scripts/` が昇格対象ディレクトリ、`evals/` が昇格除外であることを確認した。 |
| `.amadeus/intents/20260702-skill-change-review-contract/state.json` | Intent 状態の実例 | 未 finalize 判定に使える構造（`construction.status`、`gate`、`bolts[].taskGeneration`、requiredBoltArtifacts の test-results と pr.md）を確認した。 |
| `.amadeus/intents/20260702-stage-prerequisite-checks` | 先例 Intent | finalization を人間起点の別ブランチ（`codex/finalize-...`）で行った運用を確認した。 |

## 既存能力

- `amadeus-construction` の auto 判定表は「状態 → 自動選択 → 理由」の行構造を持ち、再開規則を1行として追加できる。
- Decision Review 記述は、既存成果物と作業ツリーを入力証拠として列挙する形を持ち、検出結果を証拠として追加できる。
- `state.json` は `construction.status`、`construction.gate`、Bolt ごとの成果物（`tasks.md`、`test-results.md`、`pr.md`）を持ち、未 finalize の状態を機械判定できる情報が揃っている。
- promote 契約により、`scripts/` に置いたファイルは昇格先へ反映され、`evals/` は昇格先に混入しない。

## 統合点

- auto 判定表に、merge 済み未 finalize を検出して finalization を選ぶ行を追加できる。
- Decision Review の入力証拠の列挙に、同梱スクリプトの検出結果を追加できる。
- 検出スクリプトは `skills/amadeus-construction/scripts/` に新設し、promote で `.agents/skills/amadeus-construction/scripts/` へ反映できる。
- 検出スクリプトの eval は既存の `skills/amadeus-construction/evals/` に追加でき、昇格先に混入しない。

## ギャップ

- auto 判定表に、merge 後の再実行を finalization へ導く行がない。現状は「必須成果物が存在し、内容を煮詰める依頼である → refine」に吸われる。
- 未 finalize の状態を列挙する実行可能な手段がない。エージェントは state と成果物を手で読み合わせている。
- 「merge 済み」を成果物と state だけで判定する規則が文書化されていない。基準 branch 由来の checkout に実装済み・検証済み・pr.md なし・gate 未 passed の Intent があれば merge 済み未 finalize である、という判定が暗黙になっている。

## リスク

- 作業中 branch（実装 PR 未 merge）でも同じ未 finalize 状態が見えるため、判定を基準 branch 由来の checkout に限定しないと誤検出する。
- auto 判定表の行を追加する際、既存の refine と repair の判定と重なる可能性があり、行の順序と条件の排他性を明確にする必要がある。
- 検出スクリプトの出力が skill 本文の期待と揺れると、入力証拠として使えない。入出力契約を Bolt の完了条件で固定する必要がある。

## Inception への入力

- 要求は、オフライン判定の再開規則、同梱スクリプトの検出と入出力契約、auto 判定と Decision Review への統合、eval 先行の検証に分ける。
- Unit は、BC001 自己開発運用を参照する単一の価値境界（finalization 再開契約）で扱える見込みである。
- Bolt は、検出スクリプトと eval の実装（B001）、skill 本文の auto 判定と参照の更新と promote 同期（B002）に分けられる。B002 は B001 のスクリプト path を参照するため B001 に依存する。
- Construction では、skill 変更 PR としてレビュー支援契約（挙動差分要約、skill-forge 確認、粒度制約）が適用される。スクリプトと skill 本文は不可分（本文がスクリプト path を参照する）のため同一 PR に含める判断が必要になる。

## 証拠

| 種別 | 参照 | 内容 |
|---|---|---|
| file | `skills/amadeus-construction/SKILL.md` | auto 判定表と Decision Review 記述の現状確認。 |
| file | `.agents/skills/amadeus-construction/SKILL.md` | 昇格先成果物の現状確認。 |
| file | `dev-scripts/promote-skill.ts` | scripts 昇格、evals 除外の契約確認。 |
| file | `.amadeus/intents/20260702-skill-change-review-contract/state.json` | 未 finalize 判定に使う state 構造の実例確認。 |
| file | `.amadeus/steering/policies.md` | レビュー支援契約と粒度制約の確認。 |

## 鮮度

| 項目 | 値 |
|---|---|
| analyzedCommit | `bddc570c15e3d6c61df2ee55118279ba9f4577b1` |
| analyzedAt | `2026-07-02T01:04:58Z` |
| freshness | current |

## 未確認事項

- 検出スクリプトの出力形式と終了コードの最終仕様は、Unit Design Brief と Construction で確定する。
