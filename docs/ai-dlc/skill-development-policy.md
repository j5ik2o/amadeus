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
```

`agents/` は、そのスキルが実行時に明示的に使う場合だけコピーする。

コピーしない対象は次のとおりである。

```text
dev-scripts/
evals/
eval-runs/
tmp/
benchmarks/
review-output/
```

## 実行時と開発用検証の分離

`scripts/` は、スキル実行時に必要なスクリプトの置き場である。

`dev-scripts/` は、スキル開発、eval、昇格判断に使う開発用スクリプトの置き場である。

検証スクリプトは、原則として開発用である。

スキル実行時に必要な検証は、次のどちらかにする。

- 対象スキルの `scripts/` や `references/` に同梱する。
- 独立した検証スキルとして分離する。

開発用検証を実行時依存として扱わない。

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
