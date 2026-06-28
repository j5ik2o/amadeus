# Amadeus examples

このディレクトリは、Amadeus skill を使って生成した `.amadeus/` の段階別 snapshot です。
root `.amadeus/` は実運用状態と例示成果物を混ぜるため置いていません。

## Snapshot

| ディレクトリ | 状態 | 見るもの |
|---|---|---|
| [01-discovery-completed](01-discovery-completed/.amadeus/README.md) | Discovery 完了 | Discovery Brief と Intent 候補 |
| [02-intent-initialized](02-intent-initialized/.amadeus/README.md) | Intent 初期化完了 | Intent の入れ物と Discovery からのリンク |
| [03-ideation-completed](03-ideation-completed/.amadeus/README.md) | Ideation 完了 | scope、ideation、mock、traceability、decision |
| [04-inception-completed](04-inception-completed/.amadeus/README.md) | Inception 完了 | Requirement、Story、Use Case、Unit、Bolt |
| [05-construction-design-ready](05-construction-design-ready/.amadeus/README.md) | Construction Design ready | Bolt ごとの Construction Design、`tasks.md`、Design Gate、実装前の追跡 |

注: Task 生成は Construction Design 後の Construction phase に移行済みです。
`04-inception-completed` は `tasks.md` を含まず、`05-construction-design-ready` は Construction の Bolt preparation 後の `tasks.md` を含みます。

## 検証

各 snapshot は、次のように Amadeus Validator で検証できます。

~~~sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts examples/01-discovery-completed
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts examples/02-intent-initialized 20260628-discovery-brief-creation
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts examples/03-ideation-completed 20260628-discovery-brief-creation
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts examples/04-inception-completed 20260628-discovery-brief-creation
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts examples/05-construction-design-ready 20260628-discovery-brief-creation
~~~

repo 全体の examples 検証では、[skill-provenance.json](skill-provenance.json) も確認します。
この manifest は、各 snapshot を生成した source skill の `skills/**/SKILL.md` と md5 を記録します。
`npm run validate` は、現在の skill file md5 と manifest の md5 が一致することを検証します。
再生成予定の snapshot だけ、`staleReason` に理由を記録して一時的な md5 不一致を明示できます。
