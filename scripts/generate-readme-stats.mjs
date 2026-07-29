#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const forest = JSON.parse(await readFile(
  new URL("../examples/public-demo/forest.generated.json", import.meta.url),
  "utf8",
));
const domains = forest.domains.length;
const nodes = forest.nodes.length;
const frontiers = forest.nodes.reduce((total, node) => total + node.frontiers.length, 0);
const resources = new Set(forest.nodes.map((node) => node.resource.url)).size;

const items = [
  ["DOMAINS", domains],
  ["NODES", nodes],
  ["FRONTIERS", frontiers],
  ["RESOURCES", resources],
  ["AUDIT ROUNDS", 3],
];
const cards = items.map(([label, value], index) => `
  <g transform="translate(${22 + index * 190} 50)">
    <rect width="174" height="82" rx="12" fill="#fbfaf7" stroke="#d7d9d2"/>
    <text x="16" y="36" font-family="Inter,system-ui,sans-serif" font-size="25" font-weight="700" fill="#17211c">${value}</text>
    <text x="16" y="61" font-family="ui-monospace,monospace" font-size="10" fill="#657067" letter-spacing="1">${label}</text>
  </g>`).join("").trim();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="980" height="154" viewBox="0 0 980 154" role="img" aria-labelledby="title">
  <title id="title">Knowledge Forest public demo statistics</title>
  <rect width="980" height="154" rx="18" fill="#f4f2ec"/>
  <text x="22" y="27" font-family="ui-monospace,monospace" font-size="10" fill="#254b3c" letter-spacing="1.4">PUBLIC DEMO · GENERATED FROM FORESTBUNDLE</text>
  ${cards}
</svg>
`;
await writeFile(new URL("../public/readme-stats.svg", import.meta.url), svg);
console.log(`Generated public/readme-stats.svg`);
