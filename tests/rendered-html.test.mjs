import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the product shell and interactive demo", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Knowledge Forest Framework<\/title>/i);
  assert.match(html, /Open RISC-V SoC Prototype/);
  assert.match(html, /Knowledge Forest Framework/);
  assert.match(html, /Build request/);
  assert.match(html, /Engineering branches/);
  assert.match(html, /One complete primary resource/);
  assert.match(html, /Acceptance artifact/);
  assert.match(html, /Current research directions/);
  assert.match(html, /data-layout-direction="top-to-bottom"/);
  assert.match(html, /data-layout-model="branched-dag"/);
  assert.match(html, /data-complete-preview="true"/);
  assert.match(html, /id="complete-map"/);
  assert.match(html, /RISC-V Ratified Specifications Library/);
  assert.match(html, /data-testid="recommended-next"/);
  assert.match(html, /切换到中文/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("readmes keep demo languages and production screenshots separate", async () => {
  const [english, chinese, galleryText] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../README.zh-CN.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/images/gallery.json", import.meta.url), "utf8"),
  ]);
  const gallery = JSON.parse(galleryText);
  const englishProductionImages = [
    "actual-semiconductor-node-en.png",
    "actual-robotics-map-en.png",
    "actual-aviation-sources-en.png",
    "actual-ai-frontiers-en.png",
  ];
  const chineseProductionImages = [
    "actual-semiconductor-node-zh.png",
    "actual-robotics-map-zh.png",
    "actual-aviation-sources-zh.png",
    "actual-ai-frontiers-zh.png",
    "actual-ai-mobile-zh.png",
  ];
  const chineseProductSection = chinese.match(/## 产品界面([\s\S]*?)\n## /)?.[1] ?? "";
  const englishProductSection = english.match(/## Product interface([\s\S]*?)\n## /)?.[1] ?? "";
  const galleryFiles = new Set(gallery.captures.map((capture) => capture.file));
  const galleryFields = new Set(gallery.captures.map((capture) => capture.field));
  const galleryViews = new Set(gallery.captures.map((capture) => capture.view));

  assert.match(english, /knowledge-forest-framework\/\?lang=en/);
  assert.match(english, /knowledge-forest-framework\/\?lang=zh-CN/);
  assert.ok(englishProductSection.length > 500);
  for (const image of englishProductionImages) {
    assert.ok(galleryFiles.has(image));
    assert.match(english, new RegExp(image.replaceAll(".", "\\.")));
    const bytes = await readFile(new URL(`../docs/images/${image}`, import.meta.url));
    assert.ok(bytes.byteLength > 50_000, `${image} must contain a real production screenshot`);
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), 1280);
    assert.equal(bytes.readUInt32BE(20), 720);
  }
  assert.doesNotMatch(englishProductSection, /Authentik|private deployment|private forest|learner(?:'s)? actual data/i);
  assert.doesNotMatch(englishProductSection, /actual-[^"\n]*-zh\.png/);
  assert.match(englishProductSection, /AMD Versal Adaptive SoC Technical Reference Manual/);
  assert.match(englishProductSection, /MIT 16\.333 Aircraft Stability and Control/);
  assert.match(englishProductSection, /World Models/);
  assert.match(englishProductSection, /<p align="center">[\s\S]*actual-semiconductor-node-en\.png/);

  assert.match(chinese, /knowledge-forest-framework\/\?lang=zh-CN/);
  assert.match(chinese, /knowledge-forest-framework\/\?lang=en/);
  assert.ok(chineseProductSection.length > 500);
  for (const image of chineseProductionImages) {
    assert.ok(galleryFiles.has(image));
    assert.match(chinese, new RegExp(image.replaceAll(".", "\\.")));
    const bytes = await readFile(new URL(`../docs/images/${image}`, import.meta.url));
    assert.ok(bytes.byteLength > 50_000, `${image} must contain a real production screenshot`);
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    const expectedWidth = image === "actual-ai-mobile-zh.png" ? 390 : 1280;
    const expectedHeight = image === "actual-ai-mobile-zh.png" ? 1385 : 720;
    assert.equal(bytes.readUInt32BE(16), expectedWidth);
    assert.equal(bytes.readUInt32BE(20), expectedHeight);
  }
  assert.doesNotMatch(chineseProductSection, /Authentik|认证网关|私有部署|私有森林|使用者实际数据/);
  assert.doesNotMatch(chineseProductSection, /actual-[^"\n]*-en\.png/);
  assert.doesNotMatch(chineseProductSection, /[；。][ \t]*$/m);
  assert.match(chineseProductSection, /AMD Versal Adaptive SoC Technical Reference Manual/);
  assert.match(chineseProductSection, /MIT 16\.333 Aircraft Stability and Control/);
  assert.match(chineseProductSection, /World Models/);
  assert.match(chineseProductSection, /<p align="center">[\s\S]*actual-ai-mobile-zh\.png/);
  assert.deepEqual(
    galleryFields,
    new Set(["semiconductor", "embodied-robotics", "aviation", "artificial-intelligence"]),
  );
  assert.deepEqual(
    galleryViews,
    new Set(["node", "directory", "platforms", "frontiers", "frontiers-mobile"]),
  );
  assert.equal(gallery.captures.length, 9);
  assert.doesNotMatch(galleryText, /forest\.aialra|Authentik|1028|376|private progress/i);
});

test("dependency lines remain visible and distinguishable", async () => {
  const [pageSource, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(pageSource, /className: `tree-edge edge-\$\{state\}\$\{dependency === selectedId \|\| node\.id === selectedId \? " edge-selected" : ""\}`/);
  assert.match(pageSource, /markerEnd: \{ type: MarkerType\.ArrowClosed \}/);
  assert.match(styles, /\.react-flow__edge-path\s*\{[\s\S]*?vector-effect:\s*non-scaling-stroke;/);
  assert.match(styles, /\.react-flow__edge\.edge-locked \.react-flow__edge-path\s*\{[\s\S]*?stroke:\s*#777f79;[\s\S]*?stroke-width:\s*1\.75;/);
  assert.match(styles, /\.react-flow__edge\.edge-available \.react-flow__edge-path\s*\{[\s\S]*?stroke:\s*#2f6a4c;[\s\S]*?stroke-width:\s*2\.4;/);
  assert.match(styles, /\.react-flow__edge\.edge-completed \.react-flow__edge-path\s*\{[\s\S]*?stroke:\s*#164e38;[\s\S]*?stroke-width:\s*2\.6;/);
  assert.match(styles, /\.react-flow__edge\.edge-selected \.react-flow__edge-path\s*\{[\s\S]*?stroke:\s*#9a4f2f;[\s\S]*?stroke-width:\s*3\.4;/);
});

test("desktop case preview shows the complete technical tree", async () => {
  const [forestText, chineseForestText, styles] = await Promise.all([
    readFile(new URL("../examples/public-demo/forest.generated.json", import.meta.url), "utf8"),
    readFile(new URL("../examples/public-demo/forest.zh-CN.generated.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  const englishForest = JSON.parse(forestText);
  const chineseForest = JSON.parse(chineseForestText);

  assert.equal(englishForest.metadata.id, "open-riscv-soc-prototype");
  assert.equal(chineseForest.metadata.id, englishForest.metadata.id);
  assert.equal(englishForest.nodes.length, 12);
  assert.equal(chineseForest.nodes.length, 12);
  assert.deepEqual(
    englishForest.domains.map((domain) => domain.id),
    ["architecture", "rtl-verification", "physical-design", "software-integration"],
  );
  assert.ok(englishForest.nodes.some((node) => node.id === "integration-fpga" && node.dependsOn.length === 3));
  const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(pageSource, /const NODE_WIDTH = 226;/);
  assert.match(pageSource, /const NODE_HEIGHT = 88;/);
  assert.match(pageSource, /rankdir: "TB"/);
  assert.match(pageSource, /instance\.fitView\(\{[\s\S]*?padding: 0\.12,[\s\S]*?maxZoom: 0\.76,/);
  assert.match(styles, /\.workspace\s*\{[\s\S]{0,140}grid-template-columns:\s*minmax\(0,\s*1fr\) 410px;/);
  assert.match(styles, /\.skill-node\s*\{[\s\S]{0,220}border-left:\s*3px solid var\(--realm\);/);
  assert.match(styles, /\.detail-panel\s*\{[\s\S]{0,220}border-left:\s*1px solid var\(--line\);/);
});
