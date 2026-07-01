# UC001: 参照リンク化規則を定義する

## システム境界

- Agent が Issue #243、Discovery、Ideation、既存成果物を読み、参照リンク化対象とリンク先規則を整理する。

## 事前条件

- Issue #243 が存在する。
- Discovery と Ideation が gate passed である。
- 参照リンク化の観察例が既存成果物に存在する。

## 基本フロー

1. Agent は Issue #243 の目的、リンク方針、受け入れ条件を読む。
2. Agent は Discovery と Ideation の対象境界を読む。
3. Agent は Requirement ID、Unit ID、Bolt ID、Bounded Context ID、Business Rule、Intent Contracts、Decision ID、PR番号、Issue番号、ファイルパスを参照種別として整理する。
4. Agent は workspace 内成果物、GitHub ファイルパス、PR番号、Issue番号のリンク先規則を整理する。
5. Agent は Inception 成果物へ参照リンク化対象とリンク先規則を記録する。

## 代替フロー

- 参照先が一意に決まらない表記がある場合は、機械的なリンク化対象外として扱い、Construction で人間判断へ残す。

## 事後条件

- 参照リンク化対象とリンク先規則を、後続 stage へ渡せる。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | Reference Link Policy | 参照リンク化方針の対象範囲を扱う。 |
| 制御 | Link Target Decision | 参照種別ごとのリンク先規則を判断する。 |
| エンティティ | Reference Target | ID、PR番号、Issue番号、ファイルパス、成果物名を表す。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| Reference Link Policy | 採用候補 | 参照種別、表示形式、対象外 | Artifact Scope に適用範囲を渡す |
| Link Target Decision | 採用候補 | 相対リンク、GitHub permalink、PR URL、Issue URL | Validator Boundary に検出条件を渡す |
