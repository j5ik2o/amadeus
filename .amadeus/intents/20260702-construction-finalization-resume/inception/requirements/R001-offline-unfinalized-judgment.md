# R001 オフライン未 finalize 判定

## 要求

merge 済み未 finalize の Intent を、成果物と state だけから判定できる。

## 背景

finalization は merge というセッション外のイベントの後に実行する。
merge されていない実装は基準 branch に存在しないため、基準 branch 由来の checkout に未 finalize 状態が存在すること自体が merge の証拠になる。

## 受け入れ条件

- 判定規則が「基準 branch 由来の checkout に、実装済みかつ検証済み（`test-results.md` あり）で、`pr.md` がなく `construction.gate` が `passed` でない Intent が存在する」として文書化されている。
- 判定に GitHub への照会（gh CLI など）を必須にしない。
- 作業中 branch での誤検出を避けるため、判定の前提（基準 branch 由来の checkout）が明記されている。

## 依存

なし。

## 対応する対象境界

- SC-IN-001

## 未確認事項

- なし。
