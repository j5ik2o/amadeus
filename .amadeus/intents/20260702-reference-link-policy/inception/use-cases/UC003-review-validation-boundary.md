# UC003: 検出境界を確認する

## システム境界

- Maintainer が Agent の整理した参照リンク化対象、適用範囲、検出候補を確認し、validator、eval、人間判断の分担を判断する。

## 事前条件

- UC001 で参照リンク化対象とリンク先規則が整理されている。
- UC002 で適用成果物範囲が整理されている。

## 基本フロー

1. Maintainer は未リンク参照を validator で fail にする範囲を確認する。
2. Maintainer は warning または eval に残す範囲を確認する。
3. Maintainer はコードブロック、例示、既にリンク済みの表記、参照先が一意でない表記を対象外として扱う条件を確認する。
4. Maintainer は GitHub ファイルパスの commit SHA 付き permalink 条件を確認する。
5. Agent は判断結果を後続 stage の Unit と Bolt へ渡す。

## 代替フロー

- validator で誤検出が多い参照種別は、Construction で eval または人間判断に残す。

## 事後条件

- validator、eval、人間判断の分担を後続 stage へ渡せる。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | Validation Boundary | 機械検出と人間判断の境界を扱う。 |
| 制御 | Detection Policy Decision | fail、warning、対象外を判断する。 |
| エンティティ | Detection Candidate | 未リンク参照または permalink 条件の検出候補を表す。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| Validation Boundary | 採用候補 | validator、eval、人間判断の分担 | Construction で検出仕様を具体化する |
| Detection Candidate | 採用候補 | 参照種別、対象成果物、除外条件 | validator または eval に検出を委ねる |
