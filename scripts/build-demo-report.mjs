#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { auditBrief, auditForest } from "../packages/core/src/audit.mjs";

const briefUrl = new URL("../examples/public-demo/brief.json", import.meta.url);
const forestUrl = new URL("../examples/public-demo/forest.generated.json", import.meta.url);
const reportUrl = new URL("../examples/public-demo/audit-report.json", import.meta.url);
const experienceUrl = new URL("../docs/user-journey-review.json", import.meta.url);
const [briefText, forestText, experienceText] = await Promise.all([
  readFile(briefUrl, "utf8"),
  readFile(forestUrl, "utf8"),
  readFile(experienceUrl, "utf8"),
]);
const brief = JSON.parse(briefText);
const forest = JSON.parse(forestText);
const experience = JSON.parse(experienceText);
const briefAudit = auditBrief(brief);
const forestAudit = auditForest(forest, { currentYear: 2026 });
const briefHash = createHash("sha256").update(briefText).digest("hex");

const report = {
  schemaVersion: "1.0.0",
  generatedAt: new Date().toISOString(),
  status: briefAudit.status === "pass"
    && forestAudit.status === "pass"
    && experience.status === "pass"
    ? "pass"
    : "fail",
  briefHash,
  rounds: [
    {
      id: "structure",
      status: forestAudit.status,
      errors: forestAudit.errors,
      warnings: forestAudit.warnings.filter((item) => item.code !== "frontier-freshness"),
    },
    {
      id: "evidence",
      status: forestAudit.warnings.some((item) => item.code === "frontier-freshness") ? "review" : "pass",
      warnings: forestAudit.warnings.filter((item) => item.code === "frontier-freshness"),
    },
    {
      id: "experience",
      status: experience.status,
      artifact: "docs/user-journey-review.md",
      journeys: experience.journeys.length,
      resolvedFindings: experience.findings.filter((item) => item.result === "resolved").length,
    },
  ],
  summary: forestAudit.summary,
};

await writeFile(reportUrl, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Demo audit ${report.status}; ${report.summary.nodes} nodes`);
if (report.status !== "pass") process.exitCode = 1;
