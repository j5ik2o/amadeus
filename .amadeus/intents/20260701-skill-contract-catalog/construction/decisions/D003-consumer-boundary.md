# D003: consumer 責務境界

## 背景

Issue #263 は validator または evaluator が Skill Contract を参照する入口と、#257/#259 が Skill Contract を入力にできることを求めている。

## 判断

validator は生成物の構造と参照入口を扱う。
evaluator は品質評価入力の候補を扱う。
decision review と learning review は、Skill Contract の consumer として catalog に記録する。

## 理由

validator の `passed` を内容承認にすると、構造検出と品質評価の責務が混ざる。

## 影響

Skill Contract catalog に consumer 参照情報を持たせる。
validator 用 TypeScript 生成物を追加するが、意味評価エンジン化はしない。
