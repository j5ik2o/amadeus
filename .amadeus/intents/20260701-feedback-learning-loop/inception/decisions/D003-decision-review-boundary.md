# D003: decision review と learning loop 分類を分ける

## 背景

Issue #257 は、phase skill 起動時に decision tree を再評価し、`amadeus-grilling` を起動すべき不明瞭な判断ノードを見つけることを扱う。

Issue #259 は、後段発見や完了済み Intent から得た知見を、どの feedback 先または学習先へ渡すかを扱う。

## 判断

Issue #257 の decision review と、Issue #259 の learning loop 分類を別責務として扱う。

decision review は、質問が必要かを決める。
learning loop 分類は、発見や学習を前段成果物、現在 phase、Steering knowledge、Domain Map、Context Map、後続 Issue、後続 Intent、不採用のどこへ渡すかを決める。

## 理由

質問起動条件と学習先分類を同じ責務にすると、phase skill が何を再評価し、何を昇格または後続化するのかが曖昧になる。

責務を分けることで、Issue #257 の成果物が先に確定しても、この Intent は分類先の契約だけを更新すればよい。

## 影響

Construction では、Issue #257 を参照する場合でも、この Intent の成果物には decision review の詳細仕様を持ち込まない。

Issue #257 の成果物が先に merge された場合は、用語と起動順序だけを同期する。
