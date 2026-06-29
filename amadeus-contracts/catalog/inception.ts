import type { ArtifactContract } from "./types";

export const inceptionArtifacts = [
  {
    artifactType: "inception.units.index",
    pathPattern: "inception/units.md",
    documentType: "UnitIndex",
    requiredHeadings: ["一覧", "依存関係"],
    tables: [
      {
        heading: "一覧",
        columns: ["識別子", "概要", "要求", "コンテキスト", "依存", "詳細"],
      },
      {
        heading: "依存関係",
        columns: ["ユニット", "依存", "理由"],
      },
    ],
  },
] as const satisfies readonly ArtifactContract[];
