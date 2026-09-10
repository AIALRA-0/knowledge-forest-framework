import { nodeState } from "./progress.mjs";

const DAY_MS = 24 * 60 * 60 * 1000;

function localDayKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function summarizeProgress(bundle, completed) {
  const status = { completed: 0, available: 0, locked: 0 };
  const domains = bundle.domains.map((domain) => {
    const nodes = bundle.nodes.filter((node) => node.domainId === domain.id);
    const counts = { completed: 0, available: 0, locked: 0 };
    for (const node of nodes) {
      const state = nodeState(node, completed);
      counts[state] += 1;
      status[state] += 1;
    }
    return {
      id: domain.id,
      title: domain.title,
      color: domain.color,
      total: nodes.length,
      ...counts,
      completionRate: nodes.length ? Math.round((counts.completed / nodes.length) * 100) : 0,
    };
  });

  return {
    total: bundle.nodes.length,
    ...status,
    completionRate: bundle.nodes.length
      ? Math.round((status.completed / bundle.nodes.length) * 100)
      : 0,
    domains,
  };
}

export function summarizeActivity(events, now = new Date(), days = 14) {
  const valid = events
    .map((event) => ({ ...event, day: localDayKey(event.at) }))
    .filter((event) => event.day && typeof event.nodeId === "string")
    .sort((left, right) => Date.parse(right.at) - Date.parse(left.at));
  const countByDay = new Map();
  for (const event of valid) countByDay.set(event.day, (countByDay.get(event.day) ?? 0) + 1);

  const start = new Date(now);
  start.setHours(12, 0, 0, 0);
  const trend = Array.from({ length: days }, (_, index) => {
    const date = new Date(start.getTime() - (days - index - 1) * DAY_MS);
    const day = localDayKey(date);
    return { day, count: countByDay.get(day) ?? 0 };
  });

  return { total: valid.length, trend, recent: valid.slice(0, 5) };
}
