# كيف يعمل الذكاء الاصطناعي

> **العربية · [简体中文](how-ai-works.md) · [English](how-ai-works.en.md) · [繁體中文（香港）](how-ai-works.zh-HK.md)**

توضح هذه الوثيقة كيف تعمل **آلية الذكاء الاصطناعي** في Chameleon UI من طرف إلى طرف: كيف «يفهم» الذكاء الاصطناعي (الوكلاء/النماذج) المكونات، وكيف يحصل على استخدام **صالح وموثوق**، وكيف **يثبّت** المكونات/المواضيع. هذا شرح معماري للآلية؛ القواعد التطبيقية مصدرها [`AGENTS.md`](../../AGENTS.md)، وهو المصدر الوحيد للحقيقة (SSOT).

> بجملة واحدة: تُدار Chameleon UI بواسطة **عقود قابلة للقراءة آليًا** — لا يخمّن الذكاء الاصطناعي؛ بل يجمّع مكونات WYSIWYG بالاستعلام عن العقود والمعجم، وكل عمليات الكتابة على القرص تتلاقى دائمًا في نواة واحدة.

---

## 1. الفكرة الأساسية: قائم على العقود

المكتبات التقليدية «صندوق أسود» للذكاء الاصطناعي — لا يمكنه إلا تخمين الاستخدام من README/الأمثلة، مخترعًا استيرادات أو props خاطئة أو مسارات غير موجودة. عكس ذلك في Chameleon UI: **كل مكوّن يحمل `contract.json` قابلًا للقراءة آليًا** — يقرأه الذكاء الاصطناعي مباشرة ليحصل على استخدام معتمد وقابل للتحقق.

كل `contract.json` (في `packages/components/src/<slug>/contract.json`) يتضمن:

- `slug` / `name` / `schemaVersion`
- `props` / `variants` / `states`
- `composition` / `antiPatterns` (كيف لا يُستخدم)
- `a11y` (متطلبات إمكانية الوصول)
- `responsive` / `rtl` (سلوك الأطراف الثلاثة و RTL)
- **`dataAi`**: `{ "role", "states", "intents" }` — دلالات سلوكية قابلة للقراءة آليًا
- `usage` / `exports` / `mechanics`

مثال حقيقي (`dataAi` لزر):

```json
{
  "role": "button",
  "states": ["default", "loading", "disabled"],
  "intents": ["submit", "confirm", "cancel"]
}
```

تُتحقق العقود **100% عبر مخطط موحّد** في [`@chameleon-ui/contract`](../../packages/contract/README.md): كل slug في الفهرس يجب أن يحمل عقدًا صالحًا، وإلا يتحول CI إلى الأحمر. لذا «العقود موثوقة» ليست أملًا — بل مضمونة بواسطة البوابات.

---

## 2. معجم النوايا: data-ai-vocabulary

عند البحث/الوصف، يستخدم الذكاء الاصطناعي **معجم نوايا مُجمَّدًا** لمواءمة الدلالات:

يعرّف [`docs/ai/data-ai-vocabulary.json`](./data-ai-vocabulary.json) مجموعة قياسية من `intents` (حاليًا **70**)، مثل `submit` و`cancel` و`choose-option` و`confirm`.

- كل intent جملة وصف دلالي بالإنجليزية (مثل `adjust-value`: "Adjust a numeric value along a range.").
- الغرض: جعل «وصف الاحتياج» و«قدرات المكوّن» يلتقيان على **المعجم نفسه**، ليجعل بحث/توصية الذكاء الاصطناعي قابلة للتفسير والتوقع.
- المعجم **مُجمَّد**: قبل إضافة intent يجب تسجيله هنا، ثم يمنع `catalog-data-ai.test.ts` و`generate-data-ai-vocabulary.mjs --check` الانحراف في الاتجاهين.

---

## 3. مساران للاستهلاك

يستهلك الذكاء الاصطناعي Chameleon UI عبر **مسارين**، يحددهما «هل MCP مركّب»:

### المسار A: MCP مركّب (موصى به لسير عمل AI شبه الإنتاجي)

يوفر `@chameleon-ui/mcp-server` خادم [Model Context Protocol](../../packages/mcp-server/README.md) عبر stdio؛ يستعلم الذكاء الاصطناعي **في الوقت الفعلي** عبر استدعاء الأدوات بدل التخمين:

| متى | الأداة |
| :--- | :--- |
| أول استدعاء | `get_started` (ملخص الفهرس، الموضوع، ترتيب الأدوات، ممنوعات) |
| قبل كتابة أي استيراد CSS/JS | `get_import_specifiers` (يُرجع مُحدِّدات **صالحة**) |
| اختيار المكونات | `list_components` / `search_components` (حسب `intent`) |
| إصدار JSX/SFC للمكوّن | `get_contract` (عقد v0.2) |
| التعامل مع الكثافة / نصف القطر / RTL | `get_design_rules` |
| سرد المواضيع | `list_themes` |
| التثبيت النهائي | `install_with_theme` وغيرها من `install_*` |

الأدوات للقراءة فقط لا تكتب على القرص؛ **كل الكتابات تتم عبر `install-core`**.

### المسار B: بلا MCP (صفر اعتماديات)

يقرأ الذكاء الاصطناعي `AGENTS.md` و`docs/ai/` من المستودع، ويأخذ العقود من نظام الملفات، وينسخ مُحدِّدات الاستيراد الرسمية. في هذا الوضع **ممنوع** اختلاق مسارات أو مُحدِّدات بديلة — فقواعد `AGENTS.md` موجودة لوقف «التخمين».

---

## 4. مسؤولية ثلاث طبقات: تعيين → عرض → تثبيت

تتحول مستندات البروتوكول (A2UI / MCP Apps / AG-UI) إلى مكونات Chameleon حقيقية عبر تقسيم ثلاثي، و**لا تتسرب حقول البروتوكول أبدًا إلى L1/L2**:

| الطبقة | الحزمة | المسؤولية | يكتب على القرص؟ |
| :--- | :--- | :--- | :--- |
| تعيين البروتوكول | `adapter-a2ui` / `adapter-mcp-apps` / `adapter-ag-ui` | مستند بروتوكول → render node / خطة تثبيت | لا (يُرجع خطة) |
| العرض وقت التشغيل | `schema-renderer` | JSON render-schema → **شجرة مكونات حقيقية** (10 slugs افتراضيًا) | لا |
| نواة التثبيت | `install-core` | **يكتب على القرص** وفق الخطة (مخطط تبعيات، كشف تعارض، عجز) | **نعم (الوحيد)** |

- يتشارك `schema-renderer` اصطلاح تسمية slugs مع الفهرس، ولكنه لا يعي أي حقل بروتوكول.
- المحوّلات و`schema-renderer` **مسارات جانبية** (L3/L4) لا تلوّث النواة عديمة الشكل.
- مثال: مدخل JSON لـ `schema-renderer`:

```json
{
  "version": "1.0",
  "root": {
    "component": "stack",
    "props": { "direction": "column", "gap": "2" },
    "children": [
      { "component": "heading", "props": { "level": "level-2" }, "children": ["Sign in"] }
    ]
  }
}
```

---

## 5. حدود تجميع AI الآمنة (NEVER)

يقيّد `AGENTS.md` الذكاء الاصطناعي بقائمة **NEVER** صريحة لمنع الكود الرديء:

- **ممنوع** اختلاق مُحدِّدات `@chameleon-ui/*/css`، أو كتابة `workspace:*` في المستهلكين.
- **ممنوع** تضمين `@chameleon-ui/react` و`@chameleon-ui/vue` معًا.
- **ممنوع** معاملة محوِّل AG-UI كبروتوكول مدعوم (فهو POC).
- **ممنوع** اختلاق أرقام أداء أو معدلات تعرّف بعمى أو شهادات وصول.
- **ممنوع** كتابة مسار تثبيت ثانٍ خارج `install-core`.
- **ممنوع** إضافة تجاوز `resolve.alias` لـ CSS الخاص بـ `@chameleon-ui/*` — يجب أن تُحل `exports` للحزمة بنفسها.

هذه ليست اقتراحات — إنها قيود صارمة تنفذها CI/البوابات.

---

## 6. مثال سير عمل: يضيف AI نموذج تسجيل دخول

1. `get_started` → يحصل على الموضوع `line` واستيرادات CSS وترتيب الأدوات.
2. `search_components`(`intent: "authenticate"`) → يصل إلى `login` / `input` / `password-input`.
3. `get_import_specifiers` → يحصل على الاستيرادات **الصالحة** لهذه المجموعة.
4. `get_contract`(`input`) → يحصل على props / a11y / antiPatterns.
5. `get_design_rules`(`line`) → يحصل على قواعد الكثافة / RTL / التباعد.
6. يُصدر JSX/SFC بمُحدِّدات رسمية، وبدون `resolve.alias`.
7. للكتابة على القرص: `install_with_theme` (عجز عبر install-core).

كل خطوة في السلسلة لها مصدر معتمد — لا يحتاج الذكاء الاصطناعي للتخمين.

---

## 7. وثائق ذات صلة

| الموضوع | أين |
| :--- | :--- |
| قواعد استهلاك AI (SSOT) | [`AGENTS.md`](../../AGENTS.md) |
| تدفق استهلاك الوكيل | [`docs/ai/agent-consume.md`](./agent-consume.md) |
| تعيين حقول العقد | [`docs/ai/component-contract-v0.2-mapping.md`](./component-contract-v0.2-mapping.md) |
| معجم النوايا | [`docs/ai/data-ai-vocabulary.md`](./data-ai-vocabulary.md) |
| SchemaRenderer | [`docs/ai/schema-renderer.md`](./schema-renderer.md) · [`packages/schema-renderer`](../../packages/schema-renderer/README.md) |
| خادم MCP | [`packages/mcp-server/README.md`](../../packages/mcp-server/README.md) |
| التحقق من العقود | [`packages/contract/README.md`](../../packages/contract/README.md) |
| نواة التثبيت | [`packages/install-core/README.md`](../../packages/install-core/README.md) |
