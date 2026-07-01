# skill 変更のレビュー支援契約

## 目標プロファイル

| フィールド | 値 | 説明 |
|---|---|---|
| goalType | technical | 自己開発の skill 変更レビューを支える steering policy の契約を追加する技術目標である。 |
| scope | refactor | 既存の変更種別「skill 変更」の必須条件と README の推奨を、確定済みの運用契約へ強化する Intent である。 |
| labels | steering-policy, skill-change, review-support, self-development | steering policy、skill 変更、レビュー支援、自己開発を表す。 |

## 目的

skill 本文の変更に対して、人間レビューの判断時間を減らす運用契約を steering policy として確定する。

この Intent は [Issue #298](https://github.com/amadeus-dlc/amadeus/issues/298) を根拠にする。

skill 本文の変更は散文であるため、テストでは落ちず、人間レビューだけが防波堤になっている。
2026-07-02 の grilling session で、自動化は課さず、レビュー支援の運用契約を採用する判断が確定した。

## 成功条件

- `.amadeus/steering/policies.md` の変更種別「skill 変更」の必須条件に、挙動差分の要約が追加されている。
- skill 変更 PR の作成前に skill-forge による確認を実施し、結果を PR 説明に記録する条件が必須化されている。
- skill 本文変更と他の変更種別を同一 PR に混ぜない粒度制約と、その例外の記録先が文書化されている。
- `.amadeus/development.md` の PR 準備条件から、skill 変更時の追加条件を追跡できる。
- agent-instruction-rules の方針（肯定形で書く、禁止は失敗確認後に限る）と矛盾しない記述になっている。

## 範囲

含めるもの:

- `.amadeus/steering/policies.md` の変更種別表の更新。
- `.amadeus/development.md` の PR 準備条件の更新。
- 挙動差分要約の必須項目の確定。
- 緊急修正時と粒度制約の例外運用の確定。
- `README.md` の skill-forge 確認記述と policies の整合確認。

含めないもの:

- skill 本文変更ごとの behavioral eval の必須化。
- skill、validator、example の実装変更。
- README の skill 一覧の再構成。
- stage0 採用判断の自動化。

## 現在の phase

Ideation を開始する。

Inception では、policies と development の更新要求、受け入れ状態、必要なユースケースを具体化する。
