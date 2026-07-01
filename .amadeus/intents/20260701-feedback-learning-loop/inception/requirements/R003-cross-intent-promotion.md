# R003: Intent 横断学習の昇格条件

## 要求

- 完了済み Intent から抽出した再利用可能な学習を、Steering knowledge、Domain Map、Context Map へ昇格する条件を判断できる。

## 受け入れ条件

- Intent 横断で再利用する運用知識は、`.amadeus/steering/knowledge.md` または `steering/knowledge/` の候補として扱える。
- 現在採用されている Subdomain または Bounded Context の索引へ反映する内容だけを Domain Map へ昇格できる。
- 現在採用されている Bounded Context 間の依存として反映する内容だけを Context Map へ昇格できる。
- Domain Map と Context Map には候補を載せず、承認済み stage 成果物から採用された現在像だけを載せる。
- Steering policy へ昇格すべき運用ルールは、Steering knowledge 候補とは別に後続 Issue または後続 Intent 候補へ分けられる。

## 根拠

- Issue #259 の「Intent 横断の learning loop」。
- `CONTEXT.md` の Domain Map と Context Map の定義。
- `.amadeus/steering/knowledge.md`。

## 未確認事項

- `steering/knowledge/` 配下に専用ファイルを作るかは、Construction で更新差分を見て確定する。
