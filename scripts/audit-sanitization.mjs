#!/usr/bin/env node

import { lstat, readFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const ignored = new Set([
  ".git",
  ".next",
  ".vinext",
  ".wrangler",
  "dist",
  "node_modules",
  "outputs",
  "work",
]);
const textExtensions = new Set([
  ".css", ".html", ".js", ".json", ".md", ".mjs", ".mts", ".ts", ".tsx", ".txt", ".yaml", ".yml",
]);
const forbidden = [
  ["local-user-path", /\/Users\/[^/\s]+/u],
  ["private-host", /\b(?:forest|auth|codex)\.aialra\.online\b/iu],
  ["ipv4-address", /\b(?:\d{1,3}\.){3}\d{1,3}\b/u],
  ["email-address", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu],
  ["secret-assignment", /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"']{8,}/iu],
  ["private-course-record", /\bUSC\s+EE\s*\d{3}\b/iu],
];
const findings = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute);
    if (entry.isDirectory()) {
      await walk(absolute);
      continue;
    }
    const info = await lstat(absolute);
    if (info.size > 2 * 1024 * 1024) {
      findings.push({ code: "large-file", path: relative, detail: `${info.size} bytes` });
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name).toLocaleLowerCase())) continue;
    const text = await readFile(absolute, "utf8");
    for (const [code, pattern] of forbidden) {
      if (pattern.test(text)) findings.push({ code, path: relative });
    }
  }
}

await walk(root);
try {
  const metadata = execFileSync(
    "git",
    ["log", "--format=%H%n%an%n%ae%n%cn%n%ce%n%B"],
    { cwd: root, encoding: "utf8" },
  );
  if (/\.local\b|localhost\b|\/Users\/[^/\s]+/iu.test(metadata)) {
    findings.push({ code: "git-history-private-metadata", path: ".git" });
  }
} catch {
  // Source archives may not contain Git metadata; file scanning still applies
}
if (findings.length) {
  console.error(JSON.stringify({ status: "fail", findings }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ status: "pass", scannedRoot: ".", findings: [] }, null, 2));
}
