# Internal Command 設計メモ

## 目的

このメモは、Surface command と Internal command の分離方針を記録する。

目的は、ユーザーに使いやすい入口を保ちながら、E2E で Markdown 成果物の生成と更新を細かく検証できるようにすることである。

## 背景

現在の skill command は、ユーザーにとって使いやすい大きな入口になっている。

一方で、ビッグコマンドは複数のプロセスと複数の Markdown 成果物を一度に扱う。

そのため、ある Markdown が生成または更新されるべき場面で漏れた場合に、どのプロセスの責任かを E2E だけで切り分けにくい。

## 方針

Surface command は、ユーザーが直接使う大きめの入口として残す。

Internal command は、AI-DLC の phase 内に閉じたプロセス単位で切る。

Surface command は、Internal command を順番に実行する orchestration として扱う。

初期実装では、固定順に近い単純な orchestration にする。

高度な planner、差分最適化、state による実行 step 選択は、後続改善として扱う。

## 境界

Internal command の名前は、成果物名ではなくプロセス名にする。

成果物は、プロセスの出力として扱う。

たとえば `requirements.md` を作る command ではなく、要件定義を進める command として設計する。

大きな活動が複数 phase にまたがる場合でも、Internal command は phase 内に閉じる。

これは、AI-DLC が phase 基準で進むためである。

## E2E の考え方

E2E は、Internal command ごとに期待する Markdown の生成と更新を検証する。

初回実行では、生成されるべき Markdown を `created` として検証する。

補修や確定処理では、更新されるべき Markdown を `updated` として検証する。

再実行では、更新が必須ではない Markdown を `mayUpdate` として扱う。

これにより、再実行で差分が出ないことを正しい挙動として許容できる。

## 最初の対象

最初の分解対象は `amadeus-inception` 相当の Inception Surface command にする。

Inception は成果物が多く、ビッグコマンド問題が最も表面化しやすい。

また、Internal command と E2E カバレッジの形を試す tracer bullet として適している。

## Inception の初期分割

Inception の Internal command は、まず次の4つに分ける。

| Internal command | プロセス | 主な Markdown 成果物 |
|---|---|---|
| `inception-requirements-definition` | 要件定義 | `requirements.md`, `requirements/**`, `acceptance.md` |
| `inception-interaction-modeling` | 相互作用整理 | `user-stories.md`, `user-stories/**`, `use-cases.md`, `use-cases/**` |
| `inception-execution-design` | 実施設計 | `units.md`, `units/**`, `bolts.md`, `bolts/**`, `domain/subdomains.md`, `domain/bounded-contexts.md` |
| `inception-traceability-finalization` | 追跡と状態確定 | `traceability.md`, `decisions.md`, `decisions/**`, `state.json` |

## Construction の初期分割

Construction の Internal command は、まず次の4つに分ける。

| Internal command | プロセス | 主な結果 |
|---|---|---|
| `construction-bolt-preparation` | Bolt 実行準備 | 対象 Bolt、Construction Design、Task 生成 Review Gate、`tasks.md`、`notes.md`、Design Gate ready |
| `construction-implementation-execution` | 実装実行 | Construction Design に基づく対象 Task の実装、実装判断、`design.md`、`notes.md` |
| `construction-verification-hardening` | 検証と堅牢化 | テスト実装、テスト実行、安全性確認、CI 確認、`test-results.md` |
| `construction-traceability-finalization` | 追跡と状態確定 | `tasks.md`, `acceptance.md`, `traceability.md`, `decisions.md`, `state.json`, 任意の `pr.md` |

`amadeus-construction` は Surface command として、これらの Internal command を順に呼び出す。
Internal command は現行実装では skill として定義する。
そのため、非公開にはならないが、ユーザー向けの主入口ではなく phase 内のプロセス単位として扱う。

## 保留事項

Internal command をいつ Surface command として公開するかは、初期実装では決めない。

まずは非公開の Internal command として実装し、E2E の観測点を増やす。

利用頻度と安定性が確認できた Internal command だけを、後で公開候補にする。
