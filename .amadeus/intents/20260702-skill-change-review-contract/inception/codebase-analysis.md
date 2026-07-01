# 既存コード分析

## 対象コード

| 対象 | 種別 | 確認内容 |
|---|---|---|
| `.amadeus/steering/policies.md` | steering layer | 変更種別ごとの完了条件の表と、禁止事項、判断基準の現状を確認した。 |
| `.amadeus/development.md` | steering layer | PR 準備条件とレビュー対応の現状を確認した。 |
| `.amadeus/steering/policies/git-branching.md` | steering policy | 例外時に理由と後続確認先を PR 説明または Intent 成果物へ記録する型を確認した。 |
| `README.md`、`README.ja.md` | docs | skill-forge による確認の推奨記述（境界、trigger description、本文指示、eval coverage、Codex metadata）を確認した。 |
| `.agents/rules/agent-instruction-rules.md` | agent rules | 肯定形を先に書き、禁止事項は失敗確認後に限る方針を確認した。 |
| `.amadeus/glossary.md` | steering layer | source skill、昇格先成果物、stage 語彙を確認した。 |

## 既存能力

- `policies.md` の変更種別表は、skill 変更の必須条件と推奨条件を1行で表現できる構造を持つ。
- `development.md` の PR 準備条件は、「変更種別ごとの必須条件が満たされている」という形で変更種別表への参照を既に持つ。
- Git Branching Policy は、例外時に未実行の検証、理由、後続確認先を PR 説明または対象 Intent の成果物へ記録する型を持つ。
- README（英語、日本語）は、skill-forge の確認観点を推奨として持つ。
- agent-instruction-rules は、契約を肯定形で書くための判断基準を持つ。

## 統合点

- `policies.md` の変更種別表「skill 変更」の必須条件に、挙動差分要約と skill-forge 確認の記録を追加できる。
- `policies.md` の判断基準または禁止事項に、粒度制約と例外の一般則を追加できる。
- `development.md` の PR 準備条件は変更種別表を既に参照しているため、skill 変更時の追加条件は最小の変更で追跡できる。
- README の推奨記述は、policies の必須条件と同じ確認観点を共有しているため、整合確認の対応付けが取れる。

## ギャップ

- 変更種別表「skill 変更」の必須条件に、レビュー判断を支える挙動差分要約と skill-forge 確認の記録が含まれていない。
- skill 本文変更と他の変更種別を同一 PR に混ぜないという粒度の制約が、policies にも Git Branching Policy にも存在しない。
- 「不可分（分割するとどちらかの PR 単独で検証が fail する）」という例外判定の語彙が存在しない。
- README の skill-forge 確認は推奨に留まり、必須条件へ格上げした場合の記述整合が定義されていない。

## リスク

- PR 説明の見出し形式が PR ごとに揺れると、記録があるかの確認が形骸化する。固定見出しの定義が必要である。
- 粒度制約を禁止形だけで書くと agent-instruction-rules の方針に反する。不可分の判定基準を肯定形で先に書く必要がある。
- README（英語、日本語）と policies の記述が二重管理になり、片方だけの更新で stale になりやすい。
- 例外の一般則が広すぎると、粒度制約そのものが形骸化する。

## Inception への入力

- 要求は、変更種別表の必須条件強化、粒度制約と例外一般則の追加、PR 準備条件からの追跡、README との整合の4つに分ける。
- Unit は、Domain Map の `BC001 自己開発運用` を参照する steering policy 契約の更新として扱える見込みである。
- Bolt の分割は、policies と development の更新、README の整合確認を1つの実施単位にするか分けるかを Units Generation で判断する。
- Construction は文書変更だけであり、実装やテストコードの変更はない。検証は validator、`npm run test:all`、文書間の整合確認になる。

## 証拠

| 種別 | 参照 | 内容 |
|---|---|---|
| file | `.amadeus/steering/policies.md` | 変更種別表と判断基準の現状確認。 |
| file | `.amadeus/development.md` | PR 準備条件とレビュー対応の現状確認。 |
| file | `.amadeus/steering/policies/git-branching.md` | 例外記録の型の確認。 |
| file | `README.md` | skill-forge 確認の推奨記述の確認（81行目）。 |
| file | `README.ja.md` | skill-forge 確認の推奨記述の確認（81行目）。 |
| file | `.agents/rules/agent-instruction-rules.md` | 記述方針の制約確認。 |
| file | `.amadeus/glossary.md` | stage 語彙と skill 供給元語彙の確認。 |

## 鮮度

| 項目 | 値 |
|---|---|
| analyzedCommit | `3e61dbe1b8681a0a50554a7861a8c7c2d79c8b7f` |
| analyzedAt | `2026-07-01T23:08:27Z` |
| freshness | current |

## 未確認事項

- README の推奨記述を推奨のまま残して policies を必須の定義元にするか、README 側も必須と書き換えるかは Requirements で確定する。
