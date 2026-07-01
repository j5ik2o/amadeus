# D004: Unit と Bolt の粒度判断

## 背景

Issue #259 の受け入れ条件は、前段 feedback、Intent 横断学習、成果物責務、検証結果、Issue #257 との境界に分かれている。

一方で、Construction では skill 契約や eval へ反映するため、変更単位を大きくしすぎると確認しづらい。

## 判断

Unit を次の2つに分ける。

- U001: 後段発見を前段 feedback、現在 phase 修正、後続化へ振り分ける契約。
- U002: Intent 横断学習の昇格先と成果物責務の分離。

Bolt も Unit と同じ境界に合わせ、B001 と B002 に分ける。

## 理由

前段 feedback routing は、まず現在 Intent 内で扱うかどうかを決める契約である。
Intent 横断 learning promotion は、現在 Intent 内で扱わない学習をどこへ昇格または後続化するかを決める契約である。

この順序にすると、Construction で前段 routing を先に反映し、その後に横断学習の昇格先を反映できる。

## 影響

B001 は B002 の前提になる。

内部 skill `amadeus-learning-review` または `amadeus-feedback-review` の新設は、初期 Construction の必須条件にしない。
共通契約だけでは重複や分岐が大きいと分かった場合に、後続 Issue 候補として扱う。
