# Chameleon UI

<p align="center">
  <img src="./brand/chameleon-logo.png" alt="Chameleon UI logo" width="120" />
</p>

> **العربية · [简体中文](README.md) · [English](README.en.md) · [繁體中文（香港）](README.zh-HK.md)**

**نظام تصميم موجَّه للذكاء الاصطناعي، قائم على الرؤوس عديمة الشكل (headless)، ثلاثي الأطراف (390/768/1280)، وعبور الأطر (cross-framework) لـ React و Vue.**

تُعد Chameleon UI نظام تصميم موجَّهًا لعصر الذكاء الاصطناعي. يعتمد على **أوليات عديمة الشكل (headless primitives)** لتوفير مكتبة مكونات كاملة ومتسقة لكل من **React 19** و **Vue 3.5** فوق مجموعة واحدة مشتركة من الرموز (tokens) والعقود والبنية، مع تحقيق **تثليث الأطراف (ثلاثية الأجهزة / تلقائية التكيّف)**. ومن خلال التصميم القائم على العقود و MCP ومحوّلات البروتوكول، يمكن **لوكلاء الذكاء الاصطناعي أن «يفهموا» المكونات ويجمّعوها أو يثبّتوها بشكل موثوق**.

- **المكونات**: 103 عنصرًا في الفهرس (تطابق بين React و Vue بالكامل `103/103`)
- **ثلاثية الأطراف**: تكيّف مع نافذة عرض الهاتف 390 / التابلت 768 / سطح المكتب 1280 (الكثافة وحجم المكونات والخطوط تتغير حسب الطرف)
- **المواضيع**: 9 (`line` الرائد بصريًا + 8 طبقات تكريم)
- **اللغات**: 21 لغة (ICU MessageFormat)، تشمل RTL (`ar` `ug` `ur` `fa`)
- **الرأس عديم الشكل**: مبني على **Ark UI / Zag** (تغليفات رفيعة في `primitives` / `primitives-vue`)
- **الترخيص**: MIT. القياس عن بُعد (telemetry) معطَّل افتراضيًا (`telemetry-notice.v1`).

> **الإصدار الحالي: `0.2.0` (غير منشور على npm)**. حتى نشر npm، استخدم `link-external` / `pack-external` أو قوالب Vite الرسمية للوصول.

---

## لماذا Chameleon UI

- **ثلاثية الأطراف (390 / 768 / 1280)**: تتكيّف المكونات نفسها تلقائيًا عبر ثلاث نافذات عرض بواسطة استعلامات الحاويات (container queries) ورموز الكثافة — تتغير الكثافة وأهداف اللمس والخطوط حسب الطرف؛ والشريط الجانبي القابل للطي في سطح المكتب، وشريط التابلت، وتبويبات الهاتف السفلية كلها مشتقّة من نفس `Navigation`.
- **اتساق عبر الأطر**: مجموعة واحدة من رموز التصميم، ومجموعة واحدة من عقود المكونات، مع تطبيقات متطابقة لـ React و Vue. اختر حزمة موحّدة واحدة (`@chameleon-ui/react` أو `@chameleon-ui/vue`) لتجربة متطابقة.
- **نواة عديمة الشكل**: فصل العرض عن المنطق عديم الشكل. تريد تحكمًا كاملًا في العرض؟ استخدم طبقة `primitives` مباشرة.
- **موجَّه للذكاء الاصطناعي**: كل مكوّن يحمل `contract.json` قابلًا للقراءة آليًا (مع `dataAi.role` / `states` / `intents`)؛ و `AGENTS.md` هو المصدر الوحيد للحقيقة (SSOT) للاستهلاك عبر الذكاء الاصطناعي، ويُمكِّن خادم MCP الوكلاء من الاستعلام عن العقود وتثبيت المكونات مباشرة.
- **قائم على العقود**: قائمة المكونات والعقود وقواعد التصميم والمعجم لكل منها مصدر معتمد واحد، مما يمنع الانحراف بين الوثائق والتنفيذ.
- **مواضيع و i18n بإصدارات**: رموز DTCG تُجمَّع إلى متغيرات CSS قياسية؛ المواضيع واللغات حزم مستقلة وقابلة للتركيب.

---

## البداية السريعة

### المتطلبات

- Node `>= 20.19.0`
- pnpm `9.15.0` (الموصى به: Corepack `corepack enable`)

### البناء / التشغيل داخل هذا المستودع

```bash
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 check      # lint + typecheck + test + build
```

أوامر شائعة (من `package.json` الجذرية):

| الأمر | الغرض |
| :--- | :--- |
| `pnpm build` | بناء كل الحزم عبر Turborepo |
| `pnpm check` | lint + typecheck + test + build في بوابة واحدة |
| `pnpm clean` | تنظيف `.turbo` / `dist` / مخابئ البناء المحلية |
| `pnpm publish:check` | فحص جاف pre-publish (لا يدفع) |
| `pnpm ai:check` | التحقق من اتساق AGENTS / العقود / وثائق التثبيت |
| `pnpm verify:external` | التحقق من قابلية استهلاك القوالب الخارجية الرسمية |

### الاستخدام في تطبيقك (قبل نشر npm)

بأي طريقة (لا تتطلب أيًا منهما `workspace:*`):

```bash
# 1. تغليف إلى tarball ثم التثبيت في تطبيقك
node ./scripts/pack-external.mjs            # React umbrella
node ./scripts/pack-external.mjs --vue     # Vue umbrella
npm install <path-to>/dist-tarballs/chameleon-ui-react-0.2.0.tgz

# 2. أو npm link
node ./scripts/link-external.mjs --vue --apply
```

قوالب البدء الرسمية:

- [`templates/external-vite-react`](./templates/external-vite-react)
- [`templates/external-vite-vue`](./templates/external-vite-vue)

---

## الحزم (مساحة العمل)

المستودع هو **monorepo بـ pnpm + Turborepo** يضم 21 حزمة `@chameleon-ui/*` منظَّمة حسب الطبقات.

### قواعد الطبقات

| الطبقة | الحزم | القاعدة |
| :--- | :--- | :--- |
| **L1 الأساس** | `tokens` · `themes` · `i18n` · `contract` | مستقل عن الإطار؛ ممنوع اعتماد `react`/`vue` |
| **L1 الأوليات** | `primitives` · `primitives-vue` | تغليفات رفيعة فوق `@ark-ui/*` / Zag؛ بحذف الإطار المعني |
| **L2 المكونات** | `components` · `components-vue` | L1 فقط؛ **ممنوع `import '@ark-ui/*'` مباشرة** |
| **L3/L4 المحوّلات** | `adapter-*` · `schema-renderer` | تعيين البروتوكول؛ الكتابة عبر `install-core` فقط |
| **نواة التثبيت** | `install-core` | الكاتب الوحيد على القرص |
| **الفهرس** | `registry` · `registry-private` | قراءة فقط / خدمة خاصة؛ لا كتابة |
| **الأغلفة/الخدمات** | `cli` · `mcp-server` · `market-service` | أغلفة رفيعة؛ كل الكتابات تلتقي عند `install-core` |
| **الحزم الموحّدة** | `react` · `vue` | اعتماد واحد؛ للمستهلك النهائي |

### نظرة سريعة على الحزم

| الحزمة | الوصف |
| :--- | :--- |
| `@chameleon-ui/tokens` | المصدر المعتمد لرموز التصميم DTCG + تجميع محدد لمتغيرات CSS |
| `@chameleon-ui/themes` | طبقات المواضيع + `design-rules` (`line` الرائد + 8 تكريمات) |
| `@chameleon-ui/contract` | JSON Schema + تحقق للمكونات وقواعد التصميم |
| `@chameleon-ui/i18n` | وقت تشغيل ICU MessageFormat، بحث C3 Map، أدوات شبه الترجمة |
| `@chameleon-ui/primitives` · `primitives-vue` | تغليفات رفيعة لـ Ark UI / Zag (النواة عديمة الشكل) |
| `@chameleon-ui/components` | تطبيقات مكونات React (103 slugs + عقود) |
| `@chameleon-ui/components-vue` | مكونات Vue (103/103 + ThemeProvider) |
| `@chameleon-ui/react` | حزمة React الموحّدة |
| `@chameleon-ui/vue` | حزمة Vue الموحّدة |
| `@chameleon-ui/install-core` | الكاتب الوحيد: مخطط التبعيات، كشف التعارض، النسخ العجزي |
| `@chameleon-ui/registry` | فهرس المكونات/المواضيع |
| `@chameleon-ui/registry-private` | خادم فهرس خاص محلي/إنترانت |
| `@chameleon-ui/cli` | واجهة `chameleon`، غلاف رفيع إلى `install-core` |
| `@chameleon-ui/mcp-server` | خادم MCP (استعلام الوكلاء عن العقود / تثبيت المكونات) |
| `@chameleon-ui/schema-renderer` | JSON Schema → شجرة المكونات (10 slugs افتراضيًا) |
| `@chameleon-ui/blocks` | كتل سيناريوهات قابلة للتركيب |
| `@chameleon-ui/adapter-a2ui` | محوِّل بروتوكول A2UI |
| `@chameleon-ui/adapter-ag-ui` | محوِّل بروتوكول AG-UI (**POC**، غير مدعوم رسميًا) |
| `@chameleon-ui/adapter-mcp-apps` | محوِّل بروتوكول MCP Apps (SEP-1865) (**POC**) |
| `@chameleon-ui/market-service` | سوق المواضيع / خدمة حزم قواعد المجتمع |
| `@chameleon-ui/utils` | أدوات عامة (أساسيات PNG/الصور؛ JS خالص بلا اعتمادات أصلية) |

---

## ثلاثة أطراف (هاتف / تابلت / سطح مكتب)

التجربة الأساسية هي **مجموعة مكونات واحدة تتكيّف مع ثلاث نافذات عرض** — 390 (هاتف)، 768 (تابلت)، 1280 (سطح مكتب) — بدلًا من كتابة كل شكل على حدة.

آليات الدفع:

| البُعد | المستويات الثلاث | ملاحظة |
| :--- | :--- | :--- |
| نقاط القطع | `<768` / `768–1279` / `≥1280` | Token `--cu-breakpoint-{mobile,tablet,desktop}` |
| الكثافة | `comfortable` / `standard` / `compact` | قيمة افتراضية حسب الطرف (مريحة للهاتف / قياسية للتابلت / مضغوطة لسطح المكتب)؛ قابلة للتجاوز عبر `[data-density]` |
| المكونات | 36 / 40 / 44px | `--cu-control-size-{compact,standard,comfortable}` |
| الخط | `clamp()` سائل | يتدرّج من `20rem → 80rem` |

- **الاستجابة للعرض تستخدم استعلامات الحاويات `@container`**، وليس نقاط قطع عرض `@media` مباشرة (يحظرها stylelint).
- استهلاك `@chameleon-ui/tokens/css` **يتطلب أيضًا استيراد `@chameleon-ui/tokens/density.css`**؛ وإلا لن تتغير الكثافة/حجم المكونات حسب نقاط القطع.
- غلاف التطبيق والتنقل: يوفر `AppShell` هيكل التطبيق ثلاثي المستويات؛ يستخدم `Navigation` نفس واجهة `items` للتحول بين الشريط الجانبي لسطح المكتب / شريط التابلت القابل للطي / تتبويب الهاتف السفلي؛ ويعالج `SafeArea` الحواف (notch) وشريط الإيماءات.

مكونات المستويات الثلاث: `AppShell` · `Navigation` · `NavigationBar` · `Sidebar` · `TabBar` · `ActionSheet` · `SafeArea`.

آلية عمل التثليث الكاملة (رموز نقاط القطع، استعلامات الحاويات مقابل `@media`، الكثافة حسب الطرف، تحوّل Navigation، و«لماذا نفصل React/Vue»): [**نظام الأطراف الثلاثة**](./docs/theming/three-end-system.ar.md).

---

## المكونات والمواضيع

### المكونات (103)

القائمة الكاملة مصدرها المعتمد الواحد: [`packages/components/catalog.json`](./packages/components/catalog.json). كل مكوّن يرفق عقدًا قابلًا للقراءة آليًا:

- `contract.json` (مع `dataAi.role` / `states` / `intents`)
- جداول نصوص 21 لغة
- أنماط وأنواع واختبارات

### المواضيع (9)

| الموضوع | ملاحظة |
| :--- | :--- |
| `line` | **الرائد بصريًا** (المظهر الافتراضي للمنتج) |
| `silver-arrow` `stuttgart` `corsa` `cupertino` `siren` `wechat` `ant-blue` | طبقات تكريم |
| `community-focus-first` | بذرة حزمة قواعد المجتمع (`registry:rules`) |

> **الحالة**: `line` هو **الرائد البصري الوحيد المُتحقَّق منه بالكامل** (المظهر الافتراضي؛ معيار المنتج). أما طبقات التكريم الثماني الأخرى فهي **ما زالت قيد الصقل**، وهي أنسب للإلهام والاستكشاف. للحصول على موضوع افتراضي موثوق استخدم `line`.

- **كيف يعمل نظام الرموز**: من المصدر المعتمد DTCG إلى تجميع `--cu-*`، وحل المرجع، وكشف الدورة، وآلية overlay/`$extends` — راجع [**نظام الرموز**](./docs/theming/token-system.ar.md).
- تريد موضوعًا خاصًا بك؟ الموضوع **طبقة** (يفوق فقط مجموعة فرعية من رموز core). دليل خطوة بخطوة: [**إنشاء موضوع مخصص**](./docs/theming/creating-a-theme.ar.md).

### اللغات و RTL

- 21 لغة (راجع `catalog.json`)
- لغات RTL: `ar` `ug` `ur` `fa`
- استخدم `directionForLocale` (`@chameleon-ui/i18n`) لتحديد الاتجاه؛ لا تخمّن `dir`

---

## استخدام الذكاء الاصطناعي (الدخول الأساسي)

**`AGENTS.md` هو SSOT لاستهلاك هذه المكتبة عبر الذكاء الاصطناعي.** سواء كنت نموذجًا أو وكيلًا أو تريد «أن يجمّعه الذكاء الاصطناعي»، ابدأ هناك.

- [`AGENTS.md`](./AGENTS.md) — القواعد الكاملة للاستهلاك عبر الذكاء الاصطناعي (CSS، استيرادات JS، التثبيت، MCP، ممنوعات)
- [`docs/ai/`](./docs/ai/) — ملاحظات إضافية (تدفق الاستهلاك، SchemaRenderer، المعجم، تمديدات المواضيع، حزم المجتمع)
- [**كيف يعمل الذكاء الاصطناعي**](./docs/ai/how-ai-works.ar.md) — قائم على العقود، معجم النوايا، سلسلة MCP، طبقات تعيين→عرض→تثبيت من طرف إلى طرف

إذا كان MCP مركّبًا، فإن ترتيب استدعاء الأدوات القياسي هو:

`get_started` → `get_import_specifiers` (قبل كتابة الاستيرادات) → `get_contract` (قبل إصدار المكوّن) → `get_design_rules` (قبل الكثافة/RTL)

**كل عمليات الكتابة على القرص يجب أن تمر عبر `install-core`** (`chameleon add` / MCP `install_*`)؛ لا تكتب مسارًا ثانيًا في مكان آخر.

---

## بنية الدليل

```
.
├── packages/                # كل @chameleon-ui/*
├── scripts/                 # بناء، تغليف، ربط، publish:check، ai:check
├── templates/               # تطبيقات Vite الخارجية الرسمية (React / Vue)
├── docs/ai/                 # ملاحظات استهلاك الذكاء الاصطناعي (SSOT = AGENTS.md)
├── brand/                   # الشعار / أصول العلامة
├── AGENTS.md                # SSOT لاستهلاك الذكاء الاصطناعي
├── STRUCTURE.md             # خريطة دليل تفصيلية
└── LICENSE · CONTRIBUTING.md · SECURITY.md · CHANGELOG.md
```

> أدوات lint/البناء الخاصة بالمسؤول، وميزانيات الحجم إلخ **ليست داخل هذا المستودع** (تقع خارجه) ولا علاقة لها بالمستهلكين.

---

## الوثائق المرجعية

| الموضوع | أين |
| :--- | :--- |
| خريطة الدليل | [`STRUCTURE.md`](./STRUCTURE.md) |
| قواعد استهلاك الذكاء الاصطناعي | [`AGENTS.md`](./AGENTS.md) |
| تغييرات الإصدارات | [`CHANGELOG.md`](./CHANGELOG.md) |
| المساهمة | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |
| الأمان | [`SECURITY.md`](./SECURITY.md) |

---

## الترخيص

[MIT](./LICENSE)
