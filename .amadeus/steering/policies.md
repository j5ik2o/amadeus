# Policies

## 方針

- target workspace の root `.amadeus/` を、Amadeus 本体開発用の steering layer として扱う。
- Intent ごとに対応する GitHub Issue を持つ。
- Issue 本文は要約設計を持ち、詳細な Requirement、Acceptance、Traceability、Decision は `.amadeus/` に置く。
- skill 変更、validator 変更、example 更新、語彙追加、docs 更新を変更種別として扱う。
- build workspace、host environment、target workspace、target artifacts を分けて記録する。
- Git ブランチ戦略は [Git Branching Policy](policies/git-branching.md) に従う。
- AGENTS.md は操作指示を扱い、steering policy は Intent 成果物から参照する長期方針を扱う。

## 禁止事項

- `git submodule` で同じ Amadeus リポジトリを入れ子にしない。
- `.target-amadeus/` のような別名ディレクトリを作らない。
- `host` を workspace 名として使わない。
- stage2 を次回作業の stage0 に自動昇格しない。
- 作業 branch を次の Issue または次の phase へ暗黙に流用しない。

## 判断基準

- stage2 を次回 stage0 として扱うには、対象 PR が現在の基準 branch に merge 済みであり、build workspace が merge 後の基準 commit を参照し、人間が採用を承認している必要がある。
- stage0 採用判断は Maintainer が行い、validator pass や CI pass だけで stage2 を次回 stage0 に自動昇格しない。
- stage0 採用判断の証拠には、対象 PR、基準 commit、build workspace の参照 commit、対象 Intent、検証結果を含める。
- provenance は、実際に使った build workspace、target workspace、skill、validator、開発用スクリプト、stage 判定、人間の stage0 採用判断から追跡できる形で記録する。
- 初回導入では、skill、validator、example snapshot、ハーネスの実装変更を後続 Intent に分ける。
- 作業 branch は最新の `origin/main` を基点に作る。
- PR merge 後は、最新の `origin/main` に追従してから次の作業 branch を作る。
- PR 作成前には、対象 Intent の validator と標準検証の結果を記録する。
- skill 変更 PR は、skill 変更だけで構成することを既定とする。source skill と昇格先成果物の同期は skill 変更の一部であり、常に同一 PR に含める。
- 他の変更種別を skill 変更と同一 PR に含めてよいのは、分割するとどちらかの PR 単独で検証が fail する不可分な場合だけである。
- 粒度制約の例外を使う場合は、理由と後続確認先を PR 説明に記録する。記録の型は [Git Branching Policy](policies/git-branching.md) の例外記録に合わせる。
- merge 操作は人間が行う。

## provenance の最低記録項目

- build workspace の path と commit。
- target workspace の path と commit。
- host environment の識別情報。
- target artifacts の対象範囲。
- 利用した昇格済み skill の path、commit、md5。
- 利用した validator の path、commit、md5、実行結果。
- 利用した開発用スクリプトの path、commit、md5。
- stage 判定の根拠。
- 人間による次回 stage0 採用判断の有無。

## 変更種別ごとの完了条件

| 変更種別 | 必須条件 | 推奨条件 |
|---|---|---|
| skill 変更 | source skill と昇格先成果物の差分、昇格手段、対象 Intent、検証結果、provenance を記録する。PR 説明に、挙動差分の要約（変わる判断、変わる成果物構造、影響する後続 phase の3観点を最低ラインとし、補足は自由記述）を記録する。skill-forge による確認を実施し、PR 説明の固定見出し「skill-forge 確認」に、確認した観点（skill 境界、trigger description、本文指示、eval coverage、存在する場合は Codex metadata。該当しない観点は「該当なし」）と確認結果を記録する。 | 影響する example snapshot と validator 契約を確認する。 |
| validator 変更 | 先に失敗する eval または検証を追加し、validator と標準検証の結果を記録する。 | 影響する成果物 phase とエラー表示の読みやすさを確認する。 |
| example 更新 | 実際の skill で生成し、`examples/skill-provenance.json` と validator 結果を記録する。 | 上流 phase から再生成する必要があるかを確認する。 |
| 語彙追加 | `CONTEXT.md` または `.amadeus/glossary.md` のどちらに置くかを判断し、未確定語を確定語彙として扱わない。 | 既存成果物で同じ概念が別名になっていないか確認する。 |
| docs 更新 | 対象 docs、対応 Issue、関連する Amadeus DLC 成果物との関係を記録する。 | docs と skill、validator、example の契約がずれていないか確認する。 |
