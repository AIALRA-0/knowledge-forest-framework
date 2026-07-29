---
name: knowledge-forest
description: Research, generate, audit, and maintain an evidence-backed learning forest from a learner's plain-language needs
---

# Knowledge Forest

Use this skill when a user wants a complete learning path, skill tree, curriculum forest, research preparation map, or long-term cross-domain learning system

## Required outcome

Produce a domain-separated, top-to-bottom learning forest where every node has:

- one atomic topic
- one complete primary course, book, article, standard, documentation set, or platform
- explicit prerequisites
- one concrete acceptance artifact with observable criteria
- exactly three current frontier positions
- traceable evidence for every frontier position
- resource access and licensing notes
- a stable id that survives future revisions

The output is not complete until realistic user journeys have been performed and their friction has been recorded

## Step 1; preserve the learner's history

Read the current request and all corrections already accepted in the conversation or project

Create or update `brief.json`

Convert every correction into:

```json
{
  "id": "stable-correction-id",
  "statement": "What the user expects",
  "regressionCheck": "How every future release proves it remains true",
  "source": "user"
}
```

Never ask the user to repeat information that is already available

Preserve:

- prior learning and completed nodes
- intended depth
- available hours
- language and formatting preferences
- free, paid, and institutional access
- excluded formats
- licensing constraints
- high-risk domains
- desired acceptance artifacts

## Step 2; normalize scope

Separate the request into independent domains before generating nodes

Do not place every topic beneath one universal root

Identify:

- shared foundations
- domain-specific branches
- regulated or safety-critical branches
- cross-domain bridges
- boundaries that should remain outside the forest

For ambiguous compound topics, split first and merge only when the learner must acquire them as one inseparable capability

## Step 3; investigate the field

Research the domain from at least four perspectives:

1. academic taxonomy
2. industry workflow
3. standards or regulatory structure
4. current research agenda

Prefer:

1. standards bodies and regulators
2. official vendor documentation
3. universities and primary research organizations
4. peer-reviewed papers and conference proceedings
5. mature professional training platforms

Community sources may reveal gaps or experience problems; they must not be the sole evidence for a factual or safety-critical claim

Record the query, source, publication date, access result, license, and reason for inclusion

## Step 4; build the taxonomy

Create a coverage contract before writing learning nodes

The contract must state:

- expected domains
- expected major branches per domain
- required interfaces between branches
- expected safety boundaries
- expected resource and evidence counts
- known exclusions with reasons

Run a gap challenge:

- What would an industry practitioner say is missing
- What would a researcher say is missing
- What would a regulator say is missing
- What adjacent discipline becomes a bottleneck
- What operational or human factor is being ignored

## Step 5; select learning resources

Assign exactly one primary resource to each node

Reject:

- isolated chapters
- page ranges
- arbitrary video fragments
- search-result pages
- unavailable or unverifiable files
- resources selected only because they are popular

Rank candidates by:

- authority
- completeness
- fit to the node outcome
- accessibility
- freshness
- practical depth
- licensing clarity
- stability of the canonical URL

Keep alternatives in research notes; the visible tree must retain one main path

## Step 6; define acceptance

Every node requires an artifact that another person can inspect

Good artifacts include:

- design review
- working prototype
- reproducible notebook
- simulation
- test report
- policy memo
- performance profile
- annotated experiment
- portfolio performance

Avoid acceptance criteria such as "understand", "read", or "be familiar with"

## Step 7; attach frontier evidence

Every node requires exactly three frontier positions

Each position must include:

- a short statement of what is changing
- why it matters to the node
- a current primary or authoritative evidence page
- publication date
- source type

Use a rolling three-year window by default

Older evidence may remain only when it is the current governing standard; explain the exception and add a current maintenance signal

## Step 8; generate deterministic artifacts

Write:

- `forest.generated.json`
- `provenance.json`
- `audit-report.json`
- `review-queue.json`

The interactive site reads only `forest.generated.json` after it passes validation

Do not let an agent write directly into production-resolved data

## Step 9; run three audit rounds

### Round 1; structure

Check:

- taxonomy coverage
- stable ids
- domain separation
- acyclic prerequisites
- atomic titles
- whole-resource assignments
- acceptance artifacts
- safety boundaries

### Round 2; evidence

Check:

- URL reachability
- source authority
- publication date
- claim-level relevance
- licensing
- duplication
- exactly three frontiers per node
- resource access class

### Round 3; experience

Use the site as a learner

At minimum test:

- a novice with a vague goal
- a practitioner with known prior skills
- a cross-domain goal
- a regulated or health-related goal
- a mobile user
- a user returning after progress was saved
- a user who corrects a requirement
- a user who encounters an unavailable resource

Do not mark the experience round as passed merely because scripted checks succeed

Record:

- whether the first next action is obvious
- whether a resource is reachable in one deliberate action
- whether a locked node explains why
- whether the acceptance artifact is understandable
- whether frontier context is visible without cluttering the main path
- whether progress survives a return visit
- whether an earlier correction ever regresses
- what confused the evaluator
- what changed after evaluation

## Step 10; publish safely

Before a public release:

- build from a new or already-public source history
- run the sanitization audit
- scan secrets and high-entropy strings
- reject local paths, private hosts, emails, identifiers, and production configuration
- redistribute third-party files only when the license explicitly permits it
- use synthetic or independently public example data
- generate screenshots and statistics from the public bundle

## Completion rule

The work is complete only when:

- all deterministic audits pass
- every open review item is either resolved or explicitly accepted
- realistic desktop and mobile journeys are documented
- the public build contains no private data
- the learner can identify the next node, the complete resource, the acceptance artifact, and the frontier context without additional explanation
