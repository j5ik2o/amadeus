# D002: Skill Contract 参照文書を生成する

## 背景

Issue #263 は `references/skill-contract.md` または同等の生成物を求めている。
手書き管理にすると、TypeScript catalog と参照文書がずれる。

## 判断

Skill Contract 参照文書は `amadeus-contracts/catalog/**` から生成する。
`references/skill-contract.md` には直接編集禁止を明記する。

## 理由

`contracts:check` で欠落と差分を検出するには、生成対象を `generatedContractFiles` に集約する必要がある。

## 影響

Construction では `dev-scripts/amadeus-contracts.ts` と `dev-scripts/evals/amadeus-contracts/check.ts` を更新する。
