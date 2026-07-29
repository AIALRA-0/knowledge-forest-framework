# Architecture

## Boundary

The public framework contains provider-neutral contracts, deterministic audits, a renderer, a CLI, agent instructions, and independently public fixtures

A private instance contains learner history, private trees, progress, restricted resources, research archives, credentials, identity, and production configuration

The dependency direction is public to private only

## Layers

1. `LearnerBrief`; goals, prior skills, constraints, risk, durable corrections
2. research manifests; taxonomy queries, resource candidates, evidence candidates
3. `ForestBundle`; domains, nodes, bridges, provenance, completion contract
4. audits; deterministic errors, warnings, review queue, experience evidence
5. renderer; vertical trees, node detail, progress, feedback, export

## Versioning

- framework uses semantic versioning
- schemas use semantic versioning independently
- private content has its own content version
- private production pins an exact framework release
- schema migrations are explicit and reversible during the supported window
