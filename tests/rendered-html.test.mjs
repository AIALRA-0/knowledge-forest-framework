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
  assert.match(html, /Interactive public demo/i);
  assert.match(html, /data-layout-direction="top-to-bottom"/);
  assert.match(html, /data-layout-model="branched-dag"/);
  assert.match(html, /Connected dependency tree/);
  assert.match(html, /Swipe horizontally inside the map to compare all four branches/);
  assert.match(html, /data-branch-level="5"/);
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
