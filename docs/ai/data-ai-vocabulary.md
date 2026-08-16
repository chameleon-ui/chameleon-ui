# data-ai vocabulary

Machine copy: [`data-ai-vocabulary.json`](./data-ai-vocabulary.json) (same directory). Contract fields: `dataAi.role` / `states` / `intents` — see [v0.2 mapping](./component-contract-v0.2-mapping.md).

**Discipline:** register a new intent here before adding it to any contract. `catalog-data-ai.test.ts` and `node ./scripts/generate-data-ai-vocabulary.mjs --check` gate drift both ways. DOM markers are static semantics only — **no PII**.

## DOM triple

| Attribute | Source | Meaning |
| :--- | :--- | :--- |
| `data-ai-role` | `contract.dataAi.role` | Semantic role (= component slug) |
| `data-ai-state` | `contract.dataAi.states` | Current state; subset of contract states |
| `data-ai-intent` | `contract.dataAi.intents[0]` | Primary intent; full set lives on the contract |

## Intent lexicon (78)

| intent | Meaning |
| :--- | :--- |
| `adjust-value` | Adjust a numeric value along a range. |
| `cancel` | Abort or dismiss a reversible action. |
| `choose-action` | Pick an action from a menu of commands. |
| `choose-option` | Pick one option from a predefined list. |
| `collapse-section` | Hide an expandable content section. |
| `collect-input` | Gather structured input from the user in a modal flow. |
| `compare-images` | Compare two images with a draggable before/after divider. |
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
| `layout-split` | Split a region into master and detail panes. |
| `name-field` | Associate a caption with a form control. |
| `navigate` | Follow a hyperlink to another location. |
| `navigate-detail` | Open the detail view of a grouped item. |
| `navigate-hierarchy` | Navigate back up a location hierarchy. |
| `navigate-overlay` | Navigate within an overlay panel. |
| `navigate-pages` | Move between pages of a result set. |
| `navigate-sections` | Switch between top-level sections of the shell. |
| `navigate-stack` | Move back or forward within the current tab's navigation stack. |
| `notify-status` | Communicate a persistent status message. |
| `notify-transient` | Communicate a transient confirmation or alert. |
| `paint-mask` | Paint or erase a mask over a source image. |
| `pan-canvas` | Pan, zoom, or inspect a 2D canvas surface. |
| `pick-datetime` | Pick a calendar date and/or clock time. |
| `present-overlay` | Present modal or side-sheet content above the page. |
| `preview-detail` | Preview detail about a hovered target. |
| `prompt-first-action` | Guide the user to the first action on an empty surface. |
| `rate-item` | Assign a discrete rating to an item. |
| `render-markup` | Render Markdown or other markup as readable content. |
| `reveal-context` | Reveal contextual content anchored to a trigger. |
| `reveal-detail` | Reveal detail in a dismissible panel. |
| `scroll-region` | Own nested scrolling for a region inside a shell. |
| `search-select` | Search within options and select one. |
| `select-single` | Select exactly one option from a small set. |
| `separate-items` | Separate sibling items in a list or toolbar. |
| `separate-sections` | Separate content sections visually. |
| `share-content` | Share a URL or content payload to a chosen target. |
| `show-attribution` | Show credits, legal, or other attribution chrome. |
| `show-brand` | Show a sized brand mark in chrome. |
| `show-progress` | Show determinate progress toward completion. |
| `show-shortcut` | Document a keyboard shortcut. |
| `show-transparency` | Reveal transparent media edges on a checkerboard surface. |
| `sign-out` | End the current user session from chrome. |
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
