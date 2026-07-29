#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { normalizeRequirement } from "../../agent/src/normalize.mjs";
import { auditBrief, auditForest } from "../../core/src/audit.mjs";

const packageRoot = fileURLToPath(new URL("../../../", import.meta.url));
const [command = "help", ...args] = process.argv.slice(2);

async function readJson(file) {
  return JSON.parse(await readFile(path.resolve(file), "utf8"));
}

async function initProject(target = "my-knowledge-forest") {
  const resolved = path.resolve(target);
  await mkdir(path.join(resolved, "inputs"), { recursive: true });
  await mkdir(path.join(resolved, "outputs"), { recursive: true });
  const template = await readFile(
    path.join(packageRoot, "templates", "default", "brief.example.json"),
    "utf8",
  );
  await writeFile(path.join(resolved, "inputs", "brief.json"), template);
  await writeFile(
    path.join(resolved, "README.md"),
    "# My Knowledge Forest\n\nEdit `inputs/brief.json`; ask your agent to follow `skills/knowledge-forest/SKILL.md`; audit the resulting bundle before publishing\n",
  );
  console.log(`Initialized ${resolved}`);
}

async function buildBrief(text) {
  const brief = normalizeRequirement(text);
  console.log(JSON.stringify(brief, null, 2));
}

async function audit(file = "forest.generated.json") {
  const bundle = await readJson(file);
  const report = auditForest(bundle);
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

async function auditInput(file = "brief.json") {
  const brief = await readJson(file);
  const report = auditBrief(brief);
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

async function stats(file = "forest.generated.json") {
  const bundle = await readJson(file);
  const report = auditForest(bundle);
  console.log(JSON.stringify({
    forest: bundle.metadata?.title,
    status: report.status,
    ...report.summary,
  }, null, 2));
}

function help() {
  console.log(`Knowledge Forest Framework

Usage:
  knowledge-forest init [directory]
  knowledge-forest brief <plain-language requirement>
  knowledge-forest audit [forest.generated.json]
  knowledge-forest audit-brief [brief.json]
  knowledge-forest stats [forest.generated.json]

The CLI prepares and validates deterministic artifacts; the agent skill performs
taxonomy research, resource verification, frontier research, and adversarial review`);
}

switch (command) {
  case "init":
    await initProject(args[0]);
    break;
  case "brief":
    await buildBrief(args.join(" "));
    break;
  case "audit":
    await audit(args[0]);
    break;
  case "audit-brief":
    await auditInput(args[0]);
    break;
  case "stats":
    await stats(args[0]);
    break;
  default:
    help();
}
