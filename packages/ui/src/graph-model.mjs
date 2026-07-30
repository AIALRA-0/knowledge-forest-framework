export const GRAPH_VIEW_MODES = Object.freeze(["focus", "atlas"]);

function edgeKey(source, target) {
  return `${source}\u2192${target}`;
}

export function topologySignature(records, layoutVersion = "forest-layout-v2") {
  return [
    layoutVersion,
    ...records
      .map((record) => `${record.id}:${[...record.deps].sort().join(",")}`)
      .sort(),
  ].join("|");
}

export function buildGraphContext(records, selectedId, completedIds = new Set()) {
  const recordMap = new Map(records.map((record) => [record.id, record]));
  const children = new Map(records.map((record) => [record.id, []]));

  for (const record of records) {
    for (const dependency of record.deps) {
      if (children.has(dependency)) children.get(dependency).push(record.id);
    }
  }

  const ancestors = new Set();
  const ancestorQueue = [...(recordMap.get(selectedId)?.deps ?? [])];
  while (ancestorQueue.length) {
    const id = ancestorQueue.shift();
    if (!id || ancestors.has(id) || !recordMap.has(id)) continue;
    ancestors.add(id);
    ancestorQueue.push(...recordMap.get(id).deps);
  }

  const immediateChildren = new Set(children.get(selectedId) ?? []);
  const readyNext = new Set(
    [...immediateChildren].filter((id) => (
      recordMap.get(id)?.deps.every((dependency) => completedIds.has(dependency))
    )),
  );

  const focusNodes = new Set([selectedId, ...ancestors, ...immediateChildren]);
  for (const childId of immediateChildren) {
    for (const dependency of recordMap.get(childId)?.deps ?? []) {
      focusNodes.add(dependency);
    }
  }

  const selectedPathEdges = new Set();
  const selectedPathNodes = new Set([selectedId, ...ancestors]);
  for (const target of selectedPathNodes) {
    for (const source of recordMap.get(target)?.deps ?? []) {
      if (selectedPathNodes.has(source)) selectedPathEdges.add(edgeKey(source, target));
    }
  }

  const nextReadyEdges = new Set(
    [...readyNext].map((target) => edgeKey(selectedId, target)),
  );

  return {
    ancestors,
    children,
    focusNodes,
    immediateChildren,
    nextReadyEdges,
    readyNext,
    selectedPathEdges,
  };
}

export function classifyEdge(source, target, context, viewMode = "focus") {
  const key = edgeKey(source, target);
  if (context.selectedPathEdges.has(key)) return "selected-path";
  if (context.nextReadyEdges.has(key)) return "next-ready";
  if (context.focusNodes.has(source) && context.focusNodes.has(target)) return "context";
  return viewMode === "atlas" ? "muted" : "context";
}

export function graphDepths(records) {
  const recordMap = new Map(records.map((record) => [record.id, record]));
  const memo = new Map();
  const visiting = new Set();

  function depth(id) {
    if (memo.has(id)) return memo.get(id);
    if (visiting.has(id)) return 0;
    visiting.add(id);
    const dependencies = recordMap.get(id)?.deps ?? [];
    const value = dependencies.length
      ? 1 + Math.max(...dependencies.map((dependency) => depth(dependency)))
      : 0;
    visiting.delete(id);
    memo.set(id, value);
    return value;
  }

  for (const record of records) depth(record.id);
  return memo;
}

export function graphEdgeKey(source, target) {
  return edgeKey(source, target);
}
