# スコープ

## 対象

- Amadeus 本体リポジトリの root `.amadeus/` を、自己開発用 steering layer として導入する。
- GitHub Issue と Intent の接続方針を記録する。
- 開発時にどのように進めるかを手順として記録する。
- build workspace、host environment、target workspace、target artifacts の分離方針を記録する。
- stage0、stage1、stage2 の初期方針と、次回 stage0 採用条件を記録する。
- 変更種別ごとの完了条件の初期版を記録する。

## 対象外

- 個別 skill の改善。
- validator の大きな拡張。
- example snapshot の再生成。
- ハーネス実装。
- provenance の自動収集。
- `git submodule` 構成。
- `CONTEXT.md` への stage0、stage1、stage2 の追加。

## 変更種別ごとの完了条件

- 初期版の完了条件は [steering/policies.md](../../../steering/policies.md) に記録する。
- 変更種別は、skill 変更、validator 変更、example 更新、語彙追加、docs 更新の5分類だけを固定する。
- 個別 Intent では、対象の変更種別に対応する必須条件を PR 準備の最低条件として扱う。

## 詳細度

- 初回導入は Ideation gate passed までを詳細化する。
- Inception 以降で扱う Requirement、Acceptance、Traceability、Decision の詳細は後続 Intent に分ける。
- 変更種別は、skill 変更、validator 変更、example 更新、語彙追加、docs 更新の5分類だけを固定する。

## 検証深度

- steering layer の必須成果物が存在することを validator で確認する。
- 対象 Intent を指定した validator で、Ideation 成果物と state を確認する。
- `npm run test:all` で既存の標準検証が壊れていないことを確認する。

## Inception への引き継ぎ

- ハーネス設計は後続 Intent に分ける。
- validator が target workspace の root `.amadeus/` と成果物ステージを扱えるかは後続 Intent で確認する。
- provenance の自動収集は後続 Intent に分ける。
- stage0、stage1、stage2 を `CONTEXT.md` に追加するかは、複数 Intent で継続的に使うことが確定した後に判断する。
