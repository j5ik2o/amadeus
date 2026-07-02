# D003: User Stories 省略と粒度の判断

## 背景

この Intent の相互作用主体は、skill を再実行する Agent と、成果物や state を読むシステムである。

成果物の分解では、Intent と Unit が 1:1 になる。

## 判断

- User Stories を省略する。人間アクターの価値（Maintainer が finalization を思い出さなくてよい）は存在するが、相互作用としては Agent とシステムだけで叙述でき、独立したユーザー価値表現を作る必要がない。
- Intent:Unit の 1:1 を例外として認める。Unit は U001 の1件とし、Bolt は B001 と B002 の2件に分解する。

## 理由

- 先例（20260702-stage-prerequisite-checks）も、Agent とシステムが主体の skill 契約変更で User Stories を省略している。
- この Intent は単一の再開契約を扱い、複数の価値単位に分けると境界が不自然になる。実施単位は Bolt 2件で分解できている。

## 影響

- `state.json.inception.requiredStoryArtifacts` を空配列にする。
- 分割を見直す条件: 検出対象が Construction 以外の phase へ広がる場合、または人間アクターの承認操作が契約に入る場合は、Story と Unit の分割を再検討する。
