# artifacts validation

## 対象

全体成果物では、少なくとも次を対象にする。

- `.amadeus/README.md`
- `.amadeus/steering.md`
- `.amadeus/steering/objective.md`
- `.amadeus/steering/product.md`
- `.amadeus/steering/tech.md`
- `.amadeus/steering/structure.md`
- `.amadeus/steering/actors.md`
- `.amadeus/steering/external-systems.md`
- `.amadeus/steering/knowledge.md`
- `.amadeus/steering/knowledge/README.md`
- `.amadeus/steering/policies.md`
- `.amadeus/steering/policies/README.md`
- `.amadeus/discoveries.md`
- `.amadeus/intents.md`
- `.amadeus/domain-map.md`
- `.amadeus/context-map.md`

対象 Intent ディレクトリ名が指定された場合は、少なくとも次を対象にする。

- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/traceability.md`

対象 Intent ディレクトリ名が指定された場合、次のファイルは存在する場合だけ検証する。

- `.amadeus/intents/<intent-id>-<slug>/inception/user-stories.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/use-cases.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/codebase-analysis.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/decisions.md`

対象 Intent ディレクトリ名が指定され、`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `ideation` の場合は、Ideation 段階の Intent として少なくとも次を対象にする。

- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/ideation/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/mocks/*.puml`

Ideation 段階の Intent では、次のファイルやディレクトリは Inception 以降で作る成果物として扱い、存在しない場合も不足にしない。

- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/user-stories.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/use-cases.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/codebase-analysis.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts.md`

## 共通ルール

必須対象のファイルが存在しない場合は `fail` にする。
存在する場合だけ検証するファイルが存在しない場合は、不足として扱わない。

Markdown の相対リンクは、リンクを書いたファイルからの相対パスとして解決する。
対象ファイル内の相対リンクが存在しないファイルを指す場合は `fail` にする。
外部 URL、アンカーだけのリンク、メールアドレスは参照先ファイル存在検査の対象外にする。

表の必須列は、順序ではなく列名で確認する。
必須列が欠けている場合は `fail` にする。
空行、補足文、表以外の説明文は、必須見出しと必須表列を壊さない限り許容する。

`依存` 列を持つ一覧表では、`依存` は `なし` または同じ一覧表に存在する識別子だけを許可する。
複数の依存を書く場合は、カンマ区切りで書く。
依存の意味的な妥当性、循環、階層をまたぐ依存整合性は、この検証では扱わない。

## `.amadeus/discoveries.md`

必須見出しは次である。

- `一覧`

`一覧` の表は、次の列を持つ。

- `識別子`
- `テーマ`
- `状態`
- `判定`
- `推奨次アクション`
- `詳細`

`識別子` は Discovery のモジュールディレクトリ名として扱う。
`識別子` は `YYYYMMDD-<slug>` 形式にする。
`<slug>` は英小文字、数字、ハイフンだけで書く。
同じ表の中で `識別子` を重複させない。
`詳細` は `.amadeus/discoveries/<discovery-id>.md` を指す相対リンクにする。
`詳細` のディレクトリ名は同じ行の `識別子` と一致させる。

## `.amadeus/intents.md`

必須見出しは次である。

- `一覧`
- `依存関係`

`一覧` の表は、次の列を持つ。

- `識別子`
- `概要`
- `依存`
- `詳細`

`識別子` は Intent ディレクトリ名として扱う。
`識別子` は `YYYYMMDD-<slug>` 形式にする。
`<slug>` は英小文字、数字、ハイフンだけで書く。
同じ表の中で `識別子` を重複させない。
`詳細` は `.amadeus/intents/<intent-id>-<slug>.md` を指す相対リンクにする。
`詳細` のディレクトリ名は同じ行の `識別子` と一致させる。

`依存関係` の表は、次の列を持つ。

- `インテント`
- `依存`
- `理由`

`インテント` は、`一覧` に存在する Intent ディレクトリ名または `なし` にする。
`依存` は `なし` または `一覧` に存在する Intent ディレクトリ名にする。
`理由` は空欄にしない。

## Domain Map と Context Map

Domain Map と Context Map の検証条件は、[Domain Map and Context Map validation](domain-map.md) に従う。

Domain Map は、Subdomain と Bounded Context の現在の索引である。
状態は `adopted` または `retired` にする。

Context Map は、Bounded Context 間の依存の現在の索引である。
Downstream Context、Upstream Context、Organization Pattern、Integration Pattern、状態、根拠を検証する。

## Intent 基本ファイル

`.amadeus/intents/<intent-id>-<slug>.md` の必須見出しは次である。

- `目的`
- `成功条件`
- `範囲`

## Ideation 段階の Intent

`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `ideation` の場合、`state.json` は次を満たす。

- JSON として解釈できる。
- `intent` が対象 Intent ディレクトリ名と一致する。
- `phase` が `ideation` である。
- `status` は `not_started`、`in_progress`、`waiting_approval`、`needs_changes`、`completed`、`skipped` のいずれかである。
- `ideation.status` は `not_started`、`in_progress`、`waiting_approval`、`needs_changes`、`completed`、`skipped` のいずれかである。
- `ideation.intentCapture.status` は `not_started`、`in_progress`、`waiting_approval`、`needs_changes`、`completed`、`skipped` のいずれかである。
- `ideation.intentCapture.createdArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
  ただし Intent のモジュールファイルを指す場合だけ、`../<intent-id>-<slug>.md` を許可する。
- `ideation.intentCapture.next` は `ideation/scope-framing` である。
- `ideation.gate` は `not_ready`、`waiting_approval`、`passed`、`failed` のいずれかである。
- `ideation.requiredArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
  ただし Intent のモジュールファイルを指す場合だけ、`../<intent-id>-<slug>.md` を許可する。
- `ideation.requiredMocks` に書いた相対パスは、Intent ディレクトリ内に存在する `.puml` ファイルである。
- `status` が `completed` の場合、`ideation.status` は `completed`、`ideation.gate` は `passed` である。
- `実行スコープ`、`成果物深度`、`検証戦略` などの scope 制御値は `state.json` に保存しない。
  `ideation/scope.md` を定義元にし、採用理由や変更理由は `ideation/decisions.md` と `ideation/decisions/**` に記録する。

`.amadeus/intents/<intent-id>-<slug>/ideation/scope.md` の必須見出しは次である。

- `対象境界`
- `実行制御`
- `成果物深度`
- `検証戦略`
- `Inception への引き継ぎ`

`対象境界` には `対象` と `対象外` の小見出しを置く。
それぞれの小見出しには、`識別子`、`境界`、`根拠`、`状態` の列を持つ表を置く。

`対象` の `識別子` は `SC-IN-nnn` 形式である。
`対象外` の `識別子` は `SC-OUT-nnn` 形式である。
`SC-IN-*` と `SC-OUT-*` は、同じ `scope.md` の中で重複しない。

`実行制御` には、`項目`、`値`、`理由` の列を持つ表を置く。
`実行スコープ` の値は、`enterprise`、`feature`、`mvp`、`poc`、`bugfix`、`refactor`、`infra`、`security-patch`、`workshop`、`未確認` のいずれかである。
`省略 stage` が `なし` または `未確認` 以外の場合、`理由` に省略理由を書く。

`成果物深度` には、`項目`、`値`、`理由` の列を持つ表を置く。
`深度` の値は、`minimal`、`standard`、`comprehensive`、`未確認` のいずれかである。

`検証戦略` には、`項目`、`値`、`理由` の列を持つ表を置く。
`戦略` の値は、`minimal`、`standard`、`comprehensive`、`未確認` のいずれかである。

`.amadeus/intents/<intent-id>-<slug>/ideation/ideation.md` の必須見出しは次である。

- `実現可能性`
- `体制`
- `初期モック`
- `未確定事項`
- `学習候補`

Ideation 段階の `.amadeus/intents/<intent-id>-<slug>/ideation/traceability.md` の必須見出しは次である。

- `Ideation からの追跡`
- `依存関係からの追跡`

`Ideation からの追跡` の表は、次の列を持つ。

- `Ideation 要素`
- `対象`
- `定義元`
- `後続への渡し方`

`依存関係からの追跡` の表は、次の列を持つ。

- `種別`
- `対象`
- `依存`
- `理由`
- `定義元`

Ideation 段階の `traceability.md` では、`定義元` の相対リンクは存在するファイルを指す必要がある。
ただし、要求、ユースケース、ユニット、ボルト、タスク、ドメインモデルの ID 実在チェックは、Inception 以降の成果物が作られるまで対象外にする。

`Ideation からの追跡` には、少なくとも次の `Ideation 要素` を置く。

- `対象境界`
- `実行制御`
- `成果物深度`
- `検証戦略`

これらの行は `scope.md` を定義元にし、後続 stage へ渡す対象境界、実行制御、成果物深度、検証戦略を明示する。

## Inception 段階の Intent

`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `inception` の場合、`state.json` は次を満たす。

- JSON として解釈できる。
- `intent` が対象 Intent ディレクトリ名と一致する。
- `phase` が `inception` である。
- `status` は `not_started`、`in_progress`、`waiting_approval`、`needs_changes`、`completed`、`skipped` のいずれかである。
- `ideation.status` は `completed` である。
- `ideation.gate` は `passed` である。
- `inception.status` は `not_started`、`in_progress`、`waiting_approval`、`needs_changes`、`completed`、`skipped` のいずれかである。
- `inception.gate` は `not_ready`、`waiting_approval`、`passed`、`failed` のいずれかである。
- `inception.requiredArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
  ただし Intent のモジュールファイルを指す場合だけ、`../<intent-id>-<slug>.md` を許可する。
- `inception.requiredRequirementArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
- `inception.requiredStoryArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
  Story が不要な Intent では空配列を許可する。
- `inception.requiredUseCaseArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
- `inception.requiredDecisionArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
- `inception.requiredBoltArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
  ただし Intent のモジュールファイルを指す場合だけ、`../<intent-id>-<slug>.md` を許可する。
- `status` が `completed` の場合、`inception.status` は `completed`、`inception.gate` は `passed` である。

## Construction 段階の Intent

`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `construction` の場合、`state.json` は次を満たす。

- JSON として解釈できる。
- `intent` が対象 Intent ディレクトリ名と一致する。
- `phase` が `construction` である。
- `status` は `not_started`、`in_progress`、`waiting_approval`、`needs_changes`、`completed`、`skipped` のいずれかである。
- `ideation.status` は `completed` である。
- `ideation.gate` は `passed` である。
- `inception.status` は `completed` である。
- `inception.gate` は `passed` である。
- `construction.status` は `not_started`、`in_progress`、`waiting_approval`、`needs_changes`、`completed`、`skipped` のいずれかである。
- `construction.gate` は `not_ready`、`waiting_approval`、`passed`、`failed` のいずれかである。
- `construction.targetBolts` は `inception/bolts.md` の既存 Bolt ID を参照する。
- `construction.functionalDesign` はオブジェクトである。
- `construction.functionalDesign.targetUnits` は Unit ID の配列である。
- `construction.functionalDesign.units` は Functional Design の Unit 別状態を持つ配列である。
- `construction.functionalDesign.units[].unitId` は `inception/units.md` の既存 Unit ID、または未解決 Unit ID である。
- `construction.functionalDesign.units[].requirement` は `required`、`not_required`、`unresolved` のいずれかである。
- `construction.functionalDesign.units[].status` は `not_started`、`in_progress`、`ready_for_approval`、`passed`、`failed`、`skipped`、`blocked` のいずれかである。
- `construction.functionalDesign.units[].frontendSurface` は `present`、`absent`、`unresolved` のいずれかである。
- `construction.functionalDesign.units[].targetSource` は `functional_design_target_units`、`construction_target_units`、`construction_target_bolts`、`user_specified` のいずれかである。
- `construction.functionalDesign.units[].runMode` は `initial`、`rerun` のいずれかである。
- `construction.functionalDesign.units[].skipReason` を書く場合は `unit_not_in_construction_scope` だけを許可する。
- `construction.functionalDesign.units[].blockedReason` を書く場合は `target_unit_unresolved`、`unit_design_missing`、`frontend_surface_unresolved`、`required_input_missing` のいずれかである。
- `construction.functionalDesign` と `construction.functionalDesign.units[]` は `artifacts`、`required`、`surfaces`、`gate` を保存しない。
- `construction.bolts` は配列である。
- `construction.bolts[]` は対象 Bolt の `id` と `taskGeneration` を持つ。
- `construction.bolts[].taskGeneration.status` は `not_started`、`in_progress`、`ready_for_approval`、`passed`、`failed`、`blocked` のいずれかである。
- `construction.bolts[].taskGeneration.blockedReason` を書く場合は `functional_design_missing`、`functional_design_not_passed`、`unit_design_missing`、`bolt_scope_unresolved`、`required_input_missing`、`task_generation_conflict` のいずれかである。
- `construction.bolts[].taskGeneration.evidence[]` は `kind` と `path` を持つ。
- `construction.bolts[].taskGeneration.evidence[].kind` は `functional_design`、`unit_design_brief`、`bolt_module`、`tasks`、`notes`、`approval` のいずれかである。
- `construction.bolts[].taskGeneration.evidence[].path` は Intent ディレクトリ内の相対パスを指す。
- `ready_for_approval` は `functional_design`、`unit_design_brief`、`bolt_module`、`tasks` の evidence を持つ。
- `passed` は `functional_design`、`unit_design_brief`、`bolt_module`、`tasks`、`approval` の evidence を持つ。
- `not_started` は evidence と `blockedReason` を持たない。
- `in_progress` は `bolt_module` evidence を持ち、`blockedReason` を持たない。
- `blocked` は `blockedReason` と evidence を持つ。
- `failed` は evidence を持つ。
- `construction.bolts[]` は旧 Bolt gate 状態と旧 tasks 状態を保存しない。
- `construction.requiredArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
  ただし Intent のモジュールファイルを指す場合だけ、`../<intent-id>-<slug>.md` を許可する。
- `construction.requiredArtifacts` は `construction/decisions.md` を含む。
- `construction.requiredBoltArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
  ただし Intent のモジュールファイルを指す場合だけ、`../<intent-id>-<slug>.md` を許可する。
- `construction.requiredBoltArtifacts` は Bolt 側の設計ファイルを含まない。
- Bolt 側の設計ファイルは存在しない。
- `construction.status` が `completed`、または `construction.gate` が `passed` の場合、対象 Bolt の `test-results.md` は `construction.requiredBoltArtifacts` に含まれる。
- `status` が `completed` の場合、`construction.status` は `completed`、`construction.gate` は `passed` である。

Functional Design の Unit 別状態は、次の組み合わせだけを許可する。

- `required` は `not_started`、`in_progress`、`ready_for_approval`、`passed`、`failed`、`blocked` を許可する。
- `required` と `blocked` の組み合わせでは、`blockedReason` は `unit_design_missing`、`frontend_surface_unresolved`、`required_input_missing` のいずれかにする。
- `required` と `frontendSurface: unresolved` の組み合わせでは、`status` は `blocked`、`blockedReason` は `frontend_surface_unresolved` にする。
- `required` は `skipped`、`skipReason`、`blockedReason: target_unit_unresolved` と併用しない。
- `not_required` は `status: skipped`、`skipReason: unit_not_in_construction_scope` と組み合わせる。
- `unresolved` は `status: blocked`、`blockedReason: target_unit_unresolved` と組み合わせる。
- `FunctionalDesignGateResult` は Unit 別 `status` から導出し、`state.json` には保存しない。
- Functional Design の成果物要求、条件付き成果物、パス、見出し、表構造は、Amadeus DLC Contract Catalog から導出する。

Task Generation が `ready_for_approval` または `passed` の場合、`Task Generation からの追跡` は tasks evidence と同じ `tasks.md` を指す。
同じ追跡行の `Task` は、対象 Bolt の全 Task を指す。
Construction が完了済み、または `construction.gate` が `passed` の場合、同じ追跡行の `実装` と `検証` は `未実施` のままにしない。
Construction が完了済み、または `construction.gate` が `passed` の場合、`ユースケース` が `なし` の Task を含む追跡行は `理由` 列を持つ。
その `理由` には、Use Case を参照しない理由を `なし`、`未確認`、`該当なし` 以外で書く。

Construction 段階の `construction/bolts/<bolt-id>/notes.md` は、次の見出しを持つ。

- `実行方針`
- `対象タスク`
- `未確認事項`

Construction 段階の `construction/bolts/<bolt-id>/test-results.md` は、次の見出しを持つ。

- `検証結果`
- `安全性確認`
- `CI確認`
- `受け入れ証拠`

`受け入れ証拠` の表は、次の列を持つ。

- `要求`
- `タスク`
- `証拠`
- `要約`

Construction 段階の `construction/bolts/<bolt-id>/pr.md` は、PR が存在する場合だけ作る。
存在する場合は、次の見出しを持つ。

- `Pull Request`
- `対象`
- `確認状況`

## `requirements.md`

必須見出しは次である。

- `一覧`
- `依存関係`
- `受け入れ状態`

`一覧` の表は、次の列を持つ。

- `識別子`
- `概要`
- `状態`
- `依存`
- `詳細`

`識別子` は `Rnnn` の形式にする。
同じ表の中で `識別子` を重複させない。
`詳細` は `requirements/<requirement-id>-<slug>.md` を指す相対リンクにする。

`依存関係` の表は、次の列を持つ。

- `要求`
- `依存`
- `理由`

`要求` は、`一覧` に存在する Requirement ID にする。
`理由` は空欄にしない。

## `acceptance.md`

必須見出しは次である。

- `要求状態`
- `状態ルール`

`要求状態` の表は、次の列を持つ。

- `要求`
- `状態`
- `証拠`

`要求` は、`requirements.md` の `一覧` に存在する Requirement ID にする。
`状態` と `証拠` は空欄にしない。

## `traceability.md`

必須見出しは次である。

- `要求からの追跡`
- `対象境界からの追跡`
- `背景からの追跡`
- `ボルトからの追跡`
- `設計からの追跡`
- `既存コード分析からの追跡`
- `ユニットからの追跡`
- `ドメインモデルからの追跡`
- `依存関係からの追跡`

`要求からの追跡` の表は、次の列を持つ。

- `要求`
- `アクター`
- `ストーリー`
- `ユースケース`
- `ユニット`
- `ボルト`

`タスク` 列は持たない。
Task は Construction で生成する。

`対象境界からの追跡` の表は、次の列を持つ。

- `対象境界`
- `要求`
- `ユーザーストーリー`
- `ユースケース`
- `ユニット`
- `ボルト`
- `扱い`

`対象境界` は、`ideation/scope.md` の `SC-IN-*` または `SC-OUT-*` に存在する必要がある。
採用済みの `SC-IN-*` は、`対象境界からの追跡` に存在する必要がある。
`SC-IN-*` の行は、少なくとも一つの Requirement、Story、Use Case、Unit、Bolt を参照する。
対象外境界の混入検査は内容上の疑いを含むため、最初は `warning` として扱い、gate failure にはしない。

`背景からの追跡` の表は、次の列を持つ。

- `目的`
- `アクター`
- `外部システム`
- `要求`

`ボルトからの追跡` の表は、次の列を持つ。

- `ボルト`
- `ユニット`
- `要求`

`設計からの追跡` の表は、次の列を持つ。

- `設計`
- `ユニット`
- `要求`
- `ユースケース`
- `ボルト`

`タスク` 列は持たない。
Task は Construction で生成する。

`既存コード分析からの追跡` の表は、次の列を持つ。

- `分析`
- `要求`
- `ユースケース`
- `ユニット`
- `ボルト`
- `設計`
- `入力`

`ユニットからの追跡` の表は、次の列を持つ。

- `ユニット`
- `コンテキスト`
- `要求`
- `ユースケース`
- `ボルト`

`ドメインモデルからの追跡` の表は、次の列を持つ。

- `種別`
- `対象`
- `要求`
- `ユースケース`
- `定義元`

`依存関係からの追跡` の表は、次の列を持つ。

- `種別`
- `対象`
- `依存`
- `理由`
- `定義元`

この検証では、追跡先 ID の業務上の妥当性までは扱わない。
ただし、`定義元` の相対リンクは存在するファイルを指す必要がある。

`traceability.md` に出る ID は、対応する index または定義元に存在する必要がある。
この検証では、対応の完全性、循環、内容上の妥当性は扱わない。
ただし、成果物契約として固定された相対リンクと ID の対応は構造検査として扱う。

`既存コード分析からの追跡` の `要求`、`ユースケース`、`ユニット`、`ボルト` は、対応する index に存在する必要がある。
`分析` は、対象 Intent の `inception/codebase-analysis.md` を指す相対リンクにする。
`設計` は、同じ行の `ユニット` に対応する `units/<unit-id>-<slug>/design.md` を指す相対リンクにする。
`入力` の内容妥当性は、この検証では扱わない。

`なし` は、参照が任意または外部不在を表す列だけで許可する。
少なくとも `ストーリー`、`外部システム`、`依存` では `なし` を許可する。
`要求`、`ユースケース`、`ユニット`、`ボルト`、`コンテキスト` は ID を必須にする。
Task ID は Construction 以降の追跡で `Bnnn/Tnnn` を正規形にする。

Inception 以降の Unit の `コンテキスト` は、Domain Map の `adopted` Bounded Context を参照する必要がある。

詳細な Domain Model と Intent Contracts は、Construction の Functional Design で検証する。

## `codebase-analysis.md`

対象は次である。

- `.amadeus/intents/<intent-id>-<slug>/inception/codebase-analysis.md`

`codebase-analysis.md` は条件付き成果物である。
存在する場合、または `.amadeus/intents/<intent-id>-<slug>/state.json` の `inception.requiredArtifacts` に `inception/codebase-analysis.md` が含まれる場合だけ検証する。
存在せず、`inception.requiredArtifacts` にも含まれない場合は不足にしない。

必須見出しは次である。

- `対象コード`
- `既存能力`
- `統合点`
- `ギャップ`
- `リスク`
- `Inception への入力`

この検証では、各見出しの内容妥当性、既存コード分析の網羅性、greenfield か brownfield かの判断妥当性は扱わない。

## 存在する場合だけ検証する Intent index

`user-stories.md` の必須見出しは次である。

- `一覧`
- `依存関係`

`一覧` の表は、次の列を持つ。

- `識別子`
- `アクター`
- `概要`
- `要求`
- `依存`
- `詳細`

`識別子` は `Snnn` の形式にする。
`詳細` は `user-stories/<story-id>-<slug>.md` を指す相対リンクにする。

`use-cases.md` の必須見出しは次である。

- `一覧`
- `依存関係`

`一覧` の表は、次の列を持つ。

- `識別子`
- `アクター`
- `外部システム`
- `ストーリー`
- `要求`
- `依存`
- `詳細`

`識別子` は `UCnnn` の形式にする。
`詳細` は `use-cases/<use-case-id>-<slug>.md` を指す相対リンクにする。

`units.md` の必須見出しは次である。

- `一覧`
- `依存関係`

`一覧` の表は、次の列を持つ。

- `識別子`
- `概要`
- `要求`
- `コンテキスト`
- `依存`
- `詳細`

`識別子` は `Unnn` の形式にする。
`詳細` は `units/<unit-id>-<slug>.md` を指す相対リンクにする。

`units/<unit-id>-<slug>.md` は `実装対象` 見出しを持つ。
`実装対象` の表は、次の列を持つ。

- `識別子`
- `repository`
- `path`
- `branch`
- `PR`
- `CI`

`識別子` は `ITnnn` の形式にする。
`repository` と `path` は具体値または `未確認` にする。
`branch`、`PR`、`CI` は具体値、`なし`、または `未確認` にする。
`PR` に具体値を書く場合は GitHub PR URL にする。

`bolts.md` の必須見出しは次である。

- `一覧`
- `依存関係`

`一覧` の表は、次の列を持つ。

- `識別子`
- `概要`
- `ユニット`
- `設計`
- `依存`
- `詳細`

`識別子` は `Bnnn` の形式にする。
`ユニット` は `units.md` の `一覧` に存在する Unit ID にする。
複数の Unit ID を書く場合は、カンマ区切りで書く。
同じ Bolt の `ユニット` では、同じ Unit ID を重複させない。
`設計` は、同じ行の `ユニット` に対応する `units/<unit-id>-<slug>/design.md` を指す相対リンクにする。
`詳細` は `bolts/<bolt-id>-<slug>.md` を指す相対リンクにする。

`bolts/<bolt-id>-<slug>.md` の `対象ユニット` は、`bolts.md` の同じ Bolt 行にある Unit ID を含む。
`bolts/<bolt-id>-<slug>.md` の `設計` は、対象 Unit の Unit Design Brief を指す。
`bolts/<bolt-id>-<slug>.md` は Unit と同じ構造の `実装対象` 表を持つ。
複数リポジトリまたは複数 path を扱う Bolt では、変更対象ごとに `ITnnn` の行を分ける。
複数 Unit を参照する Bolt では、`複数 Unit を扱う理由` 見出しと本文を持つ。

Inception phase では、Bolt 配下に `tasks.md` を持たない。
Task は Functional Design、Unit Design Brief、Bolt module を根拠に Construction phase の Task Generation で生成する。

Bolt 配下の `tasks.md` では、各 Task が次を持つ必要がある。

- `作業`
- `要求`
- `ユースケース`
- `依存`
- `設計根拠`
- `証拠`

`作業` には、少なくとも1つの具体的な作業項目を書く。
`要求` は `requirements.md` の `一覧` に存在する Requirement ID にする。
`ユースケース` は `use-cases.md` の `一覧` に存在する Use Case ID、または `なし` にする。
`なし` は、相互作用がない内部作業の場合だけ使う。
Construction が完了済み、または `construction.gate` が `passed` の場合、`ユースケース` が `なし` の Task は `Task Generation からの追跡` に Use Case を参照しない理由を持つ。
`設計根拠` は、同じ Bolt の `design.md` 内で Task 化の根拠になる見出しまたは判断を指す。

`decisions.md` の必須見出しは次である。

- `一覧`
- `依存関係`

`一覧` の表は、次の列を持つ。

- `識別子`
- `概要`
- `状態`
- `依存`
- `詳細`

`識別子` は `Dnnn` の形式にする。
`詳細` は `decisions/<decision-id>-<slug>.md` を指す相対リンクにする。

これらの `依存関係` の表は、次の列を持つ。

- 対象種別の列
- `依存`
- `理由`

対象種別の列は、それぞれ `ユーザーストーリー`、`ユースケース`、`ユニット`、`ボルト`、`判断` にする。
対象種別の列は、同じファイルの `一覧` に存在する ID にする。
`依存` は `なし` または同じファイルの `一覧` に存在する ID にする。
`理由` は空欄にしない。
