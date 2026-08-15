# إنشاء موضوع مخصص

> **العربية · [简体中文](creating-a-theme.md) · [English](creating-a-theme.en.md) · [繁體中文（香港）](creating-a-theme.zh-HK.md)**

يرشدك هذا الدليل إلى إضافة **موضوعك الخاص** إلى Chameleon UI. وهو مبني على الآلية الحقيقية: الموضوع **طبقة (overlay)** — يكتفي بتجاوز مجموعة فرعية من رموز core بدل نسخها كلها، ثم يقوم برنامج بناء `themes` بترجمتها إلى ملف متغيرات CSS واحد.

> المتطلبات: نفّذت `pnpm install` في جذر المستودع وتبحث في `packages/themes` و`packages/tokens`.

---

## 1. افهم: الموضوع = طبقة (overlay)

- **core** موجود في `packages/tokens/src/core/` — المصدر المعتمد الوحيد لجميع رموز التصميم (اللون، التباعد، نصف القطر، الظل، الحركة، الخطوط).
- **مجلد الموضوع** موجود في `packages/themes/src/<id>/`؛ وملفه `tokens.json` يصف فقط **ما تريد تغييره**. الرموز غير المغطاة تُورَّث من core.
- تستهلك CSS للمكونات والمواضيع هذه القيم عبر**خصائص CSS المخصصة** (`--cu-*`).

يحتوي مجلد الموضوع الأدنى على 4 ملفات:

```
src/<id>/
├── tokens.json        # طبقة: يتجاوز مجموعة فرعية من رموز core (مطلوب)
├── design-rules.json  # قواعد الخط/التباعد/نصف القطر/التباين/الأنماط المحظورة (مطلوب)
├── meta.json          # id / label / preview / fonts (مطلوب؛ id يساوي اسم المجلد)
└── effects.css        # اختياري: لغة نصف القطر/الظل/الحركة، تُلحق بالـ CSS عند البناء
```

---

## 2. الخطوة 1: أنشئ مجلد الموضوع

أنشئ مجلدًا تحت `packages/themes/src/` (المعرفات بحروف صغيرة وشرطات، مثل `my-brand`):

```bash
mkdir packages/themes/src/my-brand
```

### 2.1 `tokens.json` (طبقة overlay)

اكتب فقط الرموز التي تريد تغييرها. بناء الجملة `$type`/المفاتيح وصيغة المراجع `{...}` أدناه تطابق الشكل الحقيقي لـ core (قارن مع `packages/tokens/src/core/*.json`).

```json
{
  "color": {
    "palette": {
      "brand": { "$value": "#0ea5e9" },
      "ink":   { "$value": "#0b1220" },
      "paper": { "$value": "#fbfcfd" }
    },
    "background": {
      "default":   { "$value": "{color.palette.paper}" },
      "subtle":    { "$value": "#eef4f8" },
      "elevated":  { "$value": "{color.palette.paper}" },
      "inverse":   { "$value": "{color.palette.ink}" }
    },
    "fg": {
      "default": { "$value": "{color.palette.ink}" },
      "muted":   { "$value": "#52606e" }
    }
  },
  "radius": {
    "sm": { "$value": { "value": 6, "unit": "px" } },
    "md": { "$value": { "value": 10, "unit": "px" } },
    "lg": { "$value": { "value": 16, "unit": "px" } }
  }
}
```

**قواعد أساسية**
- تستخدم المراجع `{...}` للإشارة إلى رموز موجودة، مثل `{color.palette.ink}`؛ يوسّعها المحرِّج لتفادي تكرار القيم.
- لست بحاجة **لتعداد core كله** — فقط ما تغيّره.
- لتوريث **موضوع آخر** بدل core، أضف `"$extends": "./line/tokens.json"` في الأعلى (يجب أن يُحل المرجع داخل `packages/themes/src`؛ الهروب ممنوع).

### 2.2 `meta.json` (مطلوب؛ id يساوي اسم المجلد)

```json
{
  "id": "my-brand",
  "label": "My Brand",
  "preview": { "accent": "#0ea5e9", "surface": "#fbfcfd" },
  "fonts": { "sans": "system-ui, sans-serif" }
}
```

> يؤكّد البناء أن `meta.id === اسم المجلد`؛ أي اختلاف يرمي خطأً.

### 2.3 `design-rules.json` (مطلوب)

قارن البنية الكاملة للمواضيع الرسمية (مثل `packages/themes/src/line/design-rules.json`). نسخة أدنى صالحة:

```json
{
  "version": "1.0",
  "typography": {
    "scale": "major-third",
    "lineHeightBody": 1.5,
    "fontFamilyToken": "font.family.sans",
    "headingWeightToken": "font.weight.semibold"
  },
  "spacing": {
    "rhythm": 8,
    "density": "comfortable",
    "scale": {
      "strategy": "rem-steps",
      "steps": ["space.0", "space.1", "space.2", "space.3", "space.4", "space.5", "space.6"]
    },
    "radiusStrategy": {
      "default": "radius.md",
      "interactive": "radius.sm",
      "surface": "radius.lg"
    }
  },
  "colorBoundaries": {
    "accentUsage": "primary-actions-only",
    "surfaceLayers": [
      "color.background.default",
      "color.background.subtle",
      "color.background.elevated"
    ]
  },
  "forbiddenPatterns": [],
  "composition": {
    "surfaceHierarchy": "flat",
    "preferredStacks": ["button", "input", "stack"],
    "componentRules": {}
  },
  "rtl": {
    "supported": true,
    "strategy": "logical-properties-only; no runtime DOM mirroring"
  }
}
```

### 2.4 `effects.css` (اختياري)

أضف `effects.css` عند الحاجة (لغة نصف القطر/الظل/الحركة)؛ يُلحق بملف `variables.css` المُنتج عند البناء. احذفه إن لم تحتجه.

---

## 3. الخطوة 2: سجّل في البناء

يحمل نص بناء المواضيع `packages/themes/scripts/build-themes.mjs` **مصفوفة `themeIds` مشفّرة** (حاليًا 8 مواضيع رسمية). أضف `my-brand`:

```js
const themeIds = [
  "line", "silver-arrow", "stuttgart", "corsa", "cupertino", "siren", "wechat", "ant-blue",
  "my-brand", // ← جديد
];
```

ثم ابنِ:

```bash
pnpm --filter @chameleon-ui/themes build
```

يظهر الناتج في `packages/themes/dist/my-brand/variables.css`.

---

## 4. الخطوة 3: أظهر عمليات التصدير (اختياري لكن مُوصى به)

تملك المواضيع الرسمية مُحدِّدات مطابقة مثل `./<id>/css` و`./<id>/meta`. مُوصى به: أضف أسماء مختصرة مريحة لموضوعك في `exports` داخل `packages/themes/package.json`:

```jsonc
"./my-brand/css":           { "style": "./dist/my-brand/variables.css", "import": "./dist/my-brand/variables.css", "default": "./dist/my-brand/variables.css" },
"./my-brand/css?raw":       "./dist/my-brand/variables.css",
"./my-brand/meta":          "./dist/my-brand/meta.json",
"./my-brand/design-rules":  "./dist/my-brand/design-rules.json",
"./my-brand/tokens":        "./dist/my-brand/tokens.json"
```

> حتى دون الأسماء المختصرة، يوجد البدل `./dist/*` إذاً يعمل `@chameleon-ui/themes/dist/my-brand/variables.css` — لكن إضافة الأسماء المختصرة تتفق مع الاستخدام الرسمي.

---

## 5. استخدم موضوعك

React:

```tsx
import "@chameleon-ui/themes/my-brand/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
import { ThemeProvider } from "@chameleon-ui/react";

<ThemeProvider theme="my-brand">{/* app */}</ThemeProvider>
```

Vue:

```vue
<script setup lang="ts">
import '@chameleon-ui/themes/my-brand/css'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'
import { ThemeProvider } from '@chameleon-ui/vue'
</script>
```

> لا تنسَ أيضًا استيراد `@chameleon-ui/tokens/density.css` — وإلا فلن تتغير الكثافة/حجم المكونات حسب نقاط القطع.

---

## 6. التحقق

- `pnpm --filter @chameleon-ui/themes validate-rules` يتحقق من مخطط `design-rules.json`.
- `pnpm --filter @chameleon-ui/themes test` يشغّل اختبارات انحدار المواضيع.
- افحص الناتج: `packages/themes/dist/my-brand/variables.css` يجب أن يحتوي المتغيرات المفعّلة فقط.
- `meta.id` يساوي اسم المجلد، وإلا يرمي البناء خطأً.

---

## المراجع

- أمثلة المواضيع الرسمية: `packages/themes/src/line/` (أدنى)، `packages/themes/src/cupertino/` (مع `effects.css`)
- مصدر core المعتمد: `packages/tokens/src/core/*.json`
- وثيقة حزمة المواضيع: [`packages/themes/README.md`](../../packages/themes/README.md)
- آلية ترجمة الرموز: [`packages/tokens/README.md`](../../packages/tokens/README.md)
- كيف يعمل نظام الرموز: [`token-system.ar.md`](./token-system.ar.md)
