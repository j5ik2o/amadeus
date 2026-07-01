# R005: skill 同期と検証

## 要求

- 内部 skill を追加する場合は、`skills/` の source skill と `.agents/skills/` の昇格先成果物の同期方針に従う。
- 昇格先成果物への反映は `dev-scripts/promote-skill.ts` を使う。
- 必要な eval または text contract を追加または更新し、内部 skill の責務、分類、`dry-run` 境界を検証できる。

## 受け入れ条件

- source skill と昇格先成果物の両方から新しい内部 skill を参照できる。
- 手動同期ではなく promote-skill を使った証拠が残っている。
- text contract または関連 eval が、追加した責務境界を検出できる。

## 根拠

- [steering/policies.md](../../../steering/policies.md)
- [codebase-analysis.md](../codebase-analysis.md)
- [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277)

## 未確認事項

- 追加する eval 観点を `dev-scripts/evals/amadeus-templates/check.ts` に置くか、別の eval に分けるかは Construction で確認する。
