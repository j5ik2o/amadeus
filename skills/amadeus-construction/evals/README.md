# amadeus-construction evals

## 昇格条件

`amadeus-construction` は、次を満たすことを確認する。

- 親 skill は内部 skill を呼び出し、直接成果物作成、実装、検証をしない。
- Inception gate が `passed` でない Intent を Construction へ進めない。
- Construction の内部 skill は、Bolt 実行準備、実装実行、検証と堅牢化、追跡と状態確定に分かれている。
- `notes.md`、`test-results.md`、任意の `pr.md` は対象 Bolt 配下に置く。
- PR URL がない場合は `pr.md` を作らない。
- Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物を作らない。
- `evals/` は開発用なので昇格先へコピーしない。
