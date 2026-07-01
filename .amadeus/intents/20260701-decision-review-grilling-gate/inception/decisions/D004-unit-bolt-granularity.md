# D004 Unit Bolt Granularity

## 状態

accepted

## 文脈

decision review は、入力証拠、判断ノード、分岐、grilling handoff、phase skill 反映、検証境界を含む。
すべてを1つの実装単位にすると、Construction の検証単位が大きくなりすぎる。

## 判断

Unit は `U001 decision review gate contract` と `U002 phase skill adoption verification` の2件に分ける。
Bolt は `B001 decision review internal contract`、`B002 phase skill entry integration`、`B003 verification contract alignment` の3件に分ける。

## 根拠

- B001 は decision review の内部契約を単独で検証できる。
- B002 は公開 phase skill の起動時判断だけを検証できる。
- B003 は Skill Contract、validator、evaluator、eval の境界確認を B001 と B002 の後で扱える。

## 影響

- Construction は B001、B002、B003 の順で進める。
- B003 は U001 と U002 の両方を参照するが、複数 Unit を扱う理由を Bolt に明記する。
- 初期対象 phase skill は Ideation、Inception、Construction に限定する。
