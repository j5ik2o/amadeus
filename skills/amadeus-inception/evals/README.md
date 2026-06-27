# amadeus-inception evals

## 昇格条件

`amadeus-inception` は、次を満たすことを確認する。

- Ideation gate が `passed` でない Intent を Inception へ進めない。
- `auto` が `guided`、`refine`、`repair` を既存状態から判定する。
- `guided` と `refine` で質問が必要な場合は、`amadeus-grilling` の作法で一問だけ質問し、回答前に成果物を更新しない。
- Inception の成果物範囲を requirements、acceptance、user-stories、use-cases、codebase-analysis、units、bolts、Bolt 配下 design/tasks、traceability、decisions、state.json に限定する。
- domain model、Spec、実装、CI、運用手順を作らない。
- `requirements.md` または `acceptance.md` を書く前に `Requirements Review Gate` を通す。
- 既存コードに載せる Intent で Unit、Bolt、`design.md` を作る前に `Codebase Analysis Gate` を通す。
- `tasks.md` を書く前に `Task 生成 Review Gate` を通す。
- `tasks.md` は同じ Bolt の `bolt.md` と `design.md` を入力にし、Task の `作業`、`要求`、`ユースケース`、`依存`、`証拠` を省略しない。
- 別 Bolt の Task 依存は `B001/T002` の形式で書く。
- greenfield では `codebase-analysis.md` を作らず、`state.json.inception.requiredArtifacts` にも含めず、`traceability.md` に対象外理由と空表を残す。
- `evals.json` が JSON として解釈できる。
- `evals/` は開発用なので昇格先へコピーしない。
- `git diff --check` が成功する。

## 手動 eval 状態

検証日: 2026-06-27

| ケース | 状態 | 確認内容 | 証拠 |
|---|---|---|---|
| `guided-inception-from-ideation` | 完了 | Ideation 完了済み Intent を Inception へ進める前に gate と不足論点を確認する。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-inception-eval.20260627-hgfmNl/guided-inception-from-ideation/checks.md` |
| `refine-pyramid-cardinality` | 完了 | Inception 済み成果物を読み、1:1 分解では grill 不足を疑い、必要なら一問だけ質問する。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-inception-eval.20260627-hgfmNl/refine-pyramid-cardinality/checks.md` |
| `repair-cross-bolt-task-dependency` | 完了 | 別 Bolt の Task 依存を `B001/T002` 形式として扱い、repair で構造だけ補修する。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-inception-eval.20260627-hgfmNl/repair-cross-bolt-task-dependency/checks.md` |
| `task-generation-review-gate` | 完了 | `tasks.md` を書く前に `bolt.md`、`design.md`、要求、ユースケースを確認し、gap があれば書かずに止める。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-inception-eval.20260627-hgfmNl/task-generation-review-gate/checks.md` |
| `requirements-review-gate` | 完了 | 要求を書き込む前に WHAT と観測可能な振る舞いへ絞り、実装方法を混ぜない。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-inception-eval.20260627-hgfmNl/requirements-review-gate/checks.md` |
| `brownfield-codebase-analysis-gate` | 完了 | brownfield では Unit、Bolt、`design.md` の前に既存コード分析を通し、traceability に入力を残す。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-inception-eval.20260627-hgfmNl/brownfield-codebase-analysis-gate/checks.md` |
| `greenfield-traceability-without-codebase-analysis` | 完了 | greenfield では `codebase-analysis.md` を必須化せず、`traceability.md` に対象外理由と空表を残す。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-inception-eval.20260627-hgfmNl/greenfield-traceability-without-codebase-analysis/checks.md` |

## 再実行コマンド

```sh
bun -e 'JSON.parse(await Bun.file("skills/amadeus-inception/evals/evals.json").text()); console.log("evals.json: ok")'
cmp -s skills/amadeus-inception/SKILL.md .agents/skills/amadeus-inception/SKILL.md && echo "SKILL.md: identical"
test -z "$(find .agents/skills -path '*/evals/*' -type f -print)" && echo ".agents evals: absent"
rg -n 'Ideation|guided|refine|repair|Requirements Review Gate|Codebase Analysis Gate|Task 生成 Review Gate|B001/T002|greenfield|Spec|実装' skills/amadeus-inception/SKILL.md
git diff --check
```
