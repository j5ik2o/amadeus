# frozen_string_literal: true

require "json"
require "pathname"
require "set"

class IntentValidator
  Row = Struct.new(:target, :condition, :result, :evidence, keyword_init: true)

  ORGANIZATION_PATTERNS = [
    "パートナーシップ",
    "別々の道",
    "順応者",
    "顧客／供給者"
  ].freeze

  INTEGRATION_PATTERNS = [
    "共有カーネル",
    "巨大な泥団子",
    "公開ホストサービス（OHS）",
    "公表された言語（PL）",
    "腐敗防止層（ACL）"
  ].freeze

  STATUS_VALUES = Set[
    "not_started",
    "in_progress",
    "waiting_approval",
    "needs_changes",
    "completed",
    "skipped"
  ].freeze

  IDEATION_GATE_VALUES = Set[
    "not_ready",
    "waiting_approval",
    "passed",
    "failed"
  ].freeze

  INTENT_DIRECTORY_PATTERN = /\A\d{8}-[a-z0-9]+(?:-[a-z0-9]+)*\z/

  DDD_ELEMENT_SPECS = {
    "集約" => { heading: "集約", pattern: /\ADA\d{3}\z/, prefix: "DA" },
    "エンティティ" => { heading: "エンティティ", pattern: /\ADE\d{3}\z/, prefix: "DE" },
    "値オブジェクト" => { heading: "値オブジェクト", pattern: /\ADVO\d{3}\z/, prefix: "DVO" },
    "ドメインサービス" => { heading: "ドメインサービス", pattern: /\ADS\d{3}\z/, prefix: "DS" },
    "ドメインイベント" => { heading: "ドメインイベント", pattern: /\ADEV\d{3}\z/, prefix: "DEV" },
    "リポジトリ" => { heading: "リポジトリ", pattern: /\ADR\d{3}\z/, prefix: "DR" },
    "ファクトリ" => { heading: "ファクトリ", pattern: /\ADF\d{3}\z/, prefix: "DF" }
  }.freeze

  CODEBASE_ANALYSIS_HEADINGS = [
    "対象コード",
    "既存能力",
    "統合点",
    "ギャップ",
    "リスク",
    "Inception への入力"
  ].freeze

  INDEX_SPECS = {
    "user-stories.md" => {
      headings: ["一覧", "依存関係"],
      list_heading: "一覧",
      columns: ["識別子", "アクター", "概要", "要求", "依存", "詳細"],
      id_pattern: /\AS\d{3}\z/,
      target_column: "ユーザーストーリー"
    },
    "use-cases.md" => {
      headings: ["一覧", "依存関係"],
      list_heading: "一覧",
      columns: ["識別子", "アクター", "外部システム", "ストーリー", "要求", "依存", "詳細"],
      id_pattern: /\AUC\d{3}\z/,
      target_column: "ユースケース"
    },
    "units.md" => {
      headings: ["一覧", "依存関係"],
      list_heading: "一覧",
      columns: ["識別子", "概要", "要求", "コンテキスト", "依存", "詳細"],
      id_pattern: /\AU\d{3}\z/,
      target_column: "ユニット"
    },
    "bolts.md" => {
      headings: ["一覧", "依存関係"],
      list_heading: "一覧",
      columns: ["識別子", "概要", "ユニット", "依存", "詳細"],
      id_pattern: /\AB\d{3}\z/,
      target_column: "ボルト"
    },
    "decisions.md" => {
      headings: ["一覧", "依存関係"],
      list_heading: "一覧",
      columns: ["識別子", "概要", "状態", "依存", "詳細"],
      id_pattern: /\AD\d{3}\z/,
      target_column: "判断"
    }
  }.freeze

  def initialize(root, intent_id = nil)
    @root = Pathname.new(root).expand_path
    @intent_id = blank?(intent_id) ? nil : intent_id
    @rows = []
    @checked_files = Set.new
    @known_ids = {}
    @known_contract_ids = {}
    @known_external_boundaries = {}
    @known_domain_model_modules = {}
    @known_ddd_element_ids = {}
  end

  def run
    check_workspace
    return report if failed?

    check_file(".amadeus/README.md", "必須ファイルが存在する")
    check_global_indexes

    if @intent_id
      check_intent_indexes(@intent_id)
    else
      pass(".amadeus/intents.md", "対象 Intent ディレクトリ名", "指定なし。全体成果物だけを検証")
    end

    report
  rescue Errno::EACCES => e
    blocked("実行環境", "検証対象を読める", e.message)
    report
  end

  private

  def check_workspace
    if @root.directory?
      pass(@root.to_s, "検証対象の作業ディレクトリが存在する", "存在を確認")
    else
      fail_row(@root.to_s, "検証対象の作業ディレクトリが存在する", "存在しない")
      return
    end

    check_file(".amadeus", "Amadeus の成果物ルートが存在する", directory: true)
  end

  def check_global_indexes
    check_intents
    check_subdomains(".amadeus/domain/subdomains.md", ".amadeus/domain/bounded-contexts.md")
    check_bounded_contexts(".amadeus/domain/bounded-contexts.md", global: true)
  end

  def check_intent_indexes(intent_id)
    base = ".amadeus/intents/#{intent_id}"
    check_file("#{base}/intent.md", "Intent 基本ファイルが存在する")
    check_headings("#{base}/intent.md", ["目的", "成功条件", "範囲"])

    state = intent_state(base)
    check_file("#{base}/state.json", "Intent 状態ファイルが存在する")
    if state && state["phase"] == "initialized"
      check_initialized_intent(base, state)
      return
    end

    if state && state["phase"] == "ideation"
      check_ideation_intent(base, state)
      return
    end

    check_inception_state_json("#{base}/state.json", state) if state && state["phase"] == "inception"

    check_requirements("#{base}/requirements.md")
    check_acceptance("#{base}/acceptance.md", "#{base}/requirements.md")
    check_codebase_analysis(base, state)
    check_subdomains("#{base}/domain/subdomains.md", "#{base}/domain/bounded-contexts.md")
    check_bounded_contexts("#{base}/domain/bounded-contexts.md", global: false)

    INDEX_SPECS.each do |filename, spec|
      path = "#{base}/#{filename}"
      next unless absolute(path).file?

      check_optional_index(path, spec)
    end

    check_traceability("#{base}/traceability.md")
  end

  def intent_state(base)
    path = "#{base}/state.json"
    return nil unless absolute(path).file?

    JSON.parse(read(path)).tap do
      pass(path, "state.json が JSON として解釈できる", "JSON を確認")
    end
  rescue JSON::ParserError => e
    fail_row(path, "state.json が JSON として解釈できる", e.message)
    nil
  end

  def check_initialized_intent(base, state)
    state_path = "#{base}/state.json"
    check_file(state_path, "Initialized 状態ファイルが存在する")
    check_initialized_state_json(state_path, state)
  end

  def check_initialized_state_json(path, state)
    check_json_value(path, "intent", state["intent"], @intent_id)
    check_json_value(path, "phase", state["phase"], "initialized")
    check_allowed(path, "status", state["status"], STATUS_VALUES)

    initialized = state["initialized"]
    unless initialized.is_a?(Hash)
      fail_row(path, "`initialized` がオブジェクトである", initialized.class.to_s)
      return
    end

    pass(path, "`initialized` がオブジェクトである", "オブジェクトを確認")
    check_allowed(path, "initialized.status", initialized["status"], STATUS_VALUES)
    check_state_paths(path, initialized, "createdArtifacts", "Initialized 作成済み成果物が存在する", puml: false, label: "initialized")
    check_json_value(path, "initialized.next", initialized["next"], "ideation")
  end

  def check_ideation_intent(base, state)
    state_path = "#{base}/state.json"
    check_file(state_path, "Ideation 状態ファイルが存在する")
    check_state_json(state_path, state)

    check_file("#{base}/scope.md", "Ideation scope が存在する")
    check_headings("#{base}/scope.md", ["対象", "対象外", "詳細度", "検証深度", "Inception への引き継ぎ"])

    check_file("#{base}/ideation.md", "Ideation 分析が存在する")
    check_headings("#{base}/ideation.md", ["実現可能性", "体制", "初期モック", "未確定事項", "学習候補"])

    check_ideation_traceability("#{base}/traceability.md")

    check_file("#{base}/decisions.md", "Ideation 判断一覧が存在する")
    check_optional_index("#{base}/decisions.md", INDEX_SPECS.fetch("decisions.md"))
  end

  def check_state_json(path, state)
    check_json_value(path, "intent", state["intent"], @intent_id)
    check_json_value(path, "phase", state["phase"], "ideation")
    check_allowed(path, "status", state["status"], STATUS_VALUES)

    ideation = state["ideation"]
    unless ideation.is_a?(Hash)
      fail_row(path, "`ideation` がオブジェクトである", ideation.class.to_s)
      return
    end

    pass(path, "`ideation` がオブジェクトである", "オブジェクトを確認")
    check_allowed(path, "ideation.status", ideation["status"], STATUS_VALUES)
    check_allowed(path, "ideation.gate", ideation["gate"], IDEATION_GATE_VALUES)
    check_state_paths(path, ideation, "requiredArtifacts", "Ideation 必須成果物が存在する", puml: false, label: "ideation")
    check_state_paths(path, ideation, "requiredMocks", "Ideation 必須モックが存在する", puml: true, label: "ideation")

    return unless state["status"].to_s.strip == "completed"

    check_json_value(path, "ideation.status", ideation["status"], "completed")
    check_json_value(path, "ideation.gate", ideation["gate"], "passed")
  end

  def check_json_value(path, key, actual, expected)
    if actual.to_s.strip == expected
      pass(path, "`#{key}` が #{expected} である", actual.to_s.strip)
    else
      fail_row(path, "`#{key}` が #{expected} である", actual.to_s.strip)
    end
  end

  def check_inception_state_json(path, state)
    check_json_value(path, "intent", state["intent"], @intent_id)
    check_json_value(path, "phase", state["phase"], "inception")
    check_allowed(path, "status", state["status"], STATUS_VALUES)

    ideation = state["ideation"]
    unless ideation.is_a?(Hash)
      fail_row(path, "`ideation` がオブジェクトである", ideation.class.to_s)
      return
    end

    pass(path, "`ideation` がオブジェクトである", "オブジェクトを確認")
    check_json_value(path, "ideation.status", ideation["status"], "completed")
    check_json_value(path, "ideation.gate", ideation["gate"], "passed")

    inception = state["inception"]
    unless inception.is_a?(Hash)
      fail_row(path, "`inception` がオブジェクトである", inception.class.to_s)
      return
    end

    pass(path, "`inception` がオブジェクトである", "オブジェクトを確認")
    check_allowed(path, "inception.status", inception["status"], STATUS_VALUES)
    check_allowed(path, "inception.gate", inception["gate"], IDEATION_GATE_VALUES)
    check_state_paths(path, inception, "requiredArtifacts", "Inception 必須成果物が存在する", puml: false, label: "inception")
    check_state_paths(path, inception, "requiredBoltArtifacts", "Inception 必須 Bolt 成果物が存在する", puml: false, label: "inception")

    return unless state["status"].to_s.strip == "completed"

    check_json_value(path, "inception.status", inception["status"], "completed")
    check_json_value(path, "inception.gate", inception["gate"], "passed")
  end

  def check_state_paths(path, state_section, key, condition, puml:, label:)
    values = state_section[key]
    unless values.is_a?(Array)
      fail_row(path, "`#{label}.#{key}` が配列である", values.class.to_s)
      return
    end

    pass(path, "`#{label}.#{key}` が配列である", "#{values.length}件")
    values.each do |value|
      check_state_relative_path(path, value, condition, puml: puml)
    end
  end

  def check_state_relative_path(path, value, condition, puml:)
    item = value.to_s.strip
    if item.empty? || item.start_with?("/") || item.split("/").include?("..")
      fail_row(path, "#{condition}", "#{item} は Intent ディレクトリ内の相対パスではない")
      return
    end

    if puml && !item.end_with?(".puml")
      fail_row(path, "#{condition}", "#{item} は .puml ではない")
      return
    end

    target = absolute(File.join(File.dirname(path), item))
    if target.file?
      @checked_files << relative(target)
      pass(path, condition, item)
    else
      fail_row(path, condition, "#{item} が存在しない")
    end
  end

  def check_ideation_traceability(path)
    check_file(path, "Ideation 追跡ファイルが存在する")
    check_headings(path, ["Ideation からの追跡", "依存関係からの追跡"])
    check_table(path, "Ideation からの追跡", ["Ideation 要素", "対象", "定義元", "後続への渡し方"])
    check_table(path, "依存関係からの追跡", ["種別", "対象", "依存", "理由", "定義元"])
    check_relative_links(path)
  end

  def check_intents
    path = ".amadeus/intents.md"
    check_file(path, "インテント一覧が存在する")
    check_headings(path, ["一覧", "依存関係"])
    table = check_table(path, "一覧", ["識別子", "概要", "依存", "詳細"])
    return unless table

    ids = collect_ids(path, table, "識別子", INTENT_DIRECTORY_PATTERN)
    check_dependency_values(path, table, "依存", ids)
    check_intent_detail_links(path, table, ids)

    dep_table = check_table(path, "依存関係", ["インテント", "依存", "理由"])
    return unless dep_table

    check_table_targets(path, dep_table, "インテント", ids, allow_none: false)
    check_dependency_values(path, dep_table, "依存", ids)
    check_not_blank(path, dep_table, "理由")
  end

  def check_requirements(path)
    check_file(path, "要求一覧が存在する")
    check_headings(path, ["一覧", "依存関係", "受け入れ状態"])
    table = check_table(path, "一覧", ["識別子", "概要", "状態", "依存", "詳細"])
    return unless table

    ids = collect_ids(path, table, "識別子", /\AR\d{3}\z/)
    check_dependency_values(path, table, "依存", ids)
    check_detail_links(path, table, "詳細")

    dep_table = check_table(path, "依存関係", ["要求", "依存", "理由"])
    return unless dep_table

    check_table_targets(path, dep_table, "要求", ids, allow_none: false)
    check_dependency_values(path, dep_table, "依存", ids)
    check_not_blank(path, dep_table, "理由")
  end

  def check_acceptance(path, requirements_path)
    check_file(path, "受け入れ状態が存在する")
    check_headings(path, ["要求状態", "状態ルール"])
    table = check_table(path, "要求状態", ["要求", "状態", "証拠"])
    return unless table

    requirement_ids = ids_for(requirements_path)
    check_table_targets(path, table, "要求", requirement_ids, allow_none: false)
    check_not_blank(path, table, "状態")
    check_not_blank(path, table, "証拠")
  end

  def check_codebase_analysis(base, state)
    path = "#{base}/codebase-analysis.md"
    required = inception_required_artifacts(state).include?("codebase-analysis.md")

    if required
      check_file(path, "既存コード分析が必須成果物として存在する")
      check_headings(path, CODEBASE_ANALYSIS_HEADINGS)
    elsif absolute(path).file?
      pass(path, "既存コード分析が存在する場合は検証対象である", "存在を確認")
      check_headings(path, CODEBASE_ANALYSIS_HEADINGS)
    else
      skipped(path, "既存コード分析は条件付き成果物である", "requiredArtifacts に未指定で、ファイルも存在しない")
    end
  end

  def inception_required_artifacts(state)
    inception = state.is_a?(Hash) ? state["inception"] : nil
    return Set.new unless inception.is_a?(Hash)

    values = inception["requiredArtifacts"]
    return Set.new unless values.is_a?(Array)

    Set.new(values.map { |value| value.to_s.strip })
  end

  def check_traceability(path)
    check_file(path, "追跡ファイルが存在する")
    check_headings(
      path,
      [
        "要求からの追跡",
        "背景からの追跡",
        "ボルトからの追跡",
        "設計からの追跡",
        "既存コード分析からの追跡",
        "ユニットからの追跡",
        "ドメインモデルからの追跡",
        "依存関係からの追跡"
      ]
    )
    check_table(path, "要求からの追跡", ["要求", "アクター", "ストーリー", "ユースケース", "ユニット", "ボルト", "タスク"])
    check_table(path, "背景からの追跡", ["目的", "アクター", "外部システム", "要求"])
    check_table(path, "ボルトからの追跡", ["ボルト", "ユニット", "要求"])
    check_table(path, "設計からの追跡", ["ボルト", "設計", "要求", "ユースケース", "タスク"])
    check_table(path, "既存コード分析からの追跡", ["分析", "要求", "ユースケース", "ユニット", "ボルト", "設計", "入力"])
    check_table(path, "ユニットからの追跡", ["ユニット", "コンテキスト", "要求", "ユースケース", "ボルト"])
    check_table(path, "ドメインモデルからの追跡", ["種別", "対象", "要求", "ユースケース", "定義元"])
    check_table(path, "依存関係からの追跡", ["種別", "対象", "依存", "理由", "定義元"])
    check_relative_links(path)
    check_traceability_ids(path)
  end

  def check_traceability_ids(path)
    return unless absolute(path).file?

    base = File.dirname(path)
    ids = traceability_id_sets(base)
    tasks = task_ids_for(base)

    check_requirement_trace_ids(path, ids, tasks)
    check_background_trace_ids(path, ids)
    check_bolt_trace_ids(path, ids)
    check_design_trace_ids(path, ids, tasks)
    check_codebase_analysis_trace_ids(path, ids)
    check_unit_trace_ids(path, ids)
    check_domain_model_trace_ids(path, ids)
    check_dependency_trace_ids(path, ids, tasks)
  end

  def traceability_id_sets(base)
    {
      intents: ids_for(".amadeus/intents.md"),
      objectives: ids_for(".amadeus/objective.md"),
      actors: ids_for(".amadeus/actors.md"),
      external_systems: ids_for(".amadeus/external-systems.md"),
      requirements: ids_for("#{base}/requirements.md"),
      stories: ids_for("#{base}/user-stories.md"),
      use_cases: ids_for("#{base}/use-cases.md"),
      units: ids_for("#{base}/units.md"),
      bolts: ids_for("#{base}/bolts.md"),
      decisions: ids_for("#{base}/decisions.md"),
      contexts: ids_for("#{base}/domain/bounded-contexts.md")
    }
  end

  def check_requirement_trace_ids(path, ids, tasks)
    table = table_after_heading(path, "要求からの追跡")
    return unless table

    table[:rows].each do |row|
      check_values_exist(path, "要求", row["要求"], ids[:requirements], allow_none: false)
      check_values_exist(path, "アクター", row["アクター"], ids[:actors], allow_none: false)
      check_values_exist(path, "ストーリー", row["ストーリー"], ids[:stories], allow_none: true)
      check_values_exist(path, "ユースケース", row["ユースケース"], ids[:use_cases], allow_none: false)
      check_values_exist(path, "ユニット", row["ユニット"], ids[:units], allow_none: false)
      bolt_values = split_values(row["ボルト"])
      check_values_exist(path, "ボルト", row["ボルト"], ids[:bolts], allow_none: false)
      check_task_values_exist(path, row["タスク"], tasks, row_bolts: bolt_values, require_qualified: false)
    end
  end

  def check_background_trace_ids(path, ids)
    table = table_after_heading(path, "背景からの追跡")
    return unless table

    table[:rows].each do |row|
      check_values_exist(path, "目的", row["目的"], ids[:objectives], allow_none: false)
      check_values_exist(path, "アクター", row["アクター"], ids[:actors], allow_none: false)
      check_values_exist(path, "外部システム", row["外部システム"], ids[:external_systems], allow_none: true)
      check_values_exist(path, "要求", row["要求"], ids[:requirements], allow_none: false)
    end
  end

  def check_bolt_trace_ids(path, ids)
    table = table_after_heading(path, "ボルトからの追跡")
    return unless table

    table[:rows].each do |row|
      check_values_exist(path, "ボルト", row["ボルト"], ids[:bolts], allow_none: false)
      check_values_exist(path, "ユニット", row["ユニット"], ids[:units], allow_none: false)
      check_values_exist(path, "要求", row["要求"], ids[:requirements], allow_none: false)
    end
  end

  def check_design_trace_ids(path, ids, tasks)
    table = table_after_heading(path, "設計からの追跡")
    return unless table

    table[:rows].each do |row|
      bolt_values = split_values(row["ボルト"])
      check_values_exist(path, "ボルト", row["ボルト"], ids[:bolts], allow_none: false)
      check_values_exist(path, "要求", row["要求"], ids[:requirements], allow_none: false)
      check_values_exist(path, "ユースケース", row["ユースケース"], ids[:use_cases], allow_none: false)
      check_task_values_exist(path, row["タスク"], tasks, row_bolts: bolt_values, require_qualified: true)
    end
  end

  def check_codebase_analysis_trace_ids(path, ids)
    table = table_after_heading(path, "既存コード分析からの追跡")
    return unless table

    table[:rows].each do |row|
      check_values_exist(path, "要求", row["要求"], ids[:requirements], allow_none: false)
      check_values_exist(path, "ユースケース", row["ユースケース"], ids[:use_cases], allow_none: false)
      check_values_exist(path, "ユニット", row["ユニット"], ids[:units], allow_none: false)
      check_values_exist(path, "ボルト", row["ボルト"], ids[:bolts], allow_none: false)
      check_codebase_analysis_trace_links(path, row)
    end
  end

  def check_codebase_analysis_trace_links(path, row)
    check_codebase_analysis_source_link(path, row["分析"])
    check_codebase_analysis_design_link(path, row["設計"], split_values(row["ボルト"]))
  end

  def check_codebase_analysis_source_link(path, value)
    links = markdown_links(value.to_s)
    if links.empty?
      fail_row(path, "`分析` が codebase-analysis.md を指す", value.to_s)
      return
    end

    expected = "#{File.dirname(path)}/codebase-analysis.md"
    links.each do |target|
      resolved = relative(link_path(path, target))
      if !external_link?(target) && resolved == expected
        pass(path, "`分析` が codebase-analysis.md を指す", target)
      else
        fail_row(path, "`分析` が codebase-analysis.md を指す", "#{target} -> #{resolved}")
      end
    end
  end

  def check_codebase_analysis_design_link(path, value, bolt_ids)
    links = markdown_links(value.to_s)
    if links.empty?
      fail_row(path, "`設計` が同じ行の Bolt 配下 design.md を指す", value.to_s)
      return
    end

    links.each do |target|
      resolved = relative(link_path(path, target))
      if !external_link?(target) && bolt_design_path?(path, resolved, bolt_ids)
        pass(path, "`設計` が同じ行の Bolt 配下 design.md を指す", target)
      else
        fail_row(path, "`設計` が同じ行の Bolt 配下 design.md を指す", "#{target} -> #{resolved}")
      end
    end
  end

  def bolt_design_path?(path, resolved, bolt_ids)
    return false unless File.basename(resolved) == "design.md"

    bolt_dir = File.dirname(resolved)
    return false unless File.dirname(bolt_dir) == "#{File.dirname(path)}/bolts"

    bolt_id = File.basename(bolt_dir).split("-", 2).first
    bolt_ids.include?(bolt_id)
  end

  def check_unit_trace_ids(path, ids)
    table = table_after_heading(path, "ユニットからの追跡")
    return unless table

    table[:rows].each do |row|
      check_values_exist(path, "ユニット", row["ユニット"], ids[:units], allow_none: false)
      check_values_exist(path, "コンテキスト", row["コンテキスト"], ids[:contexts], allow_none: false)
      check_values_exist(path, "要求", row["要求"], ids[:requirements], allow_none: false)
      check_values_exist(path, "ユースケース", row["ユースケース"], ids[:use_cases], allow_none: false)
      check_values_exist(path, "ボルト", row["ボルト"], ids[:bolts], allow_none: false)
    end
  end

  def check_domain_model_trace_ids(path, ids)
    table = table_after_heading(path, "ドメインモデルからの追跡")
    return unless table

    table[:rows].each do |row|
      type = row["種別"].to_s.strip
      target = row["対象"].to_s.strip
      check_values_exist(path, "要求", row["要求"], ids[:requirements], allow_none: false)
      check_values_exist(path, "ユースケース", row["ユースケース"], ids[:use_cases], allow_none: false)

      case type
      when "境界づけられたコンテキスト"
        check_values_exist(path, "対象", target, ids[:contexts], allow_none: false)
      when "境界"
        check_external_boundary_exists(path, target)
      when "事前条件", "不変条件", "事後条件"
        check_contract_id_exists(path, type, target, row["定義元"])
      when *DDD_ELEMENT_SPECS.keys
        check_ddd_element_exists(path, type, target, row["定義元"], ids[:contexts])
      else
        skipped(path, "`#{type}` の対象は ID 実在チェック対象外である", target)
      end
    end
  end

  def check_dependency_trace_ids(path, ids, tasks)
    table = table_after_heading(path, "依存関係からの追跡")
    return unless table

    table[:rows].each do |row|
      type = row["種別"].to_s.strip
      target = row["対象"].to_s.strip
      dependency = row["依存"]
      case type
      when "インテント"
        check_values_exist(path, "対象", target, ids[:intents], allow_none: false)
        check_values_exist(path, "依存", dependency, ids[:intents], allow_none: true)
      when "要求"
        check_values_exist(path, "対象", target, ids[:requirements], allow_none: false)
        check_values_exist(path, "依存", dependency, ids[:requirements], allow_none: true)
      when "ユーザーストーリー"
        check_values_exist(path, "対象", target, ids[:stories], allow_none: false)
        check_values_exist(path, "依存", dependency, ids[:stories], allow_none: true)
      when "ユースケース"
        check_values_exist(path, "対象", target, ids[:use_cases], allow_none: false)
        check_values_exist(path, "依存", dependency, ids[:use_cases], allow_none: true)
      when "ユニット"
        check_values_exist(path, "対象", target, ids[:units], allow_none: false)
        check_values_exist(path, "依存", dependency, ids[:units], allow_none: true)
      when "ボルト"
        check_values_exist(path, "対象", target, ids[:bolts], allow_none: false)
        check_values_exist(path, "依存", dependency, ids[:bolts], allow_none: true)
      when "タスク"
        check_task_values_exist(path, target, tasks, row_bolts: [], require_qualified: true, column: "対象")
        check_task_values_exist(path, dependency, tasks, row_bolts: [], require_qualified: true, allow_none: true, column: "依存")
      when "判断"
        check_values_exist(path, "対象", target, ids[:decisions], allow_none: false)
        check_values_exist(path, "依存", dependency, ids[:decisions], allow_none: true)
      else
        fail_row(path, "`依存関係からの追跡` の種別が既知である", type)
      end
    end
  end

  def task_ids_for(base)
    bolts_path = "#{base}/bolts.md"
    table = table_after_heading(bolts_path, "一覧")
    return Set.new unless table

    task_ids = Set.new
    dependencies = []
    requirement_ids = ids_for("#{base}/requirements.md")
    use_case_ids = ids_for("#{base}/use-cases.md")
    table[:rows].each do |row|
      bolt_id = row["識別子"].to_s.strip
      next unless bolt_id.match?(/\AB\d{3}\z/)

      detail_link = markdown_links(row["詳細"].to_s).first
      unless detail_link
        fail_row(bolts_path, "ボルト詳細リンクから tasks.md を特定できる", bolt_id)
        next
      end

      bolt_file = link_path(bolts_path, detail_link)
      design_path = relative(bolt_file.dirname.join("design.md"))
      if absolute(design_path).file?
        pass(design_path, "Bolt 配下の design.md が存在する", "存在を確認")
        check_headings(design_path, ["概要", "責務境界", "構成", "データと契約", "検証方針", "Task への入力"])
      else
        fail_row(design_path, "Bolt 配下の design.md が存在する", "存在しない")
      end

      tasks_path = relative(bolt_file.dirname.join("tasks.md"))
      unless absolute(tasks_path).file?
        fail_row(tasks_path, "Bolt 配下の tasks.md が存在する", "存在しない")
        next
      end

      check_task_contract(tasks_path, requirement_ids, use_case_ids)

      current_task = nil
      read(tasks_path).each_line do |line|
        if (match = line.match(/^- \[[ xX]\]\s+(T\d{3}):/))
          current_task = match[1]
          qualified = "#{bolt_id}/#{current_task}"
          if task_ids.include?(qualified)
            fail_row(tasks_path, "Task ID が重複しない", qualified)
          else
            pass(tasks_path, "Task ID を Bnnn/Tnnn として登録できる", qualified)
            task_ids << qualified
          end
        elsif current_task && (match = line.match(/^\s+-\s+依存:\s*(.+)$/))
          dependencies << [tasks_path, bolt_id, match[1]]
        end
      end
    end

    dependencies.each do |tasks_path, bolt_id, dependency|
      check_task_values_exist(tasks_path, dependency, task_ids, row_bolts: [bolt_id], require_qualified: false, allow_none: true, column: "依存")
    end

    task_ids
  end

  def check_task_contract(path, requirement_ids, use_case_ids)
    task_blocks(path).each do |task_id, lines|
      work_index = lines.index { |line| line.match?(/^\s+-\s+作業:\s*$/) }
      if work_index
        pass(path, "`#{task_id}` に作業がある", "作業を確認")
        work_lines = lines[(work_index + 1)..] || []
        if work_lines.any? { |line| line.match?(/^\s{4,}-\s+\S/) }
          pass(path, "`#{task_id}` に具体的な作業がある", "作業項目を確認")
        else
          fail_row(path, "`#{task_id}` に具体的な作業がある", "作業項目がない")
        end
      else
        fail_row(path, "`#{task_id}` に作業がある", "作業がない")
      end

      labels = task_labels(lines)
      check_task_label(path, task_id, labels, "要求", requirement_ids)
      check_task_label(path, task_id, labels, "ユースケース", use_case_ids)
      check_task_label(path, task_id, labels, "依存", nil)
      check_task_label(path, task_id, labels, "証拠", nil)
    end
  end

  def task_blocks(path)
    blocks = []
    read(path).each_line do |line|
      if (match = line.match(/^- \[[ xX]\]\s+(T\d{3}):/))
        blocks << [match[1], []]
      end
      blocks.last[1] << line if blocks.any?
    end
    blocks
  end

  def task_labels(lines)
    labels = {}
    lines.each do |line|
      next unless (match = line.match(/^\s+-\s+(要求|ユースケース|依存|証拠):\s*(.*)$/))

      labels[match[1]] = match[2].to_s.strip
    end
    labels
  end

  def check_task_label(path, task_id, labels, label, ids)
    value = labels[label]
    if blank?(value)
      fail_row(path, "`#{task_id}` の#{label}が空欄でない", value.to_s)
      return
    end

    pass(path, "`#{task_id}` の#{label}が空欄でない", value)
    check_values_exist(path, label, value, ids, allow_none: false) if ids
  end

  def check_values_exist(path, column, value, ids, allow_none:)
    split_values(value).each do |item|
      if item == "なし"
        if allow_none
          pass(path, "`#{column}` がなしまたは実在 ID である", item)
        else
          fail_row(path, "`#{column}` はなしを許可しない", item)
        end
      elsif ids.include?(item)
        pass(path, "`#{column}` が実在 ID である", item)
      else
        fail_row(path, "`#{column}` が実在 ID である", item)
      end
    end
  end

  def check_task_values_exist(path, value, task_ids, row_bolts:, require_qualified:, allow_none: false, column: "タスク")
    split_values(value).each do |item|
      if item == "なし"
        if allow_none
          pass(path, "`#{column}` がなしまたは実在 Task ID である", item)
        else
          fail_row(path, "`#{column}` はなしを許可しない", item)
        end
        next
      end

      normalized = normalize_task_id(path, item, row_bolts, require_qualified)
      next unless normalized

      if task_ids.include?(normalized)
        pass(path, "`#{column}` が実在 Task ID である", normalized)
      else
        fail_row(path, "`#{column}` が実在 Task ID である", normalized)
      end
    end
  end

  def normalize_task_id(path, value, row_bolts, require_qualified)
    item = value.to_s.strip
    return item if item.match?(/\AB\d{3}\/T\d{3}\z/)

    if item.match?(/\AT\d{3}\z/)
      if require_qualified
        fail_row(path, "Task ID が Bnnn/Tnnn 形式である", item)
        return nil
      end

      bolt_ids = row_bolts.reject { |bolt_id| bolt_id == "なし" }
      if bolt_ids.length == 1
        return "#{bolt_ids.first}/#{item}"
      end

      fail_row(path, "Task ID を同じ行の Bolt から Bnnn/Tnnn に正規化できる", item)
      return nil
    end

    fail_row(path, "Task ID が Tnnn または Bnnn/Tnnn 形式である", item)
    nil
  end

  def check_contract_id_exists(path, type, target, source)
    source_link = markdown_links(source.to_s).first
    unless source_link
      fail_row(path, "`#{type}` の定義元が相対リンクである", target)
      return
    end

    source_path = relative(link_path(path, source_link))
    contract_ids = contract_ids_for(source_path, type)
    if contract_ids.include?(target)
      pass(path, "`#{type}` が定義元の契約ファイルに存在する", "#{target} in #{source_path}")
    else
      fail_row(path, "`#{type}` が定義元の契約ファイルに存在する", "#{target} in #{source_path}")
    end
  end

  def check_external_boundary_exists(path, target)
    bounded_contexts_path = File.join(File.dirname(path), "domain/bounded-contexts.md")
    names = external_boundary_names_for(bounded_contexts_path)
    if names.include?(target)
      pass(path, "`境界` が外部境界表の名前に存在する", target)
    else
      fail_row(path, "`境界` が外部境界表の名前に存在する", target)
    end
  end

  def external_boundary_names_for(path)
    return @known_external_boundaries[path] if @known_external_boundaries.key?(path)
    return Set.new unless absolute(path).file?

    table = table_after_heading(path, "外部境界")
    names = if table && table[:headers].include?("名前")
              Set.new(table[:rows].map { |row| row["名前"].to_s.strip }.reject(&:empty?))
            else
              Set.new
            end
    @known_external_boundaries[path] = names
  end

  def check_ddd_element_exists(path, type, target, source, context_ids)
    parts = target.split("/")
    unless parts.length == 3
      fail_row(path, "`#{type}` が BCnnn/DMnnn/<DDD要素ID> 形式である", target)
      return
    end

    context_id, module_id, element_id = parts
    spec = DDD_ELEMENT_SPECS.fetch(type)
    check_ddd_context_id(path, type, context_id, context_ids)
    check_ddd_module_id(path, type, module_id)
    check_ddd_element_id_format(path, type, element_id, spec)

    source_path = source_model_path(path, type, source, target)
    return unless source_path

    check_module_exists_for_source(path, type, context_id, module_id, source_path)
    element_ids = ddd_element_ids_for(source_path, type)
    if element_ids.include?(element_id)
      pass(path, "`#{type}` が定義元の model.md に存在する", "#{target} in #{source_path}")
    else
      fail_row(path, "`#{type}` が定義元の model.md に存在する", "#{target} in #{source_path}")
    end
  end

  def check_ddd_context_id(path, type, context_id, context_ids)
    if context_id.match?(/\ABC\d{3}\z/) && context_ids.include?(context_id)
      pass(path, "`#{type}` の BC ID が実在する", context_id)
    else
      fail_row(path, "`#{type}` の BC ID が実在する", context_id)
    end
  end

  def check_ddd_module_id(path, type, module_id)
    if module_id.match?(/\ADM\d{3}\z/)
      pass(path, "`#{type}` の DDD モジュール ID が形式に合う", module_id)
    else
      fail_row(path, "`#{type}` の DDD モジュール ID が形式に合う", module_id)
    end
  end

  def check_ddd_element_id_format(path, type, element_id, spec)
    if element_id.match?(spec[:pattern])
      pass(path, "`#{type}` の DDD 要素 ID が種別に合う", element_id)
    else
      fail_row(path, "`#{type}` の DDD 要素 ID が種別に合う", element_id)
    end
  end

  def source_model_path(path, type, source, target)
    source_link = markdown_links(source.to_s).first
    unless source_link
      fail_row(path, "`#{type}` の定義元が相対リンクである", target)
      return nil
    end

    source_path = relative(link_path(path, source_link))
    unless source_path.end_with?("/model.md")
      fail_row(path, "`#{type}` の定義元が model.md である", source_path)
      return nil
    end

    source_path
  end

  def check_module_exists_for_source(path, type, context_id, module_id, source_path)
    models_path = relative(absolute(source_path).dirname.dirname.dirname.join("models.md"))
    modules = domain_model_modules_for(models_path)
    expected_source = modules[module_id]

    if expected_source && expected_source == source_path
      pass(path, "`#{type}` の DDD モジュール ID が models.md に存在する", "#{context_id}/#{module_id}")
    elsif expected_source
      fail_row(path, "`#{type}` の DDD モジュール ID が定義元 model.md と一致する", "#{module_id}: #{expected_source} != #{source_path}")
    else
      fail_row(path, "`#{type}` の DDD モジュール ID が models.md に存在する", "#{context_id}/#{module_id}")
    end
  end

  def domain_model_modules_for(path)
    return @known_domain_model_modules[path] if @known_domain_model_modules.key?(path)
    return {} unless absolute(path).file?

    table = table_after_heading(path, "一覧")
    modules = {}
    if table && table[:headers].include?("識別子") && table[:headers].include?("詳細")
      table[:rows].each do |row|
        id = row["識別子"].to_s.strip
        link = markdown_links(row["詳細"].to_s).first
        next if id.empty? || link.to_s.empty?

        modules[id] = relative(link_path(path, link))
      end
    end
    @known_domain_model_modules[path] = modules
  end

  def ddd_element_ids_for(path, type)
    cache_key = [path, type]
    return @known_ddd_element_ids[cache_key] if @known_ddd_element_ids.key?(cache_key)
    return Set.new unless absolute(path).file?

    spec = DDD_ELEMENT_SPECS.fetch(type)
    table = table_after_heading(path, spec[:heading])
    ids = if table && table[:headers].include?("識別子")
            Set.new(table[:rows].map { |row| row["識別子"].to_s.strip }.reject(&:empty?))
          else
            Set.new
          end
    @known_ddd_element_ids[cache_key] = ids
  end

  def contract_ids_for(path, type)
    cache_key = [path, type]
    return @known_contract_ids[cache_key] if @known_contract_ids.key?(cache_key)
    return Set.new unless absolute(path).file?

    heading = case type
              when "事前条件" then "事前条件"
              when "不変条件" then "不変条件"
              when "事後条件" then "事後条件"
              end
    table = table_after_heading(path, heading)
    ids = if table && table[:headers].include?("識別子")
            Set.new(table[:rows].map { |row| row["識別子"].to_s.strip }.reject(&:empty?))
          else
            Set.new
          end
    @known_contract_ids[cache_key] = ids
  end

  def check_optional_index(path, spec)
    check_headings(path, spec[:headings])
    table = check_table(path, spec[:list_heading], spec[:columns])
    return unless table

    ids = collect_ids(path, table, "識別子", spec[:id_pattern])
    check_dependency_values(path, table, "依存", ids)
    check_detail_links(path, table, "詳細")

    dep_table = check_table(path, "依存関係", [spec[:target_column], "依存", "理由"])
    return unless dep_table

    check_table_targets(path, dep_table, spec[:target_column], ids, allow_none: false)
    check_dependency_values(path, dep_table, "依存", ids)
    check_not_blank(path, dep_table, "理由")
  end

  def check_subdomains(path, bounded_contexts_path)
    check_file(path, "サブドメイン一覧が存在する")
    check_headings(path, ["一覧"])
    table = check_table(path, "一覧", ["識別子", "名前", "種別", "役割", "コンテキスト"])
    return unless table

    collect_ids(path, table, "識別子", /\ASD\d{3}\z/)
    allowed_types = Set["コア", "支援", "汎用", "未分類"]
    table[:rows].each do |row|
      type = row["種別"].to_s.strip
      if allowed_types.include?(type)
        pass(path, "サブドメイン種別が許可値である", "#{row["識別子"]}: #{type}")
      else
        fail_row(path, "サブドメイン種別が許可値である", "#{row["識別子"]}: #{type}")
      end
    end

    bc_ids = ids_for(bounded_contexts_path)
    table[:rows].each do |row|
      split_values(row["コンテキスト"]).each do |context_id|
        if context_id == "なし" || bc_ids.include?(context_id)
          pass(path, "コンテキストが同じ階層の bounded-contexts.md に存在する", "#{row["識別子"]}: #{context_id}")
        else
          fail_row(path, "コンテキストが同じ階層の bounded-contexts.md に存在する", "#{row["識別子"]}: #{context_id}")
        end
      end
    end
  end

  def check_bounded_contexts(path, global:)
    check_file(path, "境界づけられたコンテキスト一覧が存在する")
    headings = global ? ["一覧", "外部境界", "コンテキスト間の依存", "パターン分類"] : ["コンテキスト", "外部境界", "コンテキスト間の依存"]
    list_heading = global ? "一覧" : "コンテキスト"
    check_headings(path, headings)

    table = check_table(path, list_heading, ["識別子", "名前", "サブドメイン", "役割", "モデル", "契約"])
    ids = table ? collect_ids(path, table, "識別子", /\ABC\d{3}\z/) : Set.new
    if table
      check_detail_links(path, table, "モデル")
      check_detail_links(path, table, "契約")
      check_domain_model_indexes_from_bounded_contexts(path, table)
    end

    boundary_table = check_table(path, "外部境界", ["コンテキスト", "名前", "役割", "根拠"])
    check_external_boundaries(path, boundary_table, ids) if boundary_table

    dep_table = check_table(path, "コンテキスト間の依存", ["Downstream", "Upstream", "依存内容", "組織パターン", "統合パターン", "状態"])
    check_context_dependencies(path, dep_table, ids) if dep_table
    check_pattern_classification(path) if global
  end

  def check_external_boundaries(path, table, ids)
    table[:rows].each do |row|
      context_id = row["コンテキスト"].to_s.strip
      if ids.include?(context_id)
        pass(path, "外部境界のコンテキストが既存 BC である", context_id)
      else
        fail_row(path, "外部境界のコンテキストが既存 BC である", context_id)
      end
      check_not_blank_value(path, "名前", row["名前"])
      check_not_blank_value(path, "役割", row["役割"])
      check_not_blank_value(path, "根拠", row["根拠"])
    end
  end

  def check_domain_model_indexes_from_bounded_contexts(path, table)
    table[:rows].each do |row|
      markdown_links(row["モデル"].to_s).each do |target|
        model_index_path = relative(link_path(path, target))
        check_domain_model_index(model_index_path)
      end
    end
  end

  def check_domain_model_index(path)
    return unless absolute(path).file?

    check_headings(path, ["一覧"])
    table = check_table(path, "一覧", ["識別子", "名前", "役割", "詳細"])
    return unless table

    collect_ids(path, table, "識別子", /\ADM\d{3}\z/)
    check_not_blank(path, table, "名前")
    check_not_blank(path, table, "役割")
    check_detail_links(path, table, "詳細")
    table[:rows].each do |row|
      check_domain_model_detail_path(path, row)
      markdown_links(row["詳細"].to_s).each do |target|
        check_domain_model_file(relative(link_path(path, target)))
      end
    end
  end

  def check_domain_model_detail_path(path, row)
    module_id = row["識別子"].to_s.strip
    link = markdown_links(row["詳細"].to_s).first
    unless link
      fail_row(path, "DDD モジュール詳細が相対リンクを持つ", module_id)
      return
    end

    detail_path = relative(link_path(path, link))
    dirname = File.basename(File.dirname(detail_path))
    if dirname.match?(/\A#{Regexp.escape(module_id)}-.+/)
      pass(path, "DDD モジュール詳細ディレクトリが DMnnn-<slug> 形式である", "#{module_id}: #{dirname}")
    else
      fail_row(path, "DDD モジュール詳細ディレクトリが DMnnn-<slug> 形式である", "#{module_id}: #{dirname}")
    end
  end

  def check_domain_model_file(path)
    return unless absolute(path).file?

    seen_ids = Set.new
    DDD_ELEMENT_SPECS.each do |type, spec|
      table = table_after_heading(path, spec[:heading])
      next unless table

      check_table(path, spec[:heading], ["識別子", "名前", "役割", "根拠"])
      table[:rows].each do |row|
        id = row["識別子"].to_s.strip
        if id.match?(spec[:pattern])
          pass(path, "`#{type}` の識別子が形式に合う", id)
        else
          fail_row(path, "`#{type}` の識別子が形式に合う", id)
        end

        if seen_ids.include?(id)
          fail_row(path, "DDD 要素 ID が同じ model.md 内で重複しない", id)
        else
          pass(path, "DDD 要素 ID が同じ model.md 内で重複しない", id)
          seen_ids << id
        end

        check_not_blank_value(path, "名前", row["名前"])
        check_not_blank_value(path, "役割", row["役割"])
        check_not_blank_value(path, "根拠", row["根拠"])
      end
    end
  end

  def check_context_dependencies(path, table, ids)
    table[:rows].each do |row|
      downstream = row["Downstream"].to_s.strip
      upstream = row["Upstream"].to_s.strip
      check_context_ref(path, "Downstream", downstream, ids)
      check_context_ref(path, "Upstream", upstream, ids)
      check_not_blank_value(path, "依存内容", row["依存内容"])
      check_not_blank_value(path, "状態", row["状態"])

      if upstream == "なし"
        check_exact(path, "組織パターン", row["組織パターン"], "該当なし")
        check_exact(path, "統合パターン", row["統合パターン"], "該当なし")
      else
        check_allowed(path, "組織パターン", row["組織パターン"], ORGANIZATION_PATTERNS)
        check_allowed(path, "統合パターン", row["統合パターン"], INTEGRATION_PATTERNS)
      end
    end
  end

  def check_pattern_classification(path)
    text = read(path)
    ORGANIZATION_PATTERNS.each do |pattern|
      if text.include?(pattern)
        pass(path, "組織パターンを列挙する", pattern)
      else
        fail_row(path, "組織パターンを列挙する", pattern)
      end
    end
    INTEGRATION_PATTERNS.each do |pattern|
      if text.include?(pattern)
        pass(path, "統合パターンを列挙する", pattern)
      else
        fail_row(path, "統合パターンを列挙する", pattern)
      end
    end
  end

  def check_context_ref(path, column, value, ids)
    if value == "なし" || ids.include?(value)
      pass(path, "#{column} が既存 BC またはなしである", value)
    else
      fail_row(path, "#{column} が既存 BC またはなしである", value)
    end
  end

  def check_file(path, condition, directory: false)
    target = absolute(path)
    ok = directory ? target.directory? : target.file?
    if ok
      @checked_files << relative(target)
      pass(path, condition, "存在を確認")
    else
      fail_row(path, condition, "存在しない")
    end
  end

  def check_headings(path, headings)
    return unless absolute(path).file?

    text = read(path)
    headings.each do |heading|
      if text.match?(/^##\s+#{Regexp.escape(heading)}\s*$/)
        pass(path, "`#{heading}` 見出しがある", "見出しを確認")
      else
        fail_row(path, "`#{heading}` 見出しがある", "見出しがない")
      end
    end
  end

  def check_table(path, heading, required_columns)
    return nil unless absolute(path).file?

    table = table_after_heading(path, heading)
    unless table
      fail_row(path, "`#{heading}` の表がある", "表がない")
      return nil
    end

    missing = required_columns - table[:headers]
    if missing.empty?
      pass(path, "`#{heading}` の必須表列が揃っている", required_columns.join(", "))
    else
      fail_row(path, "`#{heading}` の必須表列が揃っている", "不足: #{missing.join(", ")}")
    end
    table
  end

  def collect_ids(path, table, column, pattern = nil)
    ids = Set.new
    table[:rows].each do |row|
      id = row[column].to_s.strip
      if id.empty?
        fail_row(path, "#{column} が空欄でない", "空欄")
        next
      end

      if pattern && !id.match?(pattern)
        fail_row(path, "#{column} が識別子形式に合う", id)
      else
        pass(path, "#{column} が識別子形式に合う", id)
      end

      if ids.include?(id)
        fail_row(path, "#{column} が重複しない", id)
      else
        pass(path, "#{column} が重複しない", id)
        ids << id
      end
    end
    @known_ids[path] = ids
    ids
  end

  def ids_for(path)
    return @known_ids[path] if @known_ids.key?(path)
    return Set.new unless absolute(path).file?

    heading = path.end_with?("/domain/bounded-contexts.md") || path == ".amadeus/domain/bounded-contexts.md" ? bounded_context_list_heading(path) : "一覧"
    table = table_after_heading(path, heading)
    return Set.new unless table && table[:headers].include?("識別子")

    @known_ids[path] = Set.new(table[:rows].map { |row| row["識別子"].to_s.strip }.reject(&:empty?))
  end

  def bounded_context_list_heading(path)
    path.start_with?(".amadeus/intents/") ? "コンテキスト" : "一覧"
  end

  def check_dependency_values(path, table, column, ids)
    return unless table[:headers].include?(column)

    table[:rows].each do |row|
      split_values(row[column]).each do |dependency|
        if dependency == "なし" || ids.include?(dependency)
          pass(path, "`#{column}` がなしまたは同じ一覧内の既存 ID である", dependency)
        else
          fail_row(path, "`#{column}` がなしまたは同じ一覧内の既存 ID である", dependency)
        end
      end
    end
  end

  def check_table_targets(path, table, column, ids, allow_none:)
    return unless table[:headers].include?(column)

    table[:rows].each do |row|
      split_values(row[column]).each do |target|
        if (allow_none && target == "なし") || ids.include?(target)
          pass(path, "`#{column}` が一覧内の既存 ID である", target)
        else
          fail_row(path, "`#{column}` が一覧内の既存 ID である", target)
        end
      end
    end
  end

  def check_not_blank(path, table, column)
    return unless table[:headers].include?(column)

    table[:rows].each do |row|
      check_not_blank_value(path, column, row[column])
    end
  end

  def check_not_blank_value(path, column, value)
    if blank?(value)
      fail_row(path, "`#{column}` が空欄でない", "空欄")
    else
      pass(path, "`#{column}` が空欄でない", value.to_s.strip)
    end
  end

  def check_detail_links(path, table, column)
    return unless table[:headers].include?(column)

    table[:rows].each do |row|
      links = markdown_links(row[column].to_s)
      if links.empty?
        fail_row(path, "`#{column}` が相対リンクを持つ", row[column].to_s)
        next
      end
      links.each { |target| check_link(path, target) }
    end
  end

  def check_intent_detail_links(path, table, ids)
    return unless table[:headers].include?("詳細")

    table[:rows].each do |row|
      id = row["識別子"].to_s.strip
      links = markdown_links(row["詳細"].to_s)
      if links.empty?
        fail_row(path, "`詳細` が相対リンクを持つ", row["詳細"].to_s)
        next
      end

      links.each do |target|
        check_link(path, target)
        clean = target.split("#", 2).first.to_s.split(/\s+/, 2).first.to_s
        match = clean.match(/\Aintents\/([^\/]+)\/intent\.md\z/)
        unless match
          fail_row(path, "`詳細` が intents/<intent-id>-<slug>/intent.md を指す", target)
          next
        end

        directory = match[1]
        if directory == id
          pass(path, "`詳細` の Intent ディレクトリ名が識別子と一致する", directory)
        else
          fail_row(path, "`詳細` の Intent ディレクトリ名が識別子と一致する", "#{directory} != #{id}")
        end

        if ids.include?(directory)
          pass(path, "`詳細` の Intent ディレクトリ名が一覧内に存在する", directory)
        else
          fail_row(path, "`詳細` の Intent ディレクトリ名が一覧内に存在する", directory)
        end
      end
    end
  end

  def check_relative_links(path)
    return unless absolute(path).file?

    markdown_links(read(path)).each do |target|
      check_link(path, target)
    end
  end

  def check_link(path, target)
    return if external_link?(target)

    clean = target.split("#", 2).first.to_s.split(/\s+/, 2).first.to_s
    return if clean.empty?

    resolved = link_path(path, target)
    if resolved.exist?
      @checked_files << relative(resolved)
      pass(path, "相対リンクの参照先が存在する", target)
    else
      fail_row(path, "相対リンクの参照先が存在する", "#{target} -> #{relative(resolved)}")
    end
  end

  def link_path(path, target)
    clean = target.split("#", 2).first.to_s.split(/\s+/, 2).first.to_s
    absolute(File.join(File.dirname(path), clean))
  end

  def table_after_heading(path, heading)
    lines = read(path).lines.map(&:chomp)
    heading_index = lines.index { |line| line.match?(/^##\s+#{Regexp.escape(heading)}\s*$/) }
    return nil unless heading_index

    index = heading_index + 1
    index += 1 while index < lines.length && !lines[index].start_with?("|") && !lines[index].start_with?("## ")
    return nil if index >= lines.length || !lines[index].start_with?("|")

    table_lines = []
    while index < lines.length && lines[index].start_with?("|")
      table_lines << lines[index]
      index += 1
    end
    return nil if table_lines.length < 2

    headers = split_table_line(table_lines[0])
    rows = table_lines.drop(2).map do |line|
      values = split_table_line(line)
      headers.zip(values).to_h
    end
    { headers: headers, rows: rows }
  end

  def split_table_line(line)
    line.strip.sub(/\A\|/, "").sub(/\|\z/, "").split("|").map(&:strip)
  end

  def split_values(value)
    text = value.to_s.strip
    return [""] if text.empty?

    text.split(",").map(&:strip).reject(&:empty?)
  end

  def markdown_links(text)
    text.scan(/(?<!!)\[[^\]]+\]\(([^)]+)\)/).flatten
  end

  def external_link?(target)
    target.start_with?("#") || target.start_with?("mailto:") || target.match?(/\Ahttps?:\/\//)
  end

  def check_exact(path, column, actual, expected)
    if actual.to_s.strip == expected
      pass(path, "`#{column}` が #{expected} である", actual.to_s.strip)
    else
      fail_row(path, "`#{column}` が #{expected} である", actual.to_s.strip)
    end
  end

  def check_allowed(path, column, actual, allowed)
    value = actual.to_s.strip
    if allowed.include?(value)
      pass(path, "`#{column}` が許可値である", value)
    else
      fail_row(path, "`#{column}` が許可値である", value)
    end
  end

  def read(path)
    target = absolute(path)
    @checked_files << relative(target)
    target.read
  end

  def absolute(path)
    target = Pathname.new(path.to_s)
    target.absolute? ? target : @root.join(target)
  end

  def relative(pathname)
    absolute_path = Pathname.new(pathname).expand_path
    absolute_path.relative_path_from(@root).to_s
  rescue ArgumentError
    absolute_path.to_s
  end

  def pass(target, condition, evidence)
    @rows << Row.new(target: target, condition: condition, result: "pass", evidence: evidence)
  end

  def fail_row(target, condition, evidence)
    @rows << Row.new(target: target, condition: condition, result: "fail", evidence: evidence)
  end

  def blocked(target, condition, evidence)
    @rows << Row.new(target: target, condition: condition, result: "blocked", evidence: evidence)
  end

  def skipped(target, condition, evidence)
    @rows << Row.new(target: target, condition: condition, result: "skipped", evidence: evidence)
  end

  def failed?
    @rows.any? { |row| row.result == "fail" }
  end

  def blocked?
    @rows.any? { |row| row.result == "blocked" }
  end

  def overall_result
    return "fail" if failed?
    return "blocked" if blocked?

    "pass"
  end

  def report
    failing = @rows.select { |row| row.result == "fail" }
    blocking = @rows.select { |row| row.result == "blocked" }
    passed = @rows.select { |row| row.result == "pass" }
    skipped_rows = @rows.select { |row| row.result == "skipped" }

    lines = []
    lines << "# Intent Validator 結果"
    lines << ""
    lines << "## 判定"
    lines << ""
    lines << overall_result
    lines << ""
    lines << "## 検査サマリ"
    lines << ""
    lines.concat(summary_table)
    lines << ""
    lines << "## 確認対象"
    lines << ""
    lines.concat(checked_files_report)
    lines << ""
    lines << "## 満たしている条件"
    lines << ""
    summarize(passed).each { |item| lines << "- #{item}" }
    lines << "- なし" if passed.empty?
    lines << ""
    lines << "## 検査対象外"
    lines << ""
    summarize_skipped(skipped_rows).each { |item| lines << "- #{item}" }
    lines << "- なし" if skipped_rows.empty?
    lines << ""
    lines << "## 不足または矛盾"
    lines << ""
    if failing.empty? && blocking.empty?
      lines << "- なし"
    else
      (failing + blocking).each do |row|
        lines << "- `#{row.target}`: #{row.condition}。根拠: #{row.evidence}"
      end
    end
    lines << ""
    lines << "## 次に使う Amadeus skill"
    lines << ""
    lines << "- なし"
    lines << ""
    lines << "補足: `pass` は実行時参照に必要な最低限の構造条件を満たすという意味で、gate 通過や内容妥当性の承認ではない。"
    lines.join("\n")
  end

  def summarize(rows)
    grouped = rows.group_by { |row| category_for(row) }
    grouped.sort_by { |category, _| category }.map do |category, category_rows|
      targets = category_rows.map(&:target).uniq.length
      "#{category}: #{category_rows.length}件 pass、対象 #{targets}件"
    end
  end

  def summary_table
    grouped = @rows.reject { |row| row.result == "skipped" }.group_by { |row| category_for(row) }
    lines = []
    lines << "| 検査カテゴリ | pass | fail | blocked |"
    lines << "|---|---:|---:|---:|"
    grouped.sort_by { |category, _| category }.each do |category, rows|
      counts = rows.group_by(&:result)
      lines << "| #{category} | #{counts.fetch("pass", []).length} | #{counts.fetch("fail", []).length} | #{counts.fetch("blocked", []).length} |"
    end
    lines
  end

  def summarize_skipped(rows)
    rows.map { |row| "#{row.target}: #{row.condition}。対象: #{row.evidence}" }.uniq
  end

  def checked_files_report
    return ["- なし"] if @checked_files.empty?

    grouped = @checked_files.to_a.sort.group_by { |file| checked_file_category(file) }
    lines = []
    lines << "| 対象カテゴリ | 件数 |"
    lines << "|---|---:|"
    grouped.sort_by { |category, _| checked_file_category_order(category) }.each do |category, files|
      lines << "| #{category} | #{files.length} |"
    end
    grouped.sort_by { |category, _| checked_file_category_order(category) }.each do |category, files|
      lines << ""
      lines << "### #{category}"
      lines << ""
      files.each { |file| lines << "- `#{file}`" }
    end
    lines
  end

  def checked_file_category(file)
    return "Amadeus ルート" if file == ".amadeus"
    return "全体成果物" if file.match?(%r{\A\.amadeus/[^/]+\.md\z})
    return "全体ドメイン" if file.start_with?(".amadeus/domain/")
    return "Intent 状態" if file.match?(%r{\A\.amadeus/intents/[^/]+/state\.json\z})
    return "Intent モック" if file.match?(%r{\A\.amadeus/intents/[^/]+/mocks/})
    return "Intent 基本成果物" if file.match?(%r{\A\.amadeus/intents/[^/]+/[^/]+\.md\z})
    return "Intent ドメイン" if file.match?(%r{\A\.amadeus/intents/[^/]+/domain/})
    return "Bolt / Task" if file.match?(%r{\A\.amadeus/intents/[^/]+/bolts/})
    return "Requirement 詳細" if file.match?(%r{\A\.amadeus/intents/[^/]+/requirements/})
    return "Story 詳細" if file.match?(%r{\A\.amadeus/intents/[^/]+/user-stories/})
    return "Use Case 詳細" if file.match?(%r{\A\.amadeus/intents/[^/]+/use-cases/})
    return "Unit 詳細" if file.match?(%r{\A\.amadeus/intents/[^/]+/units/})
    return "Decision 詳細" if file.match?(%r{\A\.amadeus/intents/[^/]+/decisions/})

    "その他"
  end

  def checked_file_category_order(category)
    [
      "Amadeus ルート",
      "全体成果物",
      "全体ドメイン",
      "Intent 状態",
      "Intent 基本成果物",
      "Intent モック",
      "Intent ドメイン",
      "Requirement 詳細",
      "Story 詳細",
      "Use Case 詳細",
      "Unit 詳細",
      "Bolt / Task",
      "Decision 詳細",
      "その他"
    ].index(category) || 99
  end

  def category_for(row)
    condition = row.condition
    target = row.target

    return "実行環境" if condition.include?("作業ディレクトリ") || condition.include?("成果物ルート")
    return "検証範囲" if condition.include?("対象 Intent ディレクトリ名")
    return "Initialized" if initialized_condition?(condition, target)
    return "Ideation" if ideation_condition?(condition, target)
    return "状態" if state_condition?(condition, target)
    return "モック" if mock_condition?(condition, target)
    return "ファイル存在" if condition.include?("存在する") && !condition.include?("参照先")
    return "見出し" if condition.include?("見出し")
    return "表列" if condition.include?("表列") || condition.include?("表がある")
    return "識別子" if condition.include?("識別子")
    return "リンク参照" if condition.include?("相対リンク") || condition.include?("を指す")
    return "Traceability ID" if traceability_id_condition?(condition)
    return "Bolt / Task" if task_condition?(condition)
    return "ドメインモデル" if domain_model_condition?(condition)
    return "依存関係" if condition.include?("依存")
    return "Index ID参照" if condition.include?("一覧内の既存 ID")
    return "空欄" if condition.include?("空欄")
    return "ドメイン境界" if domain_boundary_condition?(condition, target)

    "その他"
  end

  def traceability_id_condition?(condition)
    condition.include?("実在 ID") ||
      condition.include?("実在 Task ID") ||
      condition.include?("契約ファイル") ||
      condition.include?("Bnnn/Tnnn") ||
      condition.include?("なしを許可")
  end

  def task_condition?(condition)
    condition.include?("Task") ||
      condition.include?("作業") ||
      condition.include?("要求が空欄") ||
      condition.include?("ユースケースが空欄") ||
      condition.include?("証拠が空欄")
  end

  def domain_model_condition?(condition)
    condition.include?("DDD") ||
      condition.include?("BC ID") ||
      condition.include?("model.md") ||
      condition.include?("外部境界表")
  end

  def domain_boundary_condition?(condition, target)
    target.include?("bounded-contexts.md") ||
      target.include?("subdomains.md") ||
      condition.include?("組織パターン") ||
      condition.include?("統合パターン") ||
      condition.include?("外部境界") ||
      condition.include?("コンテキスト") ||
      condition.include?("許可値")
  end

  def state_condition?(condition, target)
    target.end_with?("state.json") ||
      condition.include?("state.json") ||
      condition.include?("`phase`") ||
      condition.include?("`status`") ||
      condition.include?("`ideation.status`") ||
      condition.include?("`ideation.gate`") ||
      condition.include?("`ideation.requiredArtifacts`") ||
      condition.include?("`ideation.requiredMocks`")
  end

  def ideation_condition?(condition, target)
    target.include?("/ideation.md") ||
      target.include?("/scope.md") ||
      condition.include?("Ideation") ||
      condition.include?("Inception")
  end

  def initialized_condition?(condition, target)
    condition.include?("Initialized") ||
      condition.include?("`initialized`") ||
      condition.include?("`initialized.status`") ||
      condition.include?("`initialized.next`")
  end

  def mock_condition?(condition, target)
    target.include?("/mocks/") ||
      condition.include?("モック") ||
      condition.include?(".puml")
  end

  def blank?(value)
    value.nil? || value.to_s.strip.empty?
  end
end

if $PROGRAM_NAME == __FILE__
  root = ARGV[0] || Dir.pwd
  intent_id = ARGV[1]
  result = IntentValidator.new(root, intent_id).run
  puts result

  case result[/^pass$|^fail$|^blocked$/, 0]
  when "pass"
    exit 0
  when "blocked"
    exit 2
  else
    exit 1
  end
end
