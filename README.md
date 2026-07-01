# Amadeus

Amadeus is a project for operating Amadeus DLC, a lifecycle contract for AI-assisted software development.
It provides agent skills, templates, examples, validators, and documentation for moving work through Ideation, Inception, Construction, and supporting analysis.

[English](README.md) | [日本語](README.ja.md)

## Highlights

- Run Amadeus DLC through focused agent skills such as `amadeus-steering`, `amadeus-ideation`, `amadeus-inception`, and `amadeus-construction`.
- Keep lifecycle artifacts auditable with explicit phase state, gates, traceability, decisions, and validation results.
- Use generated examples under [examples/](examples/) as snapshots of what the skills can produce.
- Validate Amadeus workspaces and Intent artifacts with the bundled `amadeus-validator`.

## Quickstart

### Requirements

- Node.js and npm.
- Bun.
- The dependencies declared in [package.json](package.json).

### Install

```sh
bun install
```

### Run

Validate the bundled examples.

```sh
npm run validate:all
```

Run the full mock-based verification suite.

```sh
npm run test:all
```

## Usage

Amadeus is used through agent skills.
The skills are grouped by how they participate in Amadeus DLC.

### Phase Skills

Use phase skills in lifecycle order.
`amadeus-discovery` is optional, but recommended when the input topic is large, ambiguous, or not yet ready for Intent creation.

1. `amadeus-steering`
2. `amadeus-discovery` (optional, recommended)
3. `amadeus-ideation`
4. `amadeus-inception`
5. `amadeus-construction`

### Cross-Cutting Support Skills

Use cross-cutting support skills when a phase needs additional analysis, domain clarification, or artifact validation.

- `amadeus-event-storming`
- `amadeus-domain-grilling`
- `amadeus-validator`

### Internal Skills

Internal skills are used by Amadeus workflows when needed.
Use the phase skills or cross-cutting support skills as the public entrypoints unless the task explicitly requires an internal skill.

- `amadeus-grilling`
- `amadeus-domain-modeling`

The repository root keeps `.amadeus/` as the steering layer for Amadeus's own development.
Repository examples are stored as phase-by-phase snapshots under [examples/](examples/).

### Typical Flow

| Step | Skill | Purpose |
|---|---|---|
| 1 | `amadeus-steering` | Create or inspect the shared workspace foundation. |
| 2 | `amadeus-discovery` | Clarify a large or ambiguous input topic before turning it into an Intent. This step is optional, but recommended. |
| 3 | `amadeus-ideation` | Create an Intent Record and complete Ideation artifacts. |
| 4 | `amadeus-inception` | Define requirements, acceptance state, user stories, use cases, Units, Bolts, Unit Design Briefs, traceability, and decisions. |
| 5 | `amadeus-construction` | Turn Bolts into Tasks, implement them, verify them, record evidence, and update traceability. |

Cross-cutting support skills can be used alongside the flow when needed.
`amadeus-event-storming` maps Domain Events, Processes, Aggregate Candidates, Bounded Context Candidates, and Hotspots as supporting analysis.
`amadeus-domain-grilling` combines question-driven domain clarification with artifact updates.
`amadeus-validator` validates workspace and Intent artifact structure.

### Validation

Validate only workspace-level example artifacts.

```sh
npm run validate
```

Validate Intent-level example artifacts.

```sh
npm run validate:intents
```

Validate everything covered by the example wrapper.

```sh
npm run validate:all
```

Run the validator directly against a workspace.

```sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts <workspace>
```

Run the validator directly against a specific Intent.

```sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts <workspace> <intent-id>-<slug>
```

## Documentation

- Agent entrypoint: [AMADEUS.md](AMADEUS.md)
- Examples: [examples/](examples/)
- Stage references:
  - [Steering](docs/amadeus/stages/steering.md)
  - [Discovery](docs/amadeus/stages/discovery.md)
  - [Ideation](docs/amadeus/stages/ideation.md)
  - [Inception](docs/amadeus/stages/inception.md)
  - [Construction](docs/amadeus/stages/construction.md)
  - [Operation](docs/amadeus/stages/operation.md)
- Architecture decisions: [docs/adr/](docs/adr/)
- AI-DLC reference material: [docs/ai-dlc/](docs/ai-dlc/)

## Boundaries

- `.amadeus/` is the artifact root in a target workspace.
  In this repository root, it is limited to the steering layer for Amadeus's own development.
- Intent directory names must match `.amadeus/intents.md` and `.amadeus/intents/<intent-id>-<slug>/`.
- Domain findings are placed according to scope: Intent-specific notes go to `domain-notes.md`, adopted boundaries go to `.amadeus/domain-map.md`, adopted context dependencies go to `.amadeus/context-map.md`, Inception relationships go to `inception/traceability.md`, and detailed models and contracts go to Construction Functional Design.
- Unknown values are recorded as `未確認` instead of being left blank.
- External systems, Bounded Contexts, Intents, and dependencies are not invented from guesses.
- Spec, `.kiro/specs/**`, `openspec/**`, and Operation artifacts are not fixed as procedures until their corresponding skills are confirmed.

## Getting Help

- Issues: [github.com/j5ik2o/amadeus/issues](https://github.com/j5ik2o/amadeus/issues)

## Contributing

This repository does not currently include a `CONTRIBUTING.md`.
Before making a large change, open an issue that describes the scope, affected skills, expected artifacts, and validation plan.

For local development, use:

```sh
npm run test:all
```

## License

No license file is currently included in this repository.
