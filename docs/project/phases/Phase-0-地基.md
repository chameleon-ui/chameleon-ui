# Phase 0 · 地基 — 阶段目标与验收

> **日历**：第 1–5 日（5 个日历日）  
> **里程碑**：M0  
> **工程目录**：`chameleon-ui/`  
> **一句话**：锁定 Headless 与地基工具链，使 Phase 1 可规模化写组件，而不是边写边换底座。  
> **必读前置**：[工程约定与命名规范](../../engineering/工程约定与命名规范.md)（含 §10–**§12**）+ 本文 §0–§5.7。  
> **工程看板（勾选状态）**：[`../../../chameleon-ui/PHASE0.md`](../../../chameleon-ui/PHASE0.md)。本文是目标卡，不重复看板章节。

---

## 0. 本阶段前置要求（未满足不开 D1 编码）

| # | 前置 | 完成标准 |
| :--- | :--- | :--- |
| 0.1 | 已读工程约定 | 命名、L1 无框架、POC 隔离规则已知 |
| 0.2 | 瘦身 monorepo 可用 | 存在 `poc/*`、`tokens`、`contract`、`install-core`；无远期空包回潮 |
| 0.3 | 工具链 | Node ≥ 20；`cd chameleon-ui && pnpm install` 成功（若本机无 pnpm：先 `corepack enable`） |
| 0.4 | 范围确认 | 站会确认：五日**不**做 Registry/MCP/20 组件；双轨只在 `poc/` |
| 0.5 | 对比表模板 | 已复制本文 §3.2.3 空表到工作笔记（D2 起填） |
| 0.6 | 分支 | 从 `main` 拉 `feat/phase0-poc`（或按人拆 `feat/poc-ark-*` / `feat/poc-base-*`） |
| 0.7 | 三件套 + 性能 + 算法/可用性 | 已读工程约定 §10–§12 与本文 §5.5–§5.7 |

**阻断升级**：`pnpm install` 失败 → 先修环境，不计为 D1 完成。

---

## 1. 阶段效果

| 效果 | 可观察表现 |
| :--- | :--- |
| 底座不再摇摆 | 书面选定 Ark **或** Base（或单栈兜底）；正式包不得双底座 |
| Token 闭环 | 改一处源 → `pnpm --filter @chameleon-ui/tokens build` → 出 CSS 变量 |
| 方向纪律可执行 | 物理 `margin-left` 被 lint 拒绝 |
| 国际骨架可演示 | en + 伪本地化、RTL、`dir` 切换、三端断点一键可跑 |
| 契约有种子 | `component-contract.schema.json` v0.1 自检通过 |
| 开放项收敛 | O1 必裁；O2–O4 裁完或书面延期到固定日 |
| 性能口径对齐 | M0 报告抄录 S1–S5 / R1–R3，注明 Phase 1 起控 |

---

## 2. 工作任务总表

| ID | 任务 | 主路径 |
| :--- | :--- | :--- |
| T0.1 | 双轨各 Button / Input / Dialog | `poc/ark-ui`、`poc/base-ui` |
| T0.2 | 《基元 POC 报告》 | `docs/project/reports/M0-*.md` |
| T0.3 | Token 编译链 | `packages/tokens` |
| T0.4 | 物理方向 lint | `toolings/stylelint-config`（或 eslint 等价） |
| T0.5–T0.7 | i18n / RTL / 三端骨架 | 建议挂在各 poc 的 `demo/` |
| T0.8 | schema v0.1 | `packages/contract` |

### 按日 DoD

| 日 | 焦点 | 必须勾选 |
| :--- | :--- | :--- |
| D1 | 起页 + Button | 双线 dev 起页；Button 可点；根 build 不因 POC 挂死 |
| D2 | Input、Dialog + 对比表 | 每线 3 组件可演示；对比表四维有数 |
| D3 | Token + lint | A0.2、A0.3；O2 倾向写入草稿 |
| D4 | i18n/RTL/三端 | A0.4 |
| D5 | M0 包 | 报告 + O1 + schema + 性能预算表引用；下午只收敛 |

---

## 3. 怎么做（逐步操作）

### 3.1 D1 — 双轨工程跑起来 + Button

**目标**：两条 POC 不是空 `index.ts`，而是可浏览器交互的最小 App。

#### 3.1.1 初始化每个 poc 包（Ark / Base 各做一遍）

1. 在 `poc/ark-ui/package.json`（Base 同理）声明：
   - `"name": "@chameleon-ui/poc-ark-ui"`
   - `"private": true`
   - 依赖：`react`、`react-dom`、所选 Headless、Vite 或等价
   - scripts：`"dev": "vite"`、`"build": "vite build"`
2. 增加：`vite.config.ts`、`index.html`、`src/main.tsx`、`src/App.tsx`、`src/components/button/Button.tsx` + `index.ts` + `styles.css`
3. 根目录确认：`pnpm poc:ark` → filter 到该包 `dev`
4. **记账**：Button 可点人时，记入对比表

#### 3.1.2 Button 最低行为（两线相同验收口径）

| 项 | 要求 |
| :--- | :--- |
| API | 至少 `variant?: 'solid' \| 'outline'` 与 `size?: 'sm' \| 'md'` 之一套 |
| a11y | 可 Tab 聚焦、Space/Enter 触发 |
| 样式 | class 前缀 `cu-button`；尽量预留 `--cu-*`（D3 前允许临时色） |
| 演示 | `App.tsx` 上 ≥2 个实例 |

**禁止**：双 Headless 同包；在 `packages/components` 写正式 Button；引入 Ant/MUI。

---

### 3.2 D2 — Input、Dialog + 对比表

#### 3.2.1 Input

受控 `value`/`onChange`；`disabled`；可选 `invalid`；label 关联；内边距用 `padding-inline-*`。

#### 3.2.2 Dialog

打开/关闭；Esc；焦点回到触发器（有无开箱能力记入对比表）；`role="dialog"`。

#### 3.2.3 对比表填写口径

| 列 | 怎么量 |
| :--- | :--- |
| 完成度 | Button/Input/Dialog 各完成/部分/无 |
| 人时 | 该线三组件合计，0.5h 粒度 |
| 键盘 a11y | Tab / Enter / Esc：通/不通/需手补 |
| RTL 成本 | 低/中/高 |
| Vue 成本 | 低/中/高 + 一句依据 |
| 依赖负担 | 依赖数、类型体验 |
| **性能体感（非门禁）** | 操作是否明显卡顿；是否引入重运行时 |

---

### 3.3 D3 — Token 编译链 + 物理属性 lint

1. O2 倾向：Style Dictionary vs Terrazzo。  
2. `packages/tokens`：`src/core/*.json` → `scripts/build-css-vars.ts` → `dist/css/variables.css`。  
3. 变量名：`color.fg.default` → `--cu-color-fg-default`。  
4. 验收：改源 → `pnpm --filter @chameleon-ui/tokens build` → CSS 变。  
5. stylelint：拒绝物理左右 margin/padding；`fixtures/bad.css` 红、`good.css` 绿。

---

### 3.4 D4 — i18n / RTL / 三端

```
poc/<vendor>/src/demo/
  i18n.ts · locales/en.json · locales/en-XA.json
  RtlPlayground.tsx · Breakpoints.tsx
```

en + 伪本地化；`dir` 切换；390 / 768 / 1280；一键 `pnpm poc:ark` / `poc:base`。

---

### 3.5 D5 — schema + 报告 + 裁定

1. `packages/contract/schemas/component-contract.schema.json` + Ajv 自检 + sample。  
2. O1 裁定会；回写开放项；primitives README 写选定结果。  
3. 报告附录：**性能预算表 S1–S5 / R1–R3**（抄工程约定 §11），注明 Phase 1 起控。

---

## 4. 代码设计（本阶段）

| 原则 | 落地 |
| :--- | :--- |
| 对比公平 | 两线 props 同构（可复制 `DemoButtonProps`） |
| 可替换 | Headless import 集中在组件文件，便于迁 `primitives` |
| 产物单向 | Token 只产出；POC 只消费 |
| install-core | 仅 `TelemetryHook` 预留，禁止发事件 |

依赖：`poc → react, headless, tokens`；禁止 `tokens → react`。

---

## 5. 命名规范（本阶段清单）

| 对象 | 名称 |
| :--- | :--- |
| POC 包 | `@chameleon-ui/poc-ark-ui` / `poc-base-ui` |
| 组件目录/文件 | `button/` · `Button.tsx` |
| CSS | `cu-button`、`--cu-*` |
| 伪本地化 | `en-XA.json` |
| Schema | `component-contract.schema.json` |
| 提交 | `feat(poc-ark): …` / `chore(tokens): …` |

全局见工程约定。

---

## 5.5 功能点：预留 · 埋点 · 标记（本阶段矩阵）

> 字典见 [工程约定 §10](../../engineering/工程约定与命名规范.md)。  
> **Phase 0 总原则：不发生产遥测；只做结构预留与本地标记。**

| 功能点 | 预留 | 埋点 | 标记 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| POC Button / Input / Dialog | **预留**迁入注释：`// @phase-1 migrate → packages/components` | **禁止** | **应做** `cu-*` class；**鼓励**注释标明未来 `data-ai-role`（不要挂假属性） | API 与正式包对齐 |
| POC Demo（i18n/RTL/三端） | **预留** Phase 1 locales 路径说明 | **禁止** | `en` / `en-XA`；`dir` | 不做访问统计 |
| `packages/tokens` | **预留** themes overlay 约定 | **禁止** | `--cu-*` | |
| 物理属性 lint | — | **禁止** | `bad.css` / `good.css` | |
| `packages/contract` schema | **预留**可选 data-ai/telemetry 字段 | **禁止** | schema `$id` | |
| sample contract | — | **禁止** | slug=`button` | |
| `primitives` / `components` 空壳 | **预留** | **禁止** | `status: pending-M0` | |
| `install-core` | **必做预留** `TelemetryHook` + `@telemetry:hook` | **禁止**发事件 | `@phase-1` | |
| Registry / CLI / MCP / 回流 | **禁止**假实现 | **禁止** | — | |

### 合入检查（Phase 0 · 三件套）

- [ ] 新功能点已填入上表或追加一行  
- [ ] 无 `fetch` 打点、无第三方分析 SDK  
- [ ] `install-core` 仅钩子空位  
- [ ] POC 未冒充已支持 data-ai / 回流  

---

## 5.6 性能指标（本阶段）

> 全量数字见 [工程约定 §11](../../engineering/工程约定与命名规范.md)。  
> **Phase 0：不设 CI 红线，但必须留下测量口径与挂点。**

| 指标 ID | 预算（提醒） | 本阶段要求 | 做法 |
| :--- | :--- | :--- | :--- |
| **S1** | 单基础组件 ≤8KB gzip | **预留** | 报告抄录；Phase 1 起控 |
| **S2** | DataGrid ≤60KB | **—** | 本阶段无 |
| **S3** | 单主题 ≤20KB | **预留** | 同上 |
| **S4** | 单 Locale ≤6KB | **预留** | 同上 |
| **S5** | AppShell+10 ≤100KB | **预留** | 同上 |
| **R1** | LCP ≤2.5s | **预留** | 不跑正式 LHCI；对比表可记卡顿体感 |
| **R2** | INP ≤200ms P75 | **预留** | 同上 |
| **R3** | CLS ≤0.1 | **预留** | 同上 |
| **E1** | 零运行时样式优先 | **应做倾向** | Token→CSS；避免运行时主题引擎 |
| CI 挂点 | `perf:size` / `perf:lhci` | **预留** | 文档写明任务名；禁止空红灯挡 POC |
| `budgets.json` | Phase 1 路径 | **预留** | 目标：`benchmarks/budgets.json` |

### 合入检查（性能 · Phase 0）

- [ ] M0 报告含 S1–S5 / R1–R3 引用与「Phase 1 起控」句  
- [ ] 未把 POC 体积超标当成失败  
- [ ] 重依赖若引入，对比表已记「性能风险」  

---

## 5.7 算法 · 复杂度 · 可用性（本阶段）

> 全量字典见 [工程约定 §12](../../engineering/工程约定与命名规范.md)。  
> **Phase 0：把「会用到哪些算法、复杂度是否可接受、可用性怎么比」写进对比与报告，不要求全量 WCAG 审计。**

### 5.7.1 本阶段算法点

| 功能点 | 预期算法/逻辑 | 复杂度目标 | 可用性要求 | 本阶段动作 |
| :--- | :--- | :--- | :--- | :--- |
| Token 编译 | 引用解析 + 展平 + 稳定排序出 CSS | **C1/C2**；环引用报错 | **U9** 错误含路径 | D3 **应做**；注释 `@complexity` |
| Schema 自检 | JSON Schema 校验 | **C9** 可接受 | **U9** | D5 **应做** |
| Button/Input 焦点与键 | 多来自 Headless | 记「库内算法 / 是否自研」 | **U2/U3** 演示 | D1–D2 对比表必填 |
| Dialog 焦点陷阱 | 基元库陷阱算法 | **C4**；Esc 可出 | **U2/U3** | D2 通/不通记账 |
| RTL | **优先逻辑属性**，禁止运行时整树镜像算法 | — | **U6** | D4 演示 |
| i18n 查找 | Map/对象键查找 | **C3** 倾向 | 键名稳定 | D4 小字典即可 |
| lint 扫描 | 逐文件规则 | **O(文件)** | 违规信息可读 | D3 |
| install-core | — | — | — | **禁止**实现解析算法，仅预留 |
| 自研焦点/选择 | — | — | — | **禁止**（除非基元双双缺且开会） |

### 5.7.2 POC 对比表增列（D2 起）

| 列 | 含义 |
| :--- | :--- |
| 焦点/键序算法来源 | Ark 内置 / Base 内置 / 自研（自研须标红） |
| 复杂度风险 | 低/中/高（是否每键全 DOM 扫描等） |
| 可用性键程 | 打开并关闭 Dialog 的键击是否顺畅（U5 预感） |

### 5.7.3 合入检查

- [ ] Token build 有确定性说明 + 环引用失败用例（有则勾）  
- [ ] 非平凡函数有 `@complexity` 或 README 一段  
- [ ] 对比表含 a11y + 算法来源列  
- [ ] 未在浏览器运行时做全量 Token 编译（C12）  

---

## 6. 开发内容对照表

| 路径 | 做 | 不做 |
| :--- | :--- | :--- |
| `poc/ark-ui` · `poc/base-ui` | 三组件 + demo | 正式契约全集 |
| `packages/tokens` | 源 + build → CSS 变量 | 八主题 |
| `packages/themes` | 可选极薄 | design-rules 完整化 |
| `packages/contract` | schema + 自检 + sample | 手写 20 份 contract 正文 |
| `packages/primitives` | README 写选定结果 | 双轨实现 |
| `packages/components` | 空壳 | 20 组件 |
| `packages/install-core` | 钩子占位 | 安装实现 / 埋点上报 |
| `toolings/stylelint-config` | 物理属性拒绝 + fixtures | 视觉回归云（O4） |

---

## 7. 技术要求（摘要）

- React 18/19 + TS strict  
- L1 无框架；POC 可含 React  
- 逻辑属性；D3 后禁止物理左右 margin/padding  
- O2 编译器二选一写进报告  
- 性能数字以工程约定 §11 为准，本阶段只预留  

---

## 8. 突破点

| 突破 | 本阶段 |
| :--- | :--- |
| B1 | schema v0.1 播种（不公开） |
| B2 | RTL 页 + 逻辑属性 lint |
| B3 | Token 链铺路 |
| B4 | 不做（埋点禁止） |

---

## 9. 需深入开讨论会的议题

| ID | 议题 | 时机 | 产出 |
| :--- | :--- | :--- | :--- |
| O1 | Ark vs Base | D5 上午必开 | 书面结论 |
| O2 | SD vs Terrazzo | D3/D5 | 裁定 |
| O3 | Turbo 去留 | D5 | 裁定或维持 |
| O4 | 视觉回归托管 | D5 | 裁定或改期 |
| — | O1 僵持 | D5 下午 | 单栈兜底签字 |
| — | S5「常用 10」预名单 | D5 可选 | 供 Phase 1 冻结 |

---

## 10. 交付标的

1. 《基元 POC 报告》  
2. O1–O4 回写开放项表  
3. Token 一键命令说明  
4. lint 红绿证据  
5. demo 一键入口  
6. schema v0.1 + 自检绿  
7. Phase 1 开工检查一页纸（基元名、命令、路径）  
8. **性能预算表引用（S1–S5 / R1–R3）+ Phase 1 起控说明**  

---

## 11. 验收（M0）

| # | 通过标准 |
| :--- | :--- |
| A0.1 | 书面选型/兜底，禁止混用未选底座 |
| A0.2 | 改 Token 源可重编译 CSS 变量 |
| A0.3 | 物理方向样例被拒，改正后通过 |
| A0.4 | 伪本地化 + RTL + 三端一键可跑 |
| A0.5 | schema 存在且自检通过 |
| A0.6（文档） | M0 报告含性能预算引用（不挡「体积未测」） |

全过 → Phase 1。兜底不豁免 A0.2–A0.5。

---

## 12. 阶段性验证收报告模板

路径：`docs/project/reports/M0-基元POC与地基验收.md`

1. 摘要（选定/兜底一句话）  
2. 前置与范围回顾  
3. 双轨对比表（含性能体感列）  
4. 代码落点与迁移计划  
5. O1–O4 裁定表  
6. A0.1–A0.5 证据  
7. **性能预算表（S1–S5 / R1–R3）与 Phase 1 起控**  
8. **算法/可用性对比结论（C* / U* 与基元焦点算法来源）**  
9. 命名与命令速查  
10. 风险与 Go/No-Go  
11. 签字栏  

---

## 13. 非目标与衔接

**不做**：Registry/CLI/MCP、20 组件、八主题、21 语、文档站、填实 install-core、体积 CI 红灯、生产埋点。  
**下一阶段**：[Phase-1-MVP.md](./Phase-1-MVP.md)（S1/S3/S4 CI 硬门禁从此开启）。
