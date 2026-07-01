# Construction finalization skill の追跡表要件明記

## 目標プロファイル

| フィールド | 値 | 説明 |
|---|---|---|
| goalType | technical | Amadeus の skill 説明と validator の成果物契約を一致させる技術目標である。 |
| scope | refactor | 既存の Construction finalization の振る舞いを変えず、skill 記述と必要な関連成果物を補正する Intent である。 |
| labels | skill, construction, traceability, validator | Construction finalization skill、traceability、validator 要件を表す。 |

## 目的

Construction finalization skill に、完了済み Construction で必要な `Construction からの追跡` 表要件を明記する。

この Intent は [Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245) を根拠にする。

## 成功条件

- Construction 完了時の `Construction からの追跡` 表要件が skill に明記されている。
- 表の必須列が `ボルト`、`タスク`、`証拠`、`状態` であることが分かる。
- `Task Generation からの追跡` だけでは、完了済み Construction の traceability 条件を満たさないことが分かる。
- 対象 Intent の validator が pass する。
- `npm run typecheck` と `npm run diff:check` が pass する。

## 範囲

含めるもの:

- `amadeus-construction` の検証説明。
- `amadeus-construction-traceability-finalization` の手順と成果物要件。
- 必要な場合の source skill と昇格先成果物の対応更新。
- 必要な場合の template または example の `construction/traceability.md` 確認。

含めないもの:

- Construction の新しい stage や phase の追加。
- validator の成果物契約変更。
- Issue #233 の成果物再設計。
- 実装コードの大規模な構造変更。
