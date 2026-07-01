# Construction 内部 skill の親 skill 経由案内

## 目標プロファイル

| フィールド | 値 | 説明 |
|---|---|---|
| goalType | technical | Construction 内部 skill の次工程案内を、公開入口である `amadeus-construction` の契約に合わせる技術目標である。 |
| scope | refactor | 既存の stage 構造や内部 skill の責務を変えず、skill 記述の誘導だけを補正する Intent である。 |
| labels | skill, construction, guidance, parent-skill, traceability | Construction 内部 skill、親 skill 経由の継続、traceability finalization の誘導を表す。 |

## 目的

Construction 内部 skill の `次の skill` 欄から、後続作業は公開入口である `amadeus-construction` を目的付きで呼び、親 skill が次の内部 skill へ委譲する流れだと読み取れるようにする。

この Intent は [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274) を根拠にする。

## 成功条件

- `amadeus-construction-implementation-execution` の `次の skill` 欄で、実装後は `amadeus-construction` を検証目的で呼ぶことが明記されている。
- `amadeus-construction-verification-hardening` の `次の skill` 欄で、検証後は `amadeus-construction` をファイナライズ目的で呼ぶことが明記されている。
- 内部 skill を直接呼ぶのは、親 skill から明示的に委譲されている場合だけであることが説明されている。
- 実装完了だけでは Construction 完了ではなく、検証と traceability finalization が必要であることが読み取れる。
- `amadeus-construction` の公開入口としての責務と矛盾しない。

## 範囲

含めるもの:

- `amadeus-construction-implementation-execution` の `次の skill` 欄。
- `amadeus-construction-verification-hardening` の `次の skill` 欄。
- 必要な場合の `amadeus-construction-bolt-preparation`、`amadeus-construction-functional-design`、`amadeus-construction-traceability-finalization` の確認。
- source skill と昇格先成果物の対応更新要否。

含めないもの:

- Construction の stage 構造変更。
- 内部 skill の責務変更。
- 成果物レイアウト変更。
- Construction 各工程の一括自動実行追加。
- validator の変更。

## 現在の phase

Ideation を開始する。

Inception では、対象 skill、受け入れ条件、source skill と昇格先成果物の対応、検証方法を具体化する。
