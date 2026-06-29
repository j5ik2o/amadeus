# Operation Phase Stage Reference

## Phase Overview

Operation phase は、将来 phase 名として予約している。

現時点の Amadeus DLC では、Operation 成果物、Operation 用 skill、Operation gate、validator 条件を固定していない。

そのため、この文書は予約状態と非目標だけを記録する。

## Stage Summary Table

| Stage | Name | Execution | Condition | Lead Skill | Outputs |
|---|---|---|---|---|---|
| 未定 | 未定 | 未定 | Operation 成果物契約が採用された場合 | 未定 | 未定 |

## Reserved Scope

Operation phase で扱う可能性がある範囲は、deployment、monitoring、incident response、feedback、運用証拠である。

ただし、これらは現時点では Amadeus DLC の標準成果物ではない。

## Current Contract

Construction phase では、Operation 成果物を作らない。

`operation/` は将来 phase 名として予約する。

対応 skill が確定するまで、`operation/` を必須成果物配置や validator 必須対象に含めない。

## Non-Goals

この文書では、Operation stage の番号を定義しない。

この文書では、Operation 成果物のファイル名を定義しない。

この文書では、Operation gate の条件を定義しない。

この文書では、deployment、monitoring、incident response、feedback の手順を固定しない。

## Cross-References

- [Construction Phase Stages](construction.md)
- [ADR 0002: Intent Phase Directory Layout を採用する](../../adr/0002-intent-phase-directory-layout.md)
