# data-ai 值域文档（Phase 8 A5 冻结）

> 机读版：`data-ai-vocabulary.json`（同目录）。契约侧字段：`dataAi.role/states/intents`（[v0.2 映射表](./component-contract-v0.2-mapping.md)）。  
> 纪律：新增 intent 必须先登记本表再入契约；`catalog-data-ai.test.ts` 与本脚本 `--check` 双向防止漂移。DOM 标注只含静态语义，**不含 PII**。

## 三件套

| 属性 | 来源 | 说明 |
| :--- | :--- | :--- |
| `data-ai-role` | `contract.dataAi.role` | 组件语义角色（= slug） |
| `data-ai-state` | `contract.dataAi.states` | 当前状态，值域为契约 states 子集 |
| `data-ai-intent` | `contract.dataAi.intents[0]` | 首要意图；完整意图集在契约中 |

## intent 词表（69 项）

| intent | 语义 |
| :--- | :--- |
| `adjust-value` | Adjust a numeric value along a range. |
| `cancel` | Abort or dismiss a reversible action. |
| `choose-action` | Pick an action from a menu of commands. |
| `choose-option` | Pick one option from a predefined list. |
| `collapse-section` | Hide an expandable content section. |
| `collect-input` | Gather structured input from the user in a modal flow. |
| `compare-options` | Present richly described options for a single choice. |
| `compose-rich-text` | Author rich text with inline formatting commands. |
| `confirm` | Confirm a reversible action. |
| `confirm-decision` | Ask the user to confirm or reject a decision. |
| `connect-nodes` | Draw or represent a connection between canvas nodes. |
| `copy-snippet` | Copy a code sample to the clipboard. |
| `dismiss-tag` | Remove a selected tag or filter token. |
| `enter-long-text` | Enter multi-line free-form text. |
| `enter-quantity` | Enter or step a numeric quantity. |
| `enter-text` | Enter single-line text. |
| `enumerate-items` | Present an ordered or unordered set of items. |
| `expand-section` | Reveal a collapsed content section. |
| `explain-on-hover` | Reveal a short contextual explanation. |
| `filter-selection` | Narrow a set by selecting filter tokens. |
| `fit-safe-area` | Inset content within the device safe-area edges. |
| `flag-field-error` | Flag a validation problem next to a field. |
| `flag-status` | Mark an item with a compact status or count. |
| `group-content` | Group related content into a scannable unit. |
| `highlight-count` | Surface a numeric count that needs attention. |
| `identify-user` | Represent a user or entity visually. |
| `indicate-busy` | Show that an indeterminate operation is running. |
| `indicate-loading` | Show a placeholder while content loads. |
| `inspect-details` | Read term/description metadata pairs. |
| `inspect-tabular-data` | Scan and compare rows of structured data. |
| `layout-columns` | Arrange content in a responsive column layout. |
| `layout-flow` | Stack content with consistent rhythm. |
| `layout-shell` | Provide the application frame and primary regions. |
| `name-field` | Associate a caption with a form control. |
| `navigate` | Follow a hyperlink to another location. |
| `navigate-detail` | Open the detail view of a grouped item. |
| `navigate-hierarchy` | Navigate back up a location hierarchy. |
| `navigate-overlay` | Navigate within an overlay panel. |
| `navigate-pages` | Move between pages of a result set. |
| `navigate-sections` | Switch between top-level sections of the shell. |
| `notify-status` | Communicate a persistent status message. |
| `notify-transient` | Communicate a transient confirmation or alert. |
| `pan-canvas` | Pan, zoom, or inspect a 2D canvas surface. |
| `pick-datetime` | Pick a calendar date and/or clock time. |
| `present-overlay` | Present modal or side-sheet content above the page. |
| `preview-detail` | Preview detail about a hovered target. |
| `prompt-first-action` | Guide the user to the first action on an empty surface. |
| `rate-item` | Assign a discrete rating to an item. |
| `render-markup` | Render Markdown or other markup as readable content. |
| `reveal-context` | Reveal contextual content anchored to a trigger. |
| `reveal-detail` | Reveal detail in a dismissible panel. |
| `search-select` | Search within options and select one. |
| `select-single` | Select exactly one option from a small set. |
| `separate-items` | Separate sibling items in a list or toolbar. |
| `separate-sections` | Separate content sections visually. |
| `share-content` | Share a URL or content payload to a chosen target. |
| `show-progress` | Show determinate progress toward completion. |
| `show-shortcut` | Document a keyboard shortcut. |
| `signal-meaning` | Convey meaning through a glyph. |
| `structure-content` | Structure content with hierarchical headings. |
| `style-text` | Style inline or block text with the type scale. |
| `submit` | Submit a form or trigger the primary action. |
| `submit-data` | Submit a group of fields as one unit. |
| `switch-view` | Switch between peer views in the same region. |
| `toggle-option` | Toggle one option in a multi-select set. |
| `toggle-setting` | Turn a binary setting on or off. |
| `toggle-visibility` | Toggle visibility of a content region. |
| `upload-file` | Choose a file from the device for upload. |
| `visualize-data` | Render quantitative values as a chart, sparkline, heatmap, or gauge. |
