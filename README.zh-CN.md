<div align="center">

# 知识森林框架

**说清楚你想学什么；得到一张可以照着学、逐步完成、长期维护的路线图**

[中文演示](https://aialra-0.github.io/knowledge-forest-framework/?lang=zh-CN) · [English demo](https://aialra-0.github.io/knowledge-forest-framework/?lang=en) · [English](README.md) · [工作原理](docs/architecture.md) · [质量检查](docs/quality-gates.md) · [安全](SECURITY.md)

</div>

Knowledge Forest 会把宽泛目标拆成不同领域的学习路径；每一步都会告诉你去哪里学、学完要做出什么、必须先完成什么，以及这个方向目前正在研究什么；

## 使用本框架构建的真实私有森林

以下截图来自 AIALRA 正在运行并由 Authentik 保护的私有部署；截图已经脱敏；私有数据和部署地址都不会进入这个公共仓库；

- 十六棵可以独立推进的终身学习树；
- 一千零二十八个可以逐个检查和点亮的节点；
- 半导体树包含三百七十六个节点和八十二条分支；
- 每个节点都包含完整资源、验收作品、学习平台、三个当前研究方向和持久化进度；

![AIALRA 私有半导体知识森林中文界面](docs/images/aialra-forest-chip-overview-zh.jpg)

![AIALRA 私有知识森林目录中文界面](docs/images/aialra-forest-directory-zh.jpg)

### 更多真实生产界面

平台指南不是第二套课程表；它在学习树已经确定学习目标后；帮助学习者找到持续维护的行业工具、实验环境、流片入口和开放研究基础设施；

![AIALRA 私有半导体平台指南中文界面](docs/images/production-platform-guide-zh.png)

具身智能树展示从共同基础到感知、控制、机械系统和系统集成的真实分叉；学习者可以直接看出哪些节点能够并行推进；哪些节点必须等待前置成果；

![AIALRA 私有具身智能分支树中文界面](docs/images/production-embodied-tree-zh.png)

研究前沿界面把学习节点和仍未解决的问题放在同一条路径上；每条前沿都写明具体问题并提供可以反查的证据；

![AIALRA 私有研究前沿中文界面](docs/images/production-research-frontiers-zh.png)

移动端使用同一棵真实 AI 学习树；保留分支、节点状态和后续路径；不是另做一张简化的宣传页；

![AIALRA 私有 AI 学习树移动端中文界面](docs/images/production-ai-mobile-zh.png)

## 你需要做什么

1. 用自己的话写下目标；同时写明已经掌握的内容、可投入时间和重要限制；
2. 将页面生成的学习需求交给使用本框架的 Agent；
3. 打开生成后的知识森林并选择一个领域；
4. 使用节点提供的完整资源学习；完成节点要求的作品；点亮节点；进入下一个已经解锁的节点；
5. 下次回来时继续使用浏览器中保存的进度；

## 每个节点会提供什么

- 一个明确的技能或问题；
- 它为什么值得学习；
- 一门完整课程、一本完整教材、一篇完整文章、一个完整标准或一套完整官方文档；
- 学完以后必须做出的具体作品；
- 前置节点；节点被锁定时会直接说明还缺什么；
- 三个当前研究方向及其日期和来源；
- 进度、反馈、导出和资源失效报告；

公开案例是一棵真实依赖树；不是一条单线列表；两个共同底座会分叉进入证据理解、无障碍交互、视觉表达和可靠交付四个领域；最终在发布节点重新汇合；它包含十二个节点、十二份完整资源、十二项实践作品和三十六个当前研究方向；

中文与英文使用两个独立入口和完整本地化界面；二者显示同一棵依赖树并共享浏览器本地进度；单个页面不会混用两种语言；

![公开演示统计](public/readme-stats.svg)

## 直接体验

打开[中文演示](https://aialra-0.github.io/knowledge-forest-framework/?lang=zh-CN)；[英文演示](https://aialra-0.github.io/knowledge-forest-framework/?lang=en)使用独立入口；输入类似下面的目标；

```text
我想学习如何构建可靠的家用机器人；我已经掌握 Python 和基础线性代数
```

页面会整理出清晰的学习需求；Agent 随后调查完整领域、核验资源并生成最终知识森林；

## 本地运行

```bash
git clone https://github.com/AIALRA-0/knowledge-forest-framework.git
cd knowledge-forest-framework
npm install
npm run dev
```

通过命令行整理学习需求；

```bash
node packages/cli/bin/knowledge-forest.mjs brief \
  "构建具身智能研究级学习森林；我已经学过 Python"
```

检查生成后的森林；

```bash
node packages/cli/bin/knowledge-forest.mjs audit \
  examples/public-demo/forest.generated.json
```

将 [`skills/knowledge-forest/SKILL.md`](skills/knowledge-forest/SKILL.md) 交给兼容的 Agent；它会执行完整调查、生成和检查流程；

## 森林如何生成

```mermaid
flowchart TB
    A["目标与现有基础"] --> B["主要领域与前置关系"]
    B --> C["每一步的完整学习资源"]
    C --> D["能够证明已经学会的作品"]
    D --> E["当前研究方向及来源"]
    E --> F["完整性、来源、安全与真实体验检查"]
    F --> G["可交互的知识森林"]
    G --> H["学习进度与反馈"]
    H --> B
```

每次正式生成都会提供；

```text
forest.generated.json
provenance.json
audit-report.json
review-queue.json
```

简单来说；这些文件分别保存页面要显示的森林、信息来自哪里、哪些检查已经通过、哪些判断仍然需要人来决定；

## 质量检查

运行 `npm test` 会检查；

- 每个节点都属于明确领域；前置关系能够正常解锁；
- 学习资源是完整课程或完整资料；不是随意截取的一章；
- 学完必须产生可查看的作品；
- 当前研究方向带有日期和来源；
- 健康、金融、航空、航天和安全等领域具有适当边界；
- 私有路径、账号、凭据和个人课程记录不能进入公共版本；
- 最终页面能够正常构建；

自动检查只是第一层；每次发布还要用桌面端和移动端完成真实任务；记录用户在哪里困惑、能否找到恢复办法、最后具体修改了什么；

可以查看最新的[真实用户旅程报告](docs/user-journey-review.md)；

## 公共项目与私有项目

公共仓库保存可复用代码、空白模板、合成示例和通用改进；

个人学习数据、进度、受限资源、研究档案、凭据、认证和部署配置放在独立私有仓库；本框架不会把私有数据复制到公共项目；

## 维护者入口

```text
app/                         公开交互演示
packages/schema/             生成器与页面共同使用的数据形状
packages/core/               前置关系、进度与质量规则
packages/agent/              将自然语言目标整理成清晰需求
packages/cli/                本地生成与检查命令
skills/knowledge-forest/     Agent 完整工作流程
prompts/                     针对不同调查阶段的提示
schemas/                     机器可读取的文件定义
templates/                   空白用户输入
examples/public-demo/        独立生成的公开示例
docs/                        设计、质量、隐私和政策
scripts/                     报告、统计、脱敏和体验检查
tests/                       可重复执行的发布检查
```

阅读[相关项目调查](docs/project-landscape.md)可以了解现有项目与本框架的边界；阅读[系统结构](docs/architecture.md)可以了解文件如何流动；阅读[Agent 工作协议](docs/agent-protocol.md)可以了解生成流程；

## 隐私与内容许可

- 进度和反馈默认只保存在浏览器；
- 公开演示不包含行为追踪；
- 公开示例独立生成；
- 没有明确再分发许可的第三方资料只保留链接；
- 原创代码采用 Apache-2.0；
- 公开示例学习内容采用 CC BY 4.0；
- 用户生成的森林由用户自己选择许可证；

发布实例前请阅读[隐私边界](docs/privacy.md)、[内容政策](docs/content-policy.md)和[安全政策](SECURITY.md)；

## 参与贡献

从 [CONTRIBUTING.md](CONTRIBUTING.md) 开始；说明用户遇到了什么问题、修改后实际会发生什么、使用了哪些自动检查和真实旅程；

## 当前状态

项目仍处于早期公共版本；当来源、许可证、安全边界或领域完整性仍需人工判断时保留待复核状态；生成的森林是学习指导；不能替代医疗、法律、金融、执照或监管领域的专业意见；
