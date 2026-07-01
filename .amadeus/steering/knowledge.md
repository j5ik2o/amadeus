# Knowledge

## 背景

- Amadeus DLC 自体を Amadeus の仕組みで開発できるようにする。
- 目的は、Intent 作成後から PR 準備までの手戻りを減らすことである。
- 自己開発では、実行する側の skill、変更対象の skill、example snapshot、検証対象の `.amadeus/` が重なりやすい。

## 前提

- build workspace と target workspace は分ける方針を推奨する。
- target workspace は、Amadeus 本体リポジトリから切った別 `git worktree` を推奨する。
- target workspace の root `.amadeus/` を自己開発用 steering layer として扱う。
- GitHub Issue を先に作り、Intent 側に Issue URL を記録する。
- 初回導入 Intent の完了条件は Ideation gate passed である。

## 後段発見と横断学習

- 後段 phase、validator、evaluator、PR コメントで見つかった発見は、上流戻し、現在 phase 修正、横断学習、後続化、非採用へ分類する。
- 前段成果物の不足または矛盾が現在の成功条件を妨げる場合は、`upstream_feedback_required` として該当 phase または stage skill へ戻す。
- 現在 phase の成果物または実装だけで解消できる場合は、`current_phase_update_required` として現在 phase で扱う。
- 複数 Intent で再利用する運用、制約、判断基準だけを `steering_knowledge_candidate` として扱う。
- Domain Map と Context Map は候補を扱わず、承認済みの `adopted` と `retired` の現在の索引だけを扱う。
- validator は構造検出、evaluator は品質評価であり、どちらの結果も内容承認や横断学習の自動採用にはしない。

## 未確認事項

- stage0、stage1、stage2 を `CONTEXT.md` に追加する必要があるか。
- `examples/skill-provenance.json` だけで example snapshot の provenance が足りるか。
- host environment の assets と target artifacts の assets の混入を validator で検出する必要があるか。
- build workspace と target workspace の対応をどの成果物に記録するか。
