# @chameleon-ui/registry-private

**L3 私有 registry 服务 —— 本地/内网的 Bearer-token + namespace + semver。**

本包提供与 `@chameleon-ui/registry` **同 schema** 的 `RegistryItem` JSON，但加上了 Bearer token 鉴权、命名空间与语义版本。它**不写任何工程文件**——CLI/MCP 仍调用 `@chameleon-ui/install-core`。

> 定位：这是**本地/内网 Node HTTP 服务**（默认 `127.0.0.1`），不是 IdP、mTLS mesh、多租户 SaaS 或 Kubernetes operator（那些均预留）。Docker/K8s 是同一进程的可选封装，本地 R&D 不需要。遥测默认关闭，除非安装方设 `CU_TELEMETRY=1`。

## 运行

```bash
export CU_REGISTRY_TOKEN="replace-me"
corepack pnpm@9.15.0 --filter @chameleon-ui/registry-private start
```

默认监听 `http://127.0.0.1:8787`。客户端指向它：

```bash
export CU_REGISTRY_URL="http://127.0.0.1:8787"
export CU_REGISTRY_TOKEN="replace-me"
export CU_REGISTRY_NAMESPACE="public"
chameleon add button
```

未设置 `CU_REGISTRY_URL` 时，CLI/MCP 使用捆绑目录，不依赖远程。

## 协议（`chameleon-registry/v1`）

| Method | Path | Auth | Body |
| :--- | :--- | :--- | :--- |
| GET | `/health` | 无 | `{ ok, protocol, telemetry }` |
| GET | `/v1/namespaces` | Bearer | `{ namespaces }` |
| GET | `/v1/namespaces/:ns/items` | Bearer | 摘要；`?full=1` 含文件；`?q=` 搜索 |
| GET | `/v1/namespaces/:ns/items/:id` | Bearer | 最新版本 `{ item }` |
| GET | `/v1/namespaces/:ns/items/:id/versions` | Bearer | `{ versions }` |
| GET | `/v1/namespaces/:ns/items/:id/versions/:ver` | Bearer | 锁定版本 `{ item }` |

`item` = 公开 registry schema + `namespace` + `version`。

### 种子命名空间

| Namespace | 内容 |
| :--- | :--- |
| `public` | 捆绑 **103** UI + 8 主题，`0.0.0` |
| `acme` | `button` 的 `0.9.0` / `1.0.0` / `1.1.0` demo 覆盖（latest=`1.1.0`） |

## 环境变量

| 变量 | 作用 |
| :--- | :--- |
| `CU_REGISTRY_TOKEN` | **启动 server 必需**；客户端用同值 |
| `CU_REGISTRY_HOST` | 默认 `127.0.0.1` |
| `CU_REGISTRY_PORT` | 默认 `8787` |
| `CU_REGISTRY_TLS_CERT` / `CU_REGISTRY_TLS_KEY` | 可选 HTTPS（server 证书）；客户端 mTLS 预留 |
| `CU_REGISTRY_URL` | 客户端：base URL |
| `CU_REGISTRY_NAMESPACE` | 客户端：默认 `public` |

**不要提交 token。** 审计日志记录 method/path/status/source；**不**记录 bearer token 或文件内容。

## 预留（尚未实现）

- 多租户按 namespace token / IdP
- mTLS 客户端证书（`CU_REGISTRY_TLS_CA` 不被读取）
- 市场 / 付费目录字段
