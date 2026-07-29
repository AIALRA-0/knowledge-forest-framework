import type { ForestBundle } from "@/packages/schema/src/types";

export type DemoLanguage = "en" | "zh-CN";

export const UI_COPY = {
  en: {
    languageName: "中文",
    homeLabel: "Knowledge Forest Framework home",
    brandSubtitle: "open framework · v0.1",
    projectLinksLabel: "Project links",
    demoStatisticsLabel: "Demo statistics",
    pipelineLabel: "Framework pipeline",
    learningPath: "learning path",
    demoForest: "Demo forest",
    createMap: "Create your map",
    heroEyebrow: "A PERSONAL MAP FOR SERIOUS LEARNING",
    heroTitle: "One clear node at a time",
    heroDescription: "Describe what you want to learn and what you already know; get separate learning paths, one complete resource for every step, a project that proves the skill, and a clear next move",
    exploreDemo: "Explore the demo",
    domains: "domains",
    nodes: "nodes",
    researchLeads: "research leads",
    qualityCheck: "quality check",
    auditPass: "pass",
    auditFail: "fail",
    pipeline: [
      ["01", "Tell us", "Your goal, prior knowledge, and constraints"],
      ["02", "Map the field", "Separate the major directions and prerequisites"],
      ["03", "Choose the work", "A complete resource and a result to produce"],
      ["04", "Learn and track", "Finish one step, light it, and move forward"],
    ],
    startEyebrow: "START WITH YOUR GOAL",
    startTitle: "Describe the destination in your own words",
    startDescription: "The page turns your answer into a clear research request that an agent can investigate and build",
    requirementLabel: "What do you want to learn or build",
    example: "Example",
    prepareRequest: "Prepare my learning request",
    copyBrief: "Copy brief",
    copied: "Copied",
    ready: "READY",
    readyForResearch: "Ready for research",
    skillsKnown: "skills you already know",
    careAreas: "areas that need extra care",
    qualityRules: "quality rules included",
    requestFeatures: [
      "Separate paths for different parts of the field",
      "One complete learning resource for each step",
      "A concrete piece of work to finish before moving on",
      "Current research directions with sources",
    ],
    waiting: "WAITING",
    noRequest: "No request prepared",
    startingPointTitle: "Your starting point stays part of the plan",
    startingPointDescription: "Tell the system what you want to achieve, what you already know, how much time you have, and any limits that matter; the resulting map is built around that context",
    demoEyebrow: "INTERACTIVE PUBLIC DEMO",
    accepted: "accepted",
    readyNow: "nodes ready now",
    export: "Export",
    learningDomains: "Learning domains",
    completeMap: "Complete map",
    completeMapProgress: "all branches",
    dependencyMapTitle: "Connected dependency tree",
    dependencyMapDescription: "Two foundations split into four fields; every line is a real prerequisite; the final publication step reunites all branches",
    branchMapHint: "Swipe horizontally inside the map to compare all four branches",
    searchForest: "Search this forest",
    searchPlaceholder: "Topic or skill",
    complete: "complete",
    qualityChecks: "Quality checks",
    sourcesChecked: "research sources checked",
    completed: "Completed",
    nodeReady: "Ready",
    locked: "Locked",
    hours: "hours",
    estimatedHours: "estimated hours",
    noMatches: "No nodes match this search in the selected domain",
    whyLocked: "Why this is locked",
    completeFirst: "Complete",
    first: "first",
    learnFrom: "What to learn from",
    free: "free",
    paid: "paid",
    institutional: "institutional",
    resourceKinds: {
      article: "article",
      book: "book",
      course: "course",
      documentation: "documentation",
      platform: "platform",
      standard: "standard",
    },
    resourceUnavailable: "Resource unavailable",
    resourceSaved: "Saved for review; export the issue or ask the agent to verify a replacement before changing this step",
    make: "What to make",
    researchMoving: "Where research is moving",
    finishedWork: "I finished the work above",
    markComplete: "Mark complete and light this step",
    reopen: "Reopen this step",
    clarityQuestion: "Was this step clear enough to act on",
    clear: "Clear",
    unsure: "Unsure",
    blocked: "Blocked",
    storedLocally: "Stored only in this browser and included in your export",
    qualityEyebrow: "HOW QUALITY IS CHECKED",
    qualityTitle: "A useful map must survive real use",
    qualityItems: [
      ["01", "Nothing important is missing", "Compare the map with university programs, industry practice, regulation, and neighboring fields"],
      ["02", "Every source still works", "Open the links, confirm who published them, check the date, and make sure they support the claim"],
      ["03", "A person can actually use it", "Try realistic goals on desktop and mobile, record confusion, and fix the unclear parts"],
    ],
    footerTagline: "Research deeply; learn one complete step; return and light the next",
    footerLicense: "Apache-2.0 code · CC BY 4.0 examples",
  },
  "zh-CN": {
    languageName: "English",
    homeLabel: "知识森林框架首页",
    brandSubtitle: "开放框架 · v0.1",
    projectLinksLabel: "项目链接",
    demoStatisticsLabel: "演示统计",
    pipelineLabel: "框架流程",
    learningPath: "学习路径",
    demoForest: "演示森林",
    createMap: "创建学习地图",
    heroEyebrow: "面向长期学习的个人地图",
    heroTitle: "一次只完成一个明确节点",
    heroDescription: "写下想学什么和已经掌握什么；获得按领域拆分的路径、每一步的完整资源、证明已经学会的作品，以及明确的下一步",
    exploreDemo: "查看完整演示",
    domains: "领域",
    nodes: "节点",
    researchLeads: "研究方向",
    qualityCheck: "质量检查",
    auditPass: "通过",
    auditFail: "未通过",
    pipeline: [
      ["01", "说明目标", "学习目标、现有基础和重要限制"],
      ["02", "调查领域", "拆分主要方向并明确前置关系"],
      ["03", "确定任务", "为每一步选择完整资源和交付作品"],
      ["04", "学习记录", "完成一个节点、点亮并继续前进"],
    ],
    startEyebrow: "从你的目标开始",
    startTitle: "用自己的话说明最终想做到什么",
    startDescription: "页面会将回答整理成清晰的调查需求；Agent 根据它研究并构建学习地图",
    requirementLabel: "你想学习或构建什么",
    example: "示例",
    prepareRequest: "整理我的学习需求",
    copyBrief: "复制需求",
    copied: "已复制",
    ready: "已就绪",
    readyForResearch: "可以开始调查",
    skillsKnown: "项已有能力",
    careAreas: "个需要额外谨慎的领域",
    qualityRules: "项质量要求",
    requestFeatures: [
      "不同部分拥有独立路径",
      "每一步只使用一份完整学习资源",
      "完成具体作品后才能进入下一步",
      "当前研究方向带有可追溯来源",
    ],
    waiting: "等待输入",
    noRequest: "尚未整理学习需求",
    startingPointTitle: "学习地图会保留你的真实起点",
    startingPointDescription: "告诉系统最终目标、已经掌握的内容、可投入时间和重要限制；生成的地图会以这些信息为起点",
    demoEyebrow: "双语交互演示",
    accepted: "个节点已完成",
    readyNow: "个节点现在可以开始",
    export: "导出",
    learningDomains: "学习领域",
    completeMap: "完整总树",
    completeMapProgress: "全部分支",
    dependencyMapTitle: "相互连接的依赖树",
    dependencyMapDescription: "两个共同起点分叉进入四个领域；每条连线都代表真实前置关系；最终发布节点重新汇合全部分支",
    branchMapHint: "在图内横向滑动；查看并比较全部四条分支",
    searchForest: "搜索当前森林",
    searchPlaceholder: "主题或技能",
    complete: "已完成",
    qualityChecks: "质量检查",
    sourcesChecked: "条研究来源已检查",
    completed: "已完成",
    nodeReady: "可开始",
    locked: "未解锁",
    hours: "小时",
    estimatedHours: "预计小时",
    noMatches: "当前领域没有匹配节点",
    whyLocked: "为什么尚未解锁",
    completeFirst: "请先完成",
    first: "",
    learnFrom: "去哪里学习",
    free: "免费",
    paid: "付费",
    institutional: "机构访问",
    resourceKinds: {
      article: "文章",
      book: "书籍",
      course: "课程",
      documentation: "官方文档",
      platform: "学习平台",
      standard: "标准",
    },
    resourceUnavailable: "资源无法访问",
    resourceSaved: "问题已经保存；请导出问题或让 Agent 核验替代资源；不要直接更换",
    make: "学完要做什么",
    researchMoving: "当前研究正在前往哪里",
    finishedWork: "我已经完成上面的作品",
    markComplete: "点亮并完成这个节点",
    reopen: "重新打开这个节点",
    clarityQuestion: "这个节点是否足够清楚；可以直接开始行动",
    clear: "清楚",
    unsure: "不确定",
    blocked: "受阻",
    storedLocally: "只保存在当前浏览器；导出时会一并包含",
    qualityEyebrow: "如何检查质量",
    qualityTitle: "真正有用的地图必须经得起实际使用",
    qualityItems: [
      ["01", "没有遗漏关键部分", "将地图与大学培养方案、行业实践、监管要求和相邻领域进行比较"],
      ["02", "每个来源仍然有效", "打开链接；确认发布者和日期；检查来源是否真的支持对应内容"],
      ["03", "真实用户能够完成任务", "使用桌面端和移动端完成实际目标；记录困惑；修复不清楚的部分"],
    ],
    footerTagline: "深入调查；完成一个完整节点；回来点亮下一步",
    footerLicense: "Apache-2.0 代码 · CC BY 4.0 示例",
  },
} as const;

type NodeTranslation = {
  title: string;
  outcome: string;
  rationale: string;
  acceptance: {
    title: string;
    description: string;
    criteria: string[];
  };
  frontiers: Array<{ title: string; summary: string }>;
  tags: string[];
};

const DOMAIN_ZH: Record<string, { title: string; description: string }> = {
  evidence: {
    title: "证据理解",
    description: "在发布可视化结论前理解变化、不确定性、来源和推断边界",
  },
  accessibility: {
    title: "无障碍交互",
    description: "让不同能力、设备和输入方式的用户都能理解并完成任务",
  },
  visualization: {
    title: "视觉表达",
    description: "将可靠证据转化为清楚、负责、能够被检查的公共解释",
  },
  delivery: {
    title: "可靠交付",
    description: "准备、发布、测量并长期维护可信的公共信息服务",
  },
};

const NODE_ZH: Record<string, NodeTranslation> = {
  "evidence-statistics": {
    title: "统计推理",
    outcome: "理解变化、不确定性、估计结果和常见统计结论",
    rationale: "页面看起来精确；并不代表它表达的结论有足够证据",
    acceptance: {
      title: "不确定性分析笔记",
      description: "分析一个公开数据集；在不隐藏假设的情况下解释不确定性",
      criteria: ["包含可重复计算", "明确区分观察结果与推断", "记录至少三个限制"],
    },
    frontiers: [
      { title: "显示不确定性的可视分析", summary: "界面开始直接展示不确定性；不再只给出一个看似确定的答案" },
      { title: "AI 辅助统计分析", summary: "研究正在判断语言模型何时能够帮助统计推理；何时会制造错误" },
      { title: "可重复的公共证据", summary: "公共分析正在将数据、处理过程和最终结论连接成可追溯链条" },
    ],
    tags: ["统计", "不确定性", "证据"],
  },
  "evidence-provenance": {
    title: "数据来源追踪",
    outcome: "从公共结论追溯到处理步骤、版本、许可证和原始数据",
    rationale: "如果无法重建数据来自哪里；错误就无法被检查和修复",
    acceptance: {
      title: "可追溯数据包",
      description: "为一个公开数据集打包来源、许可证、结构、处理步骤、版本和已知限制",
      criteria: ["新审阅者能够从记录来源重新生成最终表格", "每个处理步骤都有负责人和时间", "许可证、版本和限制始终跟随数据"],
    },
    frontiers: [
      { title: "可携带的数据包", summary: "开放标准正在让数据、结构、许可证和说明能够一起移动" },
      { title: "可以互相连接的公共数据目录", summary: "目录标准开始同时描述数据集、服务、版本和相互关系" },
      { title: "带签名的内容历史", summary: "发布者正在为数字内容增加可验证的来源和编辑历史" },
    ],
    tags: ["来源", "元数据", "许可证"],
  },
  "evidence-journalism": {
    title: "证据叙事",
    outcome: "将可追溯证据连接成透明的公共解释",
    rationale: "读者需要区分数据、解释、不确定性和编辑判断",
    acceptance: {
      title: "证据说明",
      description: "发布一份短说明；将每个主要结论直接连接到来源",
      criteria: ["每个主要结论都有可追溯来源", "不确定性出现在受影响结论附近", "更正内容时不必重写完整叙事"],
    },
    frontiers: [
      { title: "结论级来源绑定", summary: "生成式系统开始将每条陈述直接连接到支持它的证据" },
      { title: "人工审查生成解释", summary: "AI 辅助公共表达正在将人工复核作为正式步骤" },
      { title: "内容真实性", summary: "带签名的来源记录正在成为媒体可信度的重要信号" },
    ],
    tags: ["新闻", "来源", "叙事"],
  },
  "accessibility-wcag": {
    title: "无障碍标准",
    outcome: "将 WCAG 2.2 要求转化为产品验收测试",
    rationale: "无障碍能力必须进入信息结构和设计；不能等页面完成以后再补",
    acceptance: {
      title: "无障碍验收地图",
      description: "将 WCAG 2.2 要求映射到一个仪表板设计及其检查方式",
      criteria: ["覆盖键盘、对比度、替代文本、重排和焦点", "同时说明自动检查和人工检查方法", "记录仍未解决的例外"],
    },
    frontiers: [
      { title: "基于实际结果的无障碍标准", summary: "WCAG 3 正在探索比二元通过判断更广泛的结果模型" },
      { title: "无障碍身份验证", summary: "身份验证流程和认知负担已经成为明确的无障碍问题" },
      { title: "持续测量无障碍表现", summary: "大规模年度测量正在揭示长期存在的重复障碍" },
    ],
    tags: ["WCAG", "无障碍", "标准"],
  },
  "accessibility-patterns": {
    title: "交互模式",
    outcome: "通过已经测试的模式实现键盘和辅助技术行为",
    rationale: "只有语义角色并不能自动产生可用的键盘操作和焦点管理",
    acceptance: {
      title: "键盘交互原型",
      description: "构建并测试一个不依赖鼠标的仪表板交互",
      criteria: ["所有控件都可以使用键盘", "焦点移动能够被预测", "屏幕阅读器测试记录真实行为"],
    },
    frontiers: [
      { title: "复杂图形的无障碍语义", summary: "标准正在为图表和结构化图形扩展可表达语义" },
      { title: "个性化信息呈现", summary: "研究正在探索适应不同认知和感官需求的界面" },
      { title: "自动测试的能力边界", summary: "当前工作强调将自动检查与真实任务完成结合" },
    ],
    tags: ["ARIA", "键盘", "交互"],
  },
  "accessibility-testing": {
    title: "包容性任务测试",
    outcome: "使用键盘、屏幕阅读器、缩放、重排和真实用户测试完整任务",
    rationale: "自动扫描通过；并不能证明用户能够理解并完成任务",
    acceptance: {
      title: "包容性任务报告",
      description: "使用不同输入和呈现方式完成三个具有代表性的仪表板任务",
      criteria: ["记录任务能否完成；不只记录规则错误", "包含键盘、屏幕阅读器、四倍缩放和窄屏证据", "按用户影响排列障碍并验证每项修复"],
    },
    frontiers: [
      { title: "跨工具共享测试规则", summary: "无障碍工具正在采用能够复用并明确说明假设的测试定义" },
      { title: "超越标准符合性的任务结果", summary: "评估指南开始区分符合标准与用户是否真的能够完成工作" },
      { title: "网络规模的无障碍测量", summary: "大型公开测量持续发现组件测试无法覆盖的常见障碍" },
    ],
    tags: ["测试", "屏幕阅读器", "可用性"],
  },
  "visualization-design": {
    title: "可视化设计",
    outcome: "根据问题、受众和不确定性选择合适的视觉表达",
    rationale: "图表通过视觉选择表达论点；它不是中性的装饰",
    acceptance: {
      title: "视觉表达对比",
      description: "为同一数据集制作三种解释；选择其中一种并说明原因",
      criteria: ["每个设计都写明要回答的问题", "最终选择解释为什么排除其他方案", "不确定性和缺失数据保持可见"],
    },
    frontiers: [
      { title: "自然语言生成可视化", summary: "可视化系统正在结合直接操作和语言界面" },
      { title: "无障碍数据可视化", summary: "研究正在将非视觉探索扩展到静态替代文本之外" },
      { title: "声明式可视化语法", summary: "可携带的声明式描述正在成为不同工具之间的共享层" },
    ],
    tags: ["可视化", "图表", "视觉编码"],
  },
  "visualization-narrative": {
    title: "解释性叙事",
    outcome: "带领读者从公共问题走向证据、不确定性和能够被辩护的结论",
    rationale: "一组正确图表仍然可能让读者不知道什么最重要以及为什么",
    acceptance: {
      title: "引导式证据故事",
      description: "发布一个滚动解释；让问题、证据、不确定性和限制保持可见",
      criteria: ["开头说明公共问题但不夸大答案", "每张图只推进推理中的一个部分", "来源、不确定性和限制靠近对应结论"],
    },
    frontiers: [
      { title: "语言辅助图表创作", summary: "新工具将自然语言和直接编辑结合；研究同时检查控制权丢失和隐藏假设" },
      { title: "人工审查生成解释", summary: "研究正在观察人们如何验证和修改 AI 辅助公共解释" },
      { title: "可以验证的媒体来源", summary: "内容凭据正在把最终解释与原始来源和编辑历史连接起来" },
    ],
    tags: ["叙事", "解释", "故事"],
  },
  "visualization-ethics": {
    title: "负责任表达",
    outcome: "识别数据产品代表、遗漏、暴露或可能伤害了谁",
    rationale: "计算正确；仍然可能产生不公平或不安全的公共信息",
    acceptance: {
      title: "影响与遗漏审查",
      description: "从代表性、隐私、权力、可能误用和缺失声音审查一个仪表板",
      criteria: ["列出会受到发布和不发布影响的人", "测试至少两个可能的误用场景", "根据审查修改设计或发布边界"],
    },
    frontiers: [
      { title: "生成内容风险管理", summary: "组织正在把生成式 AI 风险转化为具体设计和复核控制" },
      { title: "基于权利的 AI 治理", summary: "监管开始将系统风险与透明度、监督和受影响者权利连接" },
      { title: "国际负责任 AI 原则", summary: "公共表达正在接受透明度、稳健性、问责和人的能动性检查" },
    ],
    tags: ["伦理", "隐私", "代表性"],
  },
  "delivery-data-pipeline": {
    title: "可重复数据流程",
    outcome: "将原始公共数据变成经过检查、带版本并可重复生成的发布输入",
    rationale: "手工清理会让每次更新都变成一轮未经检查的新分析",
    acceptance: {
      title: "可重复数据构建",
      description: "创建一条命令即可下载、检查、转换和打包公开数据集的流程",
      criteria: ["干净环境可以重新生成发布数据", "结构或质量错误会停止构建并提供有用信息", "记录来源版本、输出版本和转换历史"],
    },
    frontiers: [
      { title: "作为可携带标准的数据合同", summary: "团队正在将检查、结构和元数据要求放入可携带数据包" },
      { title: "同时描述服务与版本的目录", summary: "公共目录开始共同描述文件、接口、版本、关系和数据服务" },
      { title: "跨工具开放血缘记录", summary: "共享事件正在连接不同工具中的任务、数据集和运行记录" },
    ],
    tags: ["数据流程", "检查", "血缘"],
  },
  "delivery-performance": {
    title: "韧性网络交付",
    outcome: "让仪表板在受限设备和网络中仍然快速、清楚并可用",
    rationale: "只能在高性能设备和稳定宽带上运行的公共服务会排除一部分受众",
    acceptance: {
      title: "受限网络发布版本",
      description: "发布经过测量的仪表板；确保窄屏和慢速连接仍然可用",
      criteria: ["记录加载、交互和布局稳定性指标", "可选脚本或大型资源失败时核心内容仍然存在", "移动端和慢速网络能够得出与桌面端相同的结论"],
    },
    frontiers: [
      { title: "以用户体验为中心的性能指标", summary: "网络性能越来越关注真实用户经历的加载、响应和视觉稳定性" },
      { title: "共享浏览器功能基线", summary: "团队正在使用共同可用性基线选择更可靠的网络能力" },
      { title: "大规模性能证据", summary: "开放测量正在连接设计选择与数百万网站的真实表现" },
    ],
    tags: ["性能", "韧性", "移动端"],
  },
  "visualization-publication": {
    title: "公共仪表板发布",
    outcome: "发布带有证据、无障碍能力和维护说明的响应式仪表板",
    rationale: "最终产品部署以后仍然必须保留证据和无障碍能力",
    acceptance: {
      title: "经过检查的公共仪表板",
      description: "交付一个响应式仪表板；同时提供决策记录和可重复复核流程",
      criteria: ["新读者能够找到主要结论和限制", "键盘和移动端任务能够完成", "每项结论、资源和复核日期都可追溯"],
    },
    frontiers: [
      { title: "设计系统中的证据", summary: "成熟团队正在把组件与无障碍要求和研究证据连接" },
      { title: "渐进式网络交付", summary: "公共服务正在平衡韧性、性能和离线能力" },
      { title: "保护隐私的测量", summary: "分析系统正在转向最少数据和明确用途" },
    ],
    tags: ["发布", "设计系统", "检查"],
  },
};

export function localizeForest(bundle: ForestBundle, language: DemoLanguage): ForestBundle {
  if (language === "en") return bundle;

  const localized = JSON.parse(JSON.stringify(bundle)) as ForestBundle;
  localized.metadata.title = "无障碍公共数据仪表板";
  localized.metadata.description = "一个从证据理解、无障碍、视觉表达到可靠发布的完整双语案例；展示目标如何变成可执行学习路径";
  localized.metadata.language = "zh-CN";

  localized.domains = localized.domains.map((domain) => ({
    ...domain,
    ...DOMAIN_ZH[domain.id],
  }));

  localized.nodes = localized.nodes.map((node) => {
    const translation = NODE_ZH[node.id];
    if (!translation) return node;
    return {
      ...node,
      title: translation.title,
      outcome: translation.outcome,
      rationale: translation.rationale,
      acceptance: translation.acceptance,
      frontiers: node.frontiers.map((frontier, index) => ({
        ...frontier,
        title: translation.frontiers[index]?.title ?? frontier.title,
        summary: translation.frontiers[index]?.summary ?? frontier.summary,
      })),
      tags: [...node.tags, ...translation.tags],
    };
  });

  return localized;
}
