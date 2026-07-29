# User journey review

Status: passed after two observed product changes

Evaluation date: 2026-07-29

## Journeys completed

| Journey | Outcome |
|---|---|
| vague robotics goal with known Python experience | brief detected prior skill and preserved all correction rules |
| rehabilitation and fitness goal | health safety boundary detected |
| first node acceptance | progress advanced and the next exact node opened |
| locked publication node | all missing prerequisites were named |
| return after reload | progress and feedback persisted |
| unavailable primary resource | re-audit path recorded without silent substitution |
| mobile domain and node exploration | complete resource, artifact, and frontier path remained usable |

## Observed defect and fix

The first mobile run exposed a real layout failure that deterministic rendering did not reveal

The detail column retained a 630 pixel intrinsic width inside a 390 pixel viewport; its left and right edges were clipped

The mobile grid placement and width constraints were corrected; the repeated journey measured a 364 pixel detail column between pixel 13 and pixel 377 with no page overflow

## Observed recovery gap and fix

The first interface had no explicit response when a verified resource later became unavailable

The node detail now records a re-audit item, marks the learner as blocked, preserves it locally, and includes the affected node in progress export; it explicitly prevents silent resource substitution

Structured evidence is stored in `docs/user-journey-review.json`
