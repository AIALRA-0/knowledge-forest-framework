export function nodeState(node, completed) {
  if (completed.has(node.id)) return "completed";
  return node.dependsOn.every((dependency) => completed.has(dependency))
    ? "available"
    : "locked";
}

export function nextAvailableNodes(bundle, completed) {
  return bundle.nodes.filter((node) => nodeState(node, completed) === "available");
}

export function completeNode(bundle, completed, nodeId) {
  const node = bundle.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) return { ok: false, completed, message: "Unknown node" };
  if (nodeState(node, completed) === "locked") {
    return { ok: false, completed, message: "Complete the prerequisite nodes first" };
  }
  const next = new Set(completed);
  next.add(nodeId);
  return { ok: true, completed: next };
}

export function seedKnownSkills(bundle, knownSkills) {
  const normalized = knownSkills.map((skill) => skill.toLocaleLowerCase());
  return new Set(
    bundle.nodes
      .filter((node) => normalized.some((skill) => (
        node.title.toLocaleLowerCase().includes(skill)
        || node.tags.some((tag) => tag.toLocaleLowerCase() === skill)
      )))
      .map((node) => node.id),
  );
}

export function progressEnvelope(bundle, completed) {
  return {
    format: "knowledge-forest-progress",
    version: 1,
    forestId: bundle.metadata.id,
    schemaVersion: bundle.schemaVersion,
    completed: bundle.nodes.filter((node) => completed.has(node.id)).map((node) => node.id),
    exportedAt: new Date().toISOString(),
  };
}
