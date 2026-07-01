# D001: Inception 境界判断

## 背景

- [Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245) は、Construction finalization skill に完了時の追跡表要件を明記することを求めている。
- [PR #244](https://github.com/amadeus-dlc/amadeus/pull/244) では、`Construction からの追跡` 表を追加した後に validator が pass した。
- Ideation では、validator の成果物契約変更と Issue #233 の成果物再設計を対象外にしている。

## 判断

- Inception の対象境界を、Construction finalization skill の追跡表要件、必須列、Task Generation 表との違い、source skill と昇格先成果物の整合確認に固定する。
- validator の成果物契約変更、新しい phase や stage の追加、Issue #233 の成果物再設計は対象外にする。
- User Story は、Maintainer が skill と validator の契約一致を確認する価値として扱う。

## 理由

- Issue #245 の受け入れ条件は、skill guidance と成果物契約の一致として要求へ分解できる。
- 完了時表要件、必須列、Task Generation 表との違いは、同じ finalization guidance の責務として扱える。
- source skill と昇格先成果物、template、example の確認は、skill 変更の完了条件として分けて追跡する必要がある。

## 影響

- Construction では、skill guidance 更新と template/example alignment 確認を別 Bolt として扱う。
- validator の成果物契約は変更しない。
- PR 準備時には、対象 Intent の validator、typecheck、diff check、必要な test all を確認する。
