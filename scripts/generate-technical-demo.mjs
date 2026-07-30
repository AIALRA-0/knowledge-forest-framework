import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const briefText = await readFile(new URL("examples/public-demo/brief.json", root), "utf8");
const briefHash = createHash("sha256").update(briefText).digest("hex");

const evidence = {
  riscvAnnual: {
    title: "RISC-V Annual Report 2025",
    url: "https://riscv.org/wp-content/uploads/2026/01/RISC-V-Annual-Report-2025.pdf",
    publishedAt: "2026-01-15",
    sourceType: "official",
  },
  riscvProfiles: {
    title: "RISC-V Ratified Profiles Library",
    url: "https://docs.riscv.org/reference/profiles-overview/index.html",
    publishedAt: "2026-07-01",
    sourceType: "standard",
  },
  vectorCrypto: {
    title: "RISC-V Vector Cryptography Extensions",
    url: "https://docs.riscv.org/reference/isa/extensions/crypto-vector/_attachments/riscv-crypto-spec-vector.pdf",
    publishedAt: "2026-04-01",
    sourceType: "standard",
  },
  cva6: {
    title: "CVA6 User Manual",
    url: "https://docs.openhwgroup.org/projects/cva6-user-manual/",
    publishedAt: "2025-06-01",
    sourceType: "official",
  },
  cheri: {
    title: "RISC-V CHERI Specification",
    url: "https://riscv.github.io/riscv-cheri/",
    publishedAt: "2025-06-01",
    sourceType: "standard",
  },
  chipyard: {
    title: "Chipyard Documentation",
    url: "https://chipyard.readthedocs.io/en/stable/",
    publishedAt: "2025-01-15",
    sourceType: "official",
  },
  circt: {
    title: "CIRCT Code Documentation",
    url: "https://circt.llvm.org/docs/",
    publishedAt: "2026-07-01",
    sourceType: "official",
  },
  circtVerification: {
    title: "CIRCT Verification Tools",
    url: "https://circt.llvm.org/docs/Tools/",
    publishedAt: "2026-07-01",
    sourceType: "official",
  },
  verilator: {
    title: "Verilator Guide",
    url: "https://verilator.org/guide/latest/",
    publishedAt: "2026-06-01",
    sourceType: "official",
  },
  cocotb: {
    title: "cocotb Documentation",
    url: "https://docs.cocotb.org/en/stable/",
    publishedAt: "2025-10-01",
    sourceType: "official",
  },
  symbiyosys: {
    title: "SymbiYosys Documentation",
    url: "https://symbiyosys.readthedocs.io/en/latest/",
    publishedAt: "2025-05-01",
    sourceType: "official",
  },
  yosys: {
    title: "Yosys Documentation",
    url: "https://yosyshq.readthedocs.io/projects/yosys/en/latest/",
    publishedAt: "2026-06-01",
    sourceType: "official",
  },
  openroad: {
    title: "OpenROAD Documentation",
    url: "https://openroad.readthedocs.io/en/latest/",
    publishedAt: "2026-07-01",
    sourceType: "official",
  },
  openroadRegression: {
    title: "OpenROAD Regression Tests",
    url: "https://openroad.readthedocs.io/en/latest/main/README2.html",
    publishedAt: "2026-07-01",
    sourceType: "official",
  },
  opensta: {
    title: "OpenSTA Documentation",
    url: "https://openroad.readthedocs.io/en/latest/main/src/sta/README.html",
    publishedAt: "2026-06-01",
    sourceType: "official",
  },
  llvmRiscv: {
    title: "LLVM RISC-V Usage",
    url: "https://llvm.org/docs/RISCVUsage.html",
    publishedAt: "2026-06-01",
    sourceType: "official",
  },
  zephyr: {
    title: "Zephyr Project Documentation",
    url: "https://docs.zephyrproject.org/latest/",
    publishedAt: "2026-06-01",
    sourceType: "official",
  },
  opentitan: {
    title: "OpenTitan Technical Documentation",
    url: "https://opentitan.org/book/",
    publishedAt: "2026-06-01",
    sourceType: "official",
  },
};

const domains = [
  {
    id: "architecture",
    color: "#315d72",
    order: 1,
    en: {
      title: "ISA and architecture",
      description: "Turn an instruction set into measurable microarchitectural and interconnect decisions",
    },
    zh: {
      title: "指令集与体系结构",
      description: "将指令集要求转化为能够测量的微架构、存储层次和互联决策",
    },
  },
  {
    id: "rtl-verification",
    color: "#4d5875",
    order: 2,
    en: {
      title: "RTL and verification",
      description: "Implement synthesizable hardware and establish simulation and formal evidence",
    },
    zh: {
      title: "RTL 与验证",
      description: "实现可综合硬件；通过仿真、覆盖率和形式化方法建立正确性证据",
    },
  },
  {
    id: "physical-design",
    color: "#805a46",
    order: 3,
    en: {
      title: "Physical implementation",
      description: "Carry the design from synthesis through timing, placement, routing, power, and signoff",
    },
    zh: {
      title: "物理实现",
      description: "完成综合、时序、布局、布线、功耗分析和实现签核",
    },
  },
  {
    id: "software-integration",
    color: "#66513f",
    order: 4,
    en: {
      title: "Software and integration",
      description: "Connect the toolchain, firmware, peripherals, FPGA validation, and reproducible delivery",
    },
    zh: {
      title: "软件与系统集成",
      description: "连接工具链、固件、外设、FPGA 验证和可重复交付流程",
    },
  },
];

const resource = (title, url, kind, publisher) => ({
  title,
  url,
  kind,
  publisher,
  access: "free",
  completeness: "whole-resource",
});

const nodes = [
  {
    id: "architecture-isa",
    domainId: "architecture",
    dependsOn: [],
    estimatedHours: 30,
    resource: resource(
      "RISC-V Ratified Specifications Library",
      "https://docs.riscv.org/reference/isa/unpriv/unpriv-index.html",
      "standard",
      "RISC-V International",
    ),
    en: {
      title: "RISC-V ISA contract",
      outcome: "Read machine-level behavior from the unprivileged ISA and define an implementable RV32IM target",
      rationale: "RTL cannot be reviewed coherently until supported instructions, traps, privilege assumptions, and architectural state are explicit",
      acceptance: ["ISA implementation matrix", "List every supported instruction and exception", "Bind each item to an executable compliance test", "Record every intentionally unsupported extension"],
      frontiers: [
        ["Profiles and platform contracts", "Profiles are narrowing the gap between optional extensions and software-compatible platforms", "riscvProfiles"],
        ["Vector cryptography", "Ratified vector cryptography is bringing data-independent high-throughput primitives into the ISA", "vectorCrypto"],
        ["Capability architectures", "CHERI work is extending RISC-V with hardware-enforced memory capabilities", "cheri"],
      ],
      tags: ["RISC-V", "ISA", "RV32IM", "compliance"],
    },
    zh: {
      title: "RISC-V ISA 契约",
      outcome: "从非特权指令集读取机器级行为；确定可实现的 RV32IM 目标",
      rationale: "只有明确指令、异常、特权假设和架构状态；RTL 才能接受一致审查",
      acceptance: ["ISA 实现矩阵", "列出全部支持的指令和异常", "每一项绑定可执行一致性测试", "记录所有暂不支持的扩展"],
      frontiers: [
        ["Profile 与平台契约", "Profile 正在缩小可选扩展与软件兼容平台之间的距离", "riscvProfiles"],
        ["向量密码扩展", "已经批准的向量密码扩展正在把数据无关的高吞吐密码原语带入 ISA", "vectorCrypto"],
        ["能力安全架构", "CHERI 正在为 RISC-V 引入由硬件执行的内存能力保护", "cheri"],
      ],
      tags: ["RISC-V", "ISA", "RV32IM", "一致性"],
    },
  },
  {
    id: "architecture-microarchitecture",
    domainId: "architecture",
    dependsOn: ["architecture-isa"],
    estimatedHours: 48,
    resource: resource(
      "MIT 6.004 Computation Structures",
      "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/",
      "course",
      "MIT OpenCourseWare",
    ),
    en: {
      title: "Pipeline microarchitecture",
      outcome: "Specify a five-stage pipeline with hazards, bypassing, control recovery, and measurable performance",
      rationale: "A block diagram is not a microarchitecture until timing, state transitions, conflicts, and recovery behavior are testable",
      acceptance: ["Cycle-accurate microarchitecture specification", "Define every pipeline register and control transfer", "Provide hazard and forwarding tables", "Predict CPI for at least three workloads"],
      frontiers: [
        ["Configurable application-class cores", "Open cores such as CVA6 expose increasingly configurable pipelines and memory systems", "cva6"],
        ["Composable generator ecosystems", "Chipyard is making architectural exploration reproducible across generators and SoC configurations", "chipyard"],
        ["Profile-driven implementation", "RISC-V profiles increasingly influence which architectural features must coexist", "riscvAnnual"],
      ],
      tags: ["pipeline", "hazard", "bypass", "CPI"],
    },
    zh: {
      title: "流水线微架构",
      outcome: "设计含冒险处理、旁路、控制恢复和性能测量的五级流水线",
      rationale: "只有时序、状态转移、资源冲突和恢复行为都能够测试；框图才成为微架构",
      acceptance: ["周期精确微架构规格", "定义全部流水寄存器和控制转移", "提供冒险与旁路表", "预测至少三类工作负载的 CPI"],
      frontiers: [
        ["可配置应用级处理器", "CVA6 等开放处理器正在暴露更可配置的流水线和存储系统", "cva6"],
        ["可组合生成器生态", "Chipyard 正在让生成器与 SoC 配置之间的架构探索可以重复", "chipyard"],
        ["Profile 驱动实现", "RISC-V Profile 正在影响必须共同实现的架构功能", "riscvAnnual"],
      ],
      tags: ["流水线", "冒险", "旁路", "CPI"],
    },
  },
  {
    id: "architecture-memory",
    domainId: "architecture",
    dependsOn: ["architecture-microarchitecture"],
    estimatedHours: 42,
    resource: resource(
      "Chipyard Documentation",
      "https://chipyard.readthedocs.io/en/stable/",
      "documentation",
      "CHIPS Alliance",
    ),
    en: {
      title: "Memory-system architecture",
      outcome: "Design caches, address maps, arbitration, buses, and peripheral attachment for a small SoC",
      rationale: "A CPU becomes a system only when latency, ordering, backpressure, address ownership, and failure behavior are explicit",
      acceptance: ["Executable SoC memory map", "Specify cache and uncached regions", "Document arbitration and backpressure", "Pass concurrent CPU and peripheral traffic tests"],
      frontiers: [
        ["Chiplet-aware interconnect", "SoC composition is expanding from on-die buses toward interoperable die-to-die fabrics", "riscvAnnual"],
        ["Coherent generator frameworks", "Chipyard connects cores, caches, accelerators, and interconnect generators through reproducible configurations", "chipyard"],
        ["Capability-tagged memory", "CHERI introduces metadata and checks that reshape cache and memory-system design", "cheri"],
      ],
      tags: ["cache", "interconnect", "address map", "arbitration"],
    },
    zh: {
      title: "存储系统架构",
      outcome: "为小型 SoC 设计缓存、地址映射、仲裁、总线和外设连接",
      rationale: "只有延迟、顺序、背压、地址归属和失败行为明确；CPU 才真正成为系统",
      acceptance: ["可执行 SoC 地址映射", "明确缓存与非缓存区域", "记录仲裁和背压规则", "通过 CPU 与外设并发流量测试"],
      frontiers: [
        ["面向 Chiplet 的互联", "SoC 组合正在从片上总线扩展到可互操作的裸片间互联", "riscvAnnual"],
        ["一致性生成器框架", "Chipyard 通过可重复配置连接处理器、缓存、加速器和互联生成器", "chipyard"],
        ["带能力标签的内存", "CHERI 引入的元数据和检查正在改变缓存与存储系统设计", "cheri"],
      ],
      tags: ["缓存", "互联", "地址映射", "仲裁"],
    },
  },
  {
    id: "rtl-systemverilog",
    domainId: "rtl-verification",
    dependsOn: [],
    estimatedHours: 36,
    resource: resource(
      "HDLBits",
      "https://hdlbits.01xz.net/wiki/Main_Page",
      "platform",
      "HDLBits",
    ),
    en: {
      title: "Synthesizable RTL",
      outcome: "Write parameterized SystemVerilog with explicit sequential boundaries and synthesis-safe behavior",
      rationale: "Code that simulates is not necessarily portable, synthesizable, reset-safe, or understandable during timing closure",
      acceptance: ["Lint-clean reusable RTL library", "Include registers, FIFOs, arbiters, and interfaces", "Use one clocking convention and explicit reset policy", "Synthesize every component without inferred latches"],
      frontiers: [
        ["Hardware compiler IR", "CIRCT is introducing reusable compiler infrastructure between hardware languages and implementation tools", "circt"],
        ["Faster compiled simulation", "Verilator continues to move large SystemVerilog designs into software-like compilation workflows", "verilator"],
        ["Generator-based RTL", "Chipyard demonstrates parameterized hardware generation beyond hand-written module copies", "chipyard"],
      ],
      tags: ["SystemVerilog", "RTL", "synthesis", "lint"],
    },
    zh: {
      title: "可综合 RTL",
      outcome: "编写参数化 SystemVerilog；明确时序边界并保持综合安全",
      rationale: "能够仿真的代码不一定可移植、可综合、复位安全或便于时序收敛",
      acceptance: ["通过 Lint 的可复用 RTL 库", "包含寄存器、FIFO、仲裁器和接口", "使用统一时钟约定和明确复位策略", "全部组件综合后不存在意外锁存器"],
      frontiers: [
        ["硬件编译器中间表示", "CIRCT 正在硬件语言和实现工具之间建立可复用编译基础设施", "circt"],
        ["高速编译式仿真", "Verilator 正在把大型 SystemVerilog 设计带入接近软件编译的工作流", "verilator"],
        ["生成器驱动 RTL", "Chipyard 展示了超越手工复制模块的参数化硬件生成方法", "chipyard"],
      ],
      tags: ["SystemVerilog", "RTL", "综合", "Lint"],
    },
  },
  {
    id: "rtl-verification",
    domainId: "rtl-verification",
    dependsOn: ["rtl-systemverilog"],
    estimatedHours: 44,
    resource: resource(
      "Verilator Guide",
      "https://verilator.org/guide/latest/",
      "documentation",
      "Verilator",
    ),
    en: {
      title: "Simulation verification",
      outcome: "Build self-checking unit and integration tests with assertions, coverage, and deterministic regressions",
      rationale: "Waveform inspection cannot scale into evidence that corner cases, protocol rules, and recovery paths were exercised",
      acceptance: ["Reproducible verification regression", "Use scoreboards and executable reference models", "Measure functional and structural coverage", "Archive seeds, logs, and failing waveforms"],
      frontiers: [
        ["Python-native verification", "cocotb is widening access to coroutine-based hardware verification and reusable software tooling", "cocotb"],
        ["Compiled simulation at scale", "Verilator is improving language coverage and performance for large open hardware systems", "verilator"],
        ["IR-level test generation", "CIRCT is developing random-test and verification dialects above individual simulators", "circtVerification"],
      ],
      tags: ["simulation", "coverage", "assertions", "regression"],
    },
    zh: {
      title: "仿真验证",
      outcome: "构建带断言、覆盖率和确定性回归的自检查单元与集成测试",
      rationale: "人工查看波形无法扩展成角落情况、协议规则和恢复路径已经执行的证据",
      acceptance: ["可重复验证回归", "使用记分板和可执行参考模型", "测量功能覆盖率与结构覆盖率", "保存随机种子、日志和失败波形"],
      frontiers: [
        ["Python 原生验证", "cocotb 正在扩大协程式硬件验证和软件工具复用范围", "cocotb"],
        ["大规模编译式仿真", "Verilator 正在为大型开放硬件系统改进语言覆盖与性能", "verilator"],
        ["中间表示层测试生成", "CIRCT 正在独立仿真器之上发展随机测试和验证方言", "circtVerification"],
      ],
      tags: ["仿真", "覆盖率", "断言", "回归"],
    },
  },
  {
    id: "rtl-formal",
    domainId: "rtl-verification",
    dependsOn: ["rtl-verification"],
    estimatedHours: 32,
    resource: resource(
      "SymbiYosys Documentation",
      "https://symbiyosys.readthedocs.io/en/latest/",
      "documentation",
      "YosysHQ",
    ),
    en: {
      title: "Formal properties",
      outcome: "Prove control, protocol, and safety properties and distinguish assumptions from guarantees",
      rationale: "Simulation samples executions; formal methods can exhaustively expose unreachable states, deadlocks, and missing environmental constraints",
      acceptance: ["Formal property suite", "Prove FIFO, arbiter, and pipeline safety properties", "Cover at least one deep reachable behavior", "Review every assumption for vacuous proofs"],
      frontiers: [
        ["IR-native bounded model checking", "CIRCT is lowering verification problems through reusable dialects into SMT backends", "circtVerification"],
        ["Open-source formal orchestration", "SymbiYosys is integrating bounded, induction, cover, and liveness workflows", "symbiyosys"],
        ["Logical equivalence checking", "CIRCT is exposing SMT-backed equivalence checks between hardware representations", "circt"],
      ],
      tags: ["formal", "SVA", "BMC", "equivalence"],
    },
    zh: {
      title: "形式化性质",
      outcome: "证明控制、协议和安全性质；区分环境假设与设计保证",
      rationale: "仿真只采样执行路径；形式化能够穷举发现不可达状态、死锁和缺失约束",
      acceptance: ["形式化性质套件", "证明 FIFO、仲裁器和流水线安全性质", "覆盖至少一个深层可达行为", "检查每个假设并排除空洞证明"],
      frontiers: [
        ["中间表示原生 BMC", "CIRCT 正在通过可复用方言把验证问题降低到 SMT 后端", "circtVerification"],
        ["开放形式化编排", "SymbiYosys 正在整合有界证明、归纳、覆盖和活性工作流", "symbiyosys"],
        ["逻辑等价性检查", "CIRCT 正在硬件表示之间提供基于 SMT 的等价性检查", "circt"],
      ],
      tags: ["形式化", "SVA", "BMC", "等价性"],
    },
  },
  {
    id: "physical-synthesis",
    domainId: "physical-design",
    dependsOn: ["architecture-microarchitecture", "rtl-systemverilog"],
    estimatedHours: 28,
    resource: resource(
      "Yosys Documentation",
      "https://yosyshq.readthedocs.io/projects/yosys/en/latest/",
      "documentation",
      "YosysHQ",
    ),
    en: {
      title: "Logic synthesis",
      outcome: "Map RTL into a constrained gate-level netlist and explain area, timing, and inference results",
      rationale: "Synthesis is the first place where coding style, constraints, libraries, and architecture become comparable implementation evidence",
      acceptance: ["Constrained synthesis report", "Reproduce the mapped netlist from one command", "Explain the critical logic cones and inferred memories", "Compare at least two architectural alternatives"],
      frontiers: [
        ["Compiler-based synthesis", "CIRCT is adding reusable logic-synthesis passes and hardware-specific intermediate representations", "circt"],
        ["Open synthesis ecosystems", "Yosys continues to connect front ends, technology mapping, formal tooling, and open PDK flows", "yosys"],
        ["Automated PPA exploration", "OpenROAD is targeting autonomous optimization across the RTL-to-GDSII flow", "openroad"],
      ],
      tags: ["synthesis", "netlist", "constraints", "PPA"],
    },
    zh: {
      title: "逻辑综合",
      outcome: "将 RTL 映射为受约束的门级网表；解释面积、时序和推断结果",
      rationale: "综合首次把编码方式、约束、库和架构转化为能够比较的实现证据",
      acceptance: ["受约束综合报告", "使用一条命令重复生成映射网表", "解释关键逻辑锥和推断存储器", "比较至少两种架构方案"],
      frontiers: [
        ["基于编译器的综合", "CIRCT 正在增加可复用逻辑综合 Pass 和硬件专用中间表示", "circt"],
        ["开放综合生态", "Yosys 持续连接前端、技术映射、形式化工具和开放 PDK 流程", "yosys"],
        ["自动化 PPA 探索", "OpenROAD 正在追求贯穿 RTL 到 GDSII 的自主优化", "openroad"],
      ],
      tags: ["综合", "网表", "约束", "PPA"],
    },
  },
  {
    id: "physical-place-route",
    domainId: "physical-design",
    dependsOn: ["physical-synthesis"],
    estimatedHours: 42,
    resource: resource(
      "OpenROAD Documentation",
      "https://openroad.readthedocs.io/en/latest/",
      "documentation",
      "OpenROAD Project",
    ),
    en: {
      title: "Detailed physical design",
      outcome: "Create a floorplan, power grid, placement, clock tree, routing, and implementation report",
      rationale: "A valid netlist is not a manufacturable layout until congestion, clocking, power delivery, geometry, and routing constraints converge",
      acceptance: ["Reproducible routed design", "Record floorplan and power-grid decisions", "Close placement and routing without fatal violations", "Archive metrics and implementation artifacts"],
      frontiers: [
        ["Autonomous RTL-to-GDSII", "OpenROAD is integrating flow stages around no-human-in-loop implementation targets", "openroad"],
        ["Distributed design-space search", "Open implementation flows are using parallel exploration to trade runtime against PPA quality", "openroad"],
        ["Reproducible physical-design CI", "OpenROAD publishes regression infrastructure for implementation metrics and flow changes", "openroadRegression"],
      ],
      tags: ["floorplan", "placement", "CTS", "routing"],
    },
    zh: {
      title: "详细物理实现",
      outcome: "完成 Floorplan、电源网格、布局、时钟树、布线和实现报告",
      rationale: "只有拥塞、时钟、电源、几何和布线约束共同收敛；合法网表才成为可制造版图",
      acceptance: ["可重复布线设计", "记录 Floorplan 和电源网格决策", "完成布局布线且不存在致命违规", "保存指标和实现产物"],
      frontiers: [
        ["自主 RTL 到 GDSII", "OpenROAD 正在围绕无人干预实现目标整合全部流程阶段", "openroad"],
        ["分布式设计空间搜索", "开放实现流程正在通过并行探索权衡运行时间和 PPA 质量", "openroad"],
        ["可重复物理设计 CI", "OpenROAD 发布了面向实现指标和流程变更的回归基础设施", "openroadRegression"],
      ],
      tags: ["Floorplan", "布局", "CTS", "布线"],
    },
  },
  {
    id: "physical-timing",
    domainId: "physical-design",
    dependsOn: ["physical-place-route"],
    estimatedHours: 30,
    resource: resource(
      "OpenSTA Documentation",
      "https://openroad.readthedocs.io/en/latest/main/src/sta/README.html",
      "documentation",
      "OpenROAD Project",
    ),
    en: {
      title: "Signoff closure",
      outcome: "Constrain clocks and interfaces, analyze paths, repair violations, and defend final PPA tradeoffs",
      rationale: "A routed design still fails if constraints are incomplete or if timing, slew, capacitance, clock skew, and power are not jointly reviewed",
      acceptance: ["Closure dossier", "Provide complete clock and interface constraints", "Explain worst setup and hold paths", "Track area, power, timing, and design-rule changes across iterations"],
      frontiers: [
        ["Metric-driven flow regression", "OpenROAD regression infrastructure compares slack, area, skew, slew, capacitance, and routing outcomes", "openroadRegression"],
        ["Machine-guided flow tuning", "OpenROAD is integrating modeling and prediction into implementation optimization", "openroad"],
        ["Open static timing analysis", "OpenSTA keeps timing models and constraint behavior inspectable inside an open implementation flow", "opensta"],
      ],
      tags: ["STA", "timing closure", "power", "signoff"],
    },
    zh: {
      title: "签核收敛",
      outcome: "约束时钟和接口；分析路径、修复违规并说明最终 PPA 权衡",
      rationale: "如果约束不完整；或者没有共同审查时序、Slew、电容、Clock Skew 和功耗；已布线设计仍然会失败",
      acceptance: ["收敛档案", "提供完整时钟与接口约束", "解释最差 Setup 和 Hold 路径", "跟踪每轮面积、功耗、时序和设计规则变化"],
      frontiers: [
        ["指标驱动流程回归", "OpenROAD 回归基础设施能够比较 Slack、面积、Skew、Slew、电容和布线结果", "openroadRegression"],
        ["机器辅助流程调优", "OpenROAD 正在把建模和预测引入实现优化", "openroad"],
        ["开放静态时序分析", "OpenSTA 让时序模型和约束行为在开放实现流程内保持可检查", "opensta"],
      ],
      tags: ["STA", "时序收敛", "功耗", "签核"],
    },
  },
  {
    id: "software-toolchain",
    domainId: "software-integration",
    dependsOn: ["architecture-isa"],
    estimatedHours: 24,
    resource: resource(
      "LLVM RISC-V Usage",
      "https://llvm.org/docs/RISCVUsage.html",
      "documentation",
      "LLVM Project",
    ),
    en: {
      title: "Cross-toolchain",
      outcome: "Compile, link, inspect, and debug bare-metal RISC-V programs against the implemented ISA contract",
      rationale: "A processor is not usable until software flags, ABI, linker layout, startup code, and architectural features agree with hardware",
      acceptance: ["Reproducible RISC-V toolchain harness", "Build freestanding C and assembly programs", "Inspect ELF sections and generated instructions", "Fail the build when software requests an unsupported extension"],
      frontiers: [
        ["Profile-aware toolchains", "RISC-V profiles are shaping portable compiler targets beyond individual extension flags", "riscvProfiles"],
        ["Vector cryptography code generation", "Compilers must map high-level cryptographic workloads onto new vector extension contracts", "vectorCrypto"],
        ["Capability-aware compilation", "CHERI requires compilers, ABIs, loaders, and hardware to preserve capability semantics together", "cheri"],
      ],
      tags: ["LLVM", "ABI", "linker", "bare metal"],
    },
    zh: {
      title: "交叉工具链",
      outcome: "针对已实现 ISA 编译、链接、检查并调试裸机 RISC-V 程序",
      rationale: "只有软件选项、ABI、链接布局、启动代码和架构功能与硬件一致；处理器才真正可用",
      acceptance: ["可重复 RISC-V 工具链脚手架", "构建 Freestanding C 与汇编程序", "检查 ELF Section 和生成指令", "软件请求未支持扩展时让构建失败"],
      frontiers: [
        ["感知 Profile 的工具链", "RISC-V Profile 正在塑造超越单独扩展选项的可移植编译目标", "riscvProfiles"],
        ["向量密码代码生成", "编译器需要把高级密码工作负载映射到新的向量扩展契约", "vectorCrypto"],
        ["能力感知编译", "CHERI 要求编译器、ABI、加载器和硬件共同保持能力语义", "cheri"],
      ],
      tags: ["LLVM", "ABI", "链接器", "裸机"],
    },
  },
  {
    id: "software-firmware",
    domainId: "software-integration",
    dependsOn: ["architecture-memory", "rtl-verification", "software-toolchain"],
    estimatedHours: 38,
    resource: resource(
      "Zephyr Project Documentation",
      "https://docs.zephyrproject.org/latest/",
      "documentation",
      "Zephyr Project",
    ),
    en: {
      title: "Firmware integration",
      outcome: "Bring up startup code, interrupts, timers, UART, memory layout, and a minimal RTOS environment",
      rationale: "Firmware exposes integration failures that isolated CPU and peripheral tests cannot reveal",
      acceptance: ["Automated firmware bring-up suite", "Boot from reset into a diagnostic application", "Exercise interrupts, timer, UART, and memory boundaries", "Capture cycle-accurate failure evidence in simulation"],
      frontiers: [
        ["Portable RTOS hardware descriptions", "Zephyr is expanding declarative board, device-tree, driver, and architecture integration", "zephyr"],
        ["Security-root integration", "OpenTitan demonstrates coordinated ROM, lifecycle, key management, and hardware security blocks", "opentitan"],
        ["Capability-aware system software", "CHERI research is moving memory protection into toolchain, ABI, kernel, and hardware contracts", "cheri"],
      ],
      tags: ["firmware", "interrupts", "UART", "RTOS"],
    },
    zh: {
      title: "固件集成",
      outcome: "完成启动代码、中断、定时器、UART、内存布局和最小 RTOS 环境",
      rationale: "固件能够暴露孤立 CPU 和外设测试无法发现的系统集成故障",
      acceptance: ["自动化固件 Bring-up 套件", "从复位启动到诊断应用", "执行中断、定时器、UART 和内存边界测试", "在仿真中保存周期精确失败证据"],
      frontiers: [
        ["可移植 RTOS 硬件描述", "Zephyr 正在扩展声明式开发板、设备树、驱动和架构集成", "zephyr"],
        ["安全根集成", "OpenTitan 展示了 ROM、生命周期、密钥管理和硬件安全模块的协同设计", "opentitan"],
        ["能力感知系统软件", "CHERI 正在把内存保护带入工具链、ABI、内核和硬件契约", "cheri"],
      ],
      tags: ["固件", "中断", "UART", "RTOS"],
    },
  },
  {
    id: "integration-fpga",
    domainId: "software-integration",
    dependsOn: ["rtl-formal", "physical-timing", "software-firmware"],
    estimatedHours: 46,
    resource: resource(
      "OpenTitan Technical Documentation",
      "https://opentitan.org/book/",
      "documentation",
      "OpenTitan Project",
    ),
    en: {
      title: "FPGA SoC prototype",
      outcome: "Deliver one reproducible FPGA image that boots software and carries architecture, verification, and implementation evidence",
      rationale: "The final prototype must reunite every branch; otherwise the learning path proves isolated exercises rather than system engineering",
      acceptance: ["Audited RISC-V SoC prototype", "Build bitstream and firmware from a clean checkout", "Boot diagnostics and a small application on hardware", "Publish ISA, verification, timing, and known-limit reports together"],
      frontiers: [
        ["Open silicon reference systems", "OpenTitan is integrating reusable IP, verification, firmware, security, and implementation documentation", "opentitan"],
        ["Generator-to-prototype continuity", "Chipyard links configurable hardware generators with simulation and FPGA-oriented system flows", "chipyard"],
        ["Continuous hardware delivery", "OpenROAD regression practices are moving implementation artifacts and PPA metrics into repeatable CI", "openroadRegression"],
      ],
      tags: ["FPGA", "SoC", "bring-up", "reproducibility"],
    },
    zh: {
      title: "FPGA SoC 原型",
      outcome: "交付能够启动软件并保留架构、验证和实现证据的可重复 FPGA 镜像",
      rationale: "最终原型必须重新汇合全部分支；否则路径只能证明孤立练习而不是系统工程能力",
      acceptance: ["经过审计的 RISC-V SoC 原型", "从干净检出构建 Bitstream 和固件", "在硬件上启动诊断程序与小型应用", "共同发布 ISA、验证、时序和已知限制报告"],
      frontiers: [
        ["开放芯片参考系统", "OpenTitan 正在整合可复用 IP、验证、固件、安全与实现文档", "opentitan"],
        ["从生成器到原型", "Chipyard 把可配置硬件生成器连接到仿真和 FPGA 系统流程", "chipyard"],
        ["持续硬件交付", "OpenROAD 回归实践正在把实现产物和 PPA 指标带入可重复 CI", "openroadRegression"],
      ],
      tags: ["FPGA", "SoC", "Bring-up", "可重复"],
    },
  },
];

function makeDomain(domain, language) {
  const copy = language === "zh-CN" ? domain.zh : domain.en;
  return {
    id: domain.id,
    title: copy.title,
    description: copy.description,
    color: domain.color,
    order: domain.order,
  };
}

function makeNode(node, language) {
  const copy = language === "zh-CN" ? node.zh : node.en;
  const [acceptanceTitle, acceptanceDescription, ...criteria] = copy.acceptance;
  return {
    id: node.id,
    domainId: node.domainId,
    title: copy.title,
    outcome: copy.outcome,
    rationale: copy.rationale,
    dependsOn: node.dependsOn,
    estimatedHours: node.estimatedHours,
    resource: node.resource,
    acceptance: {
      title: acceptanceTitle,
      description: acceptanceDescription,
      criteria,
    },
    frontiers: copy.frontiers.map(([title, summary, evidenceId]) => ({
      title,
      summary,
      evidence: evidence[evidenceId],
    })),
    tags: copy.tags,
  };
}

function makeBundle(language) {
  const chinese = language === "zh-CN";
  return {
    schemaVersion: "1.0.0",
    metadata: {
      id: "open-riscv-soc-prototype",
      title: chinese ? "开源 RISC-V SoC 原型" : "Open RISC-V SoC Prototype",
      description: chinese
        ? "从 ISA 契约分叉进入体系结构、RTL 验证、物理实现和软件集成；最终在可启动的 FPGA SoC 原型重新汇合"
        : "Start from the ISA contract; branch through architecture, RTL verification, physical implementation, and software integration; reunite in a bootable FPGA SoC prototype",
      language,
      generatedAt: "2026-07-30T00:00:00.000Z",
      reviewedAt: "2026-07-30T00:00:00.000Z",
      frameworkVersion: "0.1.0",
    },
    domains: domains.map((domain) => makeDomain(domain, language)),
    nodes: nodes.map((node) => makeNode(node, language)),
    bridges: [
      {
        from: "architecture-microarchitecture",
        to: "physical-synthesis",
        reason: chinese ? "微架构选择必须接受综合后的 PPA 检查" : "Microarchitecture choices must survive synthesized PPA evidence",
      },
      {
        from: "rtl-verification",
        to: "software-firmware",
        reason: chinese ? "固件 Bring-up 依赖经过验证的处理器和外设行为" : "Firmware bring-up depends on verified CPU and peripheral behavior",
      },
    ],
    provenance: {
      briefHash,
      sourceSnapshotAt: "2026-07-30T00:00:00.000Z",
      generator: "scripts/generate-technical-demo.mjs",
      sourcePolicy: "Official technical documentation, standards, complete courses, whole-resource assignments, and link-only public evidence",
    },
    completionContract: {
      expectedDomains: 4,
      expectedNodes: 12,
      expectedFrontiersPerNode: 3,
      wholeResourceOnly: true,
      layoutDirection: "top-to-bottom",
    },
  };
}

await Promise.all([
  writeFile(
    new URL("examples/public-demo/forest.generated.json", root),
    `${JSON.stringify(makeBundle("en"), null, 2)}\n`,
  ),
  writeFile(
    new URL("examples/public-demo/forest.zh-CN.generated.json", root),
    `${JSON.stringify(makeBundle("zh-CN"), null, 2)}\n`,
  ),
]);

console.log("Generated technical RISC-V SoC demo in English and Chinese");
