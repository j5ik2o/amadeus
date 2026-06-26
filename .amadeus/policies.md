# Policies

## 役割

Policies は、Amadeus DLC の成果物を作る時に守る方針、禁止事項、判断基準を扱う。

## 成果物

- 空のプレースホルダーを増やさない。
- 未確認のまま必要な成果物は、未確認であることを本文に書く。
- 任意成果物は、必要性を判断した時点で作る。
- 作らない判断が追跡に影響する場合は、`traceability.md` に `なし` と書く。

## 命名

- ユーザーストーリー一覧は `user-stories.md` とする。
- `stories.md` や `stories/` は使わない。
- Unit 分割に使う Intent 固有の境界は `domain/bounded-context.md` に置く。
- Intent 固有の概念関係は `domain/model.md` に置く。
- Intent 固有の契約は `domain/contracts.md` に置く。
- Intent 固有の未確定事項は `domain-notes.md` に置く。

## 契約

- `domain/contracts.md` には、事前条件、不変条件、事後条件を置く。
- 事前条件は `PREnnn`、不変条件は `INVnnn`、事後条件は `POSTnnn` の識別子を使う。
- 契約本文と根拠は空欄にしない。
- 根拠には、少なくとも1つの要求 ID またはユースケース ID を書く。

## 追跡

- Task は Requirement を必ず参照する。
- Task は原則として Use Case を参照する。
- 相互作用がない内部作業では、Use Case を参照しない理由を `traceability.md` に書く。
- Task は User Story を直接参照しない。
- 依存関係は順序や前提を示すが、成果物の内容説明の代わりにはしない。

## 昇格

- Intent 固有の発見が複数 Intent で共有される前提になった場合は、`.amadeus/` 直下の該当成果物へ昇格する。
- 未確定事項は、確定するまで `domain-notes.md` や `terminology-notes.md` に残す。
