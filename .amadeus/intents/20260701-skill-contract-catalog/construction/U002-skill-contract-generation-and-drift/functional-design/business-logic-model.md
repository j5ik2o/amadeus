# Business Logic Model

## 目的

Skill Contract catalog から JSON、Markdown、validator 用 TypeScript を生成し、生成物の欠落と差分を検出する業務ロジックを定義する。

## 対象 Unit

U002 skill-contract-generation-and-drift。

## 業務ロジック

| 識別子 | ロジック | 入力 | 出力 | 根拠 |
|---|---|---|---|---|
| BL001 | Skill Contract catalog を JSON 生成物へ変換する。 | Skill Contract catalog | `amadeus-contracts/generated/skills.json` | R003, UC002 |
| BL002 | 代表 skill ごとの Markdown 参照文書を生成する。 | Skill Contract catalog、対象 skill path | `references/skill-contract.md` | R003, UC002 |
| BL003 | validator 用 TypeScript 生成物を作る。 | Skill Contract catalog | `skill-contracts.ts` | R003, R005 |
| BL004 | 生成物の欠落と差分を検出する。 | 生成対象、現在ファイル | stale file list | R004, UC002 |
| BL005 | contract eval で生成対象の追跡と直接編集検出を確認する。 | `generatedContractFiles`、一時 workspace | eval 結果 | R004 |

## 入力

| 入力 | 説明 | 根拠 |
|---|---|---|
| Skill Contract catalog | 生成物の定義元。 | R003 |
| 生成対象 path | 配布先、開発用 skill、validator 用生成物の配置先。 | R003, R004 |
| 現在ファイル | `contracts:check` が比較する対象。 | R004 |

## 出力

| 出力 | 説明 | 利用先 |
|---|---|---|
| `skills.json` | Skill Contract catalog の JSON 表現。 | review、evaluator、外部確認 |
| `references/skill-contract.md` | 代表 skill の人間参照用契約文書。 | skill 利用者、review |
| `skill-contracts.ts` | validator が import できる TypeScript 生成物。 | validator |
| stale file list | 欠落または差分がある生成物一覧。 | `contracts:check`、CI |

## 未確認事項

なし。
