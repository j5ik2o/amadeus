import { createWriteStream, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export type LlmProviderMode = "mock" | "real";

export type LlmRequest = {
  caseId: string;
  outputPath: string;
  prompt: string;
  workspace: string;
};

export type LlmResult = {
  outputPath: string;
};

export type LlmProvider = {
  describe(): string;
  previewCommand(request: LlmRequest): string[];
  run(request: LlmRequest): Promise<LlmResult>;
};

export type MockLlmCase = {
  apply?: (request: LlmRequest) => Promise<void> | void;
  message: string;
};

export type MockLlmCases = Record<string, MockLlmCase>;

type ProviderOptions = {
  mockCases: MockLlmCases;
  mode: LlmProviderMode;
  root: string;
  runner: string;
};

export function isLlmProviderMode(value: string | undefined): value is LlmProviderMode {
  return value === "mock" || value === "real";
}

export function createLlmProvider(options: ProviderOptions): LlmProvider {
  if (options.mode === "mock") return createMockLlmProvider(options.mockCases);
  return createCodexLlmProvider(options.root, options.runner);
}

export function shellQuote(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

function createMockLlmProvider(cases: MockLlmCases): LlmProvider {
  return {
    describe: () => "mock",
    previewCommand: (request) => ["mock-llm-provider", request.caseId],
    run: async (request) => {
      const testCase = cases[request.caseId];
      if (!testCase) throw new Error(`missing mock LLM case: ${request.caseId}`);
      await testCase.apply?.(request);
      writeFileSync(request.outputPath, testCase.message);
      return { outputPath: request.outputPath };
    },
  };
}

function createCodexLlmProvider(root: string, runner: string): LlmProvider {
  const resolvedRunner = resolve(root, runner);
  return {
    describe: () => "real",
    previewCommand: (request) => codexCommand(resolvedRunner, request.workspace, request.outputPath, request.prompt),
    run: async (request) => {
      const events = join(request.workspace, "codex-events.jsonl");
      const stderr = join(request.workspace, "codex-stderr.log");
      const command = codexCommand(resolvedRunner, request.workspace, request.outputPath, request.prompt);

      await runLogged(command, request.workspace, events, stderr);
      ensureFile(request.outputPath);
      return { outputPath: request.outputPath };
    },
  };
}

function codexCommand(runner: string, workspace: string, output: string, prompt: string): string[] {
  return [
    runner,
    "exec",
    "--skip-git-repo-check",
    "--ignore-user-config",
    "--cd",
    workspace,
    "--json",
    "--output-last-message",
    output,
    prompt,
  ];
}

async function writeStream(stream: ReadableStream<Uint8Array>, path: string): Promise<void> {
  const writer = createWriteStream(path);
  try {
    for await (const chunk of stream) {
      writer.write(chunk);
    }
  } finally {
    writer.end();
  }
}

async function runLogged(command: string[], cwd: string, stdoutPath: string, stderrPath: string): Promise<string> {
  const result = Bun.spawn(command, {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdoutPromise = writeStream(result.stdout, stdoutPath);
  const stderrPromise = writeStream(result.stderr, stderrPath);
  const exitCode = await result.exited;
  await Promise.all([stdoutPromise, stderrPromise]);

  const stdout = readFileSync(stdoutPath, "utf8");
  const stderr = readFileSync(stderrPath, "utf8");

  if (exitCode !== 0) {
    throw new Error([
      `command failed: ${command.join(" ")}`,
      `stdout log: ${stdoutPath}`,
      `stderr log: ${stderrPath}`,
      "stdout:",
      stdout,
      "stderr:",
      stderr,
    ].join("\n"));
  }

  return stdout;
}

function ensureFile(path: string): void {
  if (!existsSync(path)) throw new Error(`missing file: ${path}`);
}
