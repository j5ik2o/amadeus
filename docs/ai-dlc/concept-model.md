# AI-DLC Concept Model

## 決定

Amadeus DLC の概念モデルでは、Story を条件付き概念として扱う。

Story は、Requirement をユーザー価値の単位で表す必要がある機能開発で作る。

Story は「誰が、何のために、何をしたいか」と受け入れ条件を表す。

リファクタ、バグ修正、インフラ変更、内部品質改善では、Story を作らずに Requirement、Unit、Bolt、Task で進められるようにする。

## 所有関係

所有関係は単一の親を持つ木として扱う。

```text
Intent
  ├─ Requirement
  │   └─ Story optional
  ├─ Unit
  │   └─ Bolt
  │       └─ Task
  └─ Acceptance / Traceability
```

- Requirement の親は Intent である。
- Story の親は Requirement である。
- Unit の親は Intent である。
- Bolt の親は Unit である。
- Task の親は Bolt である。
- Acceptance / Traceability の親は Intent である。

Requirement は Story を所有する。

Requirement は Unit と Task を所有しない。

Requirement から Unit と Task を見たい場合は、Requirement を参照している成果物を逆引きする projection として扱う。

Acceptance / Traceability は、Requirement、Story、Unit、Bolt、Task、Deployment Unit の対応と受け入れ状態を扱う横断成果物である。

Acceptance / Traceability は Requirement や Unit を所有しない。

参照関係と検証状態を記録する。

## 参照関係

Requirement は要求の定義元である。

Unit と Task は Requirement を参照する。

```text
Unit -> Requirement
Task -> Requirement
```

Requirement は Unit と Task を知らない。

この向きにすることで、横断要求を重複させず、Unit の独立性を保ちながら traceability を維持する。

Unit を Story から切り出す場合、Unit は Story を入力参照してよい。

ただし Story は Unit の下位概念ではない。

Story は Unit 生成の入力になりうるが、Unit に所有されない。

## Story と Task

Story と Task は親子関係にしない。

Story は Requirement をユーザー価値の単位で表す契約である。

Task は Bolt 内で実行する具体作業である。

Task は Requirement を参照することで、Story がある場合もない場合も要求へ接続する。

```text
Requirement
  └─ Story optional
  <- Task
```

この形なら、Story がない作業でも Requirement から Task を追跡できる。

## AI-DLC 原典との対応

AI-DLC の中心構造は、Intent から Unit を導き、Unit を Bolt で実装し、Deployment Unit へ進める流れである。

この流れは、`docs/ai-dlc/aidlc-method-definition-ja.md` の中心構造と一致する。

```text
Intent -> Unit -> Bolt -> Deployment Unit
```

一方で、Inception では Intent から requirements、stories、units を作る。

そのため、Requirement と Unit は Intent 配下の兄弟として扱い、Story は Requirement 配下の条件付き成果物として扱う。

Inception で作られる `requirements.md`、`stories.md`、`unit-of-work.md`、`bolt-plan.md` は別成果物である。

このため、Story は Unit 生成の入力になりうるが、Unit の下位概念としては扱わない。

AI-DLC v2 は adaptive workflow を前提にする。

Story を条件付きにすると、機能開発ではユーザー価値を明示でき、Story が不要な作業では過剰な成果物を作らずに進められる。

## Acceptance / Traceability

Acceptance / Traceability は、Intent 配下の成果物を横断して、何が受け入れ可能になったかを確認するための成果物である。

Requirement 側からは、どの Story、Unit、Bolt、Task、Deployment Unit が要求に対応しているかを見る。

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
