# D002: split internal skills

## 背景

Issue #259 では、過去分析と学習分類の内部 skill 候補は初期 Construction の必須条件にされなかった。
Issue #277 では、その欠落を補うために内部 skill を追加する。

## 判断

`amadeus-history-review` と `amadeus-learning-review` は別内部 skill として追加する。

## 理由

過去分析は `.amadeus/` 成果物を読み取り専用で整理する責務である。
学習分類は分析結果や検証結果を phase skill、`amadeus-grilling`、後続 Issue、後続 Intent へ振り分ける責務である。
この2つを分けることで、成果物読み取りと分類判断を独立して検証できる。

## 影響

B001 は history review の契約だけを扱う。
B002 は learning review の契約だけを扱う。
どちらも成果物更新、Issue 作成、Intent Record 作成、自動昇格は行わない。
