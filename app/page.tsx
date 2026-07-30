"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
  type ReactFlowInstance,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
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
} from "@/packages/core/src/progress.mjs";
import { normalizeRequirement } from "@/packages/agent/src/normalize.mjs";
import {
  localizeForest,
  type DemoLanguage,
} from "@/app/demo-i18n";

const forest = demoForest as ForestBundle;
const audit = auditForest(forest, { currentYear: 2026 });
const NODE_WIDTH = 226;
const NODE_HEIGHT = 88;
const PROGRESS_KEY = "knowledge-forest-framework-demo-progress-v2";

const EXAMPLE_REQUIREMENTS = {
  en: [
    "Build an RV32IM SoC through RTL verification, physical implementation, firmware, and an FPGA prototype; I already know digital logic",
    "Build a research-level learning forest for embodied robotics; I already know Python and linear algebra",
    "Map aircraft engineering, flight training, certification, and operational safety into separate learning paths",
  ],
  "zh-CN": [
    "构建 RV32IM SoC；覆盖 RTL 验证、物理实现、固件与 FPGA 原型；我已经掌握数字逻辑",
    "构建具身机器人研究级学习森林；我已经掌握 Python 与线性代数",
    "将飞机工程、飞行训练、执照法规与运行安全拆成独立学习路径",
  ],
} as const;

const PRODUCT_COPY = {
  en: {
    framework: "KNOWLEDGE FOREST FRAMEWORK",
    nodes: "nodes",
    branches: "branches",
    progress: "progress",
    buildRequest: "Build request",
    github: "GitHub",
    language: "中文",
    languageLabel: "切换到中文",
    next: "Next",
    finished: "All nodes complete",
    completed: "Lit",
    available: "Ready now",
    locked: "Waiting for prerequisites",
    outcome: "What you must be able to build",
    resource: "One complete primary resource",
    resourceReason: "Why this resource",
    openResource: "Open complete resource ↗",
    acceptance: "Acceptance artifact",
    criteria: "Observable checks",
    frontier: "Current research directions",
    prerequisites: "Prerequisites and next branches",
    prerequisite: "Prerequisite",
    nextBranch: "Next branch",
    root: "This node starts a branch",
    risk: "Boundary",
    completeFirst: "Complete first",
    confirmArtifact: "I produced and checked the required artifact",
    lightNode: "Light this node",
    reopen: "Reopen this node",
    reset: "Reset demo progress",
    openRequest: "Open request builder",
    requestTitle: "Describe the capability you want to build",
    requestIntro: "The framework turns this answer into a research brief; an agent then investigates the field, verifies sources, and generates the forest",
    requirementLabel: "Goal, prior knowledge, time, access, and important limits",
    prepare: "Prepare research brief",
    copy: "Copy brief",
    copied: "Copied",
    requestReady: "Research brief ready",
    requestWaiting: "No brief prepared yet",
    knownSkills: "known skills",
    riskAreas: "high-care areas",
    rules: "durable quality rules",
    close: "Return to selected node",
    checked: "sources checked",
    localProgress: "Progress stays in this browser",
    unlocked: "Node lit; new branches may now be available",
    resetDone: "Demo progress reset",
  },
  "zh-CN": {
    framework: "知识森林框架",
    nodes: "节点",
    branches: "分支",
    progress: "进度",
    buildRequest: "生成需求",
    github: "GitHub",
    language: "English",
    languageLabel: "Switch to English",
    next: "下一步",
    finished: "全部节点已点亮",
    completed: "已点亮",
    available: "现在可学",
    locked: "等待前置",
    outcome: "学完必须能做出来",
    resource: "唯一完整主线资源",
    resourceReason: "为什么选择这份资源",
    openResource: "打开完整资源 ↗",
    acceptance: "验收作品",
    criteria: "可观察的验收标准",
    frontier: "当前研究方向",
    prerequisites: "前置关系与后续分支",
    prerequisite: "前置",
    nextBranch: "下一步",
    root: "这是当前分支的起点",
    risk: "边界",
    completeFirst: "请先点亮",
    confirmArtifact: "我已经完成并检查要求的作品",
    lightNode: "点亮这个节点",
    reopen: "重新打开这个节点",
    reset: "重置演示进度",
    openRequest: "打开需求生成器",
    requestTitle: "说明最终想构建的能力",
    requestIntro: "框架会把回答整理成调查需求；Agent 随后调查完整领域、核验来源并生成学习森林",
    requirementLabel: "目标、已有基础、可投入时间、资源权限与重要限制",
    prepare: "整理调查需求",
    copy: "复制需求",
    copied: "已复制",
    requestReady: "调查需求已经就绪",
    requestWaiting: "尚未整理调查需求",
    knownSkills: "项已有能力",
    riskAreas: "个需要谨慎处理的领域",
    rules: "项长期质量规则",
    close: "返回当前节点",
    checked: "条来源已核验",
    localProgress: "进度只保存在当前浏览器",
    unlocked: "节点已经点亮；新的分支可能已经解锁",
    resetDone: "演示进度已经重置",
  },
} as const;

type NodeStatus = "completed" | "available" | "locked";
type PanelMode = "node" | "brief";

type DemoNodeData = {
  node: ForestNode;
  domain: ForestDomain;
  code: string;
  state: NodeStatus;
  selected: boolean;
  recommended: boolean;
};

type DemoFlowNode = Node<DemoNodeData, "skill">;

function branchCount(bundle: ForestBundle) {
  return bundle.nodes.reduce((sum, node) => sum + node.dependsOn.length, 0);
}

function loadProgress() {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const stored = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "[]");
    return new Set(Array.isArray(stored) ? stored.filter((item) => typeof item === "string") : []);
  } catch {
    return new Set<string>();
  }
}

function saveProgress(completed: Set<string>) {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]));
}

function nodeCode(node: ForestNode, bundle: ForestBundle) {
  const domainIndex = bundle.domains.findIndex((domain) => domain.id === node.domainId);
  const nodeIndex = bundle.nodes.filter((item) => item.domainId === node.domainId).findIndex((item) => item.id === node.id);
  const prefixes = ["A", "V", "P", "S"];
  return `${prefixes[domainIndex] ?? "N"}${String(nodeIndex + 1).padStart(2, "0")}`;
}

function createLayout(bundle: ForestBundle): DemoFlowNode[] {
  const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: "TB",
    ranksep: 96,
    nodesep: 42,
    edgesep: 24,
    marginx: 72,
    marginy: 62,
    ranker: "network-simplex",
    acyclicer: "greedy",
  });

  bundle.nodes.forEach((node) => graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));
  bundle.nodes.forEach((node) => node.dependsOn.forEach((dependency) => graph.setEdge(dependency, node.id)));
  dagre.layout(graph);

  const domainMap = new Map(bundle.domains.map((domain) => [domain.id, domain]));
  return bundle.nodes.map((node) => {
    const point = graph.node(node.id);
    return {
      id: node.id,
      type: "skill",
      position: {
        x: point.x - NODE_WIDTH / 2,
        y: point.y - NODE_HEIGHT / 2,
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      data: {
        node,
        domain: domainMap.get(node.domainId) ?? bundle.domains[0],
        code: nodeCode(node, bundle),
        state: "locked",
        selected: false,
        recommended: false,
      },
    };
  });
}

function DemoNode({ data }: NodeProps<DemoFlowNode>) {
  const { node, domain, code, state, selected, recommended } = data;
  return (
    <div
      className={`skill-node state-${state}${node.dependsOn.length === 0 ? " kind-realm" : ""}${selected ? " is-selected" : ""}${recommended ? " is-recommended" : ""}`}
      style={{ "--realm": domain.color } as CSSProperties}
    >
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <div className="skill-node-topline">
        <span className="skill-code">{code}</span>
        <span className="skill-track">{domain.title}</span>
        <span className="skill-state-dot" aria-hidden="true" />
      </div>
      <strong>{node.title}</strong>
      <span className="node-resource">{node.resource.publisher} · {node.resource.title}</span>
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </div>
  );
}

const NODE_TYPES: NodeTypes = { skill: DemoNode };

function descendantsOf(bundle: ForestBundle, rootId: string) {
  const descendants = new Set<string>();
  const queue = [rootId];
  while (queue.length) {
    const current = queue.shift();
    bundle.nodes.forEach((node) => {
      if (current && node.dependsOn.includes(current) && !descendants.has(node.id)) {
        descendants.add(node.id);
        queue.push(node.id);
      }
    });
  }
  return descendants;
}

function ForestExperience() {
  const flow = useReactFlow<DemoFlowNode, Edge>();
  const [language, setLanguage] = useState<DemoLanguage>("en");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState(forest.nodes[0].id);
  const [artifactConfirmed, setArtifactConfirmed] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>("node");
  const [requirement, setRequirement] = useState<string>(EXAMPLE_REQUIREMENTS.en[0]);
  const [brief, setBrief] = useState<LearnerBrief | null>(null);
  const [copyState, setCopyState] = useState("Copy brief");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const displayForest = useMemo(() => localizeForest(forest, language), [language]);
  const copy = PRODUCT_COPY[language];
  const domainMap = useMemo(
    () => new Map(displayForest.domains.map((domain) => [domain.id, domain])),
    [displayForest.domains],
  );
  const baseNodes = useMemo(() => createLayout(displayForest), [displayForest]);
  const stateMap = useMemo(
    () => new Map(displayForest.nodes.map((node) => [
      node.id,
      nodeState(node, completed) as NodeStatus,
    ])),
    [completed, displayForest.nodes],
  );
  const recommended = useMemo(
    () => nextAvailableNodes(displayForest, completed)[0] ?? null,
    [completed, displayForest],
  );
  const nodes = useMemo(
    () => baseNodes.map((flowNode) => {
      const state = stateMap.get(flowNode.id) ?? "locked";
      const selected = flowNode.id === selectedId;
      return {
        ...flowNode,
        selected,
        focusable: selected,
        data: {
          ...flowNode.data,
          state,
          selected,
          recommended: flowNode.id === recommended?.id,
        },
        ariaLabel: `${flowNode.data.node.title}; ${state}`,
        domAttributes: {
          "aria-current": selected ? "true" as const : undefined,
          "data-testid": `tree-node-${flowNode.id}`,
          "data-node-state": state,
        },
      };
    }),
    [baseNodes, recommended?.id, selectedId, stateMap],
  );
  const edges = useMemo<Edge[]>(() => {
    const result: Edge[] = [];
    displayForest.nodes.forEach((node) => {
      node.dependsOn.forEach((dependency) => {
        const dependencyDone = completed.has(dependency);
        const state = completed.has(node.id)
          ? "completed"
          : dependencyDone && stateMap.get(node.id) === "available"
            ? "available"
            : "locked";
        result.push({
          id: `${dependency}-${node.id}`,
          source: dependency,
          target: node.id,
          type: "smoothstep",
          className: `tree-edge edge-${state}${dependency === selectedId || node.id === selectedId ? " edge-selected" : ""}`,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      });
    });
    return result;
  }, [completed, displayForest.nodes, selectedId, stateMap]);

  const selected = displayForest.nodes.find((node) => node.id === selectedId) ?? displayForest.nodes[0];
  const selectedState = stateMap.get(selected.id) ?? "locked";
  const selectedDomain = domainMap.get(selected.domainId) ?? displayForest.domains[0];
  const selectedCode = nodeCode(selected, displayForest);
  const pendingDependencies = selected.dependsOn.filter((dependency) => !completed.has(dependency));
  const children = displayForest.nodes.filter((node) => node.dependsOn.includes(selected.id));
  const completedCount = displayForest.nodes.filter((node) => completed.has(node.id)).length;
  const progress = Math.round((completedCount / displayForest.nodes.length) * 100);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 3200);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
      const nextLanguage = requestedLanguage === "zh-CN" ? "zh-CN" : "en";
      setLanguage(nextLanguage);
      setRequirement(EXAMPLE_REQUIREMENTS[nextLanguage][0]);
      setCopyState(PRODUCT_COPY[nextLanguage].copy);
      setCompleted(loadProgress());
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `${displayForest.metadata.title} · Knowledge Forest Framework`;
  }, [displayForest.metadata.title, language]);

  const fitCompleteTree = useCallback((instance: ReactFlowInstance<DemoFlowNode, Edge>) => {
    window.requestAnimationFrame(() => {
      instance.fitView({
        padding: 0.12,
        minZoom: 0.2,
        maxZoom: 0.76,
        duration: 0,
      });
    });
  }, []);

  function focusNode(nodeId: string) {
    const target = nodes.find((node) => node.id === nodeId);
    if (!target) return;
    setSelectedId(nodeId);
    setArtifactConfirmed(false);
    setPanelMode("node");
    flow.setCenter(
      target.position.x + NODE_WIDTH / 2,
      target.position.y + NODE_HEIGHT / 2,
      { zoom: window.innerWidth < 720 ? 0.58 : 0.82, duration: 340 },
    );
  }

  function focusDomain(domain: ForestDomain) {
    const target = displayForest.nodes.find((node) => node.domainId === domain.id);
    if (target) focusNode(target.id);
  }

  function toggleLanguage() {
    const nextLanguage: DemoLanguage = language === "en" ? "zh-CN" : "en";
    const parameters = new URLSearchParams(window.location.search);
    parameters.set("lang", nextLanguage);
    window.history.replaceState({}, "", `${window.location.pathname}?${parameters.toString()}`);
    setLanguage(nextLanguage);
    setRequirement(EXAMPLE_REQUIREMENTS[nextLanguage][0]);
    setCopyState(PRODUCT_COPY[nextLanguage].copy);
  }

  function markComplete() {
    if (!artifactConfirmed || selectedState !== "available") return;
    const result = completeNode(displayForest, completed, selected.id);
    if (!result.ok) return;
    saveProgress(result.completed);
    setCompleted(result.completed);
    setArtifactConfirmed(false);
    showToast(copy.unlocked);
  }

  function reopenSelected() {
    const next = new Set(completed);
    next.delete(selected.id);
    descendantsOf(displayForest, selected.id).forEach((id) => next.delete(id));
    saveProgress(next);
    setCompleted(next);
  }

  function resetProgress() {
    const next = new Set<string>();
    saveProgress(next);
    setCompleted(next);
    showToast(copy.resetDone);
  }

  function analyzeRequirement() {
    const normalized = normalizeRequirement(requirement, { language }) as LearnerBrief;
    setBrief(normalized);
  }

  async function copyBrief() {
    const normalized = brief ?? (normalizeRequirement(requirement, { language }) as LearnerBrief);
    setBrief(normalized);
    try {
      await navigator.clipboard.writeText(JSON.stringify(normalized, null, 2));
      setCopyState(copy.copied);
    } catch {
      setCopyState(copy.copy);
    }
  }

  const statusLabel = selectedState === "completed"
    ? copy.completed
    : selectedState === "available"
      ? copy.available
      : copy.locked;

  return (
    <main
      className="app-shell"
      data-testid="knowledge-forest-app"
      data-selected-node-id={selected.id}
      data-layout-direction="top-to-bottom"
      data-layout-model="branched-dag"
      data-complete-preview="true"
      style={{ "--active-tree": "#315d72" } as CSSProperties}
    >
      <header className="topbar">
        <div className="brand-block">
          <div>
            <small>{copy.framework}</small>
            <h1>{displayForest.metadata.title}</h1>
          </div>
          <span className="brand-meta">
            {displayForest.nodes.length} {copy.nodes} · {branchCount(displayForest)} {copy.branches}
          </span>
        </div>

        <nav
          className="realm-jump"
          aria-label={language === "en" ? "Engineering branches" : "工程分支"}
          style={{ gridTemplateColumns: `repeat(${displayForest.domains.length}, minmax(0, 1fr))` }}
        >
          {displayForest.domains.map((domain, index) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => focusDomain(domain)}
              aria-current={selected.domainId === domain.id ? "location" : undefined}
              style={{ "--realm": domain.color } as CSSProperties}
              data-testid={`realm-jump-${domain.id}`}
            >
              <span className="realm-index">{String(index + 1).padStart(2, "0")}</span>
              <strong>{domain.title}</strong>
            </button>
          ))}
        </nav>

        <div className="header-progress">
          <div className="progress-copy">
            <strong>{completedCount}</strong>
            <span>/ {displayForest.nodes.length} · {progress}%</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label={copy.progress}
            aria-valuemin={0}
            aria-valuemax={displayForest.nodes.length}
            aria-valuenow={completedCount}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="header-actions public-header-actions">
          <button
            className={`forest-button${panelMode === "brief" ? " is-active" : ""}`}
            type="button"
            onClick={() => setPanelMode("brief")}
            aria-pressed={panelMode === "brief"}
          >
            {copy.buildRequest}
          </button>
          <a
            className="platform-button"
            href="https://github.com/AIALRA-0/knowledge-forest-framework"
            target="_blank"
            rel="noreferrer"
          >
            {copy.github}
          </a>
          <button
            className="platform-button"
            type="button"
            onClick={toggleLanguage}
            aria-label={copy.languageLabel}
          >
            {copy.language}
          </button>
          <button
            className="recommend-button"
            type="button"
            onClick={() => recommended && focusNode(recommended.id)}
            disabled={!recommended}
            data-testid="recommended-next"
          >
            <span>{recommended ? `${copy.next}: ${recommended.title}` : copy.finished}</span>
          </button>
        </div>
      </header>

      <div className="workspace">
        <section
          id="complete-map"
          className="tree-canvas"
          aria-label={`${displayForest.metadata.title}; ${language === "en" ? "complete dependency tree" : "完整依赖树"}`}
          data-layout-direction="top-to-bottom"
          data-complete-preview="true"
        >
          <ReactFlow<DemoFlowNode, Edge>
            nodes={nodes}
            edges={edges}
            nodeTypes={NODE_TYPES}
            onInit={fitCompleteTree}
            onNodeClick={(_, node) => {
              setSelectedId(node.id);
              setArtifactConfirmed(false);
              setPanelMode("node");
            }}
            nodesDraggable={false}
            nodesConnectable={false}
            edgesFocusable={false}
            disableKeyboardA11y
            minZoom={0.18}
            maxZoom={1.45}
            panOnScroll={false}
            zoomOnScroll={false}
            preventScrolling={false}
            selectionOnDrag={false}
            proOptions={{ hideAttribution: true }}
          >
            <Controls showInteractive={false} position="bottom-left" />
          </ReactFlow>
          <div className="canvas-audit" aria-label={language === "en" ? "Demo audit" : "演示审计"}>
            <strong>{audit.status === "pass" ? "PASS" : "REVIEW"}</strong>
            <span>{audit.summary.frontierEvidence} {copy.checked}</span>
          </div>
        </section>

        <aside className="detail-panel" data-testid="detail-panel">
          {panelMode === "brief" ? (
            <>
              <div className="detail-scroll brief-panel">
                <div className="detail-overline">
                  <span className="status-pill forest-status">{copy.openRequest}</span>
                  <span>v0.1</span>
                </div>
                <div className="detail-title-row">
                  <span className="detail-track">GOAL → RESEARCH BRIEF → FOREST</span>
                  <h2>{copy.requestTitle}</h2>
                  <p className="brief-intro">{copy.requestIntro}</p>
                </div>
                <section className="detail-section brief-form">
                  <label htmlFor="requirement">{copy.requirementLabel}</label>
                  <textarea
                    id="requirement"
                    data-testid="requirement-input"
                    value={requirement}
                    onChange={(event) => setRequirement(event.target.value)}
                    rows={7}
                  />
                  <div className="brief-examples">
                    {EXAMPLE_REQUIREMENTS[language].map((example, index) => (
                      <button key={example} type="button" onClick={() => setRequirement(example)}>
                        {language === "en" ? `Example ${index + 1}` : `示例 ${index + 1}`}
                      </button>
                    ))}
                  </div>
                </section>
                <section className="detail-section brief-result" data-testid="brief-summary">
                  <h3>{brief ? copy.requestReady : copy.requestWaiting}</h3>
                  {brief ? (
                    <>
                      <strong>{brief.goal}</strong>
                      <div>
                        <span><b>{brief.knownSkills.length}</b>{copy.knownSkills}</span>
                        <span><b>{brief.highRiskAreas.length}</b>{copy.riskAreas}</span>
                        <span><b>{brief.corrections.length}</b>{copy.rules}</span>
                      </div>
                    </>
                  ) : (
                    <p>{displayForest.metadata.description}</p>
                  )}
                </section>
              </div>
              <div className="detail-action">
                <button className="light-button state-available" type="button" onClick={analyzeRequirement}>
                  {copy.prepare}
                </button>
                <div className="progress-actions">
                  <button type="button" onClick={copyBrief}>{copyState}</button>
                  <button type="button" onClick={() => setPanelMode("node")}>{copy.close}</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="detail-scroll">
                <div className="detail-overline">
                  <span className={`status-pill state-${selectedState}`}>{statusLabel}</span>
                  <span>{selectedCode} · {selectedDomain.title}</span>
                </div>

                <div className="detail-title-row">
                  <span className="detail-track">{selectedDomain.description}</span>
                  <h2 data-testid="panel-title">{selected.title}</h2>
                </div>

                <section className="detail-section outcome-section">
                  <h3>{copy.outcome}</h3>
                  <p>{selected.outcome}</p>
                </section>

                <section className="detail-section resource-section">
                  <h3>{copy.resource}</h3>
                  <a className="primary-resource" href={selected.resource.url} target="_blank" rel="noreferrer">
                    <div className="resource-meta">
                      <span>{selected.resource.kind}</span>
                      <span>{selected.resource.access}</span>
                      <span>{selected.resource.completeness}</span>
                    </div>
                    <strong>{selected.resource.title}</strong>
                    <p>{selected.resource.publisher}</p>
                    <small><b>{copy.resourceReason}</b>; {selected.rationale}</small>
                    <span className="resource-open">{copy.openResource}</span>
                  </a>
                </section>

                <section className="detail-section acceptance-section">
                  <h3>{copy.acceptance}</h3>
                  <strong>{selected.acceptance.title}</strong>
                  <p>{selected.acceptance.description}</p>
                  <span>{copy.criteria}</span>
                  <ul>
                    {selected.acceptance.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
                  </ul>
                </section>

                <section className="detail-section frontier-section">
                  <div className="section-title-row">
                    <h3>{copy.frontier}</h3>
                    <span>3</span>
                  </div>
                  <div className="frontier-list">
                    {selected.frontiers.map((frontier) => (
                      <article key={frontier.title}>
                        <strong>{frontier.title}</strong>
                        <p>{frontier.summary}</p>
                        <a href={frontier.evidence.url} target="_blank" rel="noreferrer">
                          {frontier.evidence.title} · {frontier.evidence.publishedAt.slice(0, 10)} ↗
                        </a>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="detail-section dependency-section">
                  <h3>{copy.prerequisites}</h3>
                  {selected.dependsOn.length ? selected.dependsOn.map((dependency) => {
                    const dependencyNode = displayForest.nodes.find((node) => node.id === dependency);
                    const done = completed.has(dependency);
                    if (!dependencyNode) return null;
                    return (
                      <button key={dependency} type="button" onClick={() => focusNode(dependency)}>
                        <span className={done ? "done" : "pending"}>{done ? "✓" : "·"}</span>
                        <span><small>{copy.prerequisite}</small><strong>{dependencyNode.title}</strong></span>
                        <span className="row-arrow">→</span>
                      </button>
                    );
                  }) : <p className="empty-copy">{copy.root}</p>}
                  {children.map((child) => (
                    <button key={child.id} type="button" onClick={() => focusNode(child.id)}>
                      <span className="next">↓</span>
                      <span><small>{copy.nextBranch}</small><strong>{child.title}</strong></span>
                      <span className="row-arrow">→</span>
                    </button>
                  ))}
                </section>

                {selected.riskNote ? (
                  <section className="detail-section tree-context-section">
                    <h3>{copy.risk}</h3>
                    <p className="risk-boundary">{selected.riskNote}</p>
                  </section>
                ) : null}
              </div>

              <div className="detail-action">
                {selectedState === "locked" ? (
                  <span className="action-note">
                    {copy.completeFirst} {pendingDependencies
                      .map((dependency) => displayForest.nodes.find((node) => node.id === dependency)?.title)
                      .filter(Boolean)
                      .join(language === "en" ? ", " : "、")}
                  </span>
                ) : null}
                {selectedState === "available" ? (
                  <label className="artifact-confirmation">
                    <input
                      type="checkbox"
                      checked={artifactConfirmed}
                      onChange={(event) => setArtifactConfirmed(event.target.checked)}
                    />
                    <span>{copy.confirmArtifact}</span>
                  </label>
                ) : null}
                <button
                  className={`light-button state-${selectedState}`}
                  type="button"
                  onClick={selectedState === "completed" ? reopenSelected : markComplete}
                  disabled={selectedState === "locked" || (selectedState === "available" && !artifactConfirmed)}
                  data-testid="complete-node"
                >
                  {selectedState === "completed" ? copy.reopen : copy.lightNode}
                </button>
                <div className="progress-actions">
                  <button type="button" onClick={() => setPanelMode("brief")}>{copy.buildRequest}</button>
                  <button type="button" onClick={resetProgress}>{copy.reset}</button>
                </div>
                <small className="local-progress-note">{copy.localProgress}</small>
              </div>
            </>
          )}
        </aside>
      </div>

      {toast ? <div className="unlock-toast" role="status">{toast}</div> : null}
    </main>
  );
}

export default function Home() {
  return (
    <ReactFlowProvider>
      <ForestExperience />
    </ReactFlowProvider>
  );
}
