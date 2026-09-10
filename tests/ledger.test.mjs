import assert from "node:assert/strict";
import test from "node:test";
import { summarizeActivity, summarizeProgress } from "../packages/core/src/ledger.mjs";

const bundle = {
  domains: [
    { id: "one", title: "One", color: "#123456" },
    { id: "two", title: "Two", color: "#654321" },
  ],
  nodes: [
    { id: "root", domainId: "one", dependsOn: [] },
    { id: "child", domainId: "one", dependsOn: ["root"] },
    { id: "other", domainId: "two", dependsOn: [] },
  ],
};

test("progress summary separates completed, available, and locked nodes", () => {
  const summary = summarizeProgress(bundle, new Set(["root"]));
  assert.deepEqual(
    {
      total: summary.total,
      completed: summary.completed,
      available: summary.available,
      locked: summary.locked,
      completionRate: summary.completionRate,
    },
    { total: 3, completed: 1, available: 2, locked: 0, completionRate: 33 },
  );
  assert.deepEqual(
    summary.domains.map(({ id, completed, available, locked, completionRate }) => ({
      id,
      completed,
      available,
      locked,
      completionRate,
    })),
    [
      { id: "one", completed: 1, available: 1, locked: 0, completionRate: 50 },
      { id: "two", completed: 0, available: 1, locked: 0, completionRate: 0 },
    ],
  );
});

test("activity summary fills missing local days and ignores malformed records", () => {
  const summary = summarizeActivity([
    { id: "a", nodeId: "root", action: "completed", at: "2026-09-10T10:00:00.000Z" },
    { id: "b", nodeId: "child", action: "reopened", at: "2026-09-08T10:00:00.000Z" },
    { id: "bad", nodeId: "child", action: "completed", at: "not-a-date" },
  ], new Date("2026-09-10T12:00:00.000Z"), 3);
  assert.equal(summary.total, 2);
  assert.deepEqual(summary.trend.map(({ count }) => count), [1, 0, 1]);
  assert.deepEqual(summary.recent.map(({ id }) => id), ["a", "b"]);
});
