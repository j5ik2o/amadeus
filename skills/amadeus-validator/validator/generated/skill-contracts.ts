// Generated from amadeus-contracts/catalog/**. Do not edit by hand.
export const skillContracts = [
  {
    "skillId": "amadeus-ideation",
    "skillName": "amadeus-ideation",
    "sourcePaths": [
      "skills/amadeus-ideation/SKILL.md",
      ".agents/skills/amadeus-ideation/SKILL.md"
    ],
    "generatedReferencePaths": [
      "skills/amadeus-ideation/references/skill-contract.md",
      ".agents/skills/amadeus-ideation/references/skill-contract.md"
    ],
    "prerequisites": [
      {
        "id": "PRE001",
        "description": "入力テーマ、Discovery Brief、または既存 Intent から Ideation 対象を特定できる。"
      },
      {
        "id": "PRE002",
        "description": "必要な steering layer と既存 Intent の参照先を読める。"
      }
    ],
    "invariants": [
      {
        "id": "INV001",
        "description": "Ideation では Inception 以降の詳細成果物や実装を先回りして作らない。"
      },
      {
        "id": "INV002",
        "description": "merge 操作は行わない。"
      }
    ],
    "postconditions": [
      {
        "id": "POST001",
        "description": "scope、ideation、mock、traceability、decisions、state の Ideation 成果物が追跡できる。"
      },
      {
        "id": "POST002",
        "description": "Inception へ渡す未確認事項と対象外を記録する。"
      }
    ],
    "readBoundary": {
      "allowed": [
        ".amadeus/intents/**",
        ".amadeus/steering/**",
        ".amadeus/domain-map.md",
        ".amadeus/context-map.md",
        "関連 Issue"
      ],
      "prohibited": [
        "秘密情報",
        "対象外 workspace の成果物"
      ]
    },
    "writeBoundary": {
      "allowed": [
        ".amadeus/intents/<intent>/ideation/**",
        ".amadeus/intents/<intent>/state.json"
      ],
      "prohibited": [
        "実装コード",
        "Inception 成果物",
        "Construction 成果物",
        "merge 操作"
      ]
    },
    "delegation": {
      "allowed": [
        {
          "skillId": "amadeus-ideation-intent-capture",
          "purpose": "Intent Record を作成または補修する。"
        },
        {
          "skillId": "amadeus-ideation-scope-framing",
          "purpose": "scope を整理する。"
        },
        {
          "skillId": "amadeus-ideation-feasibility-shaping",
          "purpose": "実現可能性を整理する。"
        },
        {
          "skillId": "amadeus-ideation-mock-framing",
          "purpose": "初期 mock を整理する。"
        },
        {
          "skillId": "amadeus-ideation-traceability-finalization",
          "purpose": "追跡と状態を確定する。"
        }
      ],
      "order": [
        "amadeus-ideation-intent-capture",
        "amadeus-ideation-scope-framing",
        "amadeus-ideation-feasibility-shaping",
        "amadeus-ideation-mock-framing",
        "amadeus-ideation-traceability-finalization"
      ],
      "prohibited": [
        "amadeus-construction"
      ]
    },
    "grillingConditions": [
      {
        "id": "GR001",
        "description": "scope、成果物深度、検証戦略の不足が既存成果物から解消できない場合に一問ずつ確認する。"
      }
    ],
    "feedbackConditions": [
      {
        "id": "FB001",
        "description": "現在 Intent の成功条件を妨げる前段成果物の不足や矛盾は upstream_feedback_required として扱う。"
      },
      {
        "id": "FB002",
        "description": "現在 phase 内で解消できる事項は current_phase_update_required として扱う。"
      },
      {
        "id": "FB003",
        "description": "現在 Intent の成功条件に不要な改善は follow_up_issue_candidate または follow_up_intent_candidate として扱う。"
      }
    ],
    "consumerReferences": [
      {
        "consumer": "validator",
        "purpose": "生成物の存在、構造、参照入口を検出する。",
        "inputs": [
          "generatedReferencePaths",
          "prerequisites",
          "invariants",
          "postconditions",
          "readBoundary",
          "writeBoundary"
        ]
      },
      {
        "consumer": "evaluator",
        "purpose": "Skill Contract と実行結果の品質評価入力にする。",
        "inputs": [
          "invariants",
          "postconditions",
          "feedbackConditions"
        ]
      },
      {
        "consumer": "decision-review",
        "purpose": "意思決定の再確認に必要な契約条件を参照する。",
        "inputs": [
          "prerequisites",
          "invariants",
          "postconditions",
          "readBoundary",
          "writeBoundary"
        ]
      },
      {
        "consumer": "learning-review",
        "purpose": "後段発見と学習候補の分類に必要な条件を参照する。",
        "inputs": [
          "feedbackConditions",
          "postconditions",
          "consumerReferences"
        ]
      }
    ]
  },
  {
    "skillId": "amadeus-inception",
    "skillName": "amadeus-inception",
    "sourcePaths": [
      "skills/amadeus-inception/SKILL.md",
      ".agents/skills/amadeus-inception/SKILL.md"
    ],
    "generatedReferencePaths": [
      "skills/amadeus-inception/references/skill-contract.md",
      ".agents/skills/amadeus-inception/references/skill-contract.md"
    ],
    "prerequisites": [
      {
        "id": "PRE001",
        "description": "対象 Intent が Ideation を完了し、state の Ideation gate が passed である。"
      }
    ],
    "invariants": [
      {
        "id": "INV001",
        "description": "Inception では実装、Task、詳細な Domain Model、Intent Contracts を作らない。"
      },
      {
        "id": "INV002",
        "description": "Unit のコンテキストは Domain Map の adopted Bounded Context を参照する。"
      }
    ],
    "postconditions": [
      {
        "id": "POST001",
        "description": "requirements、acceptance、use-cases、units、bolts、traceability、decisions、state を追跡できる。"
      }
    ],
    "readBoundary": {
      "allowed": [
        ".amadeus/intents/<intent>/ideation/**",
        ".amadeus/steering/**",
        ".amadeus/domain-map.md",
        ".amadeus/context-map.md",
        "関連 Issue"
      ],
      "prohibited": [
        "Construction の実装差分を根拠にした要求改変"
      ]
    },
    "writeBoundary": {
      "allowed": [
        ".amadeus/intents/<intent>/inception/**",
        ".amadeus/intents/<intent>/state.json"
      ],
      "prohibited": [
        "実装コード",
        "Construction 成果物",
        "merge 操作"
      ]
    },
    "delegation": {
      "allowed": [
        {
          "skillId": "amadeus-inception-codebase-analysis",
          "purpose": "既存コード分析を行う。"
        },
        {
          "skillId": "amadeus-inception-requirements-definition",
          "purpose": "要求と受け入れを定義する。"
        },
        {
          "skillId": "amadeus-inception-user-stories",
          "purpose": "必要な User Story を定義する。"
        },
        {
          "skillId": "amadeus-inception-use-cases",
          "purpose": "Use Case を定義する。"
        },
        {
          "skillId": "amadeus-inception-units-generation",
          "purpose": "Unit と Bolt を生成する。"
        },
        {
          "skillId": "amadeus-inception-traceability-finalization",
          "purpose": "追跡と状態を確定する。"
        }
      ],
      "order": [
        "amadeus-inception-codebase-analysis",
        "amadeus-inception-requirements-definition",
        "amadeus-inception-user-stories",
        "amadeus-inception-use-cases",
        "amadeus-inception-units-generation",
        "amadeus-inception-traceability-finalization"
      ],
      "prohibited": [
        "amadeus-construction-implementation-execution"
      ]
    },
    "grillingConditions": [
      {
        "id": "GR001",
        "description": "要求、Use Case、Unit、Bolt の判断不足が既存成果物から解消できない場合に一問ずつ確認する。"
      }
    ],
    "feedbackConditions": [
      {
        "id": "FB001",
        "description": "現在 Intent の成功条件を妨げる前段成果物の不足や矛盾は upstream_feedback_required として扱う。"
      },
      {
        "id": "FB002",
        "description": "現在 phase 内で解消できる事項は current_phase_update_required として扱う。"
      },
      {
        "id": "FB003",
        "description": "現在 Intent の成功条件に不要な改善は follow_up_issue_candidate または follow_up_intent_candidate として扱う。"
      }
    ],
    "consumerReferences": [
      {
        "consumer": "validator",
        "purpose": "生成物の存在、構造、参照入口を検出する。",
        "inputs": [
          "generatedReferencePaths",
          "prerequisites",
          "invariants",
          "postconditions",
          "readBoundary",
          "writeBoundary"
        ]
      },
      {
        "consumer": "evaluator",
        "purpose": "Skill Contract と実行結果の品質評価入力にする。",
        "inputs": [
          "invariants",
          "postconditions",
          "feedbackConditions"
        ]
      },
      {
        "consumer": "decision-review",
        "purpose": "意思決定の再確認に必要な契約条件を参照する。",
        "inputs": [
          "prerequisites",
          "invariants",
          "postconditions",
          "readBoundary",
          "writeBoundary"
        ]
      },
      {
        "consumer": "learning-review",
        "purpose": "後段発見と学習候補の分類に必要な条件を参照する。",
        "inputs": [
          "feedbackConditions",
          "postconditions",
          "consumerReferences"
        ]
      }
    ]
  },
  {
    "skillId": "amadeus-construction",
    "skillName": "amadeus-construction",
    "sourcePaths": [
      "skills/amadeus-construction/SKILL.md",
      ".agents/skills/amadeus-construction/SKILL.md"
    ],
    "generatedReferencePaths": [
      "skills/amadeus-construction/references/skill-contract.md",
      ".agents/skills/amadeus-construction/references/skill-contract.md"
    ],
    "prerequisites": [
      {
        "id": "PRE001",
        "description": "対象 Intent が Inception を完了し、state の Inception gate が passed である。"
      },
      {
        "id": "PRE002",
        "description": "対象 Bolt と対象 Unit を Inception 成果物または state から解決できる。"
      }
    ],
    "invariants": [
      {
        "id": "INV001",
        "description": "親 skill は成果物や実装を直接扱わず、内部 skill に委譲する。"
      },
      {
        "id": "INV002",
        "description": "PR URL がない状態で pr.md を作らない。"
      },
      {
        "id": "INV003",
        "description": "merge 操作は行わない。"
      }
    ],
    "postconditions": [
      {
        "id": "POST001",
        "description": "Functional Design、Task、実装、検証、traceability、decisions、state が追跡できる。"
      }
    ],
    "readBoundary": {
      "allowed": [
        ".amadeus/intents/<intent>/inception/**",
        ".amadeus/intents/<intent>/construction/**",
        "対象実装コード",
        "対象テストコード",
        "関連 Issue/PR"
      ],
      "prohibited": [
        "対象外 Intent の成果物を根拠にした実装変更"
      ]
    },
    "writeBoundary": {
      "allowed": [
        ".amadeus/intents/<intent>/construction/**",
        ".amadeus/intents/<intent>/state.json",
        "対象 Task に対応する実装コード",
        "対象 Task に対応するテストコード"
      ],
      "prohibited": [
        "Spec 成果物",
        "Bolt 側 design.md",
        "merge 操作"
      ]
    },
    "delegation": {
      "allowed": [
        {
          "skillId": "amadeus-construction-functional-design",
          "purpose": "Functional Design を作成する。"
        },
        {
          "skillId": "amadeus-construction-bolt-preparation",
          "purpose": "Task と notes を作成する。"
        },
        {
          "skillId": "amadeus-construction-implementation-execution",
          "purpose": "Task に対応する実装を行う。"
        },
        {
          "skillId": "amadeus-construction-verification-hardening",
          "purpose": "検証と test-results を作成する。"
        },
        {
          "skillId": "amadeus-construction-traceability-finalization",
          "purpose": "追跡と状態を確定する。"
        }
      ],
      "order": [
        "amadeus-construction-functional-design",
        "amadeus-construction-bolt-preparation",
        "amadeus-construction-implementation-execution",
        "amadeus-construction-verification-hardening",
        "amadeus-construction-traceability-finalization"
      ],
      "prohibited": [
        "amadeus-inception-requirements-definition"
      ]
    },
    "grillingConditions": [
      {
        "id": "GR001",
        "description": "Construction の対象 Bolt、検証入口、実装範囲が成果物から確定できない場合に一問ずつ確認する。"
      }
    ],
    "feedbackConditions": [
      {
        "id": "FB001",
        "description": "現在 Intent の成功条件を妨げる前段成果物の不足や矛盾は upstream_feedback_required として扱う。"
      },
      {
        "id": "FB002",
        "description": "現在 phase 内で解消できる事項は current_phase_update_required として扱う。"
      },
      {
        "id": "FB003",
        "description": "現在 Intent の成功条件に不要な改善は follow_up_issue_candidate または follow_up_intent_candidate として扱う。"
      }
    ],
    "consumerReferences": [
      {
        "consumer": "validator",
        "purpose": "生成物の存在、構造、参照入口を検出する。",
        "inputs": [
          "generatedReferencePaths",
          "prerequisites",
          "invariants",
          "postconditions",
          "readBoundary",
          "writeBoundary"
        ]
      },
      {
        "consumer": "evaluator",
        "purpose": "Skill Contract と実行結果の品質評価入力にする。",
        "inputs": [
          "invariants",
          "postconditions",
          "feedbackConditions"
        ]
      },
      {
        "consumer": "decision-review",
        "purpose": "意思決定の再確認に必要な契約条件を参照する。",
        "inputs": [
          "prerequisites",
          "invariants",
          "postconditions",
          "readBoundary",
          "writeBoundary"
        ]
      },
      {
        "consumer": "learning-review",
        "purpose": "後段発見と学習候補の分類に必要な条件を参照する。",
        "inputs": [
          "feedbackConditions",
          "postconditions",
          "consumerReferences"
        ]
      }
    ]
  },
  {
    "skillId": "amadeus-grilling",
    "skillName": "amadeus-grilling",
    "sourcePaths": [
      "skills/amadeus-grilling/SKILL.md",
      ".agents/skills/amadeus-grilling/SKILL.md"
    ],
    "generatedReferencePaths": [
      "skills/amadeus-grilling/references/skill-contract.md",
      ".agents/skills/amadeus-grilling/references/skill-contract.md"
    ],
    "prerequisites": [
      {
        "id": "PRE001",
        "description": "確認したい論点と、反映先候補の成果物が特定されている。"
      }
    ],
    "invariants": [
      {
        "id": "INV001",
        "description": "質問は一度に並べず、一問ずつ行う。"
      },
      {
        "id": "INV002",
        "description": "回答があるまで成果物を確定しない。"
      }
    ],
    "postconditions": [
      {
        "id": "POST001",
        "description": "質問、推奨回答、ユーザー回答、確定判断、反映先を記録できる。"
      }
    ],
    "readBoundary": {
      "allowed": [
        ".amadeus/intents/**",
        ".amadeus/steering/**",
        "対象 skill が渡した前提"
      ],
      "prohibited": [
        "質問対象と無関係な成果物"
      ]
    },
    "writeBoundary": {
      "allowed": [
        "親 skill が許可した grillings.md と Gxxx-*.md"
      ],
      "prohibited": [
        "親 skill が許可していない成果物",
        "実装コード",
        "merge 操作"
      ]
    },
    "delegation": {
      "allowed": [],
      "order": [],
      "prohibited": [
        "対象 skill の責務外成果物を作る skill"
      ]
    },
    "grillingConditions": [
      {
        "id": "GR001",
        "description": "自分自身は質問実行の skill であり、対象 skill から渡された論点だけを扱う。"
      }
    ],
    "feedbackConditions": [
      {
        "id": "FB001",
        "description": "回答で新しい範囲外作業が見つかった場合は、親 skill に戻して分類する。"
      }
    ],
    "consumerReferences": [
      {
        "consumer": "validator",
        "purpose": "生成物の存在、構造、参照入口を検出する。",
        "inputs": [
          "generatedReferencePaths",
          "prerequisites",
          "invariants",
          "postconditions",
          "readBoundary",
          "writeBoundary"
        ]
      },
      {
        "consumer": "evaluator",
        "purpose": "Skill Contract と実行結果の品質評価入力にする。",
        "inputs": [
          "invariants",
          "postconditions",
          "feedbackConditions"
        ]
      },
      {
        "consumer": "decision-review",
        "purpose": "意思決定の再確認に必要な契約条件を参照する。",
        "inputs": [
          "prerequisites",
          "invariants",
          "postconditions",
          "readBoundary",
          "writeBoundary"
        ]
      },
      {
        "consumer": "learning-review",
        "purpose": "後段発見と学習候補の分類に必要な条件を参照する。",
        "inputs": [
          "feedbackConditions",
          "postconditions",
          "consumerReferences"
        ]
      }
    ]
  },
  {
    "skillId": "amadeus-validator",
    "skillName": "amadeus-validator",
    "sourcePaths": [
      "skills/amadeus-validator/SKILL.md",
      ".agents/skills/amadeus-validator/SKILL.md"
    ],
    "generatedReferencePaths": [
      "skills/amadeus-validator/references/skill-contract.md",
      ".agents/skills/amadeus-validator/references/skill-contract.md"
    ],
    "prerequisites": [
      {
        "id": "PRE001",
        "description": "検証対象 workspace または Intent を指定できる。"
      }
    ],
    "invariants": [
      {
        "id": "INV001",
        "description": "validator の pass は実行時参照に必要な最低限の構造条件を満たす意味であり、内容承認ではない。"
      },
      {
        "id": "INV002",
        "description": "Domain Map と Context Map に候補を載せない。"
      }
    ],
    "postconditions": [
      {
        "id": "POST001",
        "description": "検査カテゴリごとの pass、warning、fail、blocked と不足または矛盾を報告する。"
      }
    ],
    "readBoundary": {
      "allowed": [
        ".amadeus/**",
        "skills/amadeus-validator/validator/generated/**",
        "検証対象の関連成果物"
      ],
      "prohibited": [
        "秘密情報",
        "検証対象外 workspace"
      ]
    },
    "writeBoundary": {
      "allowed": [],
      "prohibited": [
        "検証対象成果物",
        "実装コード",
        "merge 操作"
      ]
    },
    "delegation": {
      "allowed": [],
      "order": [],
      "prohibited": [
        "対象 skill の責務外成果物を作る skill"
      ]
    },
    "grillingConditions": [
      {
        "id": "GR001",
        "description": "validator は質問を起動せず、不足または矛盾を報告する。"
      }
    ],
    "feedbackConditions": [
      {
        "id": "FB001",
        "description": "構造検出で見つかった不足は、対象 phase skill または人間判断へ戻す。"
      }
    ],
    "consumerReferences": [
      {
        "consumer": "validator",
        "purpose": "生成物の存在、構造、参照入口を検出する。",
        "inputs": [
          "generatedReferencePaths",
          "prerequisites",
          "invariants",
          "postconditions",
          "readBoundary",
          "writeBoundary"
        ]
      },
      {
        "consumer": "evaluator",
        "purpose": "Skill Contract と実行結果の品質評価入力にする。",
        "inputs": [
          "invariants",
          "postconditions",
          "feedbackConditions"
        ]
      },
      {
        "consumer": "decision-review",
        "purpose": "意思決定の再確認に必要な契約条件を参照する。",
        "inputs": [
          "prerequisites",
          "invariants",
          "postconditions",
          "readBoundary",
          "writeBoundary"
        ]
      },
      {
        "consumer": "learning-review",
        "purpose": "後段発見と学習候補の分類に必要な条件を参照する。",
        "inputs": [
          "feedbackConditions",
          "postconditions",
          "consumerReferences"
        ]
      }
    ]
  }
] as const;
