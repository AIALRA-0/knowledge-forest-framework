import assert from "node:assert/strict";
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

test("server-renders the product shell and public contract", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Knowledge Forest Framework<\/title>/i);
  assert.match(html, /One clear node at a time/);
  assert.match(html, /Turn a rough ambition into a durable contract/);
  assert.match(html, /Interactive public demo/i);
  assert.match(html, /data-layout-direction="top-to-bottom"/);
  assert.match(html, /Complete resource/);
  assert.match(html, /Current frontiers/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});
