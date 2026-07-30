import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGraphContext,
  classifyEdge,
  graphDepths,
  topologySignature,
} from "../packages/ui/src/graph-model.mjs";

const records = [
  { id: "root", deps: [] },
  { id: "left", deps: ["root"] },
  { id: "right", deps: ["root"] },
  { id: "merge", deps: ["left", "right"] },
  { id: "leaf", deps: ["merge"] },
];

test("focus contains the complete prerequisite path and immediate branches", () => {
  const context = buildGraphContext(records, "merge", new Set(["root", "left", "right", "merge"]));

  assert.deepEqual([...context.ancestors].sort(), ["left", "right", "root"]);
  assert.deepEqual([...context.immediateChildren], ["leaf"]);
  assert.ok(context.focusNodes.has("leaf"));
  assert.equal(classifyEdge("left", "merge", context), "selected-path");
  assert.equal(classifyEdge("right", "merge", context), "selected-path");
  assert.equal(classifyEdge("merge", "leaf", context), "next-ready");
  assert.notEqual(classifyEdge("root", "right", context), "next-ready");
});

test("ready-next requires every prerequisite and never highlights a locked merge", () => {
  const context = buildGraphContext(records, "left", new Set(["root", "left"]));

  assert.equal(context.readyNext.has("merge"), false);
  assert.equal(classifyEdge("left", "merge", context), "context");
});

test("topology cache signature changes when dependencies change at equal node count", () => {
  const alternate = records.map((record) => (
    record.id === "merge" ? { ...record, deps: ["left"] } : record
  ));

  assert.notEqual(topologySignature(records), topologySignature(alternate));
});

test("depths remain deterministic across a fork and merge", () => {
  const depths = graphDepths(records);

  assert.equal(depths.get("root"), 0);
  assert.equal(depths.get("left"), 1);
  assert.equal(depths.get("right"), 1);
  assert.equal(depths.get("merge"), 2);
  assert.equal(depths.get("leaf"), 3);
});
