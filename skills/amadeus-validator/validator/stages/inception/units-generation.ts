import { type PhaseValidationContext } from "../../phases/types";

export function checkInceptionUnitsGenerationStage(
  context: PhaseValidationContext,
  input: { inceptionBase: string; state: Record<string, any>; requireDomainBoundary: boolean },
): void {
  for (const filename of ["units.md", "bolts.md", "decisions.md"]) {
    const spec = context.indexSpecs[filename];
    const path = `${input.inceptionBase}/${filename}`;
    if (spec && context.isFile(path)) context.checkOptionalIndex(path, spec);
  }
  context.checkUnitContextReferences(
    input.inceptionBase,
    input.requireDomainBoundary,
    ".amadeus/domain-map.md",
    "Unit のコンテキストが Domain Map の adopted Bounded Context を参照する",
    ["inception"],
  );
  context.checkContextMapDependencyEvidence(["inception"]);
  context.checkUnitDesignArtifacts(input.inceptionBase, input.state);
  context.checkBoltDesignReferences(input.inceptionBase);
  context.checkNoInceptionBoltDesignBriefArtifacts(input.inceptionBase, input.state);
  context.checkInceptionBoltArtifacts(input.inceptionBase, input.state);
}
