# @chameleon-ui/cli

**L3 · 薄命令行外壳，指向 `@chameleon-ui/install-core`。所有文件写盘都走共享安装内核。**

CLI 负责给用户一个符合直觉的命令入口，但**不**自己写盘——安装逻辑在 `install-core`。

## 用法

```bash
chameleon add button
chameleon add-theme line
chameleon bundle button line
chameleon search
chameleon telemetry-off
```

按版本 / 命名空间安装：

```bash
chameleon add button@1.0.0
```

## Telemetry

默认**关闭**。用 `CU_TELEMETRY=1` 启用；启用时安装事件以 JSON 打到 stderr，不用任何网络分析 SDK。

## 私有 registry

- 不设 `CU_REGISTRY_URL` → 用捆绑目录安装。
- 需要连私有 server：

```bash
export CU_REGISTRY_URL=http://127.0.0.1:8787
export CU_REGISTRY_TOKEN=<token>
export CU_REGISTRY_NAMESPACE=public
chameleon add button
```

## 依赖

- `@chameleon-ui/install-core`（workspace）
- `@chameleon-ui/registry`（workspace）
