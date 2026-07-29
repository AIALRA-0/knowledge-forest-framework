<div align="center">

# Knowledge Forest Framework

**Describe what you want to learn; get a clear path you can follow, finish, and maintain**

[![CI](https://github.com/AIALRA-0/knowledge-forest-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/AIALRA-0/knowledge-forest-framework/actions/workflows/ci.yml)
[![Apache 2.0](https://img.shields.io/badge/code-Apache--2.0-254b3c.svg)](LICENSE)
[![Local first](https://img.shields.io/badge/progress-local--first-805a46.svg)](docs/privacy.md)
[![No telemetry](https://img.shields.io/badge/telemetry-none-657067.svg)](docs/privacy.md)

[Live demo](https://aialra-0.github.io/knowledge-forest-framework/) · [中文说明](README.zh-CN.md) · [How it works](docs/architecture.md) · [Quality checks](docs/quality-gates.md) · [Security](SECURITY.md)

</div>

Knowledge Forest turns a broad ambition into separate learning paths; every step tells you what to learn from, what to make before moving on, what must be completed first, and where current research is heading

## A real private forest built with the framework

These sanitized screenshots come from AIALRA's running, Authentik-protected private deployment; its private records and deployment address are not included in this public repository

- 16 independent lifelong learning trees
- 1,028 inspectable nodes
- a 376-node semiconductor tree organized into 82 branches
- a complete resource, acceptance artifact, learning platforms, three current research directions, and saved progress at every node

![AIALRA private semiconductor knowledge forest](docs/images/aialra-forest-chip-overview.jpg)

![AIALRA private knowledge forest directory](docs/images/aialra-forest-directory.jpg)

## What you do

1. Write the goal in your own words; include what you already know, how much time you have, and any limits that matter
2. Give the generated request to an agent using the included workflow
3. Open the resulting forest and choose a field
4. Learn from the complete resource; produce the listed piece of work; mark the step complete; move to the next unlocked step
5. Return later and continue from the progress saved in your browser

## What you see at every step

- one focused skill or idea
- a short explanation of why it matters
- one complete course, book, article, standard, or official documentation set
- a concrete result to produce before the step counts as complete
- prerequisite steps and a clear explanation when the step is locked
- three current research directions with dated sources
- progress, feedback, export, and a way to report an unavailable resource

The bilingual public demo is a connected path through evidence, accessibility, visualization, and reliable delivery; it contains twelve steps, twelve complete resources, twelve practical outcomes, and thirty-six current research directions; switch between English and Chinese without changing progress

![Public demo statistics](public/readme-stats.svg)

## Try it

Open the [live demo](https://aialra-0.github.io/knowledge-forest-framework/); enter a goal such as:

```text
I want to build reliable household robots; I already know Python and basic linear algebra
```

The page prepares a structured request; an agent then researches the field, checks the sources, and generates the complete forest

## Run it locally

```bash
git clone https://github.com/AIALRA-0/knowledge-forest-framework.git
cd knowledge-forest-framework
npm install
npm run dev
```

Prepare a request from the command line:

```bash
node packages/cli/bin/knowledge-forest.mjs brief \
  "Build a research-level learning forest for embodied AI; I already know Python"
```

Check a generated forest:

```bash
node packages/cli/bin/knowledge-forest.mjs audit \
  examples/public-demo/forest.generated.json
```

Give [`skills/knowledge-forest/SKILL.md`](skills/knowledge-forest/SKILL.md) to a compatible agent for the complete research and generation workflow

## How a forest is produced

```mermaid
flowchart TB
    A["Your goal and starting point"] --> B["Major fields and prerequisites"]
    B --> C["Complete learning resources"]
    C --> D["Work that proves each skill"]
    D --> E["Current research directions and sources"]
    E --> F["Coverage, source, safety, and experience checks"]
    F --> G["Interactive learning forest"]
    G --> H["Progress and feedback"]
    H --> B
```

Every production run creates:

```text
forest.generated.json
provenance.json
audit-report.json
review-queue.json
```

In plain language; these files contain the forest shown on the page, where its information came from, which checks passed, and which decisions still need a person

## Quality checks

`npm test` checks that:

- every step belongs to a clear field and has valid prerequisites
- links point to complete resources rather than isolated chapters
- completion requires a visible piece of work
- current research directions have dates and sources
- health, finance, aviation, space, and security requests receive appropriate boundaries
- private paths, accounts, credentials, and personal course records cannot enter the public build
- the production page builds successfully

Automated checks are not enough; releases also include realistic desktop and mobile use; reviewers record where a person became confused, whether recovery was obvious, and what changed afterward

Read the latest [real user journey review](docs/user-journey-review.md)

## Public and private projects

Use this public repository for reusable code, empty templates, synthetic examples, and common improvements

Keep personal progress, private learning data, restricted resources, research archives, credentials, authentication, and deployment configuration in a separate private repository; the framework does not copy private data into the public project

## For maintainers

```text
app/                         interactive public demo
packages/schema/             data shapes shared by generators and renderers
packages/core/               prerequisite, progress, and quality rules
packages/agent/              plain-language request preparation
packages/cli/                local request and validation commands
skills/knowledge-forest/     end-to-end agent workflow
prompts/                     focused research instructions
schemas/                     machine-readable file definitions
templates/                   empty learner inputs
examples/public-demo/        independently public example
docs/                        design, quality, privacy, and policy
scripts/                     reports, statistics, sanitization, and journey checks
tests/                       repeatable release checks
```

The [project landscape](docs/project-landscape.md) compares related curriculum, roadmap, graph, and research-index projects; the [architecture](docs/architecture.md) explains the internal file flow; the [agent protocol](docs/agent-protocol.md) defines the generation process

## Privacy and content rights

- progress and feedback stay in the browser by default
- the public demo includes no telemetry
- public examples are independently generated
- third-party material remains link-only unless redistribution permission is explicit
- original code uses Apache-2.0
- public example learning content uses CC BY 4.0
- generated forests keep the license selected by their owner

Read [privacy](docs/privacy.md), [content policy](docs/content-policy.md), and [security](SECURITY.md) before publishing an instance

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md); explain the user problem, show the resulting behavior, and include the checks and real journey used to evaluate the change

## Roadmap

- `0.2` connect more research sources and preserve link snapshots
- `0.3` add extension interfaces and richer connections between fields
- `1.0` guarantee long-term file compatibility and signed releases

## Status

This is an early public release; use the review queue when a source, license, safety boundary, or field-coverage decision still needs a person; a generated forest is a learning guide and does not replace professional medical, legal, financial, licensing, or regulatory advice
