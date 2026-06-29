# Amadeus examples

このディレクトリは、Amadeus skill を使って生成した `.amadeus/` の段階別 snapshot です。
root `.amadeus/` は実運用状態と例示成果物を混ぜるため置いていません。

## Snapshot

| ディレクトリ | 状態 | 見るもの |
|---|---|---|
| [01-discovery-completed](01-discovery-completed/.amadeus/README.md) | Discovery 完了 | ECサイト構築テーマの Discovery と Intent 候補 |
| [02-ideation-completed](02-ideation-completed/.amadeus/README.md) | Ideation 完了 | Intent Record、scope、ideation、mock、traceability、decision |
| [03-inception-completed](03-inception-completed/.amadeus/README.md) | Inception 完了 | Requirement、Story、Use Case、Unit、Bolt |
| [04-construction-design-ready](04-construction-design-ready/.amadeus/README.md) | Task Generation ready | Unit ごとの Functional Design、`tasks.md`、Task Generation Gate、実装前の追跡 |

注: Task 生成は Functional Design 後の Construction phase に移行済みです。
`03-inception-completed` は `tasks.md` を含まず、`04-construction-design-ready` は Construction の Bolt preparation 後の `tasks.md` を含みます。

## 再生成

段階別 snapshot を real provider で再生成する場合は、repo root で次を実行します。

~~~sh
npm run examples:generate:real
~~~

この task は空の一時 workspace から始め、`01-discovery-completed`、`02-ideation-completed`、`03-inception-completed`、`04-construction-design-ready` を順に real provider で生成します。
生成後に [skill-provenance.json](skill-provenance.json) の md5 を更新し、`staleReason` を削除します。

## 検証

各 snapshot は、次のように Amadeus Validator で検証できます。

~~~sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts examples/01-discovery-completed
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts examples/02-ideation-completed 20260629-minimum-purchase-flow
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts examples/03-inception-completed 20260629-minimum-purchase-flow
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts examples/04-construction-design-ready 20260629-minimum-purchase-flow
~~~

repo 全体の examples 検証では、[skill-provenance.json](skill-provenance.json) も確認します。
この manifest は、各 snapshot を生成した source skill の `skills/**/SKILL.md` と md5 を記録します。
`npm run validate` は、現在の skill file md5 と manifest の md5 が一致することを検証します。
再生成予定の snapshot だけ、`staleReason` に理由を記録して一時的な md5 不一致を明示できます。
