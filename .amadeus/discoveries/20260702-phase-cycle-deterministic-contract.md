# phase cycle の進行と完了確定の決定論的契約 Discovery Brief

## 入力テーマ

- [Issue #314](https://github.com/amadeus-dlc/amadeus/issues/314) の「phase cycle の進行と完了確定を決定論的な契約にする」。

## 確認した前提

- 入力元は GitHub Issue である。
- 対象分類は Amadeus DLC 契約と Amadeus 実装の両方である。
- Issue #314 は、Intent `20260702-skill-change-review-contract` の cycle 振り返りから作られた親 Issue であり、子 Issue として #306、#307、#309、#310、#311 を持つ。
- 根本課題は、phase の進行、承認、完了確定がハーネスやエージェントの裁量で変わることと、`state.json` の手書きと phase ごとの PR 往復が内容の作成よりも大きいコストになっていることの 2 点である。
- Issue #314 は、この親 Issue を 1 つの Discovery の入力として扱い、Intent への分割は Discovery で判断すると明記している。
- Issue #306 と #307 は同じ Task Generation Gate 契約の両面（skill 側の契約定義と validator 側の evidence 検査）であり、1 つの Intent に統合して扱う。
- 子 Issue #309 は既存 Intent [20260702-construction-finalization-resume](../intents/20260702-construction-finalization-resume.md) として Inception 完了済み（gate passed）であり、新規 Intent 候補にしない。
- 最初に Ideation へ進める recommended 候補は #306+#307 の統合 Intent である。
- 既存 Discovery に同じテーマはない。

## 判定

multi_intent

## 判定理由

- Issue #314 は、skill のゲート契約、validator 検査、finalization 再開、steering policy、同梱スクリプトの複数領域にまたがるため、単一 Intent として扱うには大きい。
- #306 と #307 は同じゲート契約の両面であり、契約定義と検査を別 Intent に分けると契約形式の合意を 2 回やり直すリスクがあるため、1 Intent に統合する。
- #311 の `state.json` 雛形に含める evidence フィールドは、#306+#307 のゲート契約で定まる形式を前提にするため、ゲート契約の確定を先行させる。
- #310 の統合 PR 検証は、#311 の雛形生成が整うと検証手順が単純になるため、#311 の後に扱う。
- #309 は既存 Intent として cycle が先行しており、この Discovery では新規候補ではなく既存 Intent の継続として扱う。

## Intent Draft

該当なし

## Intent 候補

| 候補 | 状態 | Intent | 課題 | 成功状態 | 除外範囲 | 依存 |
|---|---|---|---|---|---|---|
| phase skill の人間ゲートと承認 evidence 検査を決定論的契約にする（#306+#307） | recommended | 未作成 | Task Generation Gate の人間承認と grilling 起動に契約の迂回路があり、ハーネスによって承認なしで実装へ進める。validator も承認 evidence の対応を検査しない。 | 人間承認なしに実装実行へ進めない契約が implementation-execution と bolt-preparation から読め、grilling 起動の決定論的トリガーが 3 つの phase skill に定義され、承認 evidence なしの `passed` が validator で fail になる。 | 承認内容の妥当性判断、approval evidence が指す成果物の内容検査、Task Generation 以外の新しい人間ゲートの追加、完了済み Intent 成果物の遡及修正は含めない。 | なし |
| phase 遷移の state.json 雛形を skill 同梱スクリプトで生成する（#311） | waiting | 未作成 | `state.json` の手書きが validator の要求構造と合わず、修正往復が発生している。 | 各 phase 遷移の直後に validator が `state.json` の構造 fail を出さず、スクリプトが配布先ユーザー環境で動作する。 | repo root の dev-scripts への配置、成果物 Markdown の自動生成、validator の要求構造そのものの変更は含めない。 | ゲート契約（#306+#307）で定まる evidence の形式を雛形の前提にするため、その後に扱う。 |
| 小さい Intent の phase PR 統合条件を steering policy として定義する（#310） | waiting | 未作成 | 小さい Intent でも phase ごとの PR 往復と merge 待ちが内容の作成よりも大きいコストになっている。 | 統合を許可する条件と許可しない場合の既定が policy から読め、統合 PR の記録項目が定義され、validator の phase 状態検証が成立する。 | Construction 実装と finalization の統合、phase gate そのものの廃止や自動化、大きい Intent への適用は含めない。 | #311 の雛形生成が整うと統合 PR の検証が単純になるため、その後に扱う。 |

## 候補判断

- recommended は「phase skill の人間ゲートと承認 evidence 検査を決定論的契約にする（#306+#307）」である。
- この候補は Issue #314 の根本課題（進行判断が裁量で変わる）を直接解消する中核であり、ゲート契約で定まる evidence 形式は #311 の雛形と Issue #315 の検査責務境界の前提になる。
- #311 はゲート契約の確定後に扱う。#310 は #311 の後に扱う。
- #309 は既存 Intent の継続であり、この Discovery の候補順序とは独立に Construction を進められる。

## 既存 Intent との関係

- [20260702-construction-finalization-resume](../intents/20260702-construction-finalization-resume.md) は子 Issue #309 を扱う既存 Intent であり、Inception 完了済み（gate passed）で Construction 待ちである。この Discovery では新規候補にせず、既存 Intent の継続として扱う。
- [20260702-skill-change-review-contract](../intents/20260702-skill-change-review-contract.md) は Issue #314 の起点になった cycle 振り返りの Intent であり、Construction 完了済みである。この Discovery の候補は、その振り返りで確定したレビュー支援契約（挙動差分要約、skill-forge 確認、粒度制約）に従う。
- [20260702-stage-prerequisite-checks](../intents/20260702-stage-prerequisite-checks.md) は finalization 専用ブランチの人間起点運用の背景になった Intent であり、#309 の課題観察の根拠である。

## 推奨次アクション

- recommended 候補「phase skill の人間ゲートと承認 evidence 検査を決定論的契約にする（#306+#307）」を `amadeus-ideation` に渡す。
