import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { auditBrief, auditForest } from "../packages/core/src/audit.mjs";
import { completeNode, nextAvailableNodes, nodeState } from "../packages/core/src/progress.mjs";

const bundle = JSON.parse(await readFile(
  new URL("../examples/public-demo/forest.generated.json", import.meta.url),
  "utf8",
));
const brief = JSON.parse(await readFile(
  new URL("../examples/public-demo/brief.json", import.meta.url),
  "utf8",
));

test("public demo passes the deterministic forest contract", () => {
  const report = auditForest(bundle, { currentYear: 2026 });
  assert.equal(report.status, "pass", JSON.stringify(report.errors));
  assert.equal(report.summary.domains, 4);
  assert.equal(report.summary.nodes, 12);
  assert.equal(report.summary.frontierEvidence, 36);
});

test("brief preserves every remembered correction", () => {
  const report = auditBrief(brief);
  assert.equal(report.status, "pass");
  assert.equal(brief.corrections.length, 15);
  assert.equal(new Set(brief.corrections.map((item) => item.id)).size, 15);
});

test("locked nodes explain prerequisites through the state model", () => {
  const completed = new Set();
  const publication = bundle.nodes.find((node) => node.id === "integration-fpga");
  assert.equal(nodeState(publication, completed), "locked");
  const attempt = completeNode(bundle, completed, publication.id);
  assert.equal(attempt.ok, false);
});

test("completing a root node unlocks the next exact node", () => {
  const completed = new Set();
  const result = completeNode(bundle, completed, "architecture-isa");
  assert.equal(result.ok, true);
  const next = nextAvailableNodes(bundle, result.completed).map((node) => node.id);
  assert.ok(next.includes("architecture-microarchitecture"));
  assert.ok(next.includes("software-toolchain"));
});

test("chapter fragments are rejected", () => {
  const invalid = structuredClone(bundle);
  invalid.nodes[0].resource.title = "Statistics Chapter 3";
  assert.equal(auditForest(invalid, { currentYear: 2026 }).status, "fail");
});

test("missing frontier evidence is rejected", () => {
  const invalid = structuredClone(bundle);
  invalid.nodes[0].frontiers.pop();
  assert.equal(auditForest(invalid, { currentYear: 2026 }).status, "fail");
});
