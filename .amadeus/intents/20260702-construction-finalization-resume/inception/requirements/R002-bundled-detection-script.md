# R002 同梱検出スクリプト

## 要求

同梱スクリプトで未 finalize の Intent を列挙でき、配布先ユーザー環境で動作する。

## 背景

現状、未 finalize の状態はエージェントが state と成果物を手で読み合わせて発見している。
検出を実行可能な手段にすることで、ハーネスやエージェントによらず同じ結果を得られる。

## 受け入れ条件

- 検出スクリプトが `skills/amadeus-construction/scripts/` にあり、promote で昇格先へ反映される。
- 対象 workspace を引数で受け取り、R001 の判定規則に従って未 finalize の Intent を機械可読な形で列挙する。
- repo root の開発用スクリプト、gh CLI、ネットワークへ依存せず実行できる。
- 未 finalize が存在しない場合と存在する場合を、出力または終了コードで区別できる。

## 依存

- R001

## 対応する対象境界

- SC-IN-002

## 未確認事項

- 出力形式と終了コードの最終仕様は Construction の Functional Design で確定する。
