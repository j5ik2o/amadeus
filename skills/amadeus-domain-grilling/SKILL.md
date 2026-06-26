---
name: amadeus-domain-grilling
description: >-
  Amadeus の用語、概念、境界づけられたコンテキスト、DDD モデル、契約、ドメイン判断を一問ずつ詰めながら、確定した内容を Amadeus 成果物へ記録する。
  ユーザーが grill-with-docs 相当、domain を grill、用語やモデルを質問で詰めつつ `.amadeus/` に残す、または `amadeus-grilling` と
  `amadeus-domain-modeling` を組み合わせたい場面では必ず使う。一般的な設計質問だけなら `amadeus-grilling`、記録済み内容の補修だけなら
  `amadeus-domain-modeling` を使う。
---

# amadeus-domain-grilling

## 目的

Amadeus の対象ドメインについて、質問で曖昧さを解きながら、確定した知識を `.amadeus/` 成果物へ残す。

この skill は、`amadeus-grilling` と `amadeus-domain-modeling` の合成入口である。
質問の作法は `amadeus-grilling` に従う。
用語、モデル、契約、decision の記録先と昇格条件は `amadeus-domain-modeling` に従う。

## 使う skill

この skill を使う時は、次の SKILL.md も読む。

- `amadeus-grilling`
- `amadeus-domain-modeling`

役割分担は次である。

| skill | 担うこと | 担わないこと |
|---|---|---|
| `amadeus-grilling` | 一問ずつ質問し、推奨回答と理由を添え、回答を待つ | 成果物の更新 |
| `amadeus-domain-modeling` | 用語、概念、モデル、契約、decision を `.amadeus/` に記録する | 質問進行の制御 |
| `amadeus-domain-grilling` | 上記2つを組み合わせ、質問で確定した内容を記録へつなげる | 独自の用語規則や成果物構造を作る |

## 使う場面

次のような依頼で使う。

- `grill-with-docs` 相当を Amadeus 成果物で行いたい。
- 用語や概念を質問で詰めながら `.amadeus/glossary.md` や `domain-notes.md` に残したい。
- 境界づけられたコンテキスト、DDD モジュール、集約、エンティティ、値オブジェクト、契約を会話で確定したい。
- Intent 固有のドメイン候補を、全体モデルへ昇格するか判断したい。
- ドメイン判断を `decisions.md` と `decisions/<decision-id>.md` に残すべきか確認したい。

一般的な設計境界や進め方だけを詰めるなら `amadeus-grilling` を使う。
すでに確定した用語やモデルを記録、補修、昇格するだけなら `amadeus-domain-modeling` を使う。

## 手順

1. `amadeus-grilling` と `amadeus-domain-modeling` の SKILL.md を読む。
2. `.amadeus/`、`.amadeus/glossary.md`、`.amadeus/domain/**`、必要なら対象 Intent の `domain-notes.md`、`domain/**`、`requirements.md`、`use-cases.md`、`units.md`、`bolts.md`、`traceability.md`、`decisions.md` を確認する。
3. 読めば分かることは質問しない。
4. まだ人間の判断が必要な最初のドメイン論点を1つだけ選ぶ。
5. `amadeus-grilling` の形式で、一問だけ質問する。
6. 質問には、何を決めたいか、なぜ今必要か、推奨回答、推奨理由を含める。
7. 質問したターンでは成果物を更新しない。
8. ユーザーの回答を受けたら、`amadeus-domain-modeling` に従って該当する `.amadeus/` 成果物を更新する。
9. 更新後、次に残るドメイン論点があれば、再び一問だけ質問する。

## 質問の出力

質問が必要な場合は、次の形を使う。

```markdown
確認した成果物: <確認した主なファイル>
論点: <今回扱うドメイン論点>
質問: <一問だけ>
推奨回答: <推奨する判断>
理由: <推奨理由>
回答後に更新する候補: <domain-notes.md / glossary.md / domain/** / traceability.md / decisions.md など>
```

複数の質問を一度に並べない。
次の質問は、ユーザーの回答を受けて、必要な成果物更新を終えてから出す。

## 回答後の更新

ユーザー回答で内容が確定したら、`amadeus-domain-modeling` の更新先ルールに従う。

- 未確定語、候補、問いは、対象 Intent の `domain-notes.md` に記録する。
- 全 Intent で共有する確定用語は `.amadeus/glossary.md` に記録する。
- Intent 固有のサブドメイン、BC、モデル、契約は `.amadeus/intents/<intent-id>/domain/**` に記録する。
- モデル要素や契約 ID に影響する場合は、対象 Intent の `traceability.md` も整合させる。
- 全体として採用する判断がある場合だけ `.amadeus/domain/**` に昇格する。
- 戻しにくく、背景なしでは意図が分かりにくく、実際の trade-off がある判断だけ decision にする。

## 禁止事項

- この skill 独自の成果物構造を作らない。
- `amadeus-domain-modeling` と異なる用語、モデル、契約の識別子規則を作らない。
- 質問が必要なターンで成果物を更新しない。
- 複数の質問を一度に並べない。
- 読めば分かることを質問しない。
- `CONTEXT.md` や `docs/adr/**` を更新しない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を新規作成しない。
