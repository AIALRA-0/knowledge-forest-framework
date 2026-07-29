const DEFAULT_CORRECTIONS = Object.freeze([
  {
    id: "vertical-tree",
    statement: "Render every domain from top to bottom",
    regressionCheck: "Every published forest declares layoutDirection as top-to-bottom",
    source: "framework",
  },
  {
    id: "domain-separation",
    statement: "Split the forest into explicit domains instead of attaching everything to one root",
    regressionCheck: "Every node belongs to one domain and the renderer exposes domain navigation",
    source: "framework",
  },
  {
    id: "whole-resources",
    statement: "Assign a complete course, book, article, standard, or documentation set",
    regressionCheck: "The audit rejects chapter, unit, page, or partial-resource assignments",
    source: "framework",
  },
  {
    id: "atomic-topics",
    statement: "Split compound topics into independently learnable nodes",
    regressionCheck: "Compound node titles enter the review queue",
    source: "framework",
  },
  {
    id: "frontier-context",
    statement: "Explain three current research frontiers for every node",
    regressionCheck: "The audit rejects nodes without exactly three traceable frontier positions",
    source: "framework",
  },
  {
    id: "experience-evidence",
    statement: "Judge releases through realistic user journeys as well as deterministic tests",
    regressionCheck: "Every release carries a user-journey review with observed friction and changes",
    source: "framework",
  },
]);

export function normalizeRequirement(input, overrides = {}) {
  const text = String(input ?? "").trim();
  const knownSkills = overrides.knownSkills ?? extractList(text, [
    /(?:already know|already learned|已学过|已经学过)[:：]?\s*([^;；\n]+)/iu,
  ]);
  const highRiskAreas = [];
  const riskMap = [
    ["health", /health|fitness|rehab|medical|健康|健身|康复|医疗/iu],
    ["finance", /finance|trading|investment|金融|交易|投资|炒股/iu],
    ["aviation", /aviation|pilot|aircraft|航空|飞行执照|飞机/iu],
    ["space", /rocket|spaceflight|航天|火箭/iu],
    ["security", /security|cyber|安全|渗透/iu],
  ];
  for (const [name, pattern] of riskMap) if (pattern.test(text)) highRiskAreas.push(name);

  return {
    schemaVersion: "1.0.0",
    goal: text,
    knownSkills,
    desiredDepth: overrides.desiredDepth ?? "research",
    weeklyHours: overrides.weeklyHours ?? 12,
    language: overrides.language ?? detectLanguage(text),
    access: overrides.access ?? ["free"],
    excludedFormats: overrides.excludedFormats ?? ["video archives over 2 GB", "chapter fragments"],
    highRiskAreas,
    preferences: {
      layoutDirection: "top-to-bottom",
      wholeResourceOnly: true,
      splitCompoundTopics: true,
      frontierEvidencePerNode: 3,
      progressStorage: "local-first",
    },
    corrections: [...DEFAULT_CORRECTIONS, ...(overrides.corrections ?? [])],
  };
}

function extractList(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1]
        .split(/[,，、/]/u)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function detectLanguage(text) {
  return /[\u3400-\u9fff]/u.test(text) ? "zh-CN" : "en";
}

export { DEFAULT_CORRECTIONS };
