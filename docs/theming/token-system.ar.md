# كيف يعمل نظام الرموز

> **العربية · [简体中文](token-system.md) · [English](token-system.en.md) · [繁體中文（香港）](token-system.zh-HK.md)**

توضح هذه الوثيقة كيفية عمل **نظام رموز التصميم (design tokens)** في Chameleon UI: من مصدر معتمد بصيغة DTCG (JSON) إلى خصائص CSS المخصصة المتاحة للمتصفح (`--cu-*`). فهم هذه الآلية هو أساس استهلاك/تجاوز الرموز وإنشاء المواضيع ووراثتها.

> المرافِق: [إنشاء موضوع مخصص](./creating-a-theme.ar.md) يشرح «كيفية تجاوز الرموز لصناعة موضوع»؛ وهذه الوثيقة تشرح «كيفية عمل نظام الرموز نفسه».

---

## 1. صورة واحدة

```
packages/tokens/src/core/*.json   ← المصدر المعتمد DTCG (وحيد)
        │  flattenTokens (تفريغ)
        ▼
  قائمة رموز مسطّحة (path → value)
        │  resolveTokens (حل المراجع + كشف الدورة)
        ▼
  رموز محلولة (بدون مراجع {…})
        │  renderCss
        ▼
  :root { --cu-color-fg-default: …; … }   ← dist/css/variables.css
```

مسار الموضوع يضيف**خطوة overlay واحدة**:

```
مجلد core + tokens.json للموضوع (overlay)  → overlayTokenTrees (دمج عميق)  → ترجمة → variables.css للموضوع
```

---

## 2. المصدر المعتمد: `src/core/*.json`

المصدر العددي الوحيد لكل قرار تصميمي هو مجموعة ملفات DTCG تحت `packages/tokens/src/core/`:

`color.json` · `space.json` · `radius.json` · `shadow.json` · `motion.json` · `typography.json` · `blur.json` · `breakpoint.json` · `density.json`

- البنية هي **كائنات DTCG متداخلة**: المجموعات (groups) تحتوي على أوراق (leaves)؛ الورقة تُعرَّف عبر `$type` + `$value`.
- مثال حقيقي:

```json
{
  "color": {
    "palette": {
      "brand": { "$value": "#2563eb", "$type": "color" }
    },
    "background": {
      "default": { "$value": "{color.palette.paper}" }
    }
  }
}
```

- قد يكون `$value` قيمة مباشرة أو مرجعًا `{...}` (انظر §4).
- **core هو المصدر الوحيد**: تستهلك المكونات والمواضيع مخرجاته المُجمَّعة؛ ولا تنسخ القيم بأنفسها إطلاقًا.

---

## 3. خطوات الترجمة الثلاث (`token-compiler.mjs`)

تقوم `compileTokenObject(root)` من `@chameleon-ui/tokens/compiler` بمعالجة ثلاث خطوات:

### 3.1 `flattenTokens` — التفريغ

تفرّغ JSON المتداخل إلى قائمة مسطّحة **path → value**، مثل `color.fg.default` و `space.2`. التعقيد O(n).

### 3.2 `resolveTokens` — حل المراجع

تحلّ كل مرجع `{...}` إلى قيمة حقيقية (مثل `{color.palette.paper}` → `#ffffff`). هذه المرحلة:

- **كشف الدورة**: `a` يشير إلى `b` الذي يشير إلى `a` → يرمي خطأ؛ لا يُنتَج أبدًا CSS «ناجح جزئيًا».
- المراجع المجهولة والمسارات المكررة والقيم غير القابلة للتسلسل → يرمي خطأ (يشمل المسار + السبب + الخطوة التالية).

### 3.3 `renderCss` — توليد متغيرات CSS

تحوّل كل مسار رمز إلى اسم خاصية CSS مخصصة:

```
color.fg.default  →  --cu-color-fg-default
space.2           →  --cu-space-2
breakpoint.mobile →  --cu-breakpoint-mobile
```

القواعد (انظر `cssVariableName`):

- بادئة ثابتة `--cu-` (ثابت `tokenCssVariablePrefix`).
- تُربط مقاطع المسار بـ `-`؛ وتُستبدل الأحرف غير القانونية بـ `-` وتُحوَّل إلى أحرف صغيرة.
- إذا طُبِّع أكثر من مسار إلى نفس اسم المتغير → يرمي خطأ (يضمن تفرد كل `--cu-*`).

يُوضع المخرج داخل `:root { … }` ويُحمَّل افتراضيًا عبر `@chameleon-ui/tokens/css`.

---

## 4. بناء الجملة المرجعية `{...}`

- داخل `$value` يمكنك الإشارة إلى رمز آخر بـ `{<path>}`، مثل `{color.palette.ink}`.
- لا تُبقى المراجع**في المخرج** بعد الحل؛ `dist/tokens.json` هو جدول مسطّح محلول يمكن لـ JS/TS استهلاكه مباشرة.
- لا يمكن للمراجع إنشاء دورة (يكتشفها كشف الدورة).

---

## 5. الموضوع = overlay (تجاوز core)

الموضوع**لا ينسخ** مصدر core؛ بل يوفر **overlay**: `packages/tokens/src/core/` هو القاعدة، و `tokens.json` الخاص بالموضوع يذكر فقط «أي مجموعة فرعية يجري تجاوزها». تقوم `overlayTokenTrees` **بالدمج العميق** (`compileThemeTokens(coreDirectory, overlay, label)`):

- **اصطدام ورقة** → ورقة overlay تُجاوز ورقة core.
- **مجموعة غير موجودة في core** → تُضاف كمجموعة جديدة.
- **دمج عميق تكراري للمجموعات**: تُجاوز الفروع المذكورة فقط؛ غير المذكورة تحتفظ بقيم core.
- **قيد**: لا يمكن لمجموعة تجاوز ورقة موجودة؛ البيانات الوصفية المسبوقة بـ `$` (`$type`/`$description`) تمر مباشرة ولا تُعامل كمجموعة رموز في overlay.

> التعقيد O(n log n)، والفضاء O(n). الضمان: تجاوز overlay لأوراق core**لا ينسخ شجرة مصدر core**.

مثال: يعرّف core `color.background.subtle = #f6f6f4`؛ يقوم موضوع بـ overlay: `{ "color": { "background": { "subtle": { "$value": "#eef4f8" } } } }` → يصبح المتغير `#eef4f8`، وتظل ألوان الخلفية الأخرى كما هي.

---

## 6. `$extends`: وراثة المواضيع

يمكن لمستند overlay الخاص بالموضوع أن يصرّح بـ `"$extends": "<ref>" | ["<ref>", ...]` ليرث موضوعًا/مستندًا أساسيًا واحدًا أو أكثر:

- **ترتيب الدمج**: الآباء بترتيب المصفوفة، ثم المستند المشتق أخيرًا — الأخير يفوز عند تعارض الأوراق؛ وتتبع المجموعات قواعد الدمج العميق لـ overlay.
- **آمن ضد الدورات**: أقصى عمق وراثة 16 (`MAX_EXTENDS_DEPTH`)؛ تعطي دورة خطأً بسلسلة قابلة للقراءة.
- **حل المرجع** يتم عبر `loadRef` المحقون (في هذا المستودع هو نظام الملفات، و**مقيّد بـ `packages/themes/src`**— يُمنع الهروب إلى مسارات عشوائية).
- التعقيد O(n + e)، والفضاء O(d)، d ≤ 16.
- **`$extends` لا يتسرب أبدًا إلى المخرج.**

---

## 7. المخرجات

تُنتج الترجمة الواحدة ثلاث عروض (قيمة إرجاع `compileTokenObject`، وتكتب أيضًا إلى القرص):

| المخرج | المحتوى |
| :--- | :--- |
| `css` | `:root { --cu-…: … }` (لـ `@chameleon-ui/tokens/css` ولكل موضوع `/css`) |
| `dtcg` | شجرة DTCG المحلولة (`toResolvedDtcgTree`) |
| `tokens` | قائمة الرموز المسطّحة المحلولة (`dist/tokens.json`) |

**ضمان القطعية**: لا طوابع زمنية في المخرج؛ إدخال متطابق → مخرج متطابق بايتًا ببايت. ترتيب ثابت وحل مراجع مُخزَّن مؤقتًا (بمتوسط O(d)، أقصى عمق 32).

---

## 8. الاتفاقيات والقيود

- **خالٍ من الأطر**: تحدث ترجمة الرموز فقط وقت البناء؛ ويمنع React / Vue / Svelte.
- **CSS للمكونات لا يستهلك نقاط قطع عرض `@media` مباشرة**؛ يستخدم ثلاثي الأطراف (390/768/1280) `@container` + رموز نقاط قطع/كثافة `--cu-*` (انظر قسم الأطراف الثلاثة في [`tokens/README.md`](../../packages/tokens/README.md)).
- **`dist/css/variables.css` ملف مُولَّد — لا تحرّره يدويًا.**

---

## المراجع

- تنفيذ الترجمة: [`packages/tokens/scripts/token-compiler.mjs`](../../packages/tokens/scripts/token-compiler.mjs)
- المصدر المعتمد core: [`packages/tokens/src/core/`](../../packages/tokens/src/core/)
- وثيقة حزمة الرموز: [`packages/tokens/README.md`](../../packages/tokens/README.md)
- إنشاء موضوع عبر overlays: [`إنشاء موضوع مخصص`](./creating-a-theme.ar.md)
