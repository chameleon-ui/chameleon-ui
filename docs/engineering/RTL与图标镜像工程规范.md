# RTL 与图标镜像工程规范

> 版本：v1.0 · 日期：2026-08-12  
> 适用：Chameleon UI Phase 0–4  
> 效力：与 [`工程约定与命名规范.md`](./工程约定与命名规范.md) 配套；阶段范围以 `docs/project/phases/Phase-N-*.md` 为准。

## 1. 基本原则

1. **方向来自语言与内容，不来自视觉猜测。** 应用根设置 `lang` 与 `dir`；组件继承方向，只有独立语义片段才局部覆盖。
2. **布局默认写逻辑属性。** 左右含义一律表达为 inline start/end；块轴表达为 block start/end。
3. **不运行时遍历整树镜像。** 能由 CSS、DOM 顺序或基元状态机完成的，不写 JavaScript 翻转算法。
4. **只镜像方向语义，不镜像所有图形。** 文本、商标、数字、播放/暂停等不因 RTL 自动翻转。
5. **RTL-first 评审。** Phase 1 起正式组件先用 `ar + rtl` 检查，再回看 LTR；LTR 通过不能替代 RTL 证据。

## 2. CSS 与 DOM 规则

| 禁止/慎用 | 应用 |
| :--- | :--- |
| `margin-left/right` | `margin-inline-start/end` 或 `margin-inline` |
| `padding-left/right` | `padding-inline-start/end` 或 `padding-inline` |
| `border-left/right*` | `border-inline-start/end*` |
| 方向性定位 `left/right` | `inset-inline-start/end` |
| `float: left/right`、`clear: left/right` | 逻辑值或现代布局 |
| 为 RTL 反转整个 DOM | 保持语义/阅读顺序，由 Grid/Flex 与逻辑属性布局 |

`width`、`height`、`top`、`bottom` 本身不表达左右方向，Phase 0 lint 不误拦截；若它们在具体组件中编码了方向含义，评审时改成逻辑尺寸或 inset。

- 用 `document.documentElement.lang` 与 `dir` 表达页面级语言/方向。
- 组件不得硬编码 `dir="ltr"` 来掩盖问题；代码、手机号、邮箱等独立 LTR 片段可显式声明方向。
- 焦点顺序以 DOM 语义顺序为准，不用正 `tabindex` 重排视觉顺序。
- 横向键盘导航遵从所选 Ark/Zag 基元的 RTL 行为；不得在组件层重复反转两次。

## 3. 图标镜像矩阵

| 图标族/示例 | RTL 策略 | 原因与验收 |
| :--- | :--- | :--- |
| 返回/前进、上一项/下一项箭头 | **镜像** | 表达 inline 方向；LTR/RTL 快照与键盘动作一致 |
| 面包屑分隔符、列表缩进/减少缩进 | **镜像** | 表达阅读流或层级推进方向 |
| 横向进度方向、轮播切换、抽屉进入/退出提示 | **镜像** | 与 inline 流向绑定；实际进度值/动作不可颠倒 |
| 撤销/重做 | **按图标语义单独登记** | 箭头造型可能方向相关，不能靠全局规则猜测 |
| 播放、暂停、音量、下载、上传、刷新、搜索、关闭 | **不镜像** | 通用动作，不表达文本阅读流 |
| 对勾、警告、信息、日历、时钟 | **不镜像** | 无方向语义 |
| 品牌 Logo、商标、国旗 | **禁止镜像** | 资产完整性与法务要求 |
| 文字/数字嵌入图标 | **禁止自动镜像** | 镜像会破坏字形；应准备本地化资产 |
| 数据图表、地图、时间轴 | **默认不镜像** | 数据坐标有自身语义；仅在产品契约明确时调整 |

Phase 1 的 Icon contract 必须声明 `rtl`: `mirror | preserve | localized`，默认 `preserve`。自动镜像只能由稳定 class/contract 字段驱动，例如在 `[dir='rtl']` 下对 `mirror` 图标做 `scaleX(-1)`；禁止按文件名模糊匹配。

## 4. 双向文本（bidi）

- 用户生成内容、外部名称、混合方向短语优先用语义元素 `<bdi>`；CSS 等价隔离可用 `unicode-bidi: isolate`。
- 不把 `unicode-bidi: bidi-override` 当通用修复；只有协议/数据确实要求覆盖字符顺序时才允许，并须测试。
- 对纯文本插值使用隔离边界，避免 RTL 用户名、订单号或 URL 改变周围标点顺序。
- 数字、电话、邮箱、代码与 URL 保留其自然/显式方向；不要仅为视觉对齐反转字符串。
- 省略号、括号、标点与数字格式必须用真实 `ar` 内容回归，伪本地化只能发现膨胀，不能替代 bidi 测试。

## 5. 组件与可用性门禁

| 项 | 要求 |
| :--- | :--- |
| 阅读/DOM 顺序 | RTL 下仍符合语义；视觉排列不得让屏幕阅读器顺序失真 |
| 键盘 | Tab 顺序稳定；方向键行为由 APG/基元约定决定；Dialog Esc 可出且焦点归还 |
| 触控 | Phase 1 起适用控件命中区 ≥44×44px |
| 浮层定位 | start/end 与碰撞回退在 RTL 下都有测试 |
| 动画 | 方向性进入/退出随 inline 方向；减动效偏好继续生效 |
| 文案 | `ar` 主基线；伪本地化与德语膨胀不能代替真实 RTL 字形/行高检查 |

## 6. 分阶段 CI 范围

| 阶段 | 必须覆盖 |
| :--- | :--- |
| Phase 0 | stylelint 拒绝左右物理属性；bad 红/good 绿；POC `en-XA`、`dir` 切换、390/768/1280；两线键盘/焦点演示 |
| Phase 1 | `ar` 成为正式 RTL 基线；每个正式组件的 LTR/RTL 三端快照；图标矩阵、伪本地化、德语 +35%、U1–U9；违规 PR 拒绝 |
| Phase 2 | `ug` / `ur` / `fa` 随 Locale 全量加入 RTL 快照；发布前 RTL/伪本地化全绿 |
| Phase 3 | 工作台导出物与 `data-ai-*` 契约一致；私有 Registry 不放宽 RTL 门禁 |
| Phase 4 | 市场上架流水线抽检 a11y、RTL、图标策略、license 与 rules schema |

Phase 0 工作流执行 `pnpm ci:phase0`；POC 自身 lint 扫描 `src/**/*.css`，保证 Turbo 缓存键包含业务 CSS。Phase 1 使用 O4 裁定的 Playwright baseline + CI artifact，云托管在 2026-08-28 前复审。

## 7. 评审清单

- [ ] 根/局部 `lang`、`dir` 与内容一致，无硬编码 LTR 掩盖。
- [ ] 无左右物理 CSS；bad fixture/业务注入会让根 lint 失败。
- [ ] DOM/焦点/阅读顺序正确，未用 JS 全树镜像或正 `tabindex` 重排。
- [ ] 新图标已在矩阵/contract 归类，品牌和文字资产不镜像。
- [ ] UGC 与混排使用 bidi 隔离，真实 `ar` 样例覆盖标点、数字、长文案。
- [ ] 三端与阶段要求的 Locale 快照齐全；失败产物可下载复核。
- [ ] 规则变更同步更新本规范、组件 contract 与相关基线。
