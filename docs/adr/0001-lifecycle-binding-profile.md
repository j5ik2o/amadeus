# ADR 0001: Lifecycle Binding / Profile で Agent Skills を DLC に束ねる

## ステータス

採用。

## 日付

2026-06-28。

## 背景

Amadeus DLC は、Discovery、Ideation、Inception、Construction などの phase を持つ。

各 phase では、Agent Skills、成果物、gate、validator が組み合わさって作業を進める。

一方で、Agent Skills、Agent Plugin、MCP は、それぞれ別の拡張境界を持つ。

Agent Skills specification は、skill を `SKILL.md` を必須に持つディレクトリとして定義し、任意で `scripts/`、`references/`、`assets/` を持てるとしている。

OpenAI Codex Skills は、skill を再利用可能な workflow の作成形式とし、plugin を再利用可能な skill や app をインストール可能にする配布単位として扱う。

Claude Code Skills も Agent Skills open standard に従い、`SKILL.md` を入口にして、必要なときだけ本文や補助ファイルを読み込む。

Claude Code Plugins は、skill、agent、hook、MCP server、LSP server などを同梱して共有できる単位である。

MCP は、tools、resources、prompts などを server から client へ公開するプロトコルである。

MCP Tools は外部システム操作、MCP Resources は文脈データ、MCP Prompts は構造化された prompt template を公開する。

したがって、MCP は DLC の phase、gate、artifact、traceability の契約そのものではない。

Amadeus DLC を今後 software-development profile や writing profile へ広げるには、skill の配布形式や MCP の接続形式ではなく、DLC 側の lifecycle 契約として束ね方を定義する必要がある。

## 決定

**Lifecycle Binding（ライフサイクルバインディング）**を、DLC の phase ごとに skill、artifact、gate、validator を接続する概念名として採用する。

**Profile（プロファイル）**を、特定領域に向けた Lifecycle Binding の具体的な束として採用する。

Lifecycle Binding は概念である。

Profile は、software-development profile、ddd profile、writing profile、amadeus profile などの具体的な束である。

Skill は個別能力の単位である。

Skill は `SKILL.md` を入口にし、必要に応じて `scripts/`、`references/`、`assets/` を持つ。

Skill は DLC の phase 契約そのものではなく、Profile から呼び出される実行能力として扱う。

Agent Plugin は配布とインストールの単位である。

Agent Plugin は複数の skill、agent、hook、MCP server などを同梱できる。

Agent Plugin は Profile を配布する候補になり得るが、Profile の概念と同一視しない。

MCP は外部能力や文脈を接続する層である。

MCP は tools、resources、prompts などを公開するが、DLC の phase、gate、artifact、validator の契約そのものではない。

AI-DLC Core は、phase、state、decision、traceability、gate の抽象モデルを持つ。

Profile は、AI-DLC Core の抽象モデルに対して、領域別の成果物契約、phase ごとの skill 接続、gate 条件、validator を具体化する。

Amadeus DLC は、AI-DLC Core 上の software-development 系 Profile の一実装として整理する。

Amadeus DLC の既存 phase や成果物は、当面は現行契約のまま扱う。

Event Storming のような領域固有技法は、AI-DLC Core ではなく、software-development profile、ddd profile、amadeus profile 側に置く。

writing profile では、phase、state、decision、traceability、gate という Core の抽象を再利用しつつ、企画、構成、執筆、編集、校正などの成果物契約を Profile 側で具体化できる。

## 非目標

このADRでは、Profile schema を定義しない。

このADRでは、Profile の実行時ロード機構を実装しない。

このADRでは、既存 skill の移動、改名、生成契約変更を行わない。

このADRでは、既存 template の移動、改名、生成契約変更を行わない。

このADRでは、Agent Plugin を必須配布形式として固定しない。

このADRでは、MCP server を DLC 実行の必須構成要素として固定しない。

## 根拠

Skill と Profile を分けることで、個別能力と lifecycle 契約が混ざらない。

この分離により、同じ skill を複数 Profile から使える。

Plugin と Profile を分けることで、配布形式と方法論上の束が混ざらない。

この分離により、同じ Profile を plugin、repository-local skill、組織管理の設定など、複数の配布方法で扱える。

MCP と Profile を分けることで、外部能力接続と DLC の進行契約が混ざらない。

この分離により、MCP を使う Profile と使わない Profile を同じ AI-DLC Core 上で扱える。

Core と Profile を分けることで、software-development 以外の領域に拡張できる。

この分離により、writing profile は software-development 固有の Unit、Bolt、Functional Design、Task Generation、Event Storming を継承せずに済む。

## 影響

後続設計では、DLC の抽象語として Lifecycle Binding と Profile を使う。

後続設計では、Skill を phase 契約や成果物契約の同義語として使わない。

後続設計では、Agent Plugin を lifecycle 契約の同義語として使わない。

後続設計では、MCP を phase、gate、artifact、validator の同義語として使わない。

後続設計で Profile schema を導入する場合は、このADRに従い、Core 抽象と領域別契約を分ける。

後続設計で Amadeus DLC を再整理する場合は、AI-DLC Core 上の software-development 系 Profile として扱う。

このADRで採用した語彙は、`CONTEXT.md` に同期して使う。

## 却下した案

Skill を phase 単位の束として扱う案は採用しない。

この案では、個別能力と lifecycle 契約が混ざり、skill の再利用性が下がる。

Agent Plugin を Profile と同一視する案は採用しない。

この案では、配布形態が方法論上の契約を支配し、repository-local や組織管理の別配布方法を扱いにくくなる。

MCP を DLC の契約層として扱う案は採用しない。

この案では、外部能力接続と phase 進行契約が混ざり、MCP を使わない Profile を説明しにくくなる。

Event Storming を AI-DLC Core に入れる案は採用しない。

この案では、Core が software-development や DDD の領域固有技法に寄り、writing profile のような非ソフトウェア開発領域へ拡張しにくくなる。

## 未決定事項

Profile schema の形式は未決定である。

Profile の読み込み場所は未決定である。

Profile と Agent Plugin の対応方法は未決定である。

Profile と repository-local skill の対応方法は未決定である。

Profile validator の構成単位は未決定である。

## 参照

- [Agent Skills specification](https://agentskills.io/specification)
- [OpenAI Codex Skills](https://developers.openai.com/codex/skills)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)
- [Claude Code Plugins](https://code.claude.com/docs/en/plugins)
- [Claude Code Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [VS Code Agent Customization](https://code.visualstudio.com/docs/agent-customization/overview)
- [MCP Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [MCP Resources](https://modelcontextprotocol.io/specification/2025-06-18/server/resources)
- [MCP Prompts](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts)
