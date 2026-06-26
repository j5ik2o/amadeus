# artifacts validation

## 対象

全体成果物では、少なくとも次を対象にする。

- `.amadeus/README.md`
- `.amadeus/intents.md`
- `.amadeus/domain/subdomains.md`
- `.amadeus/domain/bounded-contexts.md`

対象 Intent ディレクトリ名が指定された場合は、少なくとも次を対象にする。

- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/subdomains.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts.md`

対象 Intent ディレクトリ名が指定された場合、次のファイルは存在する場合だけ検証する。

- `.amadeus/intents/<intent-id>-<slug>/user-stories.md`
- `.amadeus/intents/<intent-id>-<slug>/use-cases.md`
- `.amadeus/intents/<intent-id>-<slug>/codebase-analysis.md`
- `.amadeus/intents/<intent-id>-<slug>/units.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions.md`

対象 Intent ディレクトリ名が指定され、`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `ideation` の場合は、Ideation 段階の Intent として少なくとも次を対象にする。

- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/mocks/*.puml`

Ideation 段階の Intent では、次のファイルやディレクトリは Inception 以降で作る成果物として扱い、存在しない場合も不足にしない。

- `.amadeus/intents/<intent-id>-<slug>/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/user-stories.md`
- `.amadeus/intents/<intent-id>-<slug>/use-cases.md`
- `.amadeus/intents/<intent-id>-<slug>/codebase-analysis.md`
- `.amadeus/intents/<intent-id>-<slug>/units.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/**`

対象 Intent ディレクトリ名が指定され、`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `initialized` の場合は、Initialized 段階の Intent として少なくとも次を対象にする。

- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

Initialized 段階の Intent では、次のファイルやディレクトリは後続段階で作る成果物として扱い、存在しない場合も不足にしない。

- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/mocks/`
- `.amadeus/intents/<intent-id>-<slug>/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/user-stories.md`
- `.amadeus/intents/<intent-id>-<slug>/use-cases.md`
- `.amadeus/intents/<intent-id>-<slug>/codebase-analysis.md`
- `.amadeus/intents/<intent-id>-<slug>/units.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/**`

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
`詳細` は `.amadeus/intents/<intent-id>-<slug>/intent.md` を指す相対リンクにする。
`詳細` のディレクトリ名は同じ行の `識別子` と一致させる。

`依存関係` の表は、次の列を持つ。

- `インテント`
- `依存`
- `理由`

`インテント` は、`一覧` に存在する Intent ディレクトリ名または `なし` にする。
`依存` は `なし` または `一覧` に存在する Intent ディレクトリ名にする。
`理由` は空欄にしない。

## `domain/subdomains.md`

対象は次である。

- `.amadeus/domain/subdomains.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/subdomains.md`

必須見出しは次である。

- `一覧`

`一覧` の表は、次の列を持つ。

- `識別子`
- `名前`
- `種別`
- `役割`
- `コンテキスト`

`識別子` は `SDnnn` の形式にする。
同じ表の中で `識別子` を重複させない。

`コンテキスト` は、同じ階層の `domain/bounded-contexts.md` に存在する `BCnnn`、または `なし` にする。
複数の境界づけられたコンテキストを書く場合は、カンマ区切りで書く。

`種別` は次のいずれかにする。

- `コア`
- `支援`
- `汎用`
- `未分類`

分類理由の妥当性は、この検証では扱わない。

## Intent 基本ファイル

`.amadeus/intents/<intent-id>-<slug>/intent.md` の必須見出しは次である。

- `目的`
- `成功条件`
- `範囲`

## Initialized 段階の Intent

`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `initialized` の場合、`state.json` は次を満たす。

- JSON として解釈できる。
- `intent` が対象 Intent ディレクトリ名と一致する。
- `phase` が `initialized` である。
- `status` は `not_started`、`in_progress`、`waiting_approval`、`needs_changes`、`completed`、`skipped` のいずれかである。
- `initialized.status` は `not_started`、`in_progress`、`waiting_approval`、`needs_changes`、`completed`、`skipped` のいずれかである。
- `initialized.createdArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
- `initialized.next` は `ideation` である。

Initialized 段階では、`intent.md` と `state.json` 以外の後続成果物の ID 実在チェックは行わない。

## Ideation 段階の Intent

`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `ideation` の場合、`state.json` は次を満たす。

- JSON として解釈できる。
- `intent` が対象 Intent ディレクトリ名と一致する。
- `phase` が `ideation` である。
- `status` は `not_started`、`in_progress`、`waiting_approval`、`needs_changes`、`completed`、`skipped` のいずれかである。
- `ideation.status` は `not_started`、`in_progress`、`waiting_approval`、`needs_changes`、`completed`、`skipped` のいずれかである。
- `ideation.gate` は `not_ready`、`waiting_approval`、`passed`、`failed` のいずれかである。
- `ideation.requiredArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
- `ideation.requiredMocks` に書いた相対パスは、Intent ディレクトリ内に存在する `.puml` ファイルである。
- `status` が `completed` の場合、`ideation.status` は `completed`、`ideation.gate` は `passed` である。

`.amadeus/intents/<intent-id>-<slug>/scope.md` の必須見出しは次である。

- `対象`
- `対象外`
- `詳細度`
- `検証深度`
- `Inception への引き継ぎ`

`.amadeus/intents/<intent-id>-<slug>/ideation.md` の必須見出しは次である。

- `実現可能性`
- `体制`
- `初期モック`
- `未確定事項`
- `学習候補`

Ideation 段階の `.amadeus/intents/<intent-id>-<slug>/traceability.md` の必須見出しは次である。

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
- `inception.requiredBoltArtifacts` に書いた相対パスは、Intent ディレクトリ内に存在する。
- `status` が `completed` の場合、`inception.status` は `completed`、`inception.gate` は `passed` である。

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
- `タスク`

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

- `ボルト`
- `設計`
- `要求`
- `ユースケース`
- `タスク`

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

この検証では、追跡先 ID の意味的な正しさまでは扱わない。
ただし、`定義元` の相対リンクは存在するファイルを指す必要がある。

`traceability.md` に出る ID は、対応する index または定義元に存在する必要がある。
この検証では、対応の完全性、循環、内容上の妥当性は扱わない。

`既存コード分析からの追跡` の `要求`、`ユースケース`、`ユニット`、`ボルト` は、対応する index に存在する必要がある。
`分析` は、対象 Intent 直下の `codebase-analysis.md` を指す相対リンクにする。
`設計` は、同じ行の `ボルト` に対応する `bolts/<bolt-id>-<slug>/design.md` を指す相対リンクにする。
`入力` の内容妥当性は、この検証では扱わない。

`なし` は、参照が任意または外部不在を表す列だけで許可する。
少なくとも `ストーリー`、`外部システム`、`依存` では `なし` を許可する。
`要求`、`ユースケース`、`ユニット`、`ボルト`、`タスク`、`コンテキスト` は ID を必須にする。

Task ID は `Bnnn/Tnnn` を正規形にする。
`要求からの追跡` の `タスク` が `Tnnn` だけで書かれている場合は、同じ行の `ボルト` から `Bnnn/Tnnn` として解釈する。
`依存関係からの追跡` の Task は、`Bnnn/Tnnn` 形式にする。

`ドメインモデルからの追跡` の `PREnnn`、`INVnnn`、`POSTnnn` は、同じ行の `定義元` が指す `contracts.md` 内に存在する必要がある。

`ドメインモデルからの追跡` の DDD 要素は、`BCnnn/DMnnn/<ddd-element-id>` を正規形にする。
`<ddd-element-id>` は、`DAnnn`、`DEnnn`、`DVOnnn`、`DSnnn`、`DEVnnn`、`DRnnn`、`DFnnn` のいずれかである。
`BCnnn` は同じ階層の `domain/bounded-contexts.md` に存在する必要がある。
`DMnnn` は、その境界づけられたコンテキストの `models.md` に存在する必要がある。
`<ddd-element-id>` は、同じ行の `定義元` が指す `model.md` 内の対応する種別表に存在する必要がある。

`ドメインモデルからの追跡` の `種別` が `境界` の場合、`対象` は ID 化しない。
この場合の `対象` は、同じ階層の `domain/bounded-contexts.md` にある `外部境界` 表の `名前` に存在する必要がある。

`ドメインモデルからの追跡` の `種別` が DDD 要素を表す場合、`種別` と ID 接頭辞は一致する必要がある。

| 種別 | ID 接頭辞 |
|---|---|
| 集約 | `DA` |
| エンティティ | `DE` |
| 値オブジェクト | `DVO` |
| ドメインサービス | `DS` |
| ドメインイベント | `DEV` |
| リポジトリ | `DR` |
| ファクトリ | `DF` |

## `codebase-analysis.md`

対象は次である。

- `.amadeus/intents/<intent-id>-<slug>/codebase-analysis.md`

`codebase-analysis.md` は条件付き成果物である。
存在する場合、または `.amadeus/intents/<intent-id>-<slug>/state.json` の `inception.requiredArtifacts` に `codebase-analysis.md` が含まれる場合だけ検証する。
存在せず、`inception.requiredArtifacts` にも含まれない場合は不足にしない。

必須見出しは次である。

- `対象コード`
- `既存能力`
- `統合点`
- `ギャップ`
- `リスク`
- `Inception への入力`

この検証では、各見出しの内容妥当性、既存コード分析の網羅性、greenfield か brownfield かの判断妥当性は扱わない。

## `domain/bounded-contexts/<bounded-context-id>/models.md`

対象は次である。

- `.amadeus/domain/bounded-contexts/<bounded-context-id>/models.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts/<bounded-context-id>/models.md`

存在する場合だけ検証する。

必須見出しは次である。

- `一覧`

`一覧` の表は、次の列を持つ。

- `識別子`
- `名前`
- `役割`
- `詳細`

`識別子` は `DMnnn` の形式にする。
同じ表の中で `識別子` を重複させない。
`詳細` は `models/<ddd-module-id>-<slug>/model.md` を指す相対リンクにする。
`詳細` のリンク先ディレクトリ名は `DMnnn-<slug>` の形式にする。

## `domain/bounded-contexts/<bounded-context-id>/models/<ddd-module-id>-<slug>/model.md`

対象は次である。

- `.amadeus/domain/bounded-contexts/<bounded-context-id>/models/<ddd-module-id>-<slug>/model.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts/<bounded-context-id>/models/<ddd-module-id>-<slug>/model.md`

存在する場合だけ検証する。

DDD 要素は種別ごとに表を分ける。
次の表は、存在する場合だけ検証する。

- `集約`
- `エンティティ`
- `値オブジェクト`
- `ドメインサービス`
- `ドメインイベント`
- `リポジトリ`
- `ファクトリ`

各表は、次の列を持つ。

- `識別子`
- `名前`
- `役割`
- `根拠`

`名前`、`役割`、`根拠` は空欄にしない。
識別子は同じ `model.md` 内で重複させない。

各表の `識別子` は次の形式にする。

| 表 | 識別子 |
|---|---|
| 集約 | `DAnnn` |
| エンティティ | `DEnnn` |
| 値オブジェクト | `DVOnnn` |
| ドメインサービス | `DSnnn` |
| ドメインイベント | `DEVnnn` |
| リポジトリ | `DRnnn` |
| ファクトリ | `DFnnn` |

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

`bolts.md` の必須見出しは次である。

- `一覧`
- `依存関係`

`一覧` の表は、次の列を持つ。

- `識別子`
- `概要`
- `ユニット`
- `依存`
- `詳細`

`識別子` は `Bnnn` の形式にする。
`詳細` は `bolts/<bolt-id>-<slug>/bolt.md` を指す相対リンクにする。

Bolt 配下の `tasks.md` では、各 Task が次を持つ必要がある。

- `作業`
- `要求`
- `ユースケース`
- `依存`
- `証拠`

`作業` には、少なくとも1つの具体的な作業項目を書く。
`要求` は `requirements.md` の `一覧` に存在する Requirement ID にする。
`ユースケース` は `use-cases.md` の `一覧` に存在する Use Case ID にする。

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
`詳細` は `decisions/<decision-id>.md` を指す相対リンクにする。

これらの `依存関係` の表は、次の列を持つ。

- 対象種別の列
- `依存`
- `理由`

対象種別の列は、それぞれ `ユーザーストーリー`、`ユースケース`、`ユニット`、`ボルト`、`判断` にする。
対象種別の列は、同じファイルの `一覧` に存在する ID にする。
`依存` は `なし` または同じファイルの `一覧` に存在する ID にする。
`理由` は空欄にしない。
