# R002: リンク先規則

## 要求

- workspace 内成果物への参照は、相対 Markdown リンクとして扱う。
- GitHub 上のファイルパスまたはコード参照は、commit SHA を含む permalink として扱う。
- PR番号は対象 repository の Pull Request URL へリンクし、Issue番号は対象 repository の Issue URL へリンクする。
- 外部 repository を指す場合は、repository が分かる表記または完全な URL にする。

## 受け入れ条件

- workspace 内成果物、GitHub ファイルパス、PR番号、Issue番号のリンク先規則を成果物から読める。
- branch URL と commit SHA 付き permalink の扱いの違いを説明できる。
- 外部 repository 参照の曖昧さを避ける条件を読める。

## 根拠

- [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243)
- [scope.md](../ideation/scope.md)
- [codebase-analysis.md](../codebase-analysis.md)

## 未確認事項

- GitHub の行番号付き permalink を必須にするかは Construction で確定する。
