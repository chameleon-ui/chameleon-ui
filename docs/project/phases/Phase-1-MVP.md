# Phase 1 · MVP — 阶段目标与验收

> **日历**：第 2–3 周 · **里程碑**：M1  
> **前提**：M0 已关闭，选型未回退  
> **一句话**：可演示「AI 可装组件+主题 + 含 ar 的 RTL + 三端」最小闭环。  
> **必读**：[工程约定与命名规范](../../engineering/工程约定与命名规范.md) + 本文 §0–§5.7。  
> **工程看板（勾选状态）**：[`../../../chameleon-ui/PHASE1.md`](../../../chameleon-ui/PHASE1.md)。本文是目标卡，不重复看板章节。

---

## 0. 本阶段前置要求

| # | 前置 | 完成标准 |
| :--- | :--- | :--- |
| 0.1 | M0 报告签字 | A0.* 全绿或书面豁免项为空 |
| 0.2 | Headless 已锁定 | `primitives` README 写明 Ark/Base/兜底；禁止再开双轨 poc 扩面 |
| 0.3 | Token/lint/schema 命令可用 | 按 M0「Phase 1 开工检查」一页纸能复现 |
| 0.4 | 创建延期包 | `i18n`、`registry`、`cli`、`mcp-server` 已 mkdir + package.json + README，并进 workspace |
| 0.5 | 20 组件清单冻结会 | [catalog.json](../../../chameleon-ui/packages/components/catalog.json) 签字；置换组件须变更单 |
| 0.6 | 已读工程约定 §3–§4、§7 | 契约单源、安装单核、组件目录结构 |

---

## 1. 阶段效果

| 效果 | 表现 |
| :--- | :--- |
| 20 组件可演示 | 契约 + 4 语文案 + 三断点抽检 |
| 3 主题可切换 | 各含最小 design-rules |
| ar RTL 绿 | 视觉回归必过 |
| MCP 联装 | 一次装组件+主题 |
| 回流可开关 | 测试环境可见 install 事件 |
| CI 咬人 | 违规 PR 可拒 |

---

## 2. 工作任务

**冻结**：做 20 组件 / 3 主题 / 4 Locale（zh-CN, en, de, ar）/ Registry+MCP v0+回流；**不做** 45–50、八主题、21 语、Bench 公开发布、A2UI、工作台。

| ID | 任务 |
| :--- | :--- |
| T1.1–T1.2 | 20 组件 + DoD；创建 `i18n` |
| T1.3 | 三主题 + 最小 rules |
| T1.4–T1.6 | registry + **填实 install-core** + cli/mcp 薄壳 |
| T1.7 | 回流埋点 |
| T1.8–T1.9 | 三端快照、ar 回归、性能抽检 |
| T1.10–T1.12 | 内测 Demo、变形写入契约、法务走查启动 |

**两周**：W2=#1–12+主题初稿+装组件；W3=#13–20+联装主题+回流+回归必绿。

---

## 3. 怎么做（关键路径）

### 3.0 冻结清单（仓库权威）

20 组件与 S5「常用 10」以仓库文件为准，阶段卡不再另维护第二份名单：

**[`chameleon-ui/packages/components/catalog.json`](../../../chameleon-ui/packages/components/catalog.json)**

置换任一 slug 必须在该文件 `changeLog` 写变更单，并同步更新本页。来源：本卡 §3 + 《详细设计与验收说明书》§3.3。

### 3.1 建延期包（第 2 周 Day1）

```text
packages/i18n|registry|cli|mcp-server/
  package.json   # @chameleon-ui/<name>
  README.md
  src/index.ts
```

`cli` / `mcp-server` 的 `package.json` dependencies 必须含 `"@chameleon-ui/install-core": "workspace:*"`。

### 3.2 填 `primitives`（承接 M0）

1. 只保留**选定** Headless 依赖。  
2. 导出与 POC 对齐的薄封装，例如 `ButtonPrimitive`、`DialogPrimitive`。  
3. `components` 只依赖 `primitives`，不直接依赖 `@ark-ui/*` / `@base-ui/*`（便于测试替换）。

### 3.3 写一个组件的标准工序（对 20 个重复）

1. 建目录 `packages/components/src/<slug>/`（slug=kebab）。  
2. 实现 `Component.tsx`：组装 primitives + `--cu-*` 样式。  
3. 写 `contract.json`（对照 schema 校验）。  
4. 写 `locales/{zh-CN,en,de,ar}.json`。  
5. 单测钩子 + 三断点快照。  
6. 在 `src/index.ts` 导出。  
7. 跑体积门禁；合入。

**Dialog 变形**：桌面 = modal；窄屏 = bottom-sheet 行为；在 `contract.responsive` 写清，实现与契约一致。

### 3.4 Token / 主题

1. `themes/src/line|cupertino|silver-arrow/` 各含 `tokens.json`、`design-rules.json`（最小字段集）、`meta.json`。  
2. 最小 rules 至少含：间距阶梯、圆角策略、禁用色对比相关键（字段名进 schema 附录，会议冻结）。  
3. 切换演示：Demo 或测试页 `data-theme="line"`。

### 3.5 install-core + MCP/CLI

1. 在 `install-core` 实现：`resolveRegistryItem` → `writeFiles(targetDir)`；**禁止**执行远端脚本。  
2. CLI：`chameleon add button` 调内核。  
3. MCP：工具名与概要对齐（`search_components`、`get_component`、`install_component`、`list_themes`、`install_theme`、`install_bundle`）。  
4. 联装验收：同一测试工程内安装 `button` + `line` 主题成功。

### 3.6 回流

事件：`install` / `intent_vs_adopt` / `opt_out`；默认 off 或告知后可关；**不采源码与密钥**。测试用环境变量打开，日志/文件可见一条 install。

### 3.7 i18n / RTL CI

1. `i18n` 负责加载与 ICU 工具；组件文案仍在组件 `locales/`。  
2. 伪本地化 + 德语膨胀进主 CI。  
3. ar RTL 快照必绿。

---

## 4. 代码设计

### 4.1 组件层

```
components/src/button/
  index.ts / Button.tsx / styles.css / contract.json / locales/* / Button.test.tsx
```

- Props 名 ≡ contract 枚举名。  
- 样式只消费 `--cu-*`。  
- 逻辑属性 only。

### 4.2 install-core API 草图（实现时保持稳定）

```ts
export type InstallRequest = {
  item: RegistryItem
  targetDir: string
  mode: 'copy' // Phase 1 仅 copy
}
export type InstallResult = { written: string[]; skipped: string[] }
export declare function install(req: InstallRequest): Promise<InstallResult>
```

CLI/MCP 只做参数解析与权限提示，不写第二套 fs 逻辑。

### 4.3 Registry 条目

- 文件：`packages/registry/registry/r/button.json`（路径可按 shadcn 兼容调整，但 slug 稳定）。  
- 字段：`name`、`type`、`files[]`、`dependencies`；主题 `type: registry:theme`。

### 4.4 回流模块位置

建议 `packages/mcp-server/src/telemetry.ts` 与 CLI 共用 `install-core` 内可选 hook（`onInstall`），避免两边各打点。

---

## 5. 命名规范（本阶段增量）

| 对象 | 规范 |
| :--- | :--- |
| 组件 slug | kebab：`app-shell`、`button` |
| 主题 id | `line`、`cupertino`、`silver-arrow` |
| MCP 工具 | snake_case：`install_component` |
| 回流事件 | snake_case：`intent_vs_adopt` |
| CLI 二进制 | `chameleon`（或 `cu`；一经选定写进 README 勿改） |
| 契约文件 | 每组件目录下 `contract.json` |
| 环境变量 | `CU_TELEMETRY=0|1` |

其余服从工程约定。

---

## 5.5 功能点：预留 · 埋点 · 标记（本阶段矩阵）

> 字典见 [工程约定 §10](../../engineering/工程约定与命名规范.md)。  
> **Phase 1 总原则：安装链路 Day-1 埋点必做；`data-ai-*` 鼓励；完整 A5 标记 Phase 3 再门禁。**

| 功能点 | 预留 | 埋点 | 标记 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| 20 组件实现 | 高级变形未做部分在 contract 标 `todo` | —（组件运行时默认不打点） | **必做** contract + locales；**鼓励** `data-ai-role`；**应做** `cu-*` | 运行时埋点走安装工具链，不进每个组件 |
| Dialog 三端变形 | 未实现的断点在 `responsive` **预留**字段说明 | — | contract.`responsive` | |
| `primitives` | 未封装基元列清单 | — | 包版本与选定 Headless 名 | |
| `tokens` / 3 主题 | 其余 5 主题 **禁止**空壳冒充；只文档预留 id 列表 | — | `meta.json` id；最小 `design-rules` | |
| `i18n` 包 | ICU 高级格式 **预留** API | — | locale 文件名 BCP 47 | |
| `install-core` | `generation_quality` **预留**钩子 | **必做** `install`；**应做**经钩子可测 | `@telemetry` | 成功写入后发事件 |
| `cli` | 交互式向导可预留 | **必做** 经内核触发 `install`；来源=`cli` | 命令名稳定 | 禁止旁路 fs |
| `mcp-server` | 额外工具可预留 | **必做** `install` + **应做** `intent_vs_adopt`；来源=`mcp` | 工具名 snake_case | |
| Registry 条目 | `registry:rules` 类型名 **预留**（Phase 4 用） | — | `type`: `registry:ui` \| `registry:theme` | |
| 回流 opt_out | — | **必做** `opt_out` 事件与开关 | 告知文案 key | 默认可关 |
| 三端/RTL CI | 全量矩阵未覆盖项列缺口 | — | 快照名含 locale/dir/viewport | |
| Blocks 冒烟 | 若不做：文档预留 | — | — | |
| `data-ai-state/intent` | schema 可选字段保留 | — | **鼓励** state；intent 可 Phase 3 | |
| A2UI/AG-UI / Studio / 市场 | **禁止**假实现 | **禁止** | — | |

### 合入检查（Phase 1）

- [ ] 每次成功 install 在测试开关下可见事件  
- [ ] `CU_TELEMETRY=0` 时无外发  
- [ ] 无组件内私藏第二套打点 SDK  
- [ ] 矩阵外新功能点已补行  

---

## 5.6 性能指标（本阶段）

> 数字 SSOT：[工程约定 §11](../../engineering/工程约定与命名规范.md)。

| 指标 | 本阶段要求 | 通过标准 |
| :--- | :--- | :--- |
| **S1** 单基础组件 ≤8KB gzip | **必做 · CI 硬门禁** | 20 组件凡属「基础」者超标 PR 红灯 |
| **S3** 单主题 ≤20KB | **必做 · CI** | 3 主题各测 |
| **S4** 单 Locale ≤6KB | **必做 · CI** | zh-CN/en/de/ar 各测 |
| **S5** 首屏套件 ≤100KB | **应做 · 抽检** | AppShell+冻结的 10 组件合计；结果进 M1 报告 |
| **R1** LCP ≤2.5s | **应做 · 抽检** | 中端安卓 / Fast 4G 口径；套件页 |
| **R2** INP ≤200ms P75 | **应做 · 抽检** | 同上 |
| **R3** CLS ≤0.1 | **应做 · 抽检** | 同上 |
| **S2** DataGrid ≤60KB | **—** | MVP 不做 DataGrid 则不适用 |
| `budgets.json` | **必做** | Phase 1 创建并被 CI 读取 |
| 测量口径 | **必做** | peer（react 等）外置；报告写明工具（bundlesize / size-limit / 自研） |

### 合入检查（性能 · Phase 1）

- [ ] CI 存在超 S1 被拒样例（可专门 PR）  
- [ ] S5 套件清单已冻结并附报告  
- [ ] 无无 `perf-waiver` 文档的豁免合入  

---

## 5.7 算法 · 复杂度 · 可用性（本阶段）

> 见 [工程约定 §12](../../engineering/工程约定与命名规范.md)。  
> **Phase 1：复杂度预算开始约束正式包；可用性 U1–U9 对 20 组件生效。**

| 功能点 | 算法/逻辑 | 复杂度 | 可用性 | 要求 |
| :--- | :--- | :--- | :--- | :--- |
| 20 组件交互 | 焦点、Roving、Dismiss（经 primitives） | **C4/C5** | **U1–U5、U8** | 基元不达标不得用自研凑合混进主干 |
| i18n 运行时 | 键查找 + ICU | **C3** | **U7** | 热路径禁止线性扫全部语言包 |
| install-core | 依赖图解析 + 幂等写盘 | **C6** | **U9** | 环依赖失败；部分写入回滚或明确中止 |
| Registry 搜索 | 线性过滤 | **C7**（条目≤500） | 结果可理解 | >500 触发 C8 讨论会 |
| MCP intent 匹配 | 可朴素关键词/标签 | 注明 O(m) | 意图字段进埋点 | 禁止不可复现的随机排序作默认 |
| contract 校验 | Schema | **C9** | **U9** | CI 漂移检查 |
| 伪本地化/德语膨胀 | 字符串变换/检测 | **C10** | **U7** | 进主 CI |
| RTL | 逻辑属性 + 镜像矩阵（Icon） | 编译/静态优先 | **U6** | ar 回归绿 |
| Table 基础 | 无虚拟化 | — | 键盘达单元格（基线） | **C11 不要求** |
| API 面 | — | — | **U8** ≤8 变体 / ≤3 必填 | DoD 评审 |

### 合入检查

- [ ] 新非平凡函数有 `@complexity`  
- [ ] install 失败信息满足 U9  
- [ ] 组件合入过 U2/U3/U4 抽检  
- [ ] 超 C* 有变更单  

---

## 6. 开发内容 / 7. 技术要求 / 8. 突破点

- **开发**：填实 primitives/components/tokens/themes/contract/install-core；新建 i18n/registry/cli/mcp-server；可选 blocks 冒烟。  
- **技术**：L2 不依赖 L3/L4；安装单核；契约单源；ar 必绿；性能预算进 CI。  
- **突破**：B1 契约落地；B2 ar 门禁；B3 最小 rules；B4 回流点火。

---

## 9. 讨论会

| 议题 | 产出 |
| :--- | :--- |
| 20 清单冻结 | 签字表 |
| MCP 工具面 | 冻结列表 |
| 回流隐私文案 | 告知 + opt_out |
| 主题表述 | 所有者确认后的白名单（非律所意见书） |
| O4（若未裁） | 托管裁定 |
| Blocks 0/1 | 书面 |

---

## 10–12. 交付 · 验收 · 报告

**交付**：20 组件、3 主题、4 Locale、Registry+CLI/MCP 联装、回流证据、CI 样例、内测 Demo、M1 报告。  

**验收 A1.1–A1.7**：见详细验收说明书（POC 未回退；20 组件；3 主题；四语+ar；MCP 联装；回流；门禁）。  

**报告**：`docs/project/reports/M1-MVP验收.md` — 摘要、范围、20 矩阵、证据、A1 逐条、缺陷、Phase 2 输入、签字。

---

## 13. 非目标与衔接

不做公开 MIT/21 语/8 主题/Bench 公开发布/工作台。  
下一阶段：[Phase-2-开源发布.md](./Phase-2-开源发布.md)
