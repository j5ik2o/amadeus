# Event Storming Event Types

このメモは、Amadeus で Event Storming を扱うときのイベント種別を整理する。
このメモは設計メモであり、現時点で `amadeus-event-storming` skill が実装済みであることを意味しない。

## 原則

Event Storming で扱う **Event** は、**Domain Event（ドメインイベント）** だけである。

Event は複数のレイヤーに存在する。
しかし、提案中の補助 skill `amadeus-event-storming` で `events.md` を作る場合、そこに載せる対象は Domain Event に限定する。

UI event、technical event、integration event、log event は、Event Storming の Event として扱わない。
これらを Domain Event と混ぜると、Event Storming が UI フロー図、処理シーケンス図、監視ログ設計に寄ってしまう。

## Event 種別

| 種別 | Event Storming での扱い | 例 | 記録先 |
|---|---|---|---|
| Domain Event | Event として扱う | 注文が確定した、支払いが承認された、在庫が引き当てられた | `events.md` |
| UI event | Event として扱わない | ボタンがクリックされた、フォームが送信された | `flow.md` の Command 発火契機、または `hotspots.md` |
| Technical event | Event として扱わない | API が呼ばれた、DB に保存された、ジョブが起動した | `hotspots.md` |
| Integration event | Event として扱わない | 外部決済から通知を受けた、外部在庫システムへ通知した | `flow.md` の External System 関係、または `hotspots.md` |
| Log event | Event として扱わない | 監査ログが出力された、メトリクスが記録された | 未確認事項として `hotspots.md` に残す |

## Domain Event の基準

Domain Event は、ドメイン上で起きた意味のある過去形の事実である。

Domain Event は、利用者の操作そのものではない。
Domain Event は、実装処理そのものでもない。
Domain Event は、システム連携やログ出力そのものでもない。

Domain Event として採用するには、次の条件を満たす。

- ドメインの状態や判断に意味がある。
- 過去形の事実として表現できる。
- 後続の Command、Policy、Read Model、外部連携の根拠になり得る。
- Requirement、Use Case、Unit、Bolt を導く根拠として参照できる。

## 除外したイベントっぽいもの

Event Storming 中に出てきたが Domain Event ではないものは、捨てずに分離する。

UI event は、どの Command を起動する契機かを `flow.md` に残せる。
Technical event は、実装上の懸念や未確認事項として `hotspots.md` に残せる。
Integration event は、External System との入出力関係として `flow.md` に残せる。
Log event は、未確認事項として `hotspots.md` に残す。
未確定の Operation 系 phase へは送らない。

`events.md` には、採用した Domain Event の根拠と、似ているが除外したイベントを残す。

```md
| ID | Domain Event | Description | Source | Excluded Similar Events |
|---|---|---|---|---|
| DEV001 | 注文が確定した | 購入者の注文意思が確定した | ヒアリング | 注文ボタンがクリックされた、注文 API が呼ばれた |
```

## Event Storming 補助 skill への含意

提案中の補助 skill `amadeus-event-storming` は、Domain Event を中心に人間へヒアリングする。

最初に UI 操作、API、DB、ログから聞き始めない。
対象シナリオを絞ったうえで、ドメイン上で起きた重要な事実を過去形で聞く。

Domain Event 以外のイベントが出てきた場合は、分類して補助情報へ逃がす。
AI はイベントっぽい語を Domain Event として混ぜず、採用理由と除外理由を明示する。
