# UC001 Review Phase Decision Tree

## 概要

Agent が phase skill 起動時に対象 Intent と現在参照できる証拠を読み、decision tree の判断ノードを再評価する。

## アクター

- ACT002 Agent

## 外部システム

- EXT001 GitHub

## 事前条件

- 対象 Intent の phase 成果物を読める。
- 関連 Issue、PR、validator 結果、Skill Contract、信頼できる参照元を参照できる。

## 基本フロー

1. Agent は対象 Intent と対象 phase を特定する。
2. Agent は既存成果物、Issue、PR、作業ツリー、validator 結果、Skill Contract、信頼できる参照元を読む。
3. Agent は phase skill の判断ノードを列挙する。
4. Agent は各判断ノードについて、現在の証拠から分岐を説明できるか確認する。
5. Agent は不明瞭ノードを後続 route に渡す。

## 代替フロー

- 証拠が不足している場合は、不足している証拠の種類を route に渡す。
- 構造補修だけで解ける場合は、`repair_only` の候補として渡す。

## 事後条件

- 判断ノードごとに、根拠と分岐候補を説明できる。

## 要求

- R001
- R002
- R005
