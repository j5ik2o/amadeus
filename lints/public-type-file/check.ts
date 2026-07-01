#!/usr/bin/env bun

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import ts from "typescript";

type PublicTypeFileMeasurement = {
  id: string;
  file: string;
  publicTypeCount: number;
  publicTypes: string[];
};

type BaselineEntry = {
  id: string;
  file: string;
  publicTypeCount: number;
  publicTypes: string[];
};

type PublicTypeFileBaseline = {
  maxPublicTypesPerFile: number;
  entries: BaselineEntry[];
};

type PublicTypeFileCheckResult = {
  ok: boolean;
  messages: string[];
  measurements: PublicTypeFileMeasurement[];
  violations: PublicTypeFileMeasurement[];
};

type AnalyzeOptions = {
  root?: string;
  include?: string[];
};

type CheckOptions = AnalyzeOptions & {
  maxPublicTypesPerFile?: number;
  baselinePath?: string;
};

const defaultRoot = process.cwd();
const defaultInclude = [".agents/skills", "amadeus-contracts", "dev-scripts", "lints", "skills"];
const defaultMaxPublicTypesPerFile = 1;
const defaultBaselinePath = "lints/public-type-file/baseline.json";

export function analyzePublicTypeFiles(options: AnalyzeOptions = {}): PublicTypeFileMeasurement[] {
  const root = resolve(options.root ?? defaultRoot);
  const files = listTsFiles(root, options.include ?? defaultInclude);
  return files
    .map((file) => {
      const text = readFileSync(file, "utf8");
      const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
      const relativeFile = normalizePath(relative(root, file));
      const publicTypes = publicTypeNames(sourceFile);
      return {
        id: relativeFile,
        file: relativeFile,
        publicTypeCount: publicTypes.length,
        publicTypes,
      };
    })
    .filter((measurement) => measurement.publicTypeCount > 0)
    .sort((left, right) => {
      if (right.publicTypeCount !== left.publicTypeCount) return right.publicTypeCount - left.publicTypeCount;
      return left.file.localeCompare(right.file);
    });
}

export function checkPublicTypeFile(options: CheckOptions = {}): PublicTypeFileCheckResult {
  const root = resolve(options.root ?? defaultRoot);
  const maxPublicTypesPerFile = options.maxPublicTypesPerFile ?? defaultMaxPublicTypesPerFile;
  const baselinePath = resolve(root, options.baselinePath ?? defaultBaselinePath);
  const measurements = analyzePublicTypeFiles({ root, include: options.include });
  const violations = measurements.filter((measurement) => measurement.publicTypeCount > maxPublicTypesPerFile);
  const baseline = readBaseline(baselinePath);
  const baselineEntries = new Map((baseline?.entries ?? []).map((entry) => [entry.id, entry]));
  const violationIds = new Set(violations.map((violation) => violation.id));
  const messages: string[] = [];

  for (const violation of violations) {
    const baselineEntry = baselineEntries.get(violation.id);
    if (!baselineEntry) {
      messages.push(`new public type file violation: ${formatMeasurement(violation)} > ${maxPublicTypesPerFile}`);
      continue;
    }
    if (violation.publicTypeCount > baselineEntry.publicTypeCount) {
      messages.push(
        `public type count increased: ${formatMeasurement(violation)} was ${baselineEntry.publicTypeCount}, limit ${maxPublicTypesPerFile}`,
      );
    }
    if (violation.publicTypeCount < baselineEntry.publicTypeCount) {
      messages.push(
        `stale public type file baseline: ${formatMeasurement(violation)} was ${baselineEntry.publicTypeCount}, limit ${maxPublicTypesPerFile}`,
      );
    }
  }

  for (const entry of baselineEntries.values()) {
    if (!violationIds.has(entry.id)) {
      messages.push(`stale public type file baseline entry: ${entry.id}`);
    }
  }

  return {
    ok: messages.length === 0,
    messages,
    measurements,
    violations,
  };
}

export function writePublicTypeFileBaseline(options: CheckOptions = {}): PublicTypeFileBaseline {
  const root = resolve(options.root ?? defaultRoot);
  const maxPublicTypesPerFile = options.maxPublicTypesPerFile ?? defaultMaxPublicTypesPerFile;
  const baselinePath = resolve(root, options.baselinePath ?? defaultBaselinePath);
  const measurements = analyzePublicTypeFiles({ root, include: options.include });
  const entries = measurements
    .filter((measurement) => measurement.publicTypeCount > maxPublicTypesPerFile)
    .map((measurement) => ({
      id: measurement.id,
      file: measurement.file,
      publicTypeCount: measurement.publicTypeCount,
      publicTypes: measurement.publicTypes,
    }));
  const baseline = { maxPublicTypesPerFile, entries };
  writeFileSync(baselinePath, JSON.stringify(baseline, null, 2) + "\n");
  return baseline;
}

function listTsFiles(root: string, include: string[]): string[] {
  return include
    .map((path) => resolve(root, path))
    .filter((path) => existsSync(path))
    .flatMap((path) => walkTsFiles(path))
    .sort();
}

function walkTsFiles(path: string): string[] {
  const stats = statSync(path);
  if (stats.isFile()) return path.endsWith(".ts") ? [path] : [];
  if (!stats.isDirectory()) return [];

  const files: string[] = [];
  for (const entry of readdirSync(path)) {
    if (entry === "node_modules" || entry === "dist") continue;
    files.push(...walkTsFiles(join(path, entry)));
  }
  return files;
}

function publicTypeNames(sourceFile: ts.SourceFile): string[] {
  const localTypeNames = new Set(sourceFile.statements.flatMap((statement) => localTypeName(statement)));
  const publicTypes = new Set<string>();

  for (const statement of sourceFile.statements) {
    for (const name of exportedTypeDeclarationName(statement)) publicTypes.add(name);
    for (const name of exportAssignmentTypeName(statement, localTypeNames)) publicTypes.add(name);
    if (ts.isExportDeclaration(statement) && !statement.moduleSpecifier && statement.exportClause) {
      if (ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          const localName = (element.propertyName ?? element.name).text;
          if (statement.exportClause.isTypeOnly || element.isTypeOnly || localTypeNames.has(localName)) {
            publicTypes.add(element.name.text);
          }
        }
      }
    }
  }

  return [...publicTypes];
}

function localTypeName(statement: ts.Statement): string[] {
  if (ts.isTypeAliasDeclaration(statement)) return [statement.name.text];
  if (ts.isInterfaceDeclaration(statement)) return [statement.name.text];
  if (ts.isEnumDeclaration(statement)) return [statement.name.text];
  if (ts.isClassDeclaration(statement) && statement.name) return [statement.name.text];
  return [];
}

function exportAssignmentTypeName(statement: ts.Statement, localTypeNames: Set<string>): string[] {
  if (!ts.isExportAssignment(statement) || statement.isExportEquals) return [];
  const expression = statement.expression;
  if (ts.isIdentifier(expression) && localTypeNames.has(expression.text)) return [expression.text];
  return [];
}

function exportedTypeDeclarationName(statement: ts.Statement): string[] {
  if (!isExported(statement)) return [];
  if (ts.isTypeAliasDeclaration(statement)) return [statement.name.text];
  if (ts.isInterfaceDeclaration(statement)) return [statement.name.text];
  if (ts.isEnumDeclaration(statement)) return [statement.name.text];
  if (ts.isClassDeclaration(statement)) return [statement.name?.text ?? "<default>"];
  return [];
}

function isExported(node: ts.Node): boolean {
  return ts.canHaveModifiers(node) && (ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
}

function normalizePath(path: string): string {
  return path.split("\\").join("/");
}

function readBaseline(path: string): PublicTypeFileBaseline | undefined {
  if (!existsSync(path)) return undefined;
  return JSON.parse(readFileSync(path, "utf8")) as PublicTypeFileBaseline;
}

function formatMeasurement(measurement: PublicTypeFileMeasurement): string {
  return `${measurement.file} public types ${measurement.publicTypeCount} (${measurement.publicTypes.join(", ")})`;
}

function parseArgs(args: string[]): {
  mode: "check" | "report" | "update-baseline";
  maxPublicTypesPerFile: number;
  baselinePath: string;
} {
  let mode: "check" | "report" | "update-baseline" = "check";
  let maxPublicTypesPerFile = defaultMaxPublicTypesPerFile;
  let baselinePath = defaultBaselinePath;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--check") mode = "check";
    else if (arg === "--report") mode = "report";
    else if (arg === "--update-baseline") mode = "update-baseline";
    else if (arg === "--max-public-types-per-file") maxPublicTypesPerFile = Number(args[++index]);
    else if (arg === "--baseline") baselinePath = args[++index];
    else throw new Error(`unknown argument: ${arg}`);
  }

  if (!Number.isInteger(maxPublicTypesPerFile) || maxPublicTypesPerFile < 1) {
    throw new Error(`max public types per file must be a positive integer: ${maxPublicTypesPerFile}`);
  }

  return { mode, maxPublicTypesPerFile, baselinePath };
}

if (import.meta.main) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.mode === "update-baseline") {
      const baseline = writePublicTypeFileBaseline(args);
      console.log(`public type file baseline: ${baseline.entries.length} entries`);
      process.exit(0);
    }

    const result = checkPublicTypeFile(args);
    const reportRows = (args.mode === "report" ? result.measurements : result.violations).slice(0, 30);
    for (const measurement of reportRows) console.log(formatMeasurement(measurement));

    if (args.mode === "report") {
      console.log(`public type file: report (${result.violations.length} baseline violations)`);
      process.exit(0);
    }

    if (!result.ok) {
      for (const message of result.messages) console.error(message);
      process.exit(1);
    }

    console.log(`public type file: ok (${result.violations.length} baseline violations)`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
