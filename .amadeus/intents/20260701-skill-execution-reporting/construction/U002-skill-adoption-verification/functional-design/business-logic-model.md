# Business Logic Model

## 目的

U001 の報告契約を、source skill、昇格先 skill、関連 eval で同じ意味として確認できるようにする。

## 対象 Unit

U002 skill adoption verification。

## 業務ロジック

source skill は、`skills/amadeus-ideation/SKILL.md`、`skills/amadeus-inception/SKILL.md`、`skills/amadeus-construction/SKILL.md` を代表対象にする。

昇格先 skill は、`dev-scripts/promote-skill.ts <skill-name> --replace` で更新する。
手動同期は使わない。

関連 eval は `dev-scripts/evals/amadeus-templates/check.ts` で確認する。
この eval は、source skill と昇格先 skill の両方に報告契約のキーフレーズが存在することを検証する。

## 入力

- U001 の報告契約。
- `skills/amadeus-ideation/SKILL.md`。
- `skills/amadeus-inception/SKILL.md`。
- `skills/amadeus-construction/SKILL.md`。
- `.agents/skills/amadeus-ideation/SKILL.md`。
- `.agents/skills/amadeus-inception/SKILL.md`。
- `.agents/skills/amadeus-construction/SKILL.md`。
- `dev-scripts/evals/amadeus-templates/check.ts`。

## 出力

- 昇格先 skill の報告契約。
- `amadeus-templates` eval の text contract。
- 昇格手順の検証結果。

## 未確認事項

なし。
