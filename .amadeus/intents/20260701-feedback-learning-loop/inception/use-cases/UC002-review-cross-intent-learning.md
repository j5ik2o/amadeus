# UC002: Intent 横断学習をレビューする

## システム境界

- ACT001 Maintainer が、完了済み Intent または後段発見から抽出された学習候補をレビューする。
- EXT001 GitHub は、後続 Issue 候補の記録先として使われる。

## 事前条件

- 学習候補に、発見元、根拠、再利用可能性、推奨分類が含まれている。
- Domain Map と Context Map の現在像が参照できる。

## 基本フロー

1. Maintainer は、学習候補が Intent 横断で再利用できるか確認する。
2. 運用知識として再利用する場合、Maintainer は Steering knowledge 候補として扱う。
3. 採用済み Subdomain または Bounded Context の現在像へ反映する場合、Maintainer は Domain Map 候補として扱う。
4. 採用済み Bounded Context 間の依存へ反映する場合、Maintainer は Context Map 候補として扱う。
5. 現在の作業と分けるべき改善であれば、Maintainer は後続 Issue 候補または後続 Intent 候補として扱う。
6. 採用しない場合、Maintainer は `no_learning_action` として理由を残す。

## 代替フロー

- Domain Map または Context Map に候補としてしか扱えない内容は、直接昇格せず Steering knowledge 候補または後続 Issue 候補に戻す。
- GitHub Issue 作成が必要な場合は、人間承認後に行う。

## 事後条件

- 学習候補は、Steering knowledge、Domain Map、Context Map、後続 Issue、後続 Intent、不採用のいずれかに分類されている。
- Domain Map と Context Map には候補ではなく、承認済み現在像だけを載せる制約が守られている。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | learning review | 学習候補と根拠をレビュー対象として受け取る。 |
| 制御 | promotion classification | 昇格先と後続化の分類を決める。 |
| エンティティ | promotion candidate | 昇格先、根拠、承認状態、再確認条件を保持する。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| Steering knowledge | Intent 横断の運用知識を索引化する。 | 再利用可能な知識と根拠。 | 必要に応じて専用知識ファイルへ分ける。 |
| Domain Map | 採用済み Subdomain と Bounded Context の現在像だけを保持する。 | adopted または retired の境界。 | 採用根拠を decisions へ求める。 |
| Context Map | 採用済み Bounded Context 間の依存だけを保持する。 | Upstream、Downstream、Organization Pattern、Integration Pattern。 | 採用根拠を decisions へ求める。 |
