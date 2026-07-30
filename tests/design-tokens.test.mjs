import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

function finalToken(name) {
  const matches = [...css.matchAll(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`, "g"))];
  return matches.at(-1)?.[1];
}

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((channel) => {
    const value = Number.parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(left, right) {
  const values = [luminance(left), luminance(right)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("semantic text and graph colors retain visible contrast", () => {
  const surface = finalToken("surface");
  const canvas = finalToken("canvas");
  assert.ok(surface && canvas);

  for (const token of ["text", "muted", "faint", "primary", "complete", "available"]) {
    const color = finalToken(token);
    assert.ok(color, token);
    assert.ok(contrast(color, surface) >= 4.5, `${token} must reach 4.5:1`);
  }

  for (const token of ["line-strong", "graph-neutral", "graph-muted"]) {
    const color = finalToken(token);
    assert.ok(color, token);
    assert.ok(contrast(color, canvas) >= 3, `${token} must reach 3:1`);
  }
});
