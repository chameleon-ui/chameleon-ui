# @chameleon-ui/utils

**框架无关的通用工具 `@chameleon-ui/utils`（纯 JS，零原生依赖）。**

目前提供基础的 **PNG 图像处理原语**（解码 / 编码 / 清空区域 / 找不透明范围），供组件与脚本复用。

## 图像工具（`./image`）

| 函数 | 说明 |
| :--- | :--- |
| `fromBuffer(buffer)` | 解码 PNG Buffer（`pngjs`） |
| `toBuffer(image)` | 把 PNG 编码回 Buffer |
| `opaqueBounds(image)` | 返回像素中不透明区域的最小包围矩形 |
| `clearRegionToTransparent(image, region)` | 把指定矩形区域内的像素置为全透明 |

`PixelRegion` 用 `{ x0, y0, x1, y1 }` 描述一个区域（左下/左上角 `x0/y0` 含，`x1/y1` 不含）。

## 用法

```ts
import { fromBuffer, clearRegionToTransparent, toBuffer } from '@chameleon-ui/utils';

const img = fromBuffer(readFileSync('logo.png'));
clearRegionToTransparent(img, { x0: 16, y0: 965, x1: 113, y1: 998 });
writeFileSync('logo-cleaned.png', toBuffer(img));
```

## 合规说明（请阅读）

这些是**中性的图像处理原语**，不是"去水印"功能，也 **不会** 自动检测或剥离水印。**只能用于你有权修改的素材**（你拥有、或已获得授权移除其署名/标记）。请勿用于剥离他人的版权署名、所有权标识或受版权保护的内容——那可能构成侵权。这是本包的使用边界。

## 构建 / 测试

```bash
pnpm --filter @chameleon-ui/utils build
pnpm --filter @chameleon-ui/utils test
```

## 分层

L3 工具层：不依赖 React / Vue / 任何 UI 框架，可被组件、脚本、构建流程复用。
