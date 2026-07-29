#!/usr/bin/env node

import assert from "node:assert/strict";
import { normalizeRequirement } from "../packages/agent/src/normalize.mjs";
import { auditBrief } from "../packages/core/src/audit.mjs";

const cases = [
  {
    id: "prior-learning",
    input: "构建芯片设计技能树；我已经学过 Virtuoso、RISC-V CPU",
    check(brief) {
      assert.deepEqual(brief.knownSkills, ["Virtuoso", "RISC-V CPU"]);
    },
  },
  {
    id: "health-boundary",
    input: "规划腰肌劳损康复、增肌、减脂和耐力跑步",
    check(brief) {
      assert.ok(brief.highRiskAreas.includes("health"));
    },
  },
  {
    id: "finance-boundary",
    input: "Learn company analysis, value investing, market prediction, and automated trading",
    check(brief) {
      assert.ok(brief.highRiskAreas.includes("finance"));
    },
  },
  {
    id: "aerospace-boundary",
    input: "构建飞机、飞行执照、火箭与航天系统学习树",
    check(brief) {
      assert.ok(brief.highRiskAreas.includes("aviation"));
      assert.ok(brief.highRiskAreas.includes("space"));
    },
  },
  {
    id: "correction-memory",
    input: "Build a lifelong learning forest for embodied AI",
    check(brief) {
      const ids = new Set(brief.corrections.map((item) => item.id));
      for (const id of [
        "vertical-tree",
        "domain-separation",
        "whole-resources",
        "atomic-topics",
        "frontier-context",
        "experience-evidence",
      ]) assert.ok(ids.has(id));
    },
  },
  {
    id: "whole-resource-default",
    input: "Teach me music production",
    check(brief) {
      assert.equal(brief.preferences.wholeResourceOnly, true);
      assert.equal(brief.preferences.frontierEvidencePerNode, 3);
    },
  },
];

const results = [];
for (const scenario of cases) {
  const brief = normalizeRequirement(scenario.input);
  const audit = auditBrief(brief);
  assert.equal(audit.status, "pass");
  scenario.check(brief);
  results.push({ id: scenario.id, status: "pass" });
}
console.log(JSON.stringify({ status: "pass", cases: results }, null, 2));
