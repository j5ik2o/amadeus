#!/usr/bin/env bun

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import ts from "typescript";

export type ComplexityMeasurement = {
  id: string;
  file: string;
  name: string;
  line: number;
  complexity: number;
};

type BaselineEntry = {
  id: string;
  file: string;
  name: string;
  line: number;
  complexity: number;
};

type ComplexityBaseline = {
  maxComplexity: number;
  entries: BaselineEntry[];
};

export type ComplexityCheckResult = {
  ok: boolean;
  messages: string[];
  measurements: ComplexityMeasurement[];
  violations: ComplexityMeasurement[];
};

type AnalyzeOptions = {
  root?: string;
  include?: string[];
};

type CheckOptions = AnalyzeOptions & {
  maxComplexity?: number;
  baselinePath?: string;
};

const defaultRoot = process.cwd();
const defaultInclude = [".agents/skills", "amadeus-contracts", "dev-scripts", "lints", "skills"];
const defaultMaxComplexity = 20;
const defaultBaselinePath = "lints/ts-complexity/baseline.json";
const branchKinds = new Set<ts.SyntaxKind>([
  ts.SyntaxKind.IfStatement,
  ts.SyntaxKind.ForStatement,
  ts.SyntaxKind.ForInStatement,
  ts.SyntaxKind.ForOfStatement,
  ts.SyntaxKind.WhileStatement,
  ts.SyntaxKind.DoStatement,
  ts.SyntaxKind.CaseClause,
  ts.SyntaxKind.DefaultClause,
  ts.SyntaxKind.CatchClause,
  ts.SyntaxKind.ConditionalExpression,
]);
type MeasurableFunction =
  | ts.FunctionLikeDeclaration
  | ts.ConstructorDeclaration
  | ts.GetAccessorDeclaration
  | ts.SetAccessorDeclaration;

export function analyzeTsComplexity(options: AnalyzeOptions = {}): ComplexityMeasurement[] {
  const root = resolve(options.root ?? defaultRoot);
  const files = listTsFiles(root, options.include ?? defaultInclude);
  const measurements: ComplexityMeasurement[] = [];

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
    const relativeFile = normalizePath(relative(root, file));

    function visit(node: ts.Node): void {
      if (isFunctionLike(node)) {
        const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
        const name = functionName(node);
        measurements.push({
          id: measurementId(relativeFile, node),
          file: relativeFile,
          name,
          line,
          complexity: measureFunctionComplexity(node),
        });
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  return measurements.sort((left, right) => {
    if (right.complexity !== left.complexity) return right.complexity - left.complexity;
    if (left.file !== right.file) return left.file.localeCompare(right.file);
    return left.line - right.line;
  });
}

export function checkTsComplexity(options: CheckOptions = {}): ComplexityCheckResult {
  const root = resolve(options.root ?? defaultRoot);
  const maxComplexity = options.maxComplexity ?? defaultMaxComplexity;
  const baselinePath = resolve(root, options.baselinePath ?? defaultBaselinePath);
  const measurements = analyzeTsComplexity({ root, include: options.include });
  const violations = measurements.filter((measurement) => measurement.complexity > maxComplexity);
  const baseline = readBaseline(baselinePath);
  const baselineEntries = new Map((baseline?.entries ?? []).map((entry) => [entry.id, entry]));
  const violationIds = new Set(violations.map((violation) => violation.id));
  const messages: string[] = [];

  for (const violation of violations) {
    const baselineEntry = baselineEntries.get(violation.id);
    if (!baselineEntry) {
      messages.push(`new complexity violation: ${formatMeasurement(violation)} > ${maxComplexity}`);
      continue;
    }
    if (violation.complexity > baselineEntry.complexity) {
      messages.push(
        `complexity increased: ${formatMeasurement(violation)} was ${baselineEntry.complexity}, limit ${maxComplexity}`,
      );
    }
    if (violation.complexity < baselineEntry.complexity) {
      messages.push(
        `complexity baseline is stale: ${formatMeasurement(violation)} was ${baselineEntry.complexity}, limit ${maxComplexity}`,
      );
    }
  }

  for (const entry of baselineEntries.values()) {
    if (!violationIds.has(entry.id)) {
      messages.push(`stale complexity baseline entry: ${entry.id}`);
    }
  }

  return {
    ok: messages.length === 0,
    messages,
    measurements,
    violations,
  };
}

export function writeTsComplexityBaseline(options: CheckOptions = {}): ComplexityBaseline {
  const root = resolve(options.root ?? defaultRoot);
  const maxComplexity = options.maxComplexity ?? defaultMaxComplexity;
  const baselinePath = resolve(root, options.baselinePath ?? defaultBaselinePath);
  const measurements = analyzeTsComplexity({ root, include: options.include });
  const entries = measurements
    .filter((measurement) => measurement.complexity > maxComplexity)
    .map((measurement) => ({
      id: measurement.id,
      file: measurement.file,
      name: measurement.name,
      line: measurement.line,
      complexity: measurement.complexity,
    }));
  const baseline = { maxComplexity, entries };
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

function measureFunctionComplexity(node: MeasurableFunction): number {
  let complexity = 1;

  function count(current: ts.Node): void {
    if (current !== node && isFunctionLike(current)) return;
    if (branchKinds.has(current.kind)) complexity += 1;
    if (ts.isBinaryExpression(current) && isLogicalOperator(current.operatorToken.kind)) complexity += 1;
    ts.forEachChild(current, count);
  }

  count(node);
  return complexity;
}

function isFunctionLike(node: ts.Node): node is MeasurableFunction {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node)
  );
}

function functionName(node: MeasurableFunction): string {
  if (ts.isConstructorDeclaration(node)) return "constructor";
  if (node.name?.getText) return node.name.getText();
  const parent = node.parent;
  if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) return parent.name.text;
  if (ts.isPropertyAssignment(parent) && ts.isIdentifier(parent.name)) return parent.name.text;
  return "<anonymous>";
}

function isLogicalOperator(kind: ts.SyntaxKind): boolean {
  return (
    kind === ts.SyntaxKind.AmpersandAmpersandToken ||
    kind === ts.SyntaxKind.BarBarToken ||
    kind === ts.SyntaxKind.QuestionQuestionToken
  );
}

function measurementId(file: string, node: MeasurableFunction): string {
  return `${file}#${functionPath(node)}`;
}

function functionPath(node: MeasurableFunction): string {
  const segments = [functionSegment(node)];
  let current = node.parent;

  while (current) {
    if (isFunctionLike(current)) {
      segments.unshift(functionSegment(current));
    } else if (ts.isClassDeclaration(current) || ts.isClassExpression(current)) {
      segments.unshift(`class:${ownerName(current, "anonymous-class")}`);
    } else if (ts.isModuleDeclaration(current)) {
      segments.unshift(`module:${current.name.getText()}`);
    } else if (ts.isObjectLiteralExpression(current)) {
      segments.unshift(`object:${ownerName(current, "anonymous-object")}`);
    }
    current = current.parent;
  }

  return segments.join(">");
}

function functionSegment(node: MeasurableFunction): string {
  if (ts.isConstructorDeclaration(node)) return "constructor";
  if (ts.isGetAccessorDeclaration(node)) return `get:${functionName(node)}`;
  if (ts.isSetAccessorDeclaration(node)) return `set:${functionName(node)}`;
  if (ts.isMethodDeclaration(node)) return `method:${functionName(node)}`;
  if (functionName(node) === "<anonymous>") return anonymousFunctionSegment(node);
  return `function:${functionName(node)}`;
}

function anonymousFunctionSegment(node: MeasurableFunction): string {
  const parent = node.parent;
  if (ts.isCallExpression(parent)) {
    const argumentIndex = parent.arguments.findIndex((argument) => argument === node);
    if (argumentIndex >= 0) {
      return `callback:${safeSegment(parent.expression.getText())}:${callExpressionIndex(parent)}:${argumentIndex}`;
    }
  }
  return `function:<anonymous:${sameKindIndex(node)}>`;
}

function ownerName(
  node: ts.ClassDeclaration | ts.ClassExpression | ts.ObjectLiteralExpression,
  fallback: string,
): string {
  if ((ts.isClassDeclaration(node) || ts.isClassExpression(node)) && node.name) return node.name.text;
  const parent = node.parent;
  if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) return parent.name.text;
  if (ts.isPropertyAssignment(parent) && ts.isIdentifier(parent.name)) return parent.name.text;
  if (ts.isCallExpression(parent)) {
    const argumentIndex = parent.arguments.findIndex((argument) => argument === node);
    if (argumentIndex >= 0) return `argument:${safeSegment(parent.expression.getText())}:${argumentIndex}`;
  }
  return `${fallback}:${sameKindIndex(node)}`;
}

function sameKindIndex(node: ts.Node): number {
  const parent = node.parent;
  if (!parent) return 0;
  return parent.getChildren().filter((child) => child.kind === node.kind && child.pos < node.pos).length;
}

function callExpressionIndex(node: ts.CallExpression): number {
  const owner = nearestCountingOwner(node);
  const expressionText = node.expression.getText();
  let index = 0;
  let found = false;

  function visit(current: ts.Node): void {
    if (found) return;
    if (current === node) {
      found = true;
      return;
    }
    if (current !== owner && isFunctionLike(current)) return;
    if (ts.isCallExpression(current) && current.expression.getText() === expressionText) index += 1;
    if (!found) ts.forEachChild(current, visit);
  }

  visit(owner);
  return index;
}

function nearestCountingOwner(node: ts.Node): ts.Node {
  let current = node.parent;
  while (current) {
    if (isFunctionLike(current) || ts.isSourceFile(current)) return current;
    current = current.parent;
  }
  return node;
}

function safeSegment(value: string): string {
  return value.replace(/\s+/g, "").replace(/[>#]/g, "_");
}

function normalizePath(path: string): string {
  return path.split("\\").join("/");
}

function readBaseline(path: string): ComplexityBaseline | undefined {
  if (!existsSync(path)) return undefined;
  return JSON.parse(readFileSync(path, "utf8")) as ComplexityBaseline;
}

function formatMeasurement(measurement: ComplexityMeasurement): string {
  return `${measurement.file}:${measurement.line} ${measurement.name} complexity ${measurement.complexity}`;
}

function parseArgs(args: string[]): {
  mode: "check" | "report" | "update-baseline";
  maxComplexity: number;
  baselinePath: string;
} {
  let mode: "check" | "report" | "update-baseline" = "check";
  let maxComplexity = defaultMaxComplexity;
  let baselinePath = defaultBaselinePath;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--check") mode = "check";
    else if (arg === "--report") mode = "report";
    else if (arg === "--update-baseline") mode = "update-baseline";
    else if (arg === "--max-complexity") maxComplexity = Number(args[++index]);
    else if (arg === "--baseline") baselinePath = args[++index];
    else throw new Error(`unknown argument: ${arg}`);
  }

  if (!Number.isInteger(maxComplexity) || maxComplexity < 1) {
    throw new Error(`max complexity must be a positive integer: ${maxComplexity}`);
  }

  return { mode, maxComplexity, baselinePath };
}

if (import.meta.main) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.mode === "update-baseline") {
      const baseline = writeTsComplexityBaseline(args);
      console.log(`ts complexity baseline: ${baseline.entries.length} entries`);
      process.exit(0);
    }

    const result = checkTsComplexity(args);
    const reportRows = (args.mode === "report" ? result.measurements : result.violations).slice(0, 30);
    for (const measurement of reportRows) console.log(formatMeasurement(measurement));

    if (args.mode === "report") {
      console.log(`ts complexity: report (${result.violations.length} baseline violations)`);
      process.exit(0);
    }

    if (!result.ok) {
      for (const message of result.messages) console.error(message);
      process.exit(1);
    }

    console.log(`ts complexity: ok (${result.violations.length} baseline violations)`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
