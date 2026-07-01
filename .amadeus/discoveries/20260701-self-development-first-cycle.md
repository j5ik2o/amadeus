# 自己開発の初回テーマ選定 Discovery Brief

## 入力テーマ

- Amadeus の自己開発を始める。

## 確認した前提

- 入力元は会話、GitHub PR、docs 点検、validator 結果である。
- [PR #232](https://github.com/amadeus-dlc/amadeus/pull/232) の merge により、自己開発用 `.amadeus/` は現在の Domain Map と Context Map 契約へ追従した。
- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts .` は pass し、steering layer の実行時参照に必要な構造は満たしている。
- Discovery 作成前の GitHub open issue は 0 件であり、自己開発の次候補は未起票だった。
- recommended 候補は [Issue #233](https://github.com/amadeus-dlc/amadeus/issues/233) として起票済みである。
- `.amadeus/development.md` は、自己開発作業を GitHub Issue 起点で進める方針を記録している。
- `.amadeus/steering/knowledge.md` には、自己開発の初回候補として扱える未確認事項が残っている。
- 対象分類は Amadeus DLC 契約と Amadeus 実装の両方である。
- 変更対象領域は lifecycle 契約、docs、domain、validator、example、昇格手順にまたがる。

## 判定

multi_intent

## 判定理由

- 「自己開発を始める」は単一 Intent としては大きく、語彙、provenance、example、validator 検出、昇格手順にまたがる。
- 既存 steering layer は pass しているため、追加の steering 補修ではなく、後続 Intent 候補へ分けて扱う段階である。
- `.amadeus/development.md` は GitHub Issue 起点を前提にしているため、最初の候補は Intent Record 作成前に GitHub Issue として起票する。
- 最初に進める候補は、後続の自己開発 cycle の判断基準になる stage 判定と workspace 対応記録である。
- example provenance や混入検出は、stage 判定と workspace 対応記録が固まった後のほうが追跡条件を定義しやすい。

## Intent Draft

該当なし

## Intent 候補

| 候補 | 状態 | Intent | 課題 | 成功状態 | 除外範囲 | 依存 |
|---|---|---|---|---|---|---|
| 自己開発 cycle の stage 判定と workspace 対応記録を定義する | recommended | 未作成、[Issue #233](https://github.com/amadeus-dlc/amadeus/issues/233) | stage0、stage1、stage2 と build workspace、target workspace の対応記録が未確定で、後続 Intent の provenance が揺れやすい。 | stage 判定語彙、採用判断、workspace 対応記録の置き場所が決まり、GitHub Issue と Intent に追跡できる。 | skill 実装、validator 実装、example snapshot 再生成は含めない。 | なし |
| example snapshot provenance の十分性を確認する | waiting | 未作成 | `examples/skill-provenance.json` だけで example snapshot の provenance が足りるか未確認である。 | example 更新時に必要な provenance 項目と不足時の記録先が決まる。 | example の一括再生成は含めない。 | stage 判定と workspace 対応記録の定義後に扱う。 |
| host environment assets と target artifacts の混入検出を検討する | waiting | 未作成 | host environment の assets と target artifacts の assets が混ざった場合の検出責務が未確認である。 | validator または運用方針で検出する対象と対象外が決まる。 | 実装は含めず、検出責務の判断までに留める。 | stage 判定と workspace 対応記録の定義後に扱う。 |

## 候補判断

- recommended は「自己開発 cycle の stage 判定と workspace 対応記録を定義する」である。
- この候補は、後続の自己開発 Intent で共通して使う stage 判定、採用判断、workspace 対応記録の前提になる。
- 他の候補は、provenance や validator 検出を扱うため、先に共通の記録単位を固定してから扱う。

## 既存 Intent との関係

- 既存 Intent [20260629-self-dev-steering-layer](../intents/20260629-self-dev-steering-layer.md) は、自己開発用 steering layer の導入を扱う完了済み Intent である。
- 今回の Discovery は、その後続として新規 Intent 候補を整理する。
- 既存 Intent の更新ではなく、新規 Intent の候補群として扱う。

## 推奨次アクション

- [Issue #233](https://github.com/amadeus-dlc/amadeus/issues/233) を入力元にして、`amadeus-ideation` で Intent Record を作成する。
