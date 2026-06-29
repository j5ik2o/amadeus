# Construction Design

## 概要

- この文書は B001 の Construction Design である。
- B001 は Discovery Brief 記録を実装可能な Task 集合へ分解する。
- Design Gate の evidence は、このファイルを指す。
- 対象要求は R001 である。
- 対象ユースケースは UC001 である。
- 対象 Unit は U001 である。

## Domain Design

- **Discovery Brief** は、利用者が提示した入力テーマ、確認した前提、判定、判定理由を保持する判断記録である。
- B001 が所有する責務は、Discovery Brief の記録項目、記録順序、記録完了条件である。
- B001 は Intent 候補の提示、最初に進める候補の選択、Intent 初期化の自動実行を扱わない。
- 入力テーマは空欄にしない。
- 確認した前提は、確認済み内容と未確認事項を混同しない。
- 判定は、判定理由なしで確定扱いにしない。
- Discovery Brief の記録中に Requirement、Use Case、Unit、Bolt、Task を定義しない。
- Discovery Brief の表示文言と具体的な対話手順は、未確認事項として記録する。

## Logical Design

- Discovery Brief 記録は、入力テーマ受領、前提整理、判定記録、判定理由記録、未確認事項記録の順に進める。
- 入力テーマ受領では、利用者の入力テーマを Discovery Brief の起点として記録する。
- 前提整理では、確認した前提と未確認事項を分けて記録する。
- 判定記録では、multi_intent などの Discovery 判断を記録する。
- 判定理由記録では、入力テーマと確認した前提に基づく理由を記録する。
- 未確認事項記録では、表示文言と具体的な対話手順など、Construction 実行時に確定しない事項を残す。
- 作業ツリーには実装コードと package 定義がなく、`.amadeus` 成果物だけが存在する。
- そのため、実装対象候補は Discovery Brief を Markdown 成果物として保存する最小単位の追加または更新である。

## 実装設計

- Discovery Brief の保存先を、Discovery layer の成果物として扱える Markdown ファイルにする。
- Markdown には、入力テーマ、確認した前提、判定、判定理由、未確認事項を独立した見出しまたは表で記録する。
- 記録処理は、既存の Discovery 成果物と同じく空欄を作らず、値が確定しない項目には `未確認` を入れる。
- 記録処理は、Requirement、Use Case、Unit、Bolt、Task の定義を生成しない。
- B001 の Task は、保存形式の確定、記録項目の作成、責務境界の維持、検証入口の確認に分ける。
- B002 が扱う Intent 候補、候補判断、推奨次アクションの提示は、この Bolt の実装対象に含めない。

## 検証設計

- Discovery Brief に入力テーマ、確認した前提、判定、判定理由が記録されることを確認する。
- 確認した前提と未確認事項が混同されないことを確認する。
- 判定理由が空欄のまま判定済みにならないことを確認する。
- Discovery Brief 記録によって Requirement、Use Case、Unit、Bolt、Task が生成されないことを確認する。
- 構造検証は `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260628-discovery-brief-creation` を入口にする。

## 設計変更記録

- 2026-06-29: B001 の Construction Design を初期作成した。
