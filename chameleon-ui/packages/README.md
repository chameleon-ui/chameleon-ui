# packages/

Phase 3 workspace 包。延期包见 [../STRUCTURE.md](../STRUCTURE.md)。

| 目录 | npm 名 | 职责 |
| :--- | :--- | :--- |
| [tokens](./tokens/) | `@chameleon-ui/tokens` | Design Tokens 源与编译 |
| [themes](./themes/) | `@chameleon-ui/themes` | 致敬主题 + design-rules 权威；`validate-rules` |
| [contract](./contract/) | `@chameleon-ui/contract` | schema / 校验工具（非组件契约正文副本） |
| [i18n](./i18n/) | `@chameleon-ui/i18n` | ICU / Locale |
| [primitives](./primitives/) | `@chameleon-ui/primitives` | React Headless（Ark / Zag） |
| [primitives-vue](./primitives-vue/) | `@chameleon-ui/primitives-vue` | Vue Headless（Ark / Zag） |
| [components](./components/) | `@chameleon-ui/components` | React 主包；`catalog.json` |
| [components-vue](./components-vue/) | `@chameleon-ui/components-vue` | Vue catalog 103/103 + ThemeProvider |
| [install-core](./install-core/) | `@chameleon-ui/install-core` | 唯一写盘内核 |
| [registry](./registry/) | `@chameleon-ui/registry` | 目录 + 可选 HTTP 客户端 |
| [registry-private](./registry-private/) | `@chameleon-ui/registry-private` | 本机私有 Registry 服务（`private: true`） |
| [adapter-a2ui](./adapter-a2ui/) | `@chameleon-ui/adapter-a2ui` | A2UI → slug → install-core |
| [cli](./cli/) | `@chameleon-ui/cli` | `chameleon` 薄壳 |
| [mcp-server](./mcp-server/) | `@chameleon-ui/mcp-server` | MCP 薄壳 |
