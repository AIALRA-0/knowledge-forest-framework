"use client";

import { useEffect, useMemo, useState } from "react";
import demoForest from "@/examples/public-demo/forest.generated.json";
import type {
  ForestBundle,
  ForestDomain,
  ForestNode,
  LearnerBrief,
} from "@/packages/schema/src/types";
import { auditForest } from "@/packages/core/src/audit.mjs";
import {
  completeNode,
  nextAvailableNodes,
  nodeState,
  progressEnvelope,
} from "@/packages/core/src/progress.mjs";
import { normalizeRequirement } from "@/packages/agent/src/normalize.mjs";

const forest = demoForest as ForestBundle;
const audit = auditForest(forest, { currentYear: 2026 });
const PROGRESS_KEY = "knowledge-forest-framework-demo-progress-v1";
const FEEDBACK_KEY = "knowledge-forest-framework-demo-feedback-v1";
const RESOURCE_ISSUE_KEY = "knowledge-forest-framework-demo-resource-issues-v1";

const EXAMPLE_REQUIREMENTS = [
  "I want to learn accessible public data dashboards; I know basic JavaScript",
  "构建航空工程与飞行执照学习树；我已经学过空气动力学基础",
  "构建芯片制造、SoC、NoC、CPU、GPU 与先进封装的研究级技能森林",
  "规划腰肌劳损康复、增肌、跑步耐力与科学工作；明确医疗边界",
];

type NodeStatus = "completed" | "available" | "locked";
type FeedbackValue = "clear" | "unsure" | "blocked";

function loadSet(key: string) {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return new Set(Array.isArray(value) ? value.filter((item) => typeof item === "string") : []);
  } catch {
    return new Set<string>();
  }
}

function saveSet(key: string, value: Set<string>) {
  window.localStorage.setItem(key, JSON.stringify([...value]));
}

function statusLabel(status: NodeStatus) {
  if (status === "completed") return "Completed";
  if (status === "available") return "Ready";
  return "Locked";
}

function domainProgress(domain: ForestDomain, completed: Set<string>) {
  const nodes = forest.nodes.filter((node) => node.domainId === domain.id);
  return {
    complete: nodes.filter((node) => completed.has(node.id)).length,
    total: nodes.length,
  };
}

export default function Home() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState(forest.nodes[0].id);
  const [activeDomainId, setActiveDomainId] = useState(forest.domains[0].id);
  const [query, setQuery] = useState("");
  const [requirement, setRequirement] = useState(EXAMPLE_REQUIREMENTS[0]);
  const [brief, setBrief] = useState<LearnerBrief | null>(null);
  const [artifactConfirmed, setArtifactConfirmed] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, FeedbackValue>>({});
  const [resourceIssues, setResourceIssues] = useState<Set<string>>(new Set());
  const [copyState, setCopyState] = useState("Copy brief");

  useEffect(() => {
    setCompleted(loadSet(PROGRESS_KEY));
    try {
      const stored = JSON.parse(window.localStorage.getItem(FEEDBACK_KEY) ?? "{}");
      setFeedback(stored && typeof stored === "object" ? stored : {});
    } catch {
      setFeedback({});
    }
    setResourceIssues(loadSet(RESOURCE_ISSUE_KEY));
  }, []);

  const selected = forest.nodes.find((node) => node.id === selectedId) ?? forest.nodes[0];
  const selectedStatus = nodeState(selected, completed) as NodeStatus;
  const readyNodes = nextAvailableNodes(forest, completed);
  const filteredNodes = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return forest.nodes.filter((node) => (
      node.domainId === activeDomainId
      && (!normalized
        || node.title.toLocaleLowerCase().includes(normalized)
        || node.tags.some((tag) => tag.toLocaleLowerCase().includes(normalized)))
    ));
  }, [activeDomainId, query]);

  function selectNode(node: ForestNode) {
    setSelectedId(node.id);
    setArtifactConfirmed(false);
  }

  function markComplete() {
    if (!artifactConfirmed) return;
    const result = completeNode(forest, completed, selected.id);
    if (!result.ok) return;
    setCompleted(result.completed);
    saveSet(PROGRESS_KEY, result.completed);
    const next = nextAvailableNodes(forest, result.completed)[0];
    if (next) {
      setActiveDomainId(next.domainId);
      setSelectedId(next.id);
    }
    setArtifactConfirmed(false);
  }

  function undoNode() {
    const next = new Set(completed);
    next.delete(selected.id);
    setCompleted(next);
    saveSet(PROGRESS_KEY, next);
    setArtifactConfirmed(false);
  }

  function analyzeRequirement() {
    const normalized = normalizeRequirement(requirement, { weeklyHours: 8 });
    setBrief(normalized);
  }

  async function copyBrief() {
    const normalized = brief ?? normalizeRequirement(requirement, { weeklyHours: 8 });
    await navigator.clipboard.writeText(JSON.stringify(normalized, null, 2));
    setCopyState("Copied");
    window.setTimeout(() => setCopyState("Copy brief"), 1400);
  }

  function recordFeedback(value: FeedbackValue) {
    const next = { ...feedback, [selected.id]: value };
    setFeedback(next);
    window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(next));
  }

  function reportResourceIssue() {
    const next = new Set(resourceIssues);
    next.add(selected.id);
    setResourceIssues(next);
    saveSet(RESOURCE_ISSUE_KEY, next);
    recordFeedback("blocked");
  }

  function exportProgress() {
    const payload = {
      ...progressEnvelope(forest, completed),
      feedback,
      resourceIssues: [...resourceIssues],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "knowledge-forest-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const completedCount = completed.size;
  const completionPercent = Math.round((completedCount / forest.nodes.length) * 100);

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Knowledge Forest Framework home">
          <span className="brand-mark">KF</span>
          <span>
            <strong>Knowledge Forest</strong>
            <small>open framework · v0.1</small>
          </span>
        </a>
        <nav aria-label="Project links">
          <a href="#forest">Demo forest</a>
          <a href="#contract">Agent contract</a>
          <a href="https://github.com/AIALRA-0/knowledge-forest-framework">GitHub</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">FROM A NEED TO AN AUDITABLE LEARNING FOREST</p>
          <h1>One clear node at a time</h1>
          <p className="hero-lede">
            Describe what you want to learn; an agent investigates the field, separates domains,
            verifies complete resources, defines acceptance artifacts, and keeps frontier evidence current
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#contract">Create a brief</a>
            <a className="secondary-action" href="#forest">Explore the demo</a>
          </div>
          <dl className="hero-stats" aria-label="Demo statistics">
            <div><dt>{forest.domains.length}</dt><dd>domains</dd></div>
            <div><dt>{forest.nodes.length}</dt><dd>nodes</dd></div>
            <div><dt>{forest.nodes.length * 3}</dt><dd>frontiers</dd></div>
            <div><dt>{audit.status}</dt><dd>audit</dd></div>
          </dl>
        </div>
        <div className="hero-map" aria-label="Framework pipeline">
          {[
            ["01", "Requirement", "Goals, prior knowledge, constraints"],
            ["02", "Research", "Taxonomy, resources, frontier evidence"],
            ["03", "Audit", "Coverage, freshness, licensing, safety"],
            ["04", "Forest", "Vertical paths, artifacts, progress"],
          ].map(([step, title, note]) => (
            <div className="pipeline-row" key={step}>
              <span>{step}</span>
              <strong>{title}</strong>
              <small>{note}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="contract-section" id="contract">
        <div className="section-heading">
          <p className="eyebrow">AGENT INTAKE</p>
          <h2>Turn a rough ambition into a durable contract</h2>
          <p>The browser creates the brief; the agent skill performs research and produces the audited bundle</p>
        </div>
        <div className="intake-grid">
          <div className="intake-card">
            <label htmlFor="requirement">What do you want to learn or build</label>
            <textarea
              id="requirement"
              data-testid="requirement-input"
              value={requirement}
              onChange={(event) => setRequirement(event.target.value)}
              rows={5}
            />
            <div className="example-prompts" aria-label="Example requirements">
              {EXAMPLE_REQUIREMENTS.map((example, index) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setRequirement(example)}
                  aria-label={`Use example ${index + 1}`}
                >
                  Example {index + 1}
                </button>
              ))}
            </div>
            <div className="intake-actions">
              <button className="primary-action" type="button" onClick={analyzeRequirement}>
                Build requirement contract
              </button>
              <button className="secondary-action" type="button" onClick={copyBrief}>
                {copyState}
              </button>
            </div>
          </div>

          <div className="contract-card" data-testid="brief-summary">
            {brief ? (
              <>
                <div className="contract-status"><span>READY</span> Agent-readable brief</div>
                <h3>{brief.goal}</h3>
                <div className="contract-facts">
                  <p><strong>{brief.knownSkills.length}</strong> known skills detected</p>
                  <p><strong>{brief.highRiskAreas.length}</strong> safety boundaries detected</p>
                  <p><strong>{brief.corrections.length}</strong> remembered corrections</p>
                </div>
                <ul>
                  <li>Top-to-bottom domain trees</li>
                  <li>Complete resources only</li>
                  <li>Three traceable frontiers per node</li>
                  <li>Real user journeys required before release</li>
                </ul>
              </>
            ) : (
              <>
                <div className="contract-status"><span>WAITING</span> No brief generated</div>
                <h3>Your corrections become permanent regression rules</h3>
                <p>
                  The framework keeps layout, resource granularity, atomicity, frontier,
                  safety, and experience requirements attached to every future iteration
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="forest-section" id="forest">
        <div className="section-heading forest-heading">
          <div>
            <p className="eyebrow">INTERACTIVE PUBLIC DEMO</p>
            <h2>{forest.metadata.title}</h2>
            <p>{forest.metadata.description}</p>
          </div>
          <div className="progress-summary">
            <span>{completionPercent}%</span>
            <div>
              <strong>{completedCount} of {forest.nodes.length} accepted</strong>
              <small>{readyNodes.length} nodes ready now</small>
            </div>
            <button type="button" onClick={exportProgress}>Export</button>
          </div>
        </div>

        <div className="forest-workspace">
          <aside className="domain-rail" aria-label="Learning domains">
            <label htmlFor="node-search">Search this forest</label>
            <input
              id="node-search"
              data-testid="node-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Topic or skill"
            />
            <div className="domain-list">
              {forest.domains.map((domain) => {
                const progress = domainProgress(domain, completed);
                return (
                  <button
                    type="button"
                    key={domain.id}
                    className={domain.id === activeDomainId ? "domain-button active" : "domain-button"}
                    style={{ "--domain-color": domain.color } as React.CSSProperties}
                    onClick={() => setActiveDomainId(domain.id)}
                    data-testid={`domain-${domain.id}`}
                  >
                    <span className="domain-dot" />
                    <span>
                      <strong>{domain.title}</strong>
                      <small>{progress.complete} / {progress.total} complete</small>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="audit-card">
              <span className={audit.status === "pass" ? "audit-pass" : "audit-fail"}>
                {audit.status.toUpperCase()}
              </span>
              <strong>Deterministic audit</strong>
              <small>{audit.summary.frontierEvidence} evidence positions checked</small>
            </div>
          </aside>

          <section
            className="vertical-tree"
            aria-label={`${forest.domains.find((domain) => domain.id === activeDomainId)?.title} learning path`}
            data-layout-direction="top-to-bottom"
          >
            <div className="domain-intro">
              <span
                className="domain-accent"
                style={{ background: forest.domains.find((domain) => domain.id === activeDomainId)?.color }}
              />
              <div>
                <h3>{forest.domains.find((domain) => domain.id === activeDomainId)?.title}</h3>
                <p>{forest.domains.find((domain) => domain.id === activeDomainId)?.description}</p>
              </div>
            </div>
            <div className="tree-column">
              {filteredNodes.map((node, index) => {
                const status = nodeState(node, completed) as NodeStatus;
                return (
                  <div className="tree-step" key={node.id}>
                    {index > 0 && <span className="tree-line" aria-hidden="true" />}
                    <button
                      type="button"
                      className={`node-card ${status} ${selected.id === node.id ? "selected" : ""}`}
                      onClick={() => selectNode(node)}
                      data-testid={`tree-node-${node.id}`}
                      data-node-state={status}
                    >
                      <span className="node-status">{status === "completed" ? "✓" : index + 1}</span>
                      <span className="node-copy">
                        <small>{statusLabel(status)} · {node.estimatedHours} hours</small>
                        <strong>{node.title}</strong>
                        <span>{node.outcome}</span>
                      </span>
                    </button>
                  </div>
                );
              })}
              {filteredNodes.length === 0 && (
                <p className="empty-state">No nodes match this search in the selected domain</p>
              )}
            </div>
          </section>

          <aside className="node-detail" data-testid="node-detail">
            <div className="detail-heading">
              <span className={`state-pill ${selectedStatus}`}>{statusLabel(selectedStatus)}</span>
              <small>{selected.estimatedHours} estimated hours</small>
            </div>
            <h3>{selected.title}</h3>
            <p className="detail-outcome">{selected.outcome}</p>

            {selectedStatus === "locked" && (
              <div className="lock-explanation">
                <strong>Why this is locked</strong>
                <p>
                  Complete {selected.dependsOn
                    .filter((id) => !completed.has(id))
                    .map((id) => forest.nodes.find((node) => node.id === id)?.title)
                    .join(", ")} first
                </p>
              </div>
            )}

            <section className="detail-block">
              <div className="block-label">Complete resource</div>
              <a className="resource-card" href={selected.resource.url} target="_blank" rel="noreferrer">
                <span>{selected.resource.kind}</span>
                <strong>{selected.resource.title}</strong>
                <small>{selected.resource.publisher} · {selected.resource.access}</small>
              </a>
              <button className="resource-issue-button" type="button" onClick={reportResourceIssue}>
                Resource unavailable
              </button>
              {resourceIssues.has(selected.id) && (
                <div className="resource-issue-note" role="status">
                  Recorded for re-audit; do not silently substitute another resource; export the issue or rerun the agent review queue
                </div>
              )}
              <p>{selected.rationale}</p>
            </section>

            <section className="detail-block">
              <div className="block-label">Acceptance artifact</div>
              <h4>{selected.acceptance.title}</h4>
              <p>{selected.acceptance.description}</p>
              <ul>
                {selected.acceptance.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
              </ul>
            </section>

            <section className="detail-block">
              <div className="block-label">Current frontiers · 3</div>
              <div className="frontier-list">
                {selected.frontiers.map((frontier, index) => (
                  <details key={frontier.title}>
                    <summary><span>0{index + 1}</span>{frontier.title}</summary>
                    <p>{frontier.summary}</p>
                    <a href={frontier.evidence.url} target="_blank" rel="noreferrer">
                      {frontier.evidence.title} · {frontier.evidence.publishedAt.slice(0, 4)}
                    </a>
                  </details>
                ))}
              </div>
            </section>

            <section className="completion-box">
              {selectedStatus !== "completed" ? (
                <>
                  <label>
                    <input
                      type="checkbox"
                      checked={artifactConfirmed}
                      onChange={(event) => setArtifactConfirmed(event.target.checked)}
                      disabled={selectedStatus === "locked"}
                    />
                    I produced the acceptance artifact
                  </label>
                  <button
                    type="button"
                    onClick={markComplete}
                    disabled={!artifactConfirmed || selectedStatus === "locked"}
                    data-testid="complete-node"
                  >
                    Accept and light this node
                  </button>
                </>
              ) : (
                <button type="button" className="undo-button" onClick={undoNode}>
                  Reopen this node
                </button>
              )}
            </section>

            <section className="feedback-box">
              <span>Was this node clear enough to act on</span>
              <div>
                {([
                  ["clear", "Clear"],
                  ["unsure", "Unsure"],
                  ["blocked", "Blocked"],
                ] as Array<[FeedbackValue, string]>).map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={feedback[selected.id] === value ? "active" : ""}
                    onClick={() => recordFeedback(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <small>Stored only in this browser and included in your export</small>
            </section>
          </aside>
        </div>
      </section>

      <section className="principles-section">
        <div className="section-heading">
          <p className="eyebrow">RELEASE STANDARD</p>
          <h2>A forest is not finished when it renders</h2>
        </div>
        <div className="principle-grid">
          {[
            ["01", "Coverage audit", "Challenge the taxonomy from industry, academic, regulatory, and adjacent-domain perspectives"],
            ["02", "Evidence audit", "Recheck authority, access, freshness, licensing, duplication, and claim-level support"],
            ["03", "Experience audit", "Use realistic goals on desktop and mobile; record confusion, recovery, and the next visible action"],
          ].map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <div>
          <strong>Knowledge Forest Framework</strong>
          <span>Apache-2.0 code · CC BY 4.0 examples</span>
        </div>
        <p>Research deeply; learn one complete node; return and light the next</p>
      </footer>
    </main>
  );
}
