import { type TableColumnName } from "./primitives";

export type MarkdownTable = {
  headers: TableColumnName[];
  rows: Record<string, string>[];
};
