import { type ArtifactPath } from "./artifact-path";
import { type IdRefTargetId } from "./id-ref-target-id";

export type IdRef<TId extends IdRefTargetId> = {
  readonly id: TId;
  readonly rawLinkTarget: string;
  readonly path: ArtifactPath;
};
