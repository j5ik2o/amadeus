# AI-DLC v2 Skywork向けブリーフ

## 目的

この資料は、AI-DLC Workflows v2をSkyworkでスライド化するための入力資料である。単なる機能一覧ではなく、「AIコーディングを、再現可能で監査可能な開発ライフサイクルに変える仕組み」として説明する。

https://github.com/awslabs/aidlc-workflows/tree/v2

## 一言でいうと

AI-DLC v2は、AIエージェントによるソフトウェア開発を、5フェーズ・32ステージ・
11ドメインエージェント・承認ゲート・監査ログ・学習ループで統制する、AWS発の
AI-Driven Development Life Cycleのマルチハーネス実装である。

v2の中核は「ひとつのハーネス非依存なcoreを、Claude Code、Kiro IDE、Kiro CLI、Codex CLIなど複数の実行環境へ配布する」点にある。方法論は一箇所で定義され、各ハーネスは薄い実行面だけを持つ。

## 背景課題

アドホックなAIコーディングは、小さな修正や試作では速い。しかしプロジェクトが大きくなると、次の問題が目立つ。

- プロンプトごとに文脈が揺れ、要求・設計・実装のつながりが失われる。
- なぜその判断をしたのかが記録されず、後からレビューしづらい。
- AIがユーザーの承認なしに次の工程へ進み、意図しない成果物を作る。
- チーム標準やプロジェクト固有知識が毎回伝え直しになる。
- 監査、セキュリティ、運用、テストが後付けになりやすい。

AI-DLC v2は、この課題に対して「工程」「役割」「成果物」「承認」「監査」「学習」を明示し、AI作業を開発プロセスとして扱える形にする。

## v2の主要メッセージ

### 1. 方法論と実装を分離する

AI-DLCは方法論であり、このリポジトリはそのネイティブ実装である。方法論の「何をするか」は`core/`に置かれ、Claude Code、Kiro、Codexなどの「どう動かすか」は`harness/`で薄く表現される。

これにより、ステージ定義、エージェント、ルール、センサー、知識、フックを一箇所で管理し、複数ハーネスに同じ振る舞いを配布できる。

### 2. 5フェーズ・32ステージで開発を進める

AI-DLC v2は、ソフトウェア開発を次の5フェーズに分ける。

- Initialization: ワークスペースを検出し、`aidlc-docs/`と状態ファイルを初期化する。
- Ideation: 意図、実現可能性、スコープ、チーム、初期モックを固める。
- Inception: 既存コード分析、要求分析、ユーザーストーリー、設計、実装単位、デリバリ計画を作る。
- Construction: Unit of Work単位で設計・実装・テストし、CIまでつなげる。
- Operation: デプロイ、環境、監視、インシデント対応、性能検証、フィードバックを扱う。

各フェーズ境界では検証ゲートが走り、上流成果物と下流成果物のトレーサビリティを確認する。

### 3. 11の広い専門性を持つエージェントで進める

v2は、細かすぎる専門エージェントを大量に作るのではなく、広い責務を持つ11エージェントで進める。

- product: 意図、要求、スコープ、ストーリー
- design: UX、ワイヤーフレーム、モック、アクセシビリティ
- delivery: チーム編成、デリバリ計画、フェーズ引き継ぎ
- architect: 実現可能性、アプリケーション設計、NFR、実装単位分解
- aws-platform: AWSインフラ、環境、コスト最適化
- compliance: 規制、リスク、データ分類
- devsecops: セキュリティ、脅威モデリング、セキュリティパイプライン
- developer: 既存コード分析、コード生成、実装支援
- quality: テスト戦略、品質ゲート、性能検証
- pipeline-deploy: CI/CD、デプロイ戦略、リリース実行
- operations: 監視、インシデント対応、運用フィードバック

この設計は、人間の小さなモブチームに近い。各エージェントが複数ステージにまたがって文脈を保持するため、細切れの引き継ぎで情報を失いにくい。

### 4. スコープと深さで、重い工程にも軽い修正にも対応する

すべてのタスクに32ステージを強制するわけではない。v2は9つのスコープを持ち、タスクに応じて実行ステージ数と詳細度を調整する。

- enterprise: 32/32ステージ。規制・監査・運用まで含む。
- feature: 32/32ステージ。標準的な新機能開発。
- mvp: 22/32ステージ。運用後半を省き、MVPに集中。
- poc: 8/32ステージ。実現可能性検証を高速に進める。
- bugfix: 7/32ステージ。特定バグ修正に絞る。
- refactor: 8/32ステージ。機能変更を伴わない整理に絞る。
- infra: 13/32ステージ。インフラ変更に集中。
- security-patch: 9/32ステージ。脆弱性対応に集中。
- workshop: 25/32ステージ。研修・ワークショップ用。

さらに、成果物の詳細度はMinimal、Standard、Comprehensiveの3段階で調整できる。テスト量も同じく3段階で、ドキュメントの深さとは独立して制御できる。

### 5. 承認ゲートで人間が判断を握る

Initializationを除く各ステージの最後には承認ゲートがある。ユーザーは成果物を見て、承認するか、修正を求めるかを選ぶ。

ステージ内の質問には、次の3モードがある。

- Guide Me: エージェントが構造化された質問で導く。
- Edit File: 質問ファイルをユーザーが直接編集する。
- Chat: 自由会話から意思決定を抽出し、質問ファイルに反映する。

どのモードでも、質問ファイルが判断の正本になる。AIの会話だけに判断が埋もれない。

### 6. 状態ファイルと監査ログで追跡可能にする

v2では、`aidlc-docs/aidlc-state.md`が現在位置と進捗の正本になる。各ステージは未開始、進行中、承認待ち、修正中、完了、スキップの状態を持つ。

一方、`aidlc-docs/audit.md`は追記型の監査ログである。ワークフロー開始、ステージ開始、質問回答、ゲート承認、成果物更新、サブエージェント完了、センサー結果、学習ルール追加などを記録する。v2では67種類の監査イベントが定義されている。

これにより、後から「何を根拠に、どの成果物を作り、誰が承認したか」を追える。

### 7. チーム知識と学習ループで、同じ修正を繰り返さない

知識は2層構造になっている。

- Tier 1: フレームワークが持つ方法論知識。エージェント別・共通知識として配布される。
- Tier 2: チームが管理するプロジェクト固有知識。`aidlc-docs/knowledge/`に置く。

さらに、ステージ中の解釈、逸脱、トレードオフ、未解決事項は`memory.md`に記録される。承認ゲートでユーザーが保持すべき学びを選ぶと、プロジェクトまたはチームのルールとして保存され、次回ワークフローから反映される。

つまり、AIへの修正が一回限りの会話で消えず、チームの作業規範として蓄積される。

### 8. センサーが決定論的な二重チェックを行う

ルールはAIが読む自然言語のガードレールであり、センサーは成果物に対する決定論的チェックである。

v2には、次のようなセンサーがある。

- required-sections: 成果物に必要な見出しがあるかを見る。
- upstream-coverage: 上流成果物が下流成果物で参照されているかを見る。
- linter: TypeScript/JavaScript出力にリンターをかける。
- type-check: TypeScript出力に型チェックをかける。

センサーはこのリリースでは助言的な位置づけだが、監査ログと詳細ファイルに結果が残る。

### 9. ConstructionはBolt単位で進める

Constructionでは、Unit of Workをさらに実装可能なBoltに分ける。最初のBoltはwalking skeletonとして必ずゲートされ、アーキテクチャが最小のエンドツーエンドで成立するかを確認する。

その後、ユーザーは残りのBoltを自律実行させるか、Boltごとにゲートするかを選べる。これにより、全工程を細かく承認しすぎる負担と、大量コードを一括レビューする危険の中間を取る。

依存関係のないBoltは並列バッチとして動かせる。

### 10. 制御プレーン・データプレーン・管理プレーンに分ける

v2の内部設計は、ネットワークの3プレーン構造に近い。

- Control plane: ステージ定義、ルール、センサーを読み、実行グラフにコンパイルする。
- Data plane: 実際のステージ実行、Bolt、エージェント呼び出し、成果物生成を行う。
- Management plane: `/aidlc --doctor`、監査ログ、状態確認など、人間が観測・設定する面。

ルールやセンサーはワークフロー開始時に解決され、実行中はコンパイル済みグラフを読む。ワークフロー途中で得た学習は、次回開始時から効く。これにより、実行中の前提が途中で変わらず、再現性が保たれる。

## スライド構成案

### 1. タイトル

AI-DLC v2: AIコーディングを開発ライフサイクルへ

話すこと:

- AI-DLCはAI-Driven Development Life Cycle。
- v2はAWS発の方法論を、複数AI開発ハーネスで動く実装として再構成したもの。

### 2. なぜ必要か

主張:

- AIコーディングは速いが、プロジェクト化すると文脈・判断・承認・監査が崩れやすい。

図解候補:

- 左に「Ad-hoc AI Coding」、右に「AI-DLC」。
- 左はプロンプト、断片コード、未記録判断。
- 右はフェーズ、成果物、承認、監査、学習。

### 3. AI-DLC v2の全体像

主張:

- 5フェーズ、32ステージ、11エージェントで、意図から運用フィードバックまでを通す。

図解候補:

- Initialization -> Ideation -> Inception -> Construction -> Operation
  -> Feedback Loop。
- フェーズ境界にVerification Gateを置く。

### 4. ひとつのcore、複数のharness

主張:

- 方法論は`core/`に一度だけ定義し、Claude Code、Kiro、Codexへ生成して配布する。

図解候補:

- `core/`から`harness/claude`、`harness/kiro`、`harness/codex`を経由し、`dist/<harness>/`に出力される構成図。

### 5. 11エージェントは小さなモブチーム

主張:

- 細かすぎる専門分化ではなく、広い責務を持つ11エージェントで文脈を保つ。

図解候補:

- 中央にConductor。
- 周囲にProduct、Architect、Developer、Quality、Operationsなど。
- Product -> Architect -> Developer -> Quality -> Pipeline -> Operations -> Productのフィードバック矢印。

### 6. スコープで重さを変える

主張:

- enterpriseからbugfixまで、タスクに応じて実行ステージ数と詳細度を変えられる。

図解候補:

- 横軸を「軽量 -> 重量」、poc、bugfix、mvp、feature、enterpriseを配置。
- 各スコープに実行ステージ数を添える。

### 7. 人間が判断を握る承認ゲート

主張:

- AIは成果物を作るが、次に進む判断はゲートで人間が行う。

図解候補:

- Stage Work -> Artifact -> Approval Gate。
- Approval Gate -> Approve or Request Changes -> Next Stage。
- Guide Me / Edit File / Chatが質問ファイルに収束する図。

### 8. 状態と監査で追える

主張:

- `aidlc-state.md`が現在位置、`audit.md`が履歴を担う。

図解候補:

- 左にState: Current Phase, Current Stage, Progress。
- 右にAudit: Stage Started, Question Answered, Gate Approved, Artifact Updated。

### 9. チーム知識と学習ループ

主張:

- チーム標準や一度の修正を、次回以降のAI挙動に反映する。

図解候補:

- Stage memory -> Learning Gate -> Project/Team Rules -> Next Workflow。
- Tier 1 Methodology KnowledgeとTier 2 Team Knowledgeの二層図。

### 10. センサーで決定論的チェックを加える

主張:

- 自然言語ルールだけでなく、成果物に対する機械的チェックを持つ。

図解候補:

- Artifact write -> Sensor Fire -> Pass/Fail -> Audit detail。

### 11. ConstructionのBoltモデル

主張:

- 最初のwalking skeletonで確信を作り、その後は自律実行とゲート付き実行を選べる。

図解候補:

- Bolt 1 Walking Skeleton -> Gate -> Ladder Prompt。
- Ladder Prompt -> Autonomous or Gated -> Remaining Bolts -> Build & Test。

### 12. まとめ

主張:

- AI-DLC v2は、AIにコードを書かせるだけの仕組みではない。
- 意図、要求、設計、実装、テスト、運用、フィードバックを、承認と監査を通して接続する開発OSである。

## Skyworkへの指示例

以下の方針でスライド化する。

- 対象読者は、AI開発支援ツールを使っているが、チーム開発・監査・品質管理に課題を感じている技術リードとする。
- トーンは、プロダクト紹介ではなく、方法論と実装アーキテクチャの説明に寄せる。
- 1枚1主張で、全12枚程度にする。
- 図は工程図、レイヤー図、フィードバックループ図を中心にし、装飾的な抽象イラストは避ける。
- 「AIに任せる」ではなく「AI作業を制御し、学習させ、追跡可能にする」を強調する。
- 用語は英語名を残しつつ、日本語説明を添える。例: Approval Gate（承認ゲート）、Bolt（実装スライス）、Harness（実行環境）。

## 強調すべき差別化ポイント

- マルチハーネス: 同じ方法論をClaude Code、Kiro、Codexなどで動かせる。
- 段階的統制: 5フェーズ・32ステージだが、スコープにより軽量化できる。
- 人間中心: 各ステージで承認ゲートを持ち、判断を人間に戻す。
- トレーサビリティ: 状態ファイルと監査ログで、意図から成果物まで追える。
- 継続学習: 一度の修正をルール化し、次のワークフローへ反映する。
- 決定論的補助: センサーが成果物の形や上流参照、lint、型チェックを確認する。
- 実装単位の現実解: Boltモデルにより、過剰なマイクロ承認と巨大一括レビューの中間を取る。

## 注意して伝えるべき点

- v2はGA Previewであり、インターフェース、ステージ定義、エージェント構成、インストールモデルは変わりうる。
- 生成AIの出力はレビューが必要であり、AI-DLCも人間の判断を前提にした仕組みである。
- 安定運用では、既知のバージョンを固定して使う前提にする。
- 方法論と実装を混同しない。AI-DLCは方法論であり、このリポジトリはそのマルチハーネス実装である。

## 参照した主なリポジトリ内資料

- `README.md`
- `docs/README.md`
- `docs/guide/00-introduction.md`
- `docs/guide/03-phases-and-stages.md`
- `docs/guide/04-scopes-and-depth.md`
- `docs/guide/05-agents.md`
- `docs/guide/06-interaction-modes.md`
- `docs/guide/07-knowledge.md`
- `docs/guide/08-rules-and-the-learning-loop.md`
- `docs/guide/09-state-and-audit.md`
- `docs/guide/11-cli-commands.md`
- `docs/guide/13-artifacts-reference.md`
- `docs/reference/00-overview.md`
- `docs/reference/01-architecture.md`
- `docs/reference/02-plane-architecture.md`
