// Generated from amadeus-contracts/catalog/**. Do not edit by hand.
export const functionalDesignContract = {
  "artifacts": [
    {
      "artifactType": "functional-design.business-logic-model",
      "pathPattern": "construction/<unit-id>-<slug>/functional-design/business-logic-model.md",
      "documentType": "FunctionalDesignBusinessLogicModel",
      "requiredHeadings": [
        "目的",
        "対象 Unit",
        "業務ロジック",
        "入力",
        "出力",
        "未確認事項"
      ],
      "tables": []
    },
    {
      "artifactType": "functional-design.business-rules",
      "pathPattern": "construction/<unit-id>-<slug>/functional-design/business-rules.md",
      "documentType": "FunctionalDesignBusinessRules",
      "requiredHeadings": [
        "目的",
        "業務ルール",
        "例外",
        "未確認事項"
      ],
      "tables": [
        {
          "heading": "業務ルール",
          "columns": [
            "識別子",
            "規則",
            "根拠",
            "状態"
          ]
        }
      ]
    },
    {
      "artifactType": "functional-design.domain-entities",
      "pathPattern": "construction/<unit-id>-<slug>/functional-design/domain-entities.md",
      "documentType": "FunctionalDesignDomainEntities",
      "requiredHeadings": [
        "目的",
        "Domain Entity",
        "関係",
        "未確認事項"
      ],
      "tables": [
        {
          "heading": "Domain Entity",
          "columns": [
            "識別子",
            "名前",
            "責務",
            "関連"
          ]
        }
      ]
    },
    {
      "artifactType": "functional-design.frontend-components",
      "pathPattern": "construction/<unit-id>-<slug>/functional-design/frontend-components.md",
      "documentType": "FunctionalDesignFrontendComponents",
      "requiredHeadings": [
        "目的",
        "UI 構成",
        "状態",
        "未確認事項"
      ],
      "tables": [
        {
          "heading": "UI 構成",
          "columns": [
            "識別子",
            "名前",
            "責務",
            "状態"
          ]
        }
      ]
    }
  ],
  "requirements": [
    "required",
    "not_required",
    "unresolved"
  ],
  "statuses": [
    "not_started",
    "in_progress",
    "ready_for_approval",
    "passed",
    "failed",
    "skipped",
    "blocked"
  ],
  "frontendSurfaces": [
    "present",
    "absent",
    "unresolved"
  ],
  "skipReasons": [
    "unit_not_in_construction_scope"
  ],
  "blockedReasons": [
    "target_unit_unresolved",
    "unit_design_missing",
    "frontend_surface_unresolved",
    "required_input_missing"
  ],
  "requiredBlockedReasons": [
    "unit_design_missing",
    "frontend_surface_unresolved",
    "required_input_missing"
  ],
  "targetSources": [
    "functional_design_target_units",
    "construction_target_units",
    "construction_target_bolts",
    "user_specified"
  ],
  "runModes": [
    "initial",
    "rerun"
  ],
  "gateResultByStatus": {
    "not_started": "not_ready",
    "in_progress": "not_ready",
    "ready_for_approval": "waiting_approval",
    "passed": "passed",
    "failed": "failed",
    "skipped": "skipped",
    "blocked": "blocked"
  },
  "coreArtifacts": [
    {
      "artifactType": "functional-design.business-logic-model",
      "fileName": "business-logic-model.md",
      "requiredWhen": "functionalDesign.requirement == required"
    },
    {
      "artifactType": "functional-design.business-rules",
      "fileName": "business-rules.md",
      "requiredWhen": "functionalDesign.requirement == required"
    },
    {
      "artifactType": "functional-design.domain-entities",
      "fileName": "domain-entities.md",
      "requiredWhen": "functionalDesign.requirement == required"
    }
  ],
  "frontendArtifact": {
    "artifactType": "functional-design.frontend-components",
    "fileName": "frontend-components.md",
    "requiredWhen": "functionalDesign.requirement == required",
    "conditionField": "frontendSurface",
    "conditionValue": "present"
  },
  "allowedStateMatrix": [
    {
      "requirement": "required",
      "statuses": [
        "not_started",
        "in_progress",
        "ready_for_approval",
        "passed",
        "failed"
      ],
      "blockedReasons": [],
      "skipReasons": []
    },
    {
      "requirement": "required",
      "statuses": [
        "blocked"
      ],
      "blockedReasons": [
        "unit_design_missing",
        "frontend_surface_unresolved",
        "required_input_missing"
      ],
      "skipReasons": []
    },
    {
      "requirement": "not_required",
      "statuses": [
        "skipped"
      ],
      "blockedReasons": [],
      "skipReasons": [
        "unit_not_in_construction_scope"
      ]
    },
    {
      "requirement": "unresolved",
      "statuses": [
        "blocked"
      ],
      "blockedReasons": [
        "target_unit_unresolved"
      ],
      "skipReasons": []
    }
  ]
} as const;
