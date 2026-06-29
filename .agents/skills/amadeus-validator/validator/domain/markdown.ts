import {
  type ArtifactPath,
  type DocumentTitle,
  type SectionTitle,
  artifactPath,
  documentTitle,
  sectionTitle,
} from "./primitives";

export type MarkdownTable = {
  headers: string[];
  rows: Record<string, string>[];
};

export type MarkdownSection = {
  title: SectionTitle;
  body: string;
  tables: MarkdownTable[];
};

export type MarkdownDocument = {
  path: ArtifactPath;
  title: DocumentTitle;
  sections: MarkdownSection[];
  text: string;
};

export function parseMarkdownDocument(text: string, path: ArtifactPath | string): MarkdownDocument {
  const artifact = typeof path === "string" ? artifactPath(path) : path;
  const lines = text.split(/\r?\n/);
  const titleLine = lines.find((line) => /^#\s+/.test(line));
  const title = documentTitle(titleLine ? titleLine.replace(/^#\s+/, "").trim() : "Untitled");
  const sections: MarkdownSection[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^##\s+(.+?)\s*$/);
    if (!match) continue;
    const heading = match[1].trim();
    const bodyLines: string[] = [];
    index += 1;
    while (index < lines.length && !/^##\s+/.test(lines[index])) {
      bodyLines.push(lines[index]);
      index += 1;
    }
    index -= 1;
    sections.push({
      title: sectionTitle(heading),
      body: bodyLines.join("\n"),
      tables: parseTables(bodyLines),
    });
  }

  return {
    path: artifact,
    title,
    sections,
    text,
  };
}

export function section(document: MarkdownDocument, title: string): MarkdownSection | undefined {
  return document.sections.find((item) => item.title.value === title);
}

function parseTables(lines: string[]): MarkdownTable[] {
  const tables: MarkdownTable[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].trim().startsWith("|")) continue;
    const headerLine = lines[index];
    const delimiterLine = lines[index + 1] ?? "";
    if (!delimiterLine.trim().startsWith("|") || !/^\|?\s*:?-{3,}/.test(delimiterLine.trim())) continue;
    const headers = splitTableLine(headerLine);
    const rows: Record<string, string>[] = [];
    index += 2;
    while (index < lines.length && lines[index].trim().startsWith("|")) {
      const values = splitTableLine(lines[index]);
      rows.push(Object.fromEntries(headers.map((header, valueIndex) => [header, values[valueIndex] ?? ""])));
      index += 1;
    }
    index -= 1;
    tables.push({ headers, rows });
  }
  return tables;
}

function splitTableLine(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((value) => value.trim());
}
