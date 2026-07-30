<div align="center">

# Knowledge Forest Framework

**Describe what you want to learn; get a clear path you can follow, finish, and maintain**

[![CI](https://github.com/AIALRA-0/knowledge-forest-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/AIALRA-0/knowledge-forest-framework/actions/workflows/ci.yml)
[![Apache 2.0](https://img.shields.io/badge/code-Apache--2.0-254b3c.svg)](LICENSE)
[![Local first](https://img.shields.io/badge/progress-local--first-805a46.svg)](docs/privacy.md)
[![No telemetry](https://img.shields.io/badge/telemetry-none-657067.svg)](docs/privacy.md)

[English demo](https://aialra-0.github.io/knowledge-forest-framework/?lang=en) · [中文演示](https://aialra-0.github.io/knowledge-forest-framework/?lang=zh-CN) · [中文说明](README.zh-CN.md) · [How it works](docs/architecture.md) · [Quality checks](docs/quality-gates.md) · [Security](SECURITY.md)

</div>

Knowledge Forest turns a broad ambition into separate learning paths; every step tells you what to learn from, what to make before moving on, what must be completed first, and where current research is heading

## Product interface

One static mockup cannot show how the product behaves across a large learning forest; the gallery therefore uses four distinct fields, four tree positions, and four working views from the production interface

The learning content shown here is built from independently public evidence; the gallery contains no personal progress, private address, access-control configuration, deployment detail, or private aggregate

### Semiconductor node

The selected heterogeneous-SoC node keeps the full prerequisite branch, an observable engineering artifact, the AMD Versal Adaptive SoC Technical Reference Manual, and four supporting routes in one screen

<p align="center">
  <img src="docs/images/actual-semiconductor-node-en.png" alt="English production interface showing a heterogeneous SoC node, its prerequisite branches, complete primary resource and acceptance work" width="960">
</p>

### Robotics field map

The robotics screen moves to a different branch position and opens the field map; dynamics, perception, manipulation, and real-time safety remain independent paths until they reunite in a working system

<p align="center">
  <img src="docs/images/actual-robotics-map-en.png" alt="English production interface showing the branched robotics field map" width="960">
</p>

### Aviation source directory

The aviation screen opens the source directory around MIT 16.333 Aircraft Stability and Control, the FAA pilot handbook, EASA rules, OpenVSP, and NASA technical reports; each source has a different learning job

<p align="center">
  <img src="docs/images/actual-aviation-sources-en.png" alt="English production interface showing an aviation learning tree and authoritative source directory" width="960">
</p>

### AI research review

The AI screen selects the World Models branch and opens the research review; each direction explains the unresolved engineering problem and binds it to dated public evidence

<p align="center">
  <img src="docs/images/actual-ai-frontiers-en.png" alt="English production interface showing a world-model tree branch and dated research frontiers" width="960">
</p>

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

The public example is a real dependency tree, not a single chain; two shared foundations split into evidence, accessibility, visualization, and reliable-delivery branches, then reunite at publication; it contains twelve steps, twelve complete resources, twelve practical outcomes, and thirty-six current research directions

English and Chinese have separate entry URLs and fully localized interfaces; both render the same dependency graph and preserve the same browser-local progress without mixing languages on one page

![Public demo statistics](public/readme-stats.svg)

## Try it

Open the [English demo](https://aialra-0.github.io/knowledge-forest-framework/?lang=en); the [Chinese demo](https://aialra-0.github.io/knowledge-forest-framework/?lang=zh-CN) is a separate localized entry; enter a goal such as:

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
