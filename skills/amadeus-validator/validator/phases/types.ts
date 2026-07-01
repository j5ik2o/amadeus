import { type CheckResult } from "../domain/results";

export type IndexSpec = {
  headings: string[];
  listHeading: string;
  columns: string[];
  idPattern: RegExp;
  targetColumn: string;
};

export type MapEvidencePhase = "inception" | "construction";

export type PhaseValidationContext = {
  statusValues: Set<string>;
  gateValues: Set<string>;
  indexSpecs: Record<string, IndexSpec>;
  intentId?: string;
  pass: (target: string, condition: string, evidence: string) => void;
  failRow: (target: string, condition: string, evidence: string) => void;
  checkJsonValue: (path: string, key: string, actual: unknown, expected: string) => void;
  checkAllowed: (path: string, key: string, actual: unknown, allowed: Set<string>) => void;
  checkStatePaths: (path: string, section: Record<string, any>, key: string, condition: string, puml: boolean, label: string) => void;
  checkRequiredStatePath: (path: string, section: Record<string, any>, key: string, requiredPath: string, condition: string) => void;
  checkIntentCaptureState: (path: string, value: unknown) => void;
  checkGrillings: (base: string) => void;
  checkRequirements: (path: string) => void;
  checkAcceptance: (path: string, requirementsPath: string) => void;
  checkCodebaseAnalysis: (base: string, state: Record<string, any>) => void;
  checkNoInceptionDomainArtifacts: (base: string) => void;
  checkOptionalIndex: (path: string, spec: IndexSpec) => void;
  checkUnitContextReferences: (base: string, required: boolean, contextsPath: string, condition: string, evidencePhases: MapEvidencePhase[]) => void;
  checkContextMapDependencyEvidence: (evidencePhases: MapEvidencePhase[]) => void;
  checkUnitDesignArtifacts: (base: string, state: Record<string, any>) => void;
  checkBoltDesignReferences: (base: string) => void;
  checkNoInceptionBoltDesignBriefArtifacts: (base: string, state: Record<string, any>) => void;
  checkNoInceptionConstructionArtifacts: (base: string) => void;
  checkInceptionBoltArtifacts: (base: string, state: Record<string, any>) => void;
  checkTraceability: (path: string) => void;
  checkFile: (path: string, condition: string, directory?: boolean) => void;
  checkTaskGenerationTraceability: (path: string, state: Record<string, any>) => void;
  checkConstructionTraceability: (path: string, state: Record<string, any>) => void;
  checkConstructionBoltArtifacts: (inceptionBase: string, constructionBase: string, state: Record<string, any>) => void;
  recordCheckResults: (results: CheckResult[]) => void;
  recordCheckedFiles: (paths: string[]) => void;
  isFile: (path: string) => boolean;
  isObject: (value: unknown) => value is Record<string, any>;
  typeName: (value: unknown) => string;
  idsFor: (path: string) => Set<string>;
  unitDirectories: (base: string, unitIds: Set<string>) => Map<string, string>;
  inceptionBaseForStatePath: (path: string) => string;
  constructionBaseForStatePath: (path: string) => string;
  constructionBoltDirectories: (inceptionBase: string, constructionBase: string) => Map<string, string>;
  relativeToIntent: (intentBase: string, artifactPath: string) => string;
};
