# Project landscape

Verified 2026-07-29 from the projects' own sites or repositories

Knowledge Forest does not claim that visual roadmaps, curated curricula, knowledge graphs, or agent-generated learning plans are new on their own; the framework combines proven ideas from each category under a stricter, testable artifact contract

## Closest public projects

| Project | What it already does well | What Knowledge Forest learns from it | Contract not established by the reviewed public material |
|---|---|---|---|
| [roadmap.sh](https://roadmap.sh/) | Large community-maintained role and skill roadmaps; interactive topics; guides; projects; knowledge questions | A path must be quickly scannable; topic navigation and community maintenance matter | Learner-specific correction memory; one verified whole resource and one acceptance artifact per atomic node; exactly three current frontier positions; evidence and experience audit bundles |
| [OSSU Computer Science](https://github.com/ossu/computer-science) | A coherent degree-scale curriculum; explicit course selection criteria; prerequisites; expected effort; a final project | Prefer complete, regularly available, high-quality courses; preserve prerequisites and a capstone outcome | Cross-domain generation from an arbitrary brief; generic schemas and CLI; per-node frontier evidence; interactive local-first feedback; automatic sanitization |
| [Teach Yourself Computer Science](https://teachyourselfcs.com/) | Opinionated subject selection; concise explanations of why each subject matters; a small set of strong books and lecture series | Fewer defensible resources are more useful than a giant link list; every node needs a reason to exist | Machine-readable prerequisite graph; learner state; acceptance criteria; provenance; rolling frontier maintenance; release gates |
| [SkillTree](https://www.skilltreeapp.com/) | Turns a topic into a visual roadmap; presents skill connections and progress | Progress should be visible and low-friction | Publicly documented evidence provenance; resource availability audit; high-risk boundaries; durable correction regressions; repository-native generation artifacts |
| [Understand Anything](https://github.com/Egonex-AI/Understand-Anything) | Agent-generated interactive knowledge graphs; code and document dependency exploration; multi-agent-compatible workflow | Agent output should remain explorable; ordering should follow dependencies; an artifact should work across agent clients | It maps an existing code or knowledge base rather than constructing a lifelong learning curriculum with resource, acceptance, frontier, and safety contracts |
| [Learn Anything](https://www.learnanything.io/welcome) | Topic exploration presented as a visual learning experience | A welcoming visual surface lowers the cost of entering an unfamiliar field | The reviewed public page does not expose a complete reproducible research, provenance, audit, and maintenance protocol |

## Adjacent evidence infrastructure

[OpenAlex](https://developers.openalex.org/api-reference/introduction) is not a curriculum competitor; it is a useful primary index for agent research because its API exposes works, authors, sources, institutions, topics, keywords, funders, and related scholarly entities

Knowledge Forest treats indexes such as OpenAlex as candidate discovery infrastructure; an index result is never sufficient evidence by itself; the generator still verifies the authoritative landing page, date, relevance, accessibility, and licensing before accepting a frontier source

## Resulting design position

The reusable gap is not another static roadmap; it is the contract between research and the roadmap:

1. normalize the learner's goal, known skills, constraints, risk boundaries, and accepted corrections
2. divide the field into explicit top-to-bottom domains
3. create atomic nodes with prerequisite edges
4. assign one complete primary learning resource and an observable acceptance artifact
5. attach exactly three current, traceable frontier positions
6. produce provenance, audit, and review-queue artifacts
7. evaluate realistic novice, practitioner, cross-domain, high-risk, return-visit, and mobile journeys
8. preserve every accepted correction as a regression rule

Based on the reviewed public descriptions, no project in the table states this complete contract; this is an inference from their documented scopes, not a claim that no private or unpublished system has comparable behavior

## Reassessment rule

This comparison is evidence, not branding copy; recheck every listed project before a major release; update adopted patterns and differentiation when another project adds equivalent capabilities; never weaken interoperability merely to preserve a uniqueness claim
