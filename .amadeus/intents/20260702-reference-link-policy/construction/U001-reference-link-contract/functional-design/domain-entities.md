# Domain Entities

## 目的

U001 の Domain Entity は、参照リンク化方針を構成する対象、規則、成果物境界を扱う。

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | Reference Link Target | Markdown リンクとして扱う参照種別と表示文字列を表す。 | BR001 |
| DE002 | Link Target Rule | 参照種別ごとのリンク先解決規則を表す。 | BR002, BR003, BR004, BR005 |
| DE003 | Permalink Reference | GitHub 上のファイルパスまたはコード参照を commit SHA 付き URL として表す。 | BR003, INV001 |
| DE004 | External GitHub Reference | PR番号と Issue番号から GitHub URL へ移動できる参照を表す。 | BR004, BR005 |
| DE005 | Exclusion Rule | 参照先が一意に決まらない表記と B001 対象外を表す。 | BR006 |
| DE006 | Artifact Application Scope | source skill、昇格先成果物、example snapshot、既存成果物のどこへ参照リンク化方針を適用するかを表す。 | BR007, BR008, BR009 |

## 関係

Reference Link Target は Link Target Rule によってリンク先を決める。

Permalink Reference は Link Target Rule のうち、GitHub 上のファイルパスまたはコード参照に適用する規則である。

External GitHub Reference は Link Target Rule のうち、PR番号と Issue番号に適用する規則である。

Exclusion Rule は Reference Link Target から除外する表記を説明する。

Artifact Application Scope は、Link Target Rule をどの成果物範囲へ適用するかを説明する。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| BC001 自己開発運用 | Domain Map | 参照リンク化方針を BC001 内の成果物品質ルールとして扱う。 | 既存 BC001 の役割内に収まるため、Domain Map の新規行は追加しない。 | [domain-map.md](../../../../../domain-map.md) |
| Context Map | Context Map | 新しいコンテキスト間依存は導入しない。 | Context Map は更新しない。 | [context-map.md](../../../../../context-map.md) |

## 未確認事項

- なし。
