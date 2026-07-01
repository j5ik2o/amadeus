import { type MarkdownTable } from "./markdown-table";
import { type SectionTitle } from "./primitives";

export type MarkdownSection = {
  title: SectionTitle;
  body: string;
  tables: MarkdownTable[];
};
