const FULL_RESOURCE_KINDS = new Set([
  "course",
  "book",
  "article",
  "documentation",
  "standard",
  "platform",
]);

const CHAPTER_PATTERNS = [
  /\bchapter\s+\d+/iu,
  /\bunit\s+\d+/iu,
  /第\s*[一二三四五六七八九十百\d]+\s*章/iu,
  /\bpages?\s+\d+/iu,
];

const COMPOUND_TITLE_PATTERNS = [
  /\s[&/]\s/u,
  /\b(?:and|or)\b/iu,
  /[、与及和]/u,
];

export function auditForest(bundle, options = {}) {
  const currentYear = options.currentYear ?? new Date().getUTCFullYear();
  const errors = [];
  const warnings = [];
  const nodeIds = new Set();
  const domainIds = new Set(bundle?.domains?.map((domain) => domain.id) ?? []);

  const fail = (code, message, nodeId) => errors.push({ code, message, nodeId });
  const warn = (code, message, nodeId) => warnings.push({ code, message, nodeId });

  if (!bundle || typeof bundle !== "object") {
    return {
      status: "fail",
      errors: [{ code: "bundle-missing", message: "ForestBundle is required" }],
      warnings,
      summary: { domains: 0, nodes: 0, frontierEvidence: 0 },
    };
  }

  if (bundle.completionContract?.layoutDirection !== "top-to-bottom") {
    fail("layout-direction", "The public contract requires a top-to-bottom tree");
  }
  if (bundle.completionContract?.wholeResourceOnly !== true) {
    fail("resource-contract", "The public contract requires whole learning resources");
  }

  for (const node of bundle.nodes ?? []) {
    if (nodeIds.has(node.id)) fail("duplicate-node", `Duplicate node id ${node.id}`, node.id);
    nodeIds.add(node.id);

    if (!domainIds.has(node.domainId)) {
      fail("unknown-domain", `Node ${node.id} references an unknown domain`, node.id);
    }
    if (!node.title?.trim()) fail("title-missing", "Node title is required", node.id);
    if (COMPOUND_TITLE_PATTERNS.some((pattern) => pattern.test(node.title ?? ""))) {
      warn("compound-title", "Review whether this topic should be split into atomic nodes", node.id);
    }
    if (!FULL_RESOURCE_KINDS.has(node.resource?.kind)) {
      fail("resource-kind", "A supported whole-resource kind is required", node.id);
    }
    if (node.resource?.completeness !== "whole-resource") {
      fail("resource-fragment", "Resources must be assigned as complete works", node.id);
    }
    const resourceText = `${node.resource?.title ?? ""} ${node.resource?.url ?? ""}`;
    if (CHAPTER_PATTERNS.some((pattern) => pattern.test(resourceText))) {
      fail("chapter-fragment", "Chapter, unit, or page fragments are not accepted", node.id);
    }
    try {
      const url = new URL(node.resource?.url);
      if (!["https:", "http:"].includes(url.protocol)) throw new Error("unsupported protocol");
    } catch {
      fail("resource-url", "The primary resource URL must be an absolute web URL", node.id);
    }
    if (!node.acceptance?.title || !node.acceptance?.description) {
      fail("acceptance-missing", "Every node requires an acceptance artifact", node.id);
    }
    if (!Array.isArray(node.acceptance?.criteria) || node.acceptance.criteria.length < 2) {
      fail("acceptance-criteria", "Acceptance requires at least two concrete criteria", node.id);
    }
    if (!Array.isArray(node.frontiers) || node.frontiers.length !== 3) {
      fail("frontier-count", "Every node requires exactly three frontier positions", node.id);
    }
    for (const frontier of node.frontiers ?? []) {
      const year = Number.parseInt(frontier.evidence?.publishedAt?.slice(0, 4), 10);
      if (!Number.isFinite(year) || year < currentYear - 3) {
        warn("frontier-freshness", "Frontier evidence is older than the rolling three-year window", node.id);
      }
      if (!frontier.evidence?.url) {
        fail("frontier-url", "Frontier evidence requires a traceable URL", node.id);
      }
    }
  }

  for (const node of bundle.nodes ?? []) {
    for (const dependency of node.dependsOn ?? []) {
      if (!nodeIds.has(dependency)) {
        fail("unknown-dependency", `Node ${node.id} depends on missing node ${dependency}`, node.id);
      }
      if (dependency === node.id) {
        fail("self-dependency", `Node ${node.id} cannot depend on itself`, node.id);
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();
  const byId = new Map((bundle.nodes ?? []).map((node) => [node.id, node]));
  function visit(nodeId) {
    if (visiting.has(nodeId)) {
      fail("dependency-cycle", `Dependency cycle detected at ${nodeId}`, nodeId);
      return;
    }
    if (visited.has(nodeId)) return;
    visiting.add(nodeId);
    for (const dependency of byId.get(nodeId)?.dependsOn ?? []) visit(dependency);
    visiting.delete(nodeId);
    visited.add(nodeId);
  }
  for (const nodeId of nodeIds) visit(nodeId);

  const expected = bundle.completionContract ?? {};
  if ((bundle.domains?.length ?? 0) !== expected.expectedDomains) {
    fail("domain-count", "Domain count does not match the completion contract");
  }
  if ((bundle.nodes?.length ?? 0) !== expected.expectedNodes) {
    fail("node-count", "Node count does not match the completion contract");
  }

  const frontierEvidence = (bundle.nodes ?? []).reduce(
    (total, node) => total + (node.frontiers?.length ?? 0),
    0,
  );

  return {
    status: errors.length === 0 ? "pass" : "fail",
    errors,
    warnings,
    summary: {
      domains: bundle.domains?.length ?? 0,
      nodes: bundle.nodes?.length ?? 0,
      frontierEvidence,
      acceptanceArtifacts: (bundle.nodes ?? []).filter((node) => node.acceptance).length,
    },
  };
}

export function auditBrief(brief) {
  const errors = [];
  const correctionIds = new Set();
  if (!brief?.goal?.trim()) errors.push({ code: "goal-missing", message: "A learning goal is required" });
  if (brief?.preferences?.layoutDirection !== "top-to-bottom") {
    errors.push({ code: "brief-layout", message: "The brief must preserve the top-to-bottom layout correction" });
  }
  if (brief?.preferences?.wholeResourceOnly !== true) {
    errors.push({ code: "brief-resource", message: "The brief must preserve the whole-resource correction" });
  }
  if (brief?.preferences?.frontierEvidencePerNode !== 3) {
    errors.push({ code: "brief-frontier", message: "The brief must require three frontier positions per node" });
  }
  for (const correction of brief?.corrections ?? []) {
    if (correctionIds.has(correction.id)) {
      errors.push({ code: "duplicate-correction", message: `Duplicate correction id ${correction.id}` });
    }
    correctionIds.add(correction.id);
    if (!correction.regressionCheck?.trim()) {
      errors.push({ code: "correction-without-check", message: `Correction ${correction.id} needs a regression check` });
    }
  }
  return { status: errors.length === 0 ? "pass" : "fail", errors };
}
