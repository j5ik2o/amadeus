# 複数リポジトリ実装対象の扱い

## 目的

この文書は、1つの Intent が複数の境界づけられたコンテキストや複数のシステム境界をまたぐ場合の実装対象管理方針を定める。

## 問題

1つの Intent が複数の境界づけられたコンテキストをまたぐ場合、実装境界も複数のシステムや複数の Git リポジトリに分かれることがある。

このとき、実装リポジトリを submodule として標準的に結合すると、所有境界と checkout 手段が混ざる。

submodule は、Intent の進行、各リポジトリの branch、PR、CI、commit pin を同時に扱う必要がある。

そのため、Amadeus 成果物の管理元と実装リポジトリの管理元が曖昧になりやすい。

各システム側が Amadeus リポジトリを submodule として持つ形も、同じ Intent の管理元が複数箇所に見えるため避ける。

## 方針

Amadeus は、実装リポジトリを所有しない。

Amadeus は、Unit や Bolt から実装対象を参照する。

実装の管理元は、各システムリポジトリに置く。

Amadeus の管理対象は、Intent、Unit、Bolt、設計判断、追跡、検証証拠である。

```text
Intent
  -> Unit
      -> primary bounded context
      -> implementation target
          -> repository
          -> path
          -> branch
          -> pull request
          -> ci check
  -> Bolt
      -> Unit
      -> implementation target
```

## Construction 実行時の作業空間

複数リポジトリをまたぐ Bolt を Construction で扱う場合、同じエージェント実行文脈から Intent 成果物と対象実装リポジトリを同時に参照できる必要がある。

これは、実装リポジトリを Amadeus 配下に所有することを意味しない。

必要なのは、対象 Bolt の実行時に、Amadeus workspace と各実装リポジトリの checkout が同じ作業空間として渡されることである。

対象リポジトリが同じ作業空間にない場合、その Bolt は実装実行へ進めず、準備不足として扱う。

## AI エージェントへの渡し方

Construction を実行する AI エージェントには、実装リポジトリだけでなく、対象 Intent、Unit、Bolt を含む Amadeus workspace も渡す。

GitHub URL や PR URL だけを渡す形は、Construction の標準入力として扱わない。

AI エージェントが参照すべき情報は、実行時にローカル path として読める必要がある。

Claude Code では、実装リポジトリを開いたうえで `/add-dir` により Amadeus workspace を追加する。

複数リポジトリをまたぐ場合は、関連する実装リポジトリも `/add-dir` で追加する。

```text
/add-dir /work/ai-dlc/amadeus
/add-dir /work/ai-dlc/repos/service-b
```

Codex CLI では、`-C` で主な実装リポジトリを指定し、`--add-dir` で Amadeus workspace と関連リポジトリを追加する。

```sh
codex -C /work/ai-dlc/repos/service-a \
  --add-dir /work/ai-dlc/amadeus \
  --add-dir /work/ai-dlc/repos/service-b \
  "amadeus/.amadeus/intents/<intent-id>-<slug> の <bolt-id> を Construction する"
```

Codex App では、thread または worktree 作成時に、実装リポジトリと Amadeus workspace を同じ作業空間として扱える状態にする。

複数 workspace root を明示して渡せない場合は、同じ親ディレクトリ配下に sibling checkout を作り、その親ディレクトリを作業空間として渡す。

```text
/work/ai-dlc/
  amadeus/
    .amadeus/intents/<intent-id>-<slug>/
  repos/
    service-a/
    service-b/
```

Construction を開始する前に、AI エージェントが次を同じ文脈で読めることを確認する。

- 対象 Intent の成果物
- 対象 Unit のモジュールファイルと `design.md`
- 対象 Bolt のモジュールファイルと `tasks.md`
- 関連する `requirements.md`、`acceptance.md`、`traceability.md`
- 対象実装リポジトリのコード
- 検証コマンドと PR 作成先

この条件を満たさない場合は、実装実行ではなく、作業空間の準備を先に行う。

## Submodule の扱い

submodule は、標準構造としては扱わない。

submodule は、統合 E2E やローカル検証のために複数リポジトリを同じ workspace に checkout する手段としてだけ扱う。

submodule を使う場合でも、実装の所有権は各システムリポジトリに残す。

## 成果物への反映

Unit または Bolt には、実装対象として repository、path、branch、PR、CI を記録できるようにする。

複数リポジトリをまたぐ Intent では、Unit ごとに主な実装対象を記録する。

Bolt が複数リポジトリを変更する場合は、変更対象を分けて記録する。

## Validator 境界

validator は、実装対象欄の存在と構造を確認する。

validator は、PR URL や CI 名が記録されている場合、その形式を確認する。

validator は、対象リポジトリの実在性、branch の最新性、CI の成功可否までは判断しない。

これらは Construction の検証や PR 監視の責務で扱う。
