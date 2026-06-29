# AI-DLC Concept Model

## 決定

Amadeus DLC の概念モデルでは、Story を条件付き概念として扱う。

Story は、Requirement をユーザー価値の単位で表す必要がある機能開発で作る。

Story は「誰が、何のために、何をしたいか」と受け入れ条件を表す。

リファクタ、バグ修正、インフラ変更、内部品質改善では、Story と Use Case を作らずに Requirement、Unit、Bolt、Task で進められるようにする。
ただし Inception では Task を作らず、Construction で Bolt から Task を導く。

## 所有関係

所有関係は単一の親を持つ木として扱う。

```text
Intent
  ├─ Requirements
  │   └─ Stories optional
  ├─ Use Cases optional
  ├─ Units
  ├─ Bolts
  │   └─ Tasks
  └─ Acceptance / Traceability
```

- Requirements の親は Intent である。
- Stories の親は Requirements である。
- Use Cases の親は Intent である。
- Units の親は Intent である。
- Bolts の親は Intent である。
- Tasks の親は Bolts である。
- Acceptance / Traceability の親は Intent である。

Requirements は Stories を所有する。

Requirements は Use Cases、Units、Bolts、Tasks を所有しない。

Requirement から Use Case、Unit、Bolt、Task を見たい場合は、Requirement を参照している成果物を逆引きする projection として扱う。

Acceptance / Traceability は、Requirement、Story、Use Case、Unit、Bolt、Task、Deployment Unit の対応と受け入れ状態を扱う横断成果物である。

Acceptance / Traceability は Requirement や Unit を所有しない。

Requirement、Story、Use Case、Unit、Bolt、Task を ID で接続し、参照関係と検証状態を記録する。

## 参照関係

Requirement は要求の定義元である。

Use Case、Unit、Bolt、Task は Requirement を参照する。

```text
Use Case -> Requirement
Use Case -> Story optional
Unit -> Requirement
Bolt -> Requirement
Bolt -> Unit
Task -> Requirement
Task -> Use Case optional
```

Requirement は Use Case、Unit、Bolt、Task を知らない。

この向きにすることで、横断要求を重複させず、Unit の独立性を保ちながら traceability を維持する。

Unit を Story から切り出す場合、Unit は Story を入力参照してよい。

ただし Story は Unit の下位概念ではない。

Story は Unit 生成の入力になりうるが、Unit に所有されない。

## Story、Use Case、Task

Story と Task は親子関係にしない。

Story は Requirement をユーザー価値の単位で表す契約である。

Use Case は、アクターまたは外部システムとシステムの相互作用手順を叙述する成果物である。

Use Case は Requirement を参照する。

Story がある場合、Use Case は Story を任意で参照できる。

Use Case には、境界、制御、エンティティの候補と、候補ごとの責務を記録する。

これらは実装設計そのものではなく、ロバストネス分析と設計へ進むための分析結果である。

Task は Bolt 内で実行する具体作業である。
Task は Construction で生成する。

Task は Requirement を必ず参照する。

Task がアクターまたは外部システムとの相互作用を実現する場合は、Use Case も参照する。

相互作用がない内部作業では、Use Case を参照しない理由を traceability に残す。

Use Case は Task の親ではなく、Task が何を満たすかを示す参照先である。

```text
Requirement
  └─ Story optional
  <- Use Case <- Task
  <- Task
```

この形なら、Story がない作業でも Requirement から Task を追跡できる。
相互作用がない内部作業では、人工的な Use Case を作らずに Requirement から Task を追跡する。

## AI-DLC 原典との対応

AI-DLC の中心構造は、Intent から Unit を導き、Unit を Bolt で実装し、Deployment Unit へ進める流れである。

この流れは、`docs/ai-dlc/aidlc-method-definition-ja.md` の中心構造と一致する。

```text
Intent -> Unit -> Bolt -> Deployment Unit
```

一方で、Inception では Intent から requirements、stories、units を作る。

そのため、Requirement と Unit は Intent 配下の兄弟として扱い、Story は Requirement 配下の条件付き成果物として扱う。

Inception で作られる `requirements.md`、`user-stories.md`、`units.md`、`bolts.md` は別成果物である。

このため、Story は Unit 生成の入力になりうるが、Unit の下位概念としては扱わない。

AI-DLC v2 は adaptive workflow を前提にする。

Story を条件付きにすると、機能開発ではユーザー価値を明示でき、Story が不要な作業では過剰な成果物を作らずに進められる。

## Acceptance / Traceability

Acceptance / Traceability は、Intent 配下の成果物を横断して、何が受け入れ可能になったかを確認するための成果物である。

Requirement 側からは、どの Story、Use Case、Unit、Bolt、Task、Deployment Unit が要求に対応しているかを見る。

Unit 側からは、実装計画がどの Requirement を満たすかを見る。

これは親子関係ではなく、traceability projection である。

Acceptance / Traceability は、AI-DLC v2 の承認ゲート、状態管理、監査ログ、センサー結果と接続する。

最初の実装では、Acceptance と Traceability を同じ成果物として扱う。

Acceptance / Traceability は、人間向け Markdown と機械向け JSON を分けて保存する。

Markdown はレビューと合意に使う。

JSON は状態遷移、typed evidence、traceability の決定論的検証に使う。

### 受け入れ状態

受け入れ状態の主語は Requirement である。

Task と Deployment Unit は、Requirement が満たされたかを判断するための証拠として扱う。

Requirement の `acceptance_state` は次の順に進む。

```text
proposed -> accepted -> satisfied -> verified
```

各状態の意味は次のとおりである。

- `proposed`：候補要求である。まだ採用判断前である。
- `accepted`：要求として採用済みである。実装対象に入る。
- `satisfied`：必要な Task が完了し、受け入れ証拠が揃っている。
- `verified`：人間または承認ゲートで確認済みである。

`verified` への遷移には人間承認が必要である。

センサー結果は `verified` の根拠にはできるが、センサー結果だけで `verified` にはしない。

`satisfied` への遷移には、Task 完了だけではなく、Requirement を満たしたと判断できる証拠が必要である。

### Evidence

Evidence は typed reference のリストで表す。

```yaml
evidence:
  - type: test_result
    ref: path/to/report.md
    summary: 対象 Requirement の受け入れ条件を満たすテストが通過した
  - type: review
    ref: https://github.com/org/repo/pull/123
    summary: レビューで受け入れ条件への影響が確認された
  - type: human_note
    ref: docs/acceptance/manual-check.md
    summary: 人間が画面上で期待動作を確認した
```

Evidence の `type` は、証拠の種類を表す。

Evidence の `ref` は、証拠への参照である。

Evidence の `summary` は、証拠が Requirement の受け入れ判断にどう関係するかを説明する。

## `.amadeus/` ディレクトリ構造

Amadeus DLC では、一覧ファイルと詳細ディレクトリを併用する。

一覧ファイルは Intent 全体の俯瞰に使う。

詳細ディレクトリは、個別成果物の差分管理、レビュー、ツール更新に使う。

```text
.amadeus/
  glossary.md
  domain/
    subdomains.md
    bounded-contexts.md
    bounded-contexts/
      BC001-*/
        contracts.md
        models.md
        models/
          <ddd-module-id>/
            model.md
  intents.md
  intents/
    <intent-id>-<slug>.md
    <intent-id>-<slug>/
      requirements.md
      requirements/
        R001-*.md
      user-stories.md
      user-stories/
        S001-*.md
      use-cases.md
      use-cases/
        UC001-*.md
      units.md
      units/
        U001-*.md
        U001-*/
          design.md
      bolts.md
      bolts/
        B001-*.md
        B001-*/
          design.md
          tasks.md
          notes.md
          test-results.md
          pr.md
      acceptance.md
      traceability.md
      domain/
        subdomains.md
        bounded-contexts.md
        bounded-contexts/
          BC001-*.md
          BC001-*/
            contracts.md
            models.md
            models/
              <ddd-module-id>/
                model.md
      domain-notes.md
      decisions.md
      decisions/
```

### Unit と Bolt

Units と Bolts は Intent 直下で兄弟として扱う。

Bolt は複数 Unit をまたぐ可能性があるため、Unit 配下にネストしない。

Bolt は 1つの Unit、または依存関係で結び付いた少数の Units を実装する。

Bolt が対象にする Unit は、Bolt 側から Unit ID を参照する。

```text
bolts/B001-<slug>.md -> units: [U001, U002]
```

### Task

Task は初期状態では個別ファイル化しない。

Construction の Bolt preparation で `bolts/<BID>/tasks.md` に ID 付きチェックリストとして管理する。
Inception 完了時点では Bolt のモジュールファイルだけを置き、`tasks.md` は置かない。

Task 単位の設計、検証、履歴が必要になった時点で、`bolts/<BID>/tasks/<TID>.md` を導入する。

```text
bolts/
  B001-<slug>.md
  B001-<slug>/
    tasks.md
    tasks/
      T001.md
```

`tasks/` は必要になるまで作らない。

### Glossary と Terminology Notes

Glossary は Intent 配下に置かない。

確定済みの用語は `.amadeus/glossary.md` で管理する。

Intent 配下で扱うのは、未確定語、提案語、用語確認事項だけである。

その場合のファイル名は `terminology-notes.md` とする。

### Domain Model と Domain Notes

`.amadeus/domain/` は、グローバルなサブドメイン、境界づけられたコンテキスト、コンテキスト別モデル、契約の参照元として扱う。

`.amadeus/glossary.md` は用語定義を扱う。

`.amadeus/domain/subdomains.md` は、全体のサブドメインと分類理由を扱う。

`.amadeus/domain/bounded-contexts.md` は、全体の境界づけられたコンテキスト、Intent 固有モデルへの索引、コンテキスト間の Upstream/Downstream、組織パターン、統合パターンを扱う。

validator は、`bounded-contexts.md` の `一覧`、`コンテキスト間の依存`、`パターン分類` を検査対象にする。

`コンテキスト間の依存` では、`Downstream` と `Upstream` が同じ `bounded-contexts.md` の `一覧` に存在する境界づけられたコンテキスト ID、または `なし` であることを確認する。

`Upstream` が `なし` でない場合は、組織パターンと統合パターンが許可された分類のどれかに該当することを確認する。

`Upstream` が `なし` の場合は、組織パターンと統合パターンを `該当なし` とし、状態に理由を書く。

`.amadeus/domain/bounded-contexts/<bounded-context-id>/models.md` は、境界づけられたコンテキスト内の DDD モジュール単位のモデル一覧を扱う。

`.amadeus/domain/bounded-contexts/<bounded-context-id>/models/<ddd-module-id>/model.md` は、コンテキスト別の概念間の関係、ライフサイクル、集約候補を扱う。

`.amadeus/domain/bounded-contexts/<bounded-context-id>/contracts.md` は、コンテキスト別の事前条件、不変条件、事後条件を扱う。

Intent 固有のサブドメイン、境界づけられたコンテキスト、概念関係、契約を固定する場合は、Intent 配下に `domain/subdomains.md`、`domain/bounded-contexts.md`、`domain/bounded-contexts/<bounded-context-id>/models.md`、`domain/bounded-contexts/<bounded-context-id>/models/<ddd-module-id>/model.md`、`domain/bounded-contexts/<bounded-context-id>/contracts.md` を置く。

`domain/bounded-contexts.md` は、Unit を切る時に参照するコンテキスト、責務、外部境界、コンテキスト間の Upstream/Downstream、組織パターン、統合パターンを扱う。

`domain/bounded-contexts/<bounded-context-id>/contracts.md` は、事前条件、不変条件、事後条件を扱う。

Intent 固有のモデル上の発見や未確定事項が必要な場合は、Intent 配下に `domain-notes.md` を置く。

複数 Intent で共有する概念や不変条件だけを `.amadeus/domain/` に昇格する。
