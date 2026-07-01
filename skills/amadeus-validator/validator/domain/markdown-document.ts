import { type MarkdownSection } from "./markdown-section";
import { type ArtifactPath, type DocumentTitle } from "./primitives";

export type MarkdownDocument = {
  path: ArtifactPath;
  title: DocumentTitle;
  sections: MarkdownSection[];
  text: string;
};
