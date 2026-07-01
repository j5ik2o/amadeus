import { type ArtifactPath } from "./artifact-path";

export type IdRef<TId extends { readonly kind: string; readonly value: string }> = {
  readonly id: TId;
  readonly rawLinkTarget: string;
  readonly path: ArtifactPath;
};
