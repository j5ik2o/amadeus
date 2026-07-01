# R002 Decision Review Outcome Classification

## 要求

decision review の結果を、質問、通常処理、構造補修、後続 Issue 候補の分岐へ分類できる。

## 背景

不明瞭な判断ノードが見つかっても、すべてを人間への質問にする必要はない。
構造補修で足りる問題、成果物境界外の懸念、質問せず進める判断を分ける必要がある。

## 受け入れ状態

- `grill_required` は、人間判断が phase 成果物、gate、traceability、次 phase への引き継ぎに影響する場合に使える。
- `no_grill` は、現在の証拠で分岐を説明できる場合に使える。
- `repair_only` は、構造補修だけで解ける場合に使える。
- `follow_up_issue_candidate` は、現在 Intent の成功条件には不要だが後続作業として扱うべき場合に使える。

## 対象外

- 後続 Issue を人間承認なしに作成すること。
- 軽い感想や一時メモを成果物化すること。
