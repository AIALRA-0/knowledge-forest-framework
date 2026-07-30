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
  assert.match(html, /One clear node at a time/);
  assert.match(html, /Describe the destination in your own words/);
  assert.match(html, /Technical interactive demo/i);
  assert.match(html, /Open RISC-V SoC Prototype/);
  assert.match(html, /data-layout-direction="top-to-bottom"/);
  assert.match(html, /data-layout-model="branched-dag"/);
  assert.match(html, /data-complete-preview="true"/);
  assert.match(html, /href="#complete-map"/);
  assert.match(html, /id="complete-map"/);
  assert.match(html, /Complete dependency map/);
  assert.match(html, /architecture, RTL verification, physical implementation, and software integration/);
  assert.match(html, /Swipe horizontally inside the complete map to compare all four branches/);
  assert.match(html, /data-branch-level="5"/);
  assert.match(html, /FPGA SoC prototype/);
  assert.match(html, /RISC-V Ratified Specifications Library/);
  assert.match(html, /What to learn from/);
  assert.match(html, /Where research is moving/);
  assert.match(html, /切换到中文/);
  assert.match(html, />12</);
  assert.match(html, />36</);
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
    assert.equal(bytes.readUInt32BE(16), 1440);
    assert.equal(bytes.readUInt32BE(20), 900);
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
    const expectedWidth = image === "actual-ai-mobile-zh.png" ? 390 : 1440;
    const expectedHeight = image === "actual-ai-mobile-zh.png" ? 1385 : 900;
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

  assert.match(pageSource, /className="edge-halo"/);
  assert.match(pageSource, /className=\{`edge-line \$\{edgeState\} \$\{touchesSelectedNode \? "active" : ""\}`\}/);
  assert.match(styles, /\.branch-edges path\.edge-halo\s*\{[\s\S]*?stroke-width:\s*9;/);
  assert.match(styles, /\.branch-edges path\.edge-line\s*\{[\s\S]*?stroke:\s*#66756d;[\s\S]*?stroke-width:\s*3;/);
  assert.match(styles, /\.branch-edges path\.edge-line\.available\s*\{[\s\S]*?stroke:\s*#3f684f;[\s\S]*?stroke-width:\s*3\.5;/);
  assert.match(styles, /\.branch-edges path\.edge-line\.completed\s*\{[\s\S]*?stroke:\s*#173e30;[\s\S]*?stroke-width:\s*4;/);
  assert.match(styles, /\.branch-edges path\.edge-line\.active\s*\{[\s\S]*?stroke:\s*#9a4f2f;[\s\S]*?stroke-width:\s*4\.5;/);
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
  assert.match(styles, /\.forest-workspace\s*\{[\s\S]{0,160}grid-template-columns:\s*220px minmax\(0,\s*1fr\);/);
  assert.match(styles, /\.branch-map\s*\{[\s\S]{0,180}grid-auto-rows:\s*minmax\(56px,\s*auto\);[\s\S]{0,80}row-gap:\s*10px;/);
  assert.match(styles, /\.branch-node\s*\{[\s\S]{0,160}min-height:\s*56px;/);
  assert.match(styles, /\.branch-node \.node-copy > span\s*\{\s*display:\s*none;/);
  assert.match(styles, /\.vertical-tree\s*\{[\s\S]{0,120}scroll-margin-top:\s*84px;/);
});
