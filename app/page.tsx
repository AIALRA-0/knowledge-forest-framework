"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import {
  localizeForest,
  UI_COPY,
  type DemoLanguage,
} from "@/app/demo-i18n";

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
type BranchEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  path: string;
};

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

function domainProgress(domain: ForestDomain, completed: Set<string>) {
  const nodes = forest.nodes.filter((node) => node.domainId === domain.id);
  return {
    complete: nodes.filter((node) => completed.has(node.id)).length,
    total: nodes.length,
  };
}

function dependencyLevels(nodes: ForestNode[]) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const memo = new Map<string, number>();
  const visit = (id: string, visiting = new Set<string>()): number => {
    const cached = memo.get(id);
    if (cached !== undefined) return cached;
    if (visiting.has(id)) return 0;
    const node = nodeMap.get(id);
    if (!node || node.dependsOn.length === 0) {
      memo.set(id, 0);
      return 0;
    }
    const nextVisiting = new Set(visiting).add(id);
    const level = Math.max(...node.dependsOn.map((dependency) => visit(dependency, nextVisiting))) + 1;
    memo.set(id, level);
    return level;
  };
  nodes.forEach((node) => visit(node.id));
  return memo;
}

export default function Home() {
  const [language, setLanguage] = useState<DemoLanguage>("en");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState(forest.nodes[0].id);
  const [activeDomainId, setActiveDomainId] = useState("all");
  const [query, setQuery] = useState("");
  const [requirement, setRequirement] = useState(EXAMPLE_REQUIREMENTS[0]);
  const [brief, setBrief] = useState<LearnerBrief | null>(null);
  const [artifactConfirmed, setArtifactConfirmed] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, FeedbackValue>>({});
  const [resourceIssues, setResourceIssues] = useState<Set<string>>(new Set());
  const [copyState, setCopyState] = useState("Copy brief");
  const branchMapRef = useRef<HTMLDivElement>(null);
  const branchNodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const [branchEdges, setBranchEdges] = useState<BranchEdge[]>([]);
  const t = UI_COPY[language];
  const displayForest = useMemo(() => localizeForest(forest, language), [language]);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setCompleted(loadSet(PROGRESS_KEY));
      try {
        const stored = JSON.parse(window.localStorage.getItem(FEEDBACK_KEY) ?? "{}");
        setFeedback(stored && typeof stored === "object" ? stored : {});
      } catch {
        setFeedback({});
      }
      setResourceIssues(loadSet(RESOURCE_ISSUE_KEY));
      const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
      if (requestedLanguage === "zh-CN" || requestedLanguage === "en") {
        setLanguage(requestedLanguage);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    const copyStateTimer = window.setTimeout(() => setCopyState(t.copyBrief), 0);
    return () => window.clearTimeout(copyStateTimer);
  }, [language, t.copyBrief]);

  function statusLabel(status: NodeStatus) {
    if (status === "completed") return t.completed;
    if (status === "available") return t.nodeReady;
    return t.locked;
  }

  const selected = displayForest.nodes.find((node) => node.id === selectedId) ?? displayForest.nodes[0];
  const selectedStatus = nodeState(selected, completed) as NodeStatus;
  const readyNodes = nextAvailableNodes(forest, completed);
  const matchingNodeIds = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return new Set(displayForest.nodes.filter((node) => (
      !normalized
      || node.title.toLocaleLowerCase().includes(normalized)
      || node.tags.some((tag) => tag.toLocaleLowerCase().includes(normalized))
    )).map((node) => node.id));
  }, [displayForest.nodes, query]);
  const branchLevels = useMemo(() => dependencyLevels(displayForest.nodes), [displayForest.nodes]);

  useLayoutEffect(() => {
    const map = branchMapRef.current;
    if (!map) return;
    let frame = 0;
    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const mapRect = map.getBoundingClientRect();
        const edges: BranchEdge[] = [];
        displayForest.nodes.forEach((target) => {
          const targetElement = branchNodeRefs.current.get(target.id);
          if (!targetElement) return;
          const targetRect = targetElement.getBoundingClientRect();
          target.dependsOn.forEach((sourceId) => {
            const sourceElement = branchNodeRefs.current.get(sourceId);
            if (!sourceElement) return;
            const sourceRect = sourceElement.getBoundingClientRect();
            const startX = sourceRect.left - mapRect.left + sourceRect.width / 2;
            const startY = sourceRect.bottom - mapRect.top;
            const endX = targetRect.left - mapRect.left + targetRect.width / 2;
            const endY = targetRect.top - mapRect.top;
            const middleY = startY + Math.max(26, (endY - startY) / 2);
            edges.push({
              id: `${sourceId}-${target.id}`,
              sourceId,
              targetId: target.id,
              path: `M ${startX} ${startY} C ${startX} ${middleY}, ${endX} ${middleY}, ${endX} ${endY}`,
            });
          });
        });
        setBranchEdges(edges);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(map);
    branchNodeRefs.current.forEach((element) => observer.observe(element));
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [displayForest, language]);

  function switchLanguage() {
    const nextLanguage: DemoLanguage = language === "en" ? "zh-CN" : "en";
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLanguage);
    window.history.replaceState(null, "", url);
    setLanguage(nextLanguage);
  }

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
    setCopyState(t.copied);
    window.setTimeout(() => setCopyState(t.copyBrief), 1400);
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
        <a className="brand" href="#top" aria-label={t.homeLabel}>
          <span className="brand-mark">KF</span>
          <span>
            <strong>Knowledge Forest</strong>
            <small>{t.brandSubtitle}</small>
          </span>
        </a>
        <nav aria-label={t.projectLinksLabel}>
          <a href="#forest">{t.demoForest}</a>
          <a href="#contract">{t.createMap}</a>
          <a href="https://github.com/AIALRA-0/knowledge-forest-framework">GitHub</a>
          <button
            className="language-toggle"
            type="button"
            onClick={switchLanguage}
            aria-label={language === "en" ? "切换到中文" : "Switch to English"}
          >
            {t.languageName}
          </button>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{t.heroEyebrow}</p>
          <h1>
            {language === "zh-CN"
              ? <>一次只完成<br />一个明确节点</>
              : t.heroTitle}
          </h1>
          <p className="hero-lede">{t.heroDescription}</p>
          <div className="hero-actions">
            <a className="primary-action" href="#contract">{t.createMap}</a>
            <a className="secondary-action" href="#forest">{t.exploreDemo}</a>
          </div>
          <dl className="hero-stats" aria-label={t.demoStatisticsLabel}>
            <div><dt>{displayForest.domains.length}</dt><dd>{t.domains}</dd></div>
            <div><dt>{displayForest.nodes.length}</dt><dd>{t.nodes}</dd></div>
            <div><dt>{displayForest.nodes.length * 3}</dt><dd>{t.researchLeads}</dd></div>
            <div><dt>{audit.status === "pass" ? t.auditPass : t.auditFail}</dt><dd>{t.qualityCheck}</dd></div>
          </dl>
        </div>
        <div className="hero-map" aria-label={t.pipelineLabel}>
          {t.pipeline.map(([step, title, note]) => (
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
          <p className="eyebrow">{t.startEyebrow}</p>
          <h2>{t.startTitle}</h2>
          <p>{t.startDescription}</p>
        </div>
        <div className="intake-grid">
          <div className="intake-card">
            <label htmlFor="requirement">{t.requirementLabel}</label>
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
                  aria-label={`${t.example} ${index + 1}`}
                >
                  {t.example} {index + 1}
                </button>
              ))}
            </div>
            <div className="intake-actions">
              <button className="primary-action" type="button" onClick={analyzeRequirement}>
                {t.prepareRequest}
              </button>
              <button className="secondary-action" type="button" onClick={copyBrief}>
                {copyState}
              </button>
            </div>
          </div>

          <div className="contract-card" data-testid="brief-summary">
            {brief ? (
              <>
                <div className="contract-status"><span>{t.ready}</span> {t.readyForResearch}</div>
                <h3>{brief.goal}</h3>
                <div className="contract-facts">
                  <p><strong>{brief.knownSkills.length}</strong> {t.skillsKnown}</p>
                  <p><strong>{brief.highRiskAreas.length}</strong> {t.careAreas}</p>
                  <p><strong>{brief.corrections.length}</strong> {t.qualityRules}</p>
                </div>
                <ul>
                  {t.requestFeatures.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </>
            ) : (
              <>
                <div className="contract-status"><span>{t.waiting}</span> {t.noRequest}</div>
                <h3>{t.startingPointTitle}</h3>
                <p>{t.startingPointDescription}</p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="forest-section" id="forest">
        <div className="section-heading forest-heading">
          <div>
            <p className="eyebrow">{t.demoEyebrow}</p>
            <h2>{displayForest.metadata.title}</h2>
            <p>{displayForest.metadata.description}</p>
          </div>
          <div className="progress-summary">
            <span>{completionPercent}%</span>
            <div>
              <strong>{completedCount} / {displayForest.nodes.length} {t.accepted}</strong>
              <small>{readyNodes.length} {t.readyNow}</small>
            </div>
            <button type="button" onClick={exportProgress}>{t.export}</button>
          </div>
        </div>

        <div className="forest-workspace">
          <aside className="domain-rail" aria-label={t.learningDomains}>
            <label htmlFor="node-search">{t.searchForest}</label>
            <input
              id="node-search"
              data-testid="node-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPlaceholder}
            />
            <div className="domain-list">
              <button
                type="button"
                className={activeDomainId === "all" ? "domain-button active" : "domain-button"}
                style={{ "--domain-color": "#254b3c" } as React.CSSProperties}
                onClick={() => setActiveDomainId("all")}
                data-testid="domain-all"
              >
                <span className="domain-dot domain-dot-all" />
                <span>
                  <strong>{t.completeMap}</strong>
                  <small>{displayForest.nodes.length} {t.completeMapProgress}</small>
                </span>
              </button>
              {displayForest.domains.map((domain) => {
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
                      <small>{progress.complete} / {progress.total} {t.complete}</small>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="audit-card">
              <span className={audit.status === "pass" ? "audit-pass" : "audit-fail"}>
                {audit.status === "pass" ? t.auditPass.toUpperCase() : t.auditFail.toUpperCase()}
              </span>
              <strong>{t.qualityChecks}</strong>
              <small>{audit.summary.frontierEvidence} {t.sourcesChecked}</small>
            </div>
          </aside>

          <section
            className="vertical-tree"
            aria-label={`${t.completeMap} ${t.learningPath}`}
            data-layout-direction="top-to-bottom"
            data-layout-model="branched-dag"
          >
            <div className="domain-intro">
              <span className="domain-accent" />
              <div>
                <h3>{t.dependencyMapTitle}</h3>
                <p>{t.dependencyMapDescription}</p>
                <p className="branch-map-hint">{t.branchMapHint}</p>
              </div>
            </div>
            <div className="branch-map-scroll">
              <div className="branch-lane-headings" aria-hidden="true">
                {displayForest.domains.map((domain) => (
                  <span key={domain.id} style={{ "--domain-color": domain.color } as React.CSSProperties}>
                    <i />
                    {domain.title}
                  </span>
                ))}
              </div>
              <div className="branch-map" ref={branchMapRef}>
                <svg className="branch-edges" aria-hidden="true">
                  {branchEdges.map((edge) => {
                    const sourceCompleted = completed.has(edge.sourceId);
                    const targetCompleted = completed.has(edge.targetId);
                    const edgeState = targetCompleted ? "completed" : sourceCompleted ? "available" : "locked";
                    const touchesSelectedNode = edge.sourceId === selected.id || edge.targetId === selected.id;
                    return (
                      <g key={edge.id} className="branch-edge-pair">
                        <path d={edge.path} className="edge-halo" />
                        <path
                          d={edge.path}
                          className={`edge-line ${edgeState} ${touchesSelectedNode ? "active" : ""}`}
                        />
                      </g>
                    );
                  })}
                </svg>
                {displayForest.nodes.map((node) => {
                  const status = nodeState(node, completed) as NodeStatus;
                  const domainIndex = displayForest.domains.findIndex((domain) => domain.id === node.domainId);
                  const domain = displayForest.domains[domainIndex];
                  const domainMuted = activeDomainId !== "all" && activeDomainId !== node.domainId;
                  const searchMuted = query.trim().length > 0 && !matchingNodeIds.has(node.id);
                  return (
                    <button
                      key={node.id}
                      ref={(element) => {
                        if (element) branchNodeRefs.current.set(node.id, element);
                        else branchNodeRefs.current.delete(node.id);
                      }}
                      type="button"
                      className={`node-card branch-node ${status} ${selected.id === node.id ? "selected" : ""} ${domainMuted || searchMuted ? "muted" : ""}`}
                      onClick={() => selectNode(node)}
                      data-testid={`tree-node-${node.id}`}
                      data-node-state={status}
                      data-branch-level={branchLevels.get(node.id) ?? 0}
                      style={{
                        gridColumn: domainIndex + 1,
                        gridRow: (branchLevels.get(node.id) ?? 0) + 1,
                        "--domain-color": domain.color,
                      } as React.CSSProperties}
                    >
                      <span className="node-status">{status === "completed" ? "✓" : (branchLevels.get(node.id) ?? 0) + 1}</span>
                      <span className="node-copy">
                        <small>{statusLabel(status)} · {node.estimatedHours} {t.hours}</small>
                        <strong>{node.title}</strong>
                        <span>{node.outcome}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="node-detail" data-testid="node-detail">
            <div className="detail-heading">
              <span className={`state-pill ${selectedStatus}`}>{statusLabel(selectedStatus)}</span>
              <small>{selected.estimatedHours} {t.estimatedHours}</small>
            </div>
            <h3>{selected.title}</h3>
            <p className="detail-outcome">{selected.outcome}</p>

            {selectedStatus === "locked" && (
              <div className="lock-explanation">
                <strong>{t.whyLocked}</strong>
                <p>
                  {t.completeFirst} {selected.dependsOn
                    .filter((id) => !completed.has(id))
                    .map((id) => displayForest.nodes.find((node) => node.id === id)?.title)
                    .join(language === "en" ? ", " : "、")} {t.first}
                </p>
              </div>
            )}

            <section className="detail-block">
              <div className="block-label">{t.learnFrom}</div>
              <a className="resource-card" href={selected.resource.url} target="_blank" rel="noreferrer">
                <span>{t.resourceKinds[selected.resource.kind]}</span>
                <strong>{selected.resource.title}</strong>
                <small>{selected.resource.publisher} · {t[selected.resource.access]}</small>
              </a>
              <button className="resource-issue-button" type="button" onClick={reportResourceIssue}>
                {t.resourceUnavailable}
              </button>
              {resourceIssues.has(selected.id) && (
                <div className="resource-issue-note" role="status">
                  {t.resourceSaved}
                </div>
              )}
              <p>{selected.rationale}</p>
            </section>

            <section className="detail-block">
              <div className="block-label">{t.make}</div>
              <h4>{selected.acceptance.title}</h4>
              <p>{selected.acceptance.description}</p>
              <ul>
                {selected.acceptance.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
              </ul>
            </section>

            <section className="detail-block">
              <div className="block-label">{t.researchMoving} · 3</div>
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
                    {t.finishedWork}
                  </label>
                  <button
                    type="button"
                    onClick={markComplete}
                    disabled={!artifactConfirmed || selectedStatus === "locked"}
                    data-testid="complete-node"
                  >
                    {t.markComplete}
                  </button>
                </>
              ) : (
                <button type="button" className="undo-button" onClick={undoNode}>
                  {t.reopen}
                </button>
              )}
            </section>

            <section className="feedback-box">
              <span>{t.clarityQuestion}</span>
              <div>
                {([
                  ["clear", t.clear],
                  ["unsure", t.unsure],
                  ["blocked", t.blocked],
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
              <small>{t.storedLocally}</small>
            </section>
          </aside>
        </div>
      </section>

      <section className="principles-section">
        <div className="section-heading">
          <p className="eyebrow">{t.qualityEyebrow}</p>
          <h2>{t.qualityTitle}</h2>
        </div>
        <div className="principle-grid">
          {t.qualityItems.map(([number, title, text]) => (
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
          <span>{t.footerLicense}</span>
        </div>
        <p>{t.footerTagline}</p>
      </footer>
    </main>
  );
}
