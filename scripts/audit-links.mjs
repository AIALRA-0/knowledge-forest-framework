#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";

const forest = JSON.parse(await readFile(
  new URL("../examples/public-demo/forest.generated.json", import.meta.url),
  "utf8",
));
const outputArg = process.argv.find((argument) => argument.startsWith("--output="));
const output = outputArg ? outputArg.slice("--output=".length) : null;
const urlMap = new Map();

for (const node of forest.nodes) {
  urlMap.set(node.resource.url, { kind: "resource", nodeId: node.id, title: node.resource.title });
  for (const frontier of node.frontiers) {
    urlMap.set(frontier.evidence.url, {
      kind: "frontier",
      nodeId: node.id,
      title: frontier.evidence.title,
    });
  }
}

async function check(url, context) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "knowledge-forest-framework-link-audit/0.1",
        "accept": "text/html,application/pdf;q=0.8,*/*;q=0.5",
        "range": "bytes=0-2047",
      },
    });
    const status = response.status;
    const result = status >= 200 && status < 400
      ? "pass"
      : [401, 403, 429].includes(status)
        ? "restricted"
        : "fail";
    return {
      url,
      ...context,
      result,
      status,
      finalUrl: response.url,
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      url,
      ...context,
      result: "network-error",
      status: null,
      error: error instanceof Error ? error.name : "UnknownError",
      checkedAt: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timer);
  }
}

const entries = [...urlMap.entries()];
const results = [];
for (let index = 0; index < entries.length; index += 4) {
  results.push(...await Promise.all(
    entries.slice(index, index + 4).map(([url, context]) => check(url, context)),
  ));
}

const hardFailures = results.filter((item) => item.result === "fail");
const report = {
  schemaVersion: "1.0.0",
  generatedAt: new Date().toISOString(),
  status: hardFailures.length ? "fail" : "pass",
  summary: {
    total: results.length,
    pass: results.filter((item) => item.result === "pass").length,
    restricted: results.filter((item) => item.result === "restricted").length,
    networkError: results.filter((item) => item.result === "network-error").length,
    fail: hardFailures.length,
  },
  results,
};

if (output) await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, summary: report.summary }, null, 2));
process.exit(hardFailures.length ? 1 : 0);
