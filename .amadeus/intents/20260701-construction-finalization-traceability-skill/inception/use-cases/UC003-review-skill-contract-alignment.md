# UC003: skill 契約整合をレビューする

## システム境界

- Maintainer と Reviewer が GitHub PR 上で、skill 説明、validator 要件、template または example の整合を確認する。

## 事前条件

- UC001 と UC002 の結果が PR に含まれている。
- 検証結果が PR 説明または対象 Intent の成果物から追跡できる。

## 基本フロー

1. Maintainer は PR の対象 Issue と対象 Intent を確認する。
2. Maintainer は `Construction からの追跡` 表要件が skill から読めることを確認する。
3. Maintainer は必須列が validator 要件と一致していることを確認する。
4. Reviewer は CI と review comment を確認する。
5. Maintainer は merge 後の採用判断へ進めるかを判断する。

## 代替フロー

- review comment が目的外だが有効な場合は、別 Issue として起票して対象 PR からは外す。

## 事後条件

- PR が merge 可能な状態である。
- Issue #245 の完了判断に必要な証拠を追跡できる。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | GitHub PR | 差分、CI、review comment を扱う。 |
| 制御 | Contract Review | skill と validator の一致を確認する。 |
| エンティティ | Review Evidence | CI、validator、標準検証、コメント対応を保持する。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| Review Evidence Collection | 採用 | PR、CI、review comment、検証結果 | Maintainer の merge 判断 |
