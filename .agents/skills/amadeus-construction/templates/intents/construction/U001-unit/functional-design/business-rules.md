# Business Rules

## 目的

未確認。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | 未確認 | 未確認 | proposed |

## 例外

未確認。

## 参照リンク方針

| 参照種別 | 表示 | リンク先 | 備考 |
|---|---|---|---|
| ID | Requirement ID、Story ID、Use Case ID、Unit ID、Bolt ID、Task ID、Bounded Context ID など | 参照先成果物への Markdown リンク | 参照先が一意に決まる場合だけ扱う。 |
| 成果物名または workspace 内ファイルパス | 成果物名または相対パス | 参照元 Markdown から見た相対 Markdown リンク | 同一ファイル内アンカーは、見出し安定性がある場合だけ使う。 |
| GitHub 上のファイルパスまたはコード参照 | ファイルパスまたはコード位置 | commit SHA 付き permalink | branch URL で代替しない。 |
| PR番号 | PR #123 | GitHub Pull Request URL | PR を言及するときは URL を持つリンクにする。 |
| Issue番号 | Issue #123 | GitHub Issue URL | Issue を言及するときは URL を持つリンクにする。 |

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | 未確認 | 未確認 | proposed |
| INV001 | 不変条件 | GitHub 上のファイルパスまたはコード参照は commit SHA 付き permalink を使う。 | 未確認 | proposed |

## 未確認事項

未確認。
