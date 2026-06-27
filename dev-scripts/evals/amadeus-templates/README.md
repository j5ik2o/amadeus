# Amadeus template evals

## 検証対象

この eval は、Amadeus 成果物を生成する skill の標準テンプレート契約を検証する。

対象 skill は次である。

- `amadeus-steering`
- `amadeus-intent-init`
- `amadeus-ideation`
- `amadeus-inception`

## 検証条件

- 各 skill の `SKILL.md` が `.amadeus/settings/templates` と同梱 `templates/` の優先順位を説明している。
- source skill と promoted skill の両方に標準テンプレートが存在する。
- 標準テンプレートに必須見出しが存在する。
- JSON テンプレートは JSON として解釈できる。
- `promote-skill.ts` で一時昇格した結果に `templates/` が含まれる。
- `.amadeus/` はサンプル成果物として扱い、全体と各 Intent が validator を通る。

## 再実行コマンド

```sh
bun run dev-scripts/evals/amadeus-templates/check.ts
```

## 手動 eval 状態

検証日: 2026-06-27

| ケース | 状態 | 確認内容 | 証拠 |
|---|---|---|---|
| `template-contract` | 完了 | 対象4 skill のテンプレート、必須見出し、JSON 形式、昇格結果を確認した。 | `bun run dev-scripts/evals/amadeus-templates/check.ts` が `amadeus template eval: ok`。 |
| `sample-amadeus-artifacts` | 完了 | `.amadeus/` をサンプル成果物として validator で確認した。 | 同 eval 内で全体と各 Intent の validator が pass。 |
