# Skill Development Policy

## 目的

この文書は、Amadeus DLC で AI-DLC スキルを開発、検証、昇格するための開発方針である。

この文書はスキル実行時の参照ではない。

スキル本文からこの文書を参照しない。

## 開発場所と利用場所

開発中のスキルは `skills/<skill-name>/` に置く。

実際に agent が利用する昇格済みスキルは `.agents/skills/<skill-name>/` に置く。

デバッグ用の隔離環境は `test-root/` に置く。

`test-root/` は Git 管理しない。

```text
skills/<skill-name>              # 開発中スキル。Git 管理する
test-root/                       # デバッグ環境。Git 管理しない
test-root/.agents/skills/...     # skills/ への symlink
.agents/skills/<skill-name>      # 昇格済みスキル。Git 管理する
```

開発中スキルを root の `.agents/skills/` に置かない。

開発中スキルを agent が誤って読み込むと、開発中の未確定ルールが通常作業に混ざるためである。

## デバッグ

デバッグでは、`test-root/.agents/skills/<skill-name>` から `skills/<skill-name>` へ symlink する。

```text
test-root/.agents/skills/<skill-name> -> ../../../skills/<skill-name>
```

この symlink はデバッグ環境内だけで使う。

root の `.agents/skills/` には symlink しない。

## 昇格

最低限の eval と手動レビューを通ったスキルだけを `.agents/skills/<skill-name>/` へ昇格する。

昇格は symlink ではなくコピーで行う。

コピーにすることで、昇格時点の内容を Git で明確に管理できる。

昇格先が既にある場合は失敗する。

`--replace` を指定した場合だけ、昇格先を削除してからコピーする。

削除してからコピーすることで、旧バージョンにだけ存在したファイルが残らない。

昇格は `dev-scripts/promote-skill.rb` を使う。

```sh
ruby dev-scripts/promote-skill.rb <skill-name>
ruby dev-scripts/promote-skill.rb <skill-name> --replace
```

## 昇格コピー対象

昇格では、スキル実行時に必要なファイルだけをコピーする。

コピー対象は次のとおりである。

```text
SKILL.md
references/
scripts/
assets/
templates/
agents/
validator/
```

`agents/` は、そのスキルが実行時に明示的に使う場合だけコピーする。

`validator/` は、そのスキルが実行時検証入口として明示的に使う場合だけコピーする。

`skill-forge` のような実行時ツール同梱スキルでは、`SKILL.md` が明示的に呼び出す場合に限り、次もコピーしてよい。

```text
eval-viewer/
pyproject.toml
uv.lock
```

コピーしない対象は次のとおりである。

```text
dev-scripts/
evals/
eval-runs/
tmp/
benchmarks/
review-output/
tests/
.venv/
.pytest_cache/
__pycache__/
justfile
```

昇格後は、配布先に開発用ファイルが残っていないことを確認する。

```sh
test -z "$(find .agents/skills \( -name dev-scripts -o -name evals -o -name eval-runs -o -name tmp -o -name benchmarks -o -name review-output -o -name tests -o -name .venv -o -name .pytest_cache -o -name __pycache__ -o -name justfile -o -path '*/scripts/ci' \) -print)" && echo ".agents dev files: absent"
```

全 Amadeus skill の昇格結果を確認する場合は、一時ディレクトリへ昇格し、現行の `.agents/skills/amadeus-*` と差分がないことを確認する。

```sh
bash -lc 'set -euo pipefail
mapfile -t skills < <(find skills -maxdepth 1 -mindepth 1 -type d -name "amadeus-*" -exec basename {} \; | sort)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/amadeus-promote-all.XXXXXX")
root="$tmp/.agents/skills"
for skill in "${skills[@]}"; do
  ruby dev-scripts/promote-skill.rb "$skill" --agents-root "$root" > "$tmp/$skill.log"
  diff -qr "$root/$skill" ".agents/skills/$skill" > "$tmp/$skill.diff"
done
rm -rf "$tmp"'
```

## 実行時と開発用検証の分離

`scripts/` は、スキル実行時に必要なスクリプトの置き場である。

`dev-scripts/` は、スキル開発、eval、昇格判断に使う開発用スクリプトの置き場である。

検証スクリプトは、原則として開発用である。

スキル実行時に必要な検証は、次のどちらかにする。

- 対象スキルの `scripts/` や `references/` に同梱する。
- 独立した検証スキルとして分離する。

開発用検証を実行時依存として扱わない。

## Intent Validator の検査責務

Intent Validator は、配布先ユーザー環境で動く実行時 validator として扱う。

Intent Validator をスキルに同梱する場合は、対象スキルの `validator/` に置く。

repo root の開発用 `scripts/**` を、配布先ユーザー環境の検証入口にしない。

`domain/bounded-contexts.md` を検査する Intent Validator は、少なくとも次を確認する。

- `一覧`、`コンテキスト間の依存`、`パターン分類` の見出しがある。
- `一覧` の表に `識別子`、`名前`、`サブドメイン`、`役割`、`モデル`、`契約` がある。
- `コンテキスト間の依存` の表に `Downstream`、`Upstream`、`依存内容`、`組織パターン`、`統合パターン`、`状態` がある。
- `Downstream` と `Upstream` が、同じ `bounded-contexts.md` の `一覧` に存在する境界づけられたコンテキスト ID、または `なし` である。
- `Upstream` が `なし` の場合、`組織パターン` と `統合パターン` が `該当なし` であり、`状態` に理由がある。
- `Upstream` が `なし` でない場合、`組織パターン` が `パートナーシップ`、`別々の道`、`順応者`、`顧客／供給者` のいずれかである。
- `Upstream` が `なし` でない場合、`統合パターン` が `共有カーネル`、`巨大な泥団子`、`公開ホストサービス（OHS）`、`公表された言語（PL）`、`腐敗防止層（ACL）` のいずれかである。
- `パターン分類` に、組織パターン4種類と統合パターン5種類が列挙されている。

## 単独配布可能性

スキルは単独で配布可能な構成にする。

スキル実行時に必要な知識は、スキルディレクトリ内に閉じる。

スキル本文から repo の開発用ドキュメントを参照しない。

参照してはいけない例は次のとおりである。

```text
../docs/...
../../CONTEXT.md
repo root の docs/ai-dlc/**
repo root の scripts/**
repo root の .agents/rules/**
```

必要な知識は、次のどちらかに置く。

```text
skills/<skill-name>/references/
skills/<skill-name>/assets/
```

または、`SKILL.md` に最小限だけ埋め込む。
