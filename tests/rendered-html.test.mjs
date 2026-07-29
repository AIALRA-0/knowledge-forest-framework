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
  const [english, chinese] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../README.zh-CN.md", import.meta.url), "utf8"),
  ]);
  const englishProductionImages = [
    "product-learning-path-en.png",
    "product-source-guide-en.png",
    "product-research-review-en.png",
  ];
  const chineseProductionImages = [
    "product-learning-path-zh.png",
    "product-source-guide-zh.png",
    "product-research-review-zh.png",
    "product-mobile-complete-zh.png",
  ];
  const chineseProductSection = chinese.match(/## 产品界面([\s\S]*?)\n## /)?.[1] ?? "";
  const englishProductSection = english.match(/## Product interface([\s\S]*?)\n## /)?.[1] ?? "";

  assert.match(english, /knowledge-forest-framework\/\?lang=en/);
  assert.match(english, /knowledge-forest-framework\/\?lang=zh-CN/);
  assert.ok(englishProductSection.length > 500);
  for (const image of englishProductionImages) {
    assert.match(english, new RegExp(image.replaceAll(".", "\\.")));
    const bytes = await readFile(new URL(`../docs/images/${image}`, import.meta.url));
    assert.ok(bytes.byteLength > 50_000, `${image} must contain a real production screenshot`);
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  }
  assert.doesNotMatch(englishProductSection, /Authentik|private deployment|private forest|learner(?:'s)? actual data/i);
  assert.doesNotMatch(englishProductSection, /product-[^"\n]*-zh\.png/);
  assert.match(englishProductSection, /<p align="center">[\s\S]*product-learning-path-en\.png/);

  assert.match(chinese, /knowledge-forest-framework\/\?lang=zh-CN/);
  assert.match(chinese, /knowledge-forest-framework\/\?lang=en/);
  assert.ok(chineseProductSection.length > 500);
  for (const image of chineseProductionImages) {
    assert.match(chinese, new RegExp(image.replaceAll(".", "\\.")));
    const bytes = await readFile(new URL(`../docs/images/${image}`, import.meta.url));
    assert.ok(bytes.byteLength > 50_000, `${image} must contain a real production screenshot`);
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  }
  assert.doesNotMatch(chineseProductSection, /Authentik|认证网关|私有部署|私有森林|使用者实际数据/);
  assert.doesNotMatch(chineseProductSection, /product-[^"\n]*-en\.png/);
  assert.doesNotMatch(chineseProductSection, /[；。][ \t]*$/m);
  assert.match(chineseProductSection, /<p align="center">[\s\S]*product-mobile-complete-zh\.png/);
});
