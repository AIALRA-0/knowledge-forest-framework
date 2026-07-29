export type ResourceKind =
  | "course"
  | "book"
  | "article"
  | "documentation"
  | "standard"
  | "platform";

export type AccessKind = "free" | "paid" | "institutional";

export type LearningResource = {
  title: string;
  url: string;
  kind: ResourceKind;
  publisher: string;
  access: AccessKind;
  completeness: "whole-resource";
  licenseNote?: string;
};

export type FrontierEvidence = {
  title: string;
  summary: string;
  evidence: {
    title: string;
    url: string;
    publishedAt: string;
    sourceType: "official" | "standard" | "paper" | "conference";
  };
};

export type AcceptanceArtifact = {
  title: string;
  description: string;
  criteria: string[];
};

export type ForestNode = {
  id: string;
  domainId: string;
  title: string;
  outcome: string;
  rationale: string;
  dependsOn: string[];
  estimatedHours: number;
  resource: LearningResource;
  acceptance: AcceptanceArtifact;
  frontiers: FrontierEvidence[];
  riskNote?: string;
  tags: string[];
};

export type ForestDomain = {
  id: string;
  title: string;
  description: string;
  color: string;
  order: number;
  safetyBoundary?: string;
};

export type ForestBridge = {
  from: string;
  to: string;
  reason: string;
};

export type ForestBundle = {
  schemaVersion: string;
  metadata: {
    id: string;
    title: string;
    description: string;
    language: string;
    generatedAt: string;
    reviewedAt: string;
    frameworkVersion: string;
  };
  domains: ForestDomain[];
  nodes: ForestNode[];
  bridges: ForestBridge[];
  provenance: {
    briefHash: string;
    sourceSnapshotAt: string;
    generator: string;
    sourcePolicy: string;
  };
  completionContract: {
    expectedDomains: number;
    expectedNodes: number;
    expectedFrontiersPerNode: number;
    wholeResourceOnly: true;
    layoutDirection: "top-to-bottom";
  };
};

export type CorrectionRule = {
  id: string;
  statement: string;
  regressionCheck: string;
  source: "user" | "framework";
};

export type LearnerBrief = {
  schemaVersion: string;
  goal: string;
  knownSkills: string[];
  desiredDepth: "overview" | "practitioner" | "research";
  weeklyHours: number;
  language: string;
  access: AccessKind[];
  excludedFormats: string[];
  highRiskAreas: string[];
  preferences: {
    layoutDirection: "top-to-bottom";
    wholeResourceOnly: true;
    splitCompoundTopics: true;
    frontierEvidencePerNode: 3;
    progressStorage: "local-first";
  };
  corrections: CorrectionRule[];
};
