# D001: Inception 境界判断

## 背景

Issue #277 は、`.amadeus/` の過去成果物を横断分析する内部 skill と、分析結果を学習先へ分類する内部 skill の追加を求めている。

Issue #259 では内部 skill 候補を初期完了条件に含めなかったため、Issue #272 の `dry-run` を進める前に前提補修が必要になった。

## 判断

Inception では、過去分析 skill、学習分類 skill、`dry-run` consumer 境界、source skill と昇格先成果物の同期検証を対象にする。

`amadeus-discovery dry-run` の実装、Discovery 成果物の構造変更、Intent Record の自動作成、GitHub Issue の自動作成、自動昇格、完了済み Intent 成果物の一括移行、validator の意味検証拡張は対象外にする。

## 理由

この境界にすると、Issue #277 の前提補修を閉じた単位で扱える。
また、Issue #272 の `dry-run` は分析結果の consumer として扱えるため、候補表示と横断分析の責務を混ぜずに進められる。

## 影響

Construction では、内部 skill、`amadeus-discovery` の説明、text contract、promote-skill、validator、必要な標準検証を対象にする。

Issue #272 の `dry-run` 本体は、この Intent の完了後に進める。
