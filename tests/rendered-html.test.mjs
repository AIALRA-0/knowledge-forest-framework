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
  assert.match(html, /Path navigator/);
  assert.match(html, /Current prerequisites and immediate next choices/);
  assert.match(html, /Domains/);
  assert.match(html, /One complete primary resource/);
  assert.match(html, /Acceptance artifact/);
  assert.match(html, /Current research directions/);
  assert.match(html, /data-layout-direction="top-to-bottom"/);
  assert.match(html, /data-layout-model="branched-dag"/);
  assert.match(html, /data-complete-preview="true"/);
  assert.match(html, /data-theme="light"/);
  assert.match(html, /id="complete-map"/);
  assert.match(html, /RISC-V Ratified Specifications Library/);
  assert.match(html, /data-testid="recommended-next"/);
  assert.match(html, /data-testid="learning-stats-toggle"/);
  assert.match(html, /data-testid="theme-toggle"/);
  assert.match(html, /切换到中文/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("theme and learning statistics remain part of the public framework contract", async () => {
  const [pageSource, styles, ledgerSource, packageText] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../packages/core/src/ledger.mjs", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageText);

  assert.match(pageSource, /data-theme=\{theme\}/);
  assert.match(pageSource, /knowledge-forest-framework-theme-v1/);
  assert.match(pageSource, /data-testid="learning-stats-panel"/);
  assert.match(pageSource, /data-testid="progress-distribution"/);
  assert.match(pageSource, /data-testid="domain-progress"/);
  assert.match(pageSource, /data-testid="activity-trend"/);
  assert.match(styles, /\.app-shell\[data-theme="dark"\]\s*\{[\s\S]*?--page:\s*#000000;/);
  assert.match(styles, /\.app-shell\[data-theme="dark"\]\s*\{[\s\S]*?--canvas:\s*#000000;/);
  assert.match(styles, /\.ledger-distribution/);
  assert.match(styles, /\.ledger-trend/);
  assert.match(ledgerSource, /summarizeProgress/);
  assert.match(ledgerSource, /summarizeActivity/);
  assert.equal(packageJson.scripts.build, "node scripts/run-vinext.mjs build");
});

test("readmes route readers to the synthetic public framework", async () => {
  const [english, chinese, galleryText] = await Promise.all([
    readFile(new URL("../README.en.md", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/images/gallery.json", import.meta.url), "utf8"),
  ]);
  const gallery = JSON.parse(galleryText);
  const galleryFields = new Set(gallery.captures.map((capture) => capture.field));
  const galleryViews = new Set(gallery.captures.map((capture) => capture.view));

  for (const readme of [english, chinese]) {
    assert.match(readme, /https:\/\/aialra-0\.github\.io\/knowledge-forest-framework\//);
    assert.match(readme, /public\/og\.png/);
    assert.match(readme, /public\/readme-stats\.svg/);
    assert.match(readme, /4 (?:个领域|domains)/i);
    assert.match(readme, /12 (?:个节点|nodes)/i);
    assert.match(readme, /12 (?:项资源|resources)/i);
    assert.match(readme, /36 (?:个研究前沿|research frontiers)/i);
    assert.doesNotMatch(readme, /forest\.aialra|Authentik|private progress|生产配置[^\n]*[:=]/i);
  }
  assert.match(chinese, /中性纯黑夜间主题/);
  assert.match(english, /neutral pure-black night theme/);
  assert.doesNotMatch(chinese, /[；。][ \t]*$/m);
  assert.deepEqual(galleryFields, new Set([
    "framework",
    "semiconductor",
    "embodied-robotics",
    "aviation",
    "artificial-intelligence",
  ]));
  assert.deepEqual(galleryViews, new Set([
    "focus",
    "atlas",
    "request-builder",
    "research-evidence",
    "branched-focus",
    "platforms",
    "frontiers",
    "frontiers-mobile",
  ]));
  assert.equal(gallery.captures.length, 9);
  assert.doesNotMatch(galleryText, /forest\.aialra|Authentik|1028|376|private progress/i);
});

test("dependency lines remain visible and distinguishable", async () => {
  const [pageSource, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(pageSource, /const emphasis = classifyEdge\(/);
  assert.match(pageSource, /sourceHandle: `source-\$\{node\.id\}`/);
  assert.match(pageSource, /targetHandle: `target-\$\{dependency\}`/);
  assert.match(pageSource, /className: `tree-edge edge-\$\{emphasis\}`/);
  assert.match(pageSource, /type: MarkerType\.ArrowClosed/);
  assert.match(pageSource, /getSmoothStepPath\(\{/);
  assert.match(pageSource, /interactionWidth=\{16\}/);
  assert.match(styles, /\.react-flow__edge-path\s*\{[\s\S]*?vector-effect:\s*non-scaling-stroke;/);
  assert.match(styles, /\.react-flow__edge\.edge-muted \.react-flow__edge-path\s*\{[\s\S]*?stroke:\s*var\(--graph-muted\);[\s\S]*?stroke-width:\s*1\.75;/);
  assert.match(styles, /\.react-flow__edge\.edge-context \.react-flow__edge-path\s*\{[\s\S]*?stroke:\s*var\(--graph-neutral\);[\s\S]*?stroke-width:\s*2;/);
  assert.match(styles, /\.react-flow__edge\.edge-next-ready \.react-flow__edge-path\s*\{[\s\S]*?stroke:\s*var\(--available\);[\s\S]*?stroke-width:\s*2\.5;/);
  assert.match(styles, /\.react-flow__edge\.edge-selected-path \.react-flow__edge-path\s*\{[\s\S]*?stroke:\s*var\(--primary\);[\s\S]*?stroke-width:\s*3;/);
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
  assert.match(pageSource, /padding: viewMode === "focus" \? 0\.2 : 0\.12/);
  assert.match(pageSource, /maxZoom: viewMode === "focus" \? 0\.92 : 0\.7/);
  assert.match(styles, /\.workspace\s*\{[\s\S]{0,180}grid-template-columns:\s*240px minmax\(0,\s*1fr\) 420px;/);
  assert.match(styles, /\.skill-node\s*\{[\s\S]{0,360}border-left:\s*3px solid var\(--realm\);/);
  assert.match(styles, /\.skill-node\.is-selected\s*\{[\s\S]{0,180}outline:\s*3px solid var\(--primary\);/);
  assert.match(styles, /\.detail-panel\s*\{[\s\S]{0,220}border-left:\s*1px solid var\(--line\);/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*?\.mobile-path-list\s*\{[\s\S]*?display:\s*grid;/);
});
