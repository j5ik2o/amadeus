# R001: 前段 feedback routing

## 要求

- 後段 phase で前段成果物の不整合、不足、古い判断を見つけた場合に、前段成果物へ戻す条件を判断できる。

## 受け入れ条件

- Construction で Requirement、Use Case、Unit、Bolt の問題が見つかった場合に、Inception 成果物へ戻す条件が説明されている。
- Inception で Ideation の scope、成果物深度、検証戦略の問題が見つかった場合に、Ideation 成果物へ戻す条件が説明されている。
- 前段成果物へ戻す場合に、対象 phase skill または内部 stage skill を使う判断軸が説明されている。
- 後段成果物だけで辻褄を合わせてよい場合と、前段成果物へ戻すべき場合を区別できる。

## 根拠

- Issue #259 の「後段から前段への feedback loop」。
- `ideation/scope.md` の SC-IN-001。
- `ideation/traceability.md` の「逆方向 feedback」。

## 未確認事項

- Construction で実際に更新する skill ごとの戻し先表は、Construction で確定する。
