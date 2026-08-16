# docs/ai：AI 消费说明

本目录是 [`../../AGENTS.md`](../../AGENTS.md) 的补充。AGENTS.md 是唯一事实来源，这里只放挂载、组合、机制层面的展开说明，不重复规则。

## 阅读顺序

1. [`../../AGENTS.md`](../../AGENTS.md)：60 秒上手，然后是安装、CSS、NEVER 清单。
2. [`consumer-agent-bootstrap.md`](./consumer-agent-bootstrap.md)：可直接粘贴进消费者侧 Cursor Rule 或 prompt 的短规则。
3. [`agent-consume.md`](./agent-consume.md)：MCP 挂载（可选）、工具顺序、App 外壳、外部安装。
4. 按需查阅：
   - [`how-ai-works.md`](./how-ai-works.md)：机制总览，契约驱动、意图词表、MCP 链路、映射/渲染/安装三层
   - [`schema-renderer.md`](./schema-renderer.md)：JSON → 组件树（默认映射 10 slugs）
   - [`component-contract-v0.2-mapping.md`](./component-contract-v0.2-mapping.md)：契约字段映射
   - [`data-ai-vocabulary.md`](./data-ai-vocabulary.md) / [`.json`](./data-ai-vocabulary.json)：冻结的 `data-ai-intent` 词表（由脚本生成，勿手改）
   - [`theme-extends.md`](./theme-extends.md)：主题 `$extends`（编译期）
   - [`community-rules-pack-guide.md`](./community-rules-pack-guide.md)：社区 design-rules 包

## 文件地图

| 文件 | 用途 |
| :--- | :--- |
| [`agent-consume.md`](./agent-consume.md) | 外部消费应用的挂载与组合规范 |
| [`consumer-agent-bootstrap.md`](./consumer-agent-bootstrap.md) | 可粘贴的短规则与入口代码片段 |
| [`schema-renderer.md`](./schema-renderer.md) | SchemaRenderer 的数据形状、导入方式、能力边界 |
| [`component-contract-v0.2-mapping.md`](./component-contract-v0.2-mapping.md) | v0.1 → v0.2 与报告字段映射 |
| [`data-ai-vocabulary.md`](./data-ai-vocabulary.md) | 意图词表的人类可读表（与 `.json` 一起由 `scripts/generate-data-ai-vocabulary.mjs` 生成） |
| [`data-ai-vocabulary.json`](./data-ai-vocabulary.json) | 契约与门禁使用的机器词表 |
| [`theme-extends.md`](./theme-extends.md) | 派生主题的 DTCG `$extends` |
| [`community-rules-pack-guide.md`](./community-rules-pack-guide.md) | 社区规则包：创建、校验、注册、安装 |
| [`how-ai-works.md`](./how-ai-works.md) | 机制总览：契约驱动、意图词表、MCP、映射/渲染/安装三层 |
