import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Phase 6 scaffold generator: emits locales/*.json (21) + contract.json for each
 * new component spec below, following the exact conventions of the Phase 1 set
 * (en/zh-CN/de/ar translated, remaining 17 locales mirror en as placeholders).
 * The German gate requires de >= 1.35x en per key; this script enforces it.
 */

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')

const PLACEHOLDER_LOCALES = [
  'zh-HK', 'ja', 'ko', 'ru', 'hi', 'ug', 'sw', 'ha', 'am', 'es', 'fr', 'pt', 'bn', 'id', 'ur', 'fa', 'vi',
]

const EXPANSION_RATIO = 1.35

function expansionFailures(spec) {
  const failures = []
  for (const [key, enText] of Object.entries(spec.messages.en)) {
    const deText = spec.messages.de?.[key]
    const zhText = spec.messages['zh-CN']?.[key]
    const arText = spec.messages.ar?.[key]
    if (deText === undefined || zhText === undefined || arText === undefined) {
      failures.push(`${spec.slug}/${key}: missing zh-CN/de/ar translation`)
      continue
    }
    const ratio = [...deText].length / Math.max(1, [...enText].length)
    if (ratio + Number.EPSILON < EXPANSION_RATIO) {
      failures.push(`${spec.slug}/${key}: de expansion ${ratio.toFixed(2)} < ${EXPANSION_RATIO} ("${enText}" -> "${deText}")`)
    }
  }
  return failures
}

function contractFor(spec) {
  return {
    schemaVersion: '0.1',
    slug: spec.slug,
    name: spec.name,
    family: spec.family,
    status: 'experimental',
    purpose: spec.purpose,
    scenarios: spec.scenarios,
    props: spec.props,
    variants: spec.variants,
    states: spec.states,
    composition: spec.composition,
    antiPatterns: spec.antiPatterns,
    a11y: spec.a11y,
    responsive: spec.responsive,
    platforms: { web: 'supported', react: 'supported', vue: 'planned' },
    rtl: spec.rtl ?? {
      supported: true,
      strategy: 'Logical CSS only. Direction inherits from document lang/dir.',
      mirroredValues: [],
    },
    dataAi: spec.dataAi,
  }
}

const SPECS = []

// === D family additions (Phase 6) ===
SPECS.push(
  {
    slug: 'tag',
    name: 'Tag',
    family: 'D',
    tier: 'base',
    purpose: 'Presents a compact, optionally removable label for categorizing content.',
    scenarios: ['Show category labels on an article', 'Display applied filters with removal', 'Mark status on a list row'],
    props: {
      label: { type: 'string', required: true, description: 'Visible tag text.' },
      variant: { type: 'enum', required: false, description: 'Visual style.', values: ['default', 'brand', 'outline'], default: 'default' },
      onRemove: { type: 'event', required: false, description: 'Called when the remove control is activated; presence renders the control.' },
      removeLabel: { type: 'string', required: false, description: 'Accessible label for the remove control.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [{ name: 'variant', values: ['default', 'brand', 'outline'], default: 'default', description: 'Visual style.' }],
    states: [
      { name: 'default', description: 'Static tag.' },
      { name: 'closable', description: 'Tag with a remove control.' },
    ],
    composition: {
      allowedParents: ['card', 'list', 'table', 'data-grid', 'page'],
      allowedChildren: ['text', 'icon'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use a tag as a primary action button.',
      'Do not place interactive content other than the remove control inside a tag.',
    ],
    a11y: {
      role: 'listitem',
      keyboard: ['Enter or Space activates the remove control'],
      focus: 'Remove control is a real button in tab order.',
      labeling: 'Tag text labels the element; remove control has an aria-label.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Inline flow; wraps with surrounding content.',
      breakpoints: { compact: 'Wraps inline.', medium: 'Wraps inline.', large: 'Wraps inline.' },
    },
    dataAi: { role: 'tag', states: ['default', 'closable'] },
    messages: {
      en: { label: 'Tag', remove: 'Remove tag' },
      'zh-CN': { label: '标签', remove: '移除标签' },
      de: { label: 'Markierung', remove: 'Diese Markierung entfernen' },
      ar: { label: 'وسم', remove: 'إزالة الوسم' },
    },
  },
  {
    slug: 'statistic',
    name: 'Statistic',
    family: 'D',
    tier: 'base',
    purpose: 'Displays a single prominent metric with label, value, and optional trend indicator.',
    scenarios: ['Show revenue on a dashboard', 'Display active user count', 'Present conversion rate with trend'],
    props: {
      label: { type: 'string', required: true, description: 'Metric label.' },
      value: { type: 'string', required: true, description: 'Formatted metric value.' },
      trend: { type: 'enum', required: false, description: 'Trend direction indicator.', values: ['up', 'down', 'flat'], default: 'flat' },
      trendLabel: { type: 'string', required: false, description: 'Accessible description of the trend.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [{ name: 'trend', values: ['up', 'down', 'flat'], default: 'flat', description: 'Trend direction.' }],
    states: [{ name: 'default', description: 'Metric rendered with current value.' }],
    composition: {
      allowedParents: ['card', 'kpi-dashboard', 'grid', 'page'],
      allowedChildren: ['text'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not truncate the value without an accessible full form.',
      'Do not use color alone to convey trend direction.',
    ],
    a11y: {
      role: 'group',
      keyboard: [],
      focus: 'Not focusable; purely presentational.',
      labeling: 'Label text precedes the value; trend has a text alternative.',
      wcag: ['1.1.1', '1.3.1'],
    },
    responsive: {
      strategy: 'Stacks label above value; scales with type ramp.',
      breakpoints: { compact: 'Compact value size.', medium: 'Default value size.', large: 'Default value size.' },
    },
    dataAi: { role: 'statistic', states: ['default', 'up', 'down', 'flat'] },
    messages: {
      en: { label: 'Statistic', trend: 'Trend' },
      'zh-CN': { label: '统计', trend: '趋势' },
      de: { label: 'Statistikkennzahl', trend: 'Trendrichtung' },
      ar: { label: 'إحصائية', trend: 'الاتجاه' },
    },
  },
  {
    slug: 'timeline',
    name: 'Timeline',
    family: 'D',
    tier: 'base',
    purpose: 'Presents a chronologically ordered list of events with markers and timestamps.',
    scenarios: ['Show order fulfillment steps', 'Display activity history', 'Present project milestones'],
    props: {
      items: { type: 'string', required: true, description: 'Array of { id, title, description?, time? } events in order.' },
      emptyLabel: { type: 'string', required: false, description: 'Text shown when items is empty.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Timeline with events.' },
      { name: 'empty', description: 'No events to show.' },
    ],
    composition: {
      allowedParents: ['card', 'page', 'app-shell'],
      allowedChildren: ['text', 'badge'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not render events out of chronological order.',
      'Do not use a timeline for navigation between pages.',
    ],
    a11y: {
      role: 'list',
      keyboard: [],
      focus: 'Items are not focusable unless they contain actions.',
      labeling: 'Ordered list semantics convey chronology; timestamps use time elements.',
      wcag: ['1.3.1'],
    },
    responsive: {
      strategy: 'Vertical rail at all breakpoints; indentation follows inline direction.',
      breakpoints: { compact: 'Narrow rail.', medium: 'Default rail.', large: 'Default rail.' },
    },
    dataAi: { role: 'timeline', states: ['default', 'empty'] },
    messages: {
      en: { label: 'Timeline', empty: 'No events yet' },
      'zh-CN': { label: '时间线', empty: '暂无事件' },
      de: { label: 'Zeitstrahlansicht', empty: 'Noch keine Ereignisse vorhanden' },
      ar: { label: 'الخط الزمني', empty: 'لا توجد أحداث بعد' },
    },
  },
  {
    slug: 'tree',
    name: 'Tree',
    family: 'D',
    tier: 'base',
    purpose: 'Displays hierarchical data as an expandable and collapsible tree.',
    scenarios: ['Browse a file directory', 'Show an organization chart', 'Navigate nested categories'],
    props: {
      nodes: { type: 'string', required: true, description: 'Array of { id, label, children? } tree nodes.' },
      defaultExpandedIds: { type: 'string', required: false, description: 'Node ids expanded on first render.' },
      toggleLabel: { type: 'string', required: false, description: 'Accessible label pattern for node toggles.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Tree with collapsible nodes.' },
      { name: 'empty', description: 'No nodes provided.' },
    ],
    composition: {
      allowedParents: ['card', 'page', 'drawer', 'app-shell'],
      allowedChildren: ['text', 'icon', 'badge'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use a tree for flat lists; use List.',
      'Do not lazy-load children without a loading indicator.',
    ],
    a11y: {
      role: 'tree',
      keyboard: ['Enter or Space toggles node expansion'],
      focus: 'Node toggles are buttons in tab order with aria-expanded.',
      labeling: 'Each node is a treeitem labelled by its text; groups use role=group.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Indentation scales with inline direction; overflow scrolls horizontally.',
      breakpoints: { compact: 'Horizontal scroll for deep levels.', medium: 'Default indentation.', large: 'Default indentation.' },
    },
    dataAi: { role: 'tree', states: ['default', 'empty', 'expanded', 'collapsed'] },
    messages: {
      en: { label: 'Tree', toggleNode: 'Toggle node' },
      'zh-CN': { label: '树', toggleNode: '切换节点' },
      de: { label: 'Baumstruktur', toggleNode: 'Knoten ein- oder ausklappen' },
      ar: { label: 'شجرة', toggleNode: 'تبديل العقدة' },
    },
  },
  {
    slug: 'image',
    name: 'Image',
    family: 'D',
    tier: 'base',
    purpose: 'Renders an image with loading state, error fallback, and optional caption.',
    scenarios: ['Show a product photo', 'Display a user avatar with fallback', 'Present a figure with caption'],
    props: {
      src: { type: 'string', required: true, description: 'Image source URL.' },
      alt: { type: 'string', required: true, description: 'Alternative text; empty string marks decorative images.' },
      caption: { type: 'string', required: false, description: 'Visible caption below the image.' },
      errorLabel: { type: 'string', required: false, description: 'Text shown when the image fails to load.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Image loaded.' },
      { name: 'error', description: 'Image failed to load; fallback shown.' },
    ],
    composition: {
      allowedParents: ['card', 'article-card', 'page', 'grid'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not omit alt text for informative images.',
      'Do not use an image to present text that could be real text.',
    ],
    a11y: {
      role: 'img',
      keyboard: [],
      focus: 'Not focusable.',
      labeling: 'alt attribute carries the text alternative; caption uses figcaption.',
      wcag: ['1.1.1'],
    },
    responsive: {
      strategy: 'Scales to container width while preserving aspect ratio.',
      breakpoints: { compact: 'Full container width.', medium: 'Full container width.', large: 'Full container width.' },
    },
    dataAi: { role: 'image', states: ['default', 'error'] },
    messages: {
      en: { label: 'Image', loadError: 'Image failed to load' },
      'zh-CN': { label: '图片', loadError: '图片加载失败' },
      de: { label: 'Bildanzeige', loadError: 'Bild konnte nicht geladen werden' },
      ar: { label: 'صورة', loadError: 'تعذر تحميل الصورة' },
    },
  },
  {
    slug: 'carousel',
    name: 'Carousel',
    family: 'D',
    tier: 'base',
    purpose: 'Cycles through a sequence of slides with previous and next controls.',
    scenarios: ['Show featured products', 'Present onboarding steps', 'Display a media gallery'],
    props: {
      items: { type: 'node', required: true, description: 'Slide content rendered one at a time.' },
      label: { type: 'string', required: true, description: 'Accessible label naming the carousel region.' },
      previousLabel: { type: 'string', required: true, description: 'Accessible label for the previous control.' },
      nextLabel: { type: 'string', required: true, description: 'Accessible label for the next control.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Showing the active slide.' },
      { name: 'empty', description: 'No slides provided.' },
    ],
    composition: {
      allowedParents: ['page', 'card', 'app-shell'],
      allowedChildren: ['image', 'card', 'text'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not auto-advance slides without a pause control.',
      'Do not hide critical content only inside non-active slides.',
    ],
    a11y: {
      role: 'region',
      keyboard: ['Arrow keys move between slides when controls are focused'],
      focus: 'Previous and next controls are buttons in tab order.',
      labeling: 'Region has aria-roledescription=carousel and an accessible label.',
      wcag: ['2.2.2', '4.1.2'],
    },
    responsive: {
      strategy: 'One slide visible per viewport width at all breakpoints.',
      breakpoints: { compact: 'Full-width slide with large touch targets.', medium: 'Full-width slide.', large: 'Full-width slide.' },
    },
    dataAi: { role: 'carousel', states: ['default', 'empty'] },
    messages: {
      en: { label: 'Carousel', previousSlide: 'Previous slide', nextSlide: 'Next slide' },
      'zh-CN': { label: '轮播', previousSlide: '上一张', nextSlide: '下一张' },
      de: { label: 'Karussellansicht', previousSlide: 'Vorherige Folie anzeigen', nextSlide: 'Nächste Folie anzeigen' },
      ar: { label: 'عارض الشرائح', previousSlide: 'الشريحة السابقة', nextSlide: 'الشريحة التالية' },
    },
  },
)

// === E family additions (Phase 6) ===
SPECS.push(
  {
    slug: 'notification',
    name: 'Notification',
    family: 'E',
    tier: 'base',
    purpose: 'Presents a persistent notification card with title, message, and dismiss control.',
    scenarios: ['Show a sync completion notice', 'Display a permission request', 'Present a system warning'],
    props: {
      title: { type: 'string', required: true, description: 'Notification headline.' },
      message: { type: 'string', required: true, description: 'Notification body text.' },
      variant: { type: 'enum', required: false, description: 'Semantic tone.', values: ['info', 'success', 'warning', 'error'], default: 'info' },
      onDismiss: { type: 'event', required: false, description: 'Called when the dismiss control is activated.' },
      dismissLabel: { type: 'string', required: false, description: 'Accessible label for the dismiss control.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [{ name: 'variant', values: ['info', 'success', 'warning', 'error'], default: 'info', description: 'Semantic tone.' }],
    states: [
      { name: 'default', description: 'Visible notification.' },
      { name: 'dismissed', description: 'Dismissed by the user.' },
    ],
    composition: {
      allowedParents: ['page', 'app-shell', 'card'],
      allowedChildren: ['button', 'link'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use a persistent notification for transient feedback; use Toast.',
      'Do not stack more than three notifications at once.',
    ],
    a11y: {
      role: 'status',
      keyboard: ['Escape dismisses when the notification has focus'],
      focus: 'Dismiss control is a button in tab order.',
      labeling: 'Title labels the notification; icon is decorative with text tone.',
      wcag: ['1.3.1', '4.1.3'],
    },
    responsive: {
      strategy: 'Full width on compact; fixed measure on larger breakpoints.',
      breakpoints: { compact: 'Full width card.', medium: 'Constrained width.', large: 'Constrained width.' },
    },
    dataAi: { role: 'notification', states: ['default', 'dismissed', 'info', 'success', 'warning', 'error'] },
    messages: {
      en: { label: 'Notification', dismiss: 'Dismiss' },
      'zh-CN': { label: '通知', dismiss: '关闭' },
      de: { label: 'Systembenachrichtigung', dismiss: 'Benachrichtigung schließen' },
      ar: { label: 'إشعار', dismiss: 'تجاهل' },
    },
  },
  {
    slug: 'confirm-dialog',
    name: 'ConfirmDialog',
    family: 'E',
    tier: 'base',
    purpose: 'Interrupts the user with a modal confirmation before a consequential action.',
    scenarios: ['Confirm record deletion', 'Confirm leaving an unsaved form', 'Confirm an irreversible publish'],
    props: {
      triggerLabel: { type: 'string', required: true, description: 'Label of the button that opens the dialog.' },
      title: { type: 'string', required: true, description: 'Dialog headline.' },
      description: { type: 'string', required: true, description: 'Explanation of the consequence.' },
      confirmLabel: { type: 'string', required: true, description: 'Label of the confirm action.' },
      cancelLabel: { type: 'string', required: true, description: 'Label of the cancel action.' },
      onConfirm: { type: 'event', required: false, description: 'Called when the user confirms.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'closed', description: 'Trigger visible; dialog hidden.' },
      { name: 'open', description: 'Dialog is displayed modally.' },
    ],
    composition: {
      allowedParents: ['page', 'app-shell', 'card', 'form'],
      allowedChildren: ['button'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use a confirm dialog for low-risk reversible actions.',
      'Do not word the confirm label ambiguously; name the action.',
    ],
    a11y: {
      role: 'alertdialog',
      keyboard: ['Escape cancels', 'Enter confirms when the confirm button has focus'],
      focus: 'Focus moves to the cancel button on open and returns to the trigger on close.',
      labeling: 'Title and description label the dialog via aria attributes.',
      wcag: ['2.4.3', '3.3.4'],
    },
    responsive: {
      strategy: 'Centered modal on medium and large; bottom sheet on compact per Dialog convention.',
      breakpoints: { compact: 'Bottom sheet layout.', medium: 'Centered modal.', large: 'Centered modal.' },
    },
    dataAi: { role: 'confirm-dialog', states: ['closed', 'open'] },
    messages: {
      en: { label: 'Confirmation', confirm: 'Confirm', cancel: 'Cancel' },
      'zh-CN': { label: '确认', confirm: '确认', cancel: '取消' },
      de: { label: 'Bestätigungsdialog', confirm: 'Aktion bestätigen', cancel: 'Vorgang abbrechen' },
      ar: { label: 'تأكيد', confirm: 'تأكيد', cancel: 'إلغاء' },
    },
  },
  {
    slug: 'result',
    name: 'Result',
    family: 'E',
    tier: 'base',
    purpose: 'Presents the outcome of a process with status icon, title, description, and actions.',
    scenarios: ['Show a payment success page', 'Display a 404 empty result', 'Present a failed import summary'],
    props: {
      status: { type: 'enum', required: false, description: 'Outcome tone.', values: ['success', 'error', 'info', 'warning'], default: 'info' },
      title: { type: 'string', required: true, description: 'Result headline.' },
      description: { type: 'string', required: false, description: 'Supporting explanation.' },
      children: { type: 'node', required: false, description: 'Action area below the description.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [{ name: 'status', values: ['success', 'error', 'info', 'warning'], default: 'info', description: 'Outcome tone.' }],
    states: [{ name: 'default', description: 'Result panel rendered.' }],
    composition: {
      allowedParents: ['page', 'app-shell', 'dialog'],
      allowedChildren: ['button', 'link', 'text'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use a result for inline field errors; use InlineAlert.',
      'Do not leave the user without a next action on error results.',
    ],
    a11y: {
      role: 'status',
      keyboard: [],
      focus: 'Actions follow the description in tab order.',
      labeling: 'Status icon has a text equivalent derived from status.',
      wcag: ['1.1.1', '1.3.1'],
    },
    responsive: {
      strategy: 'Centered single column at all breakpoints.',
      breakpoints: { compact: 'Full width, stacked.', medium: 'Centered measure.', large: 'Centered measure.' },
    },
    dataAi: { role: 'result', states: ['default', 'success', 'error', 'info', 'warning'] },
    messages: {
      en: { label: 'Result' },
      'zh-CN': { label: '结果' },
      de: { label: 'Ergebnisanzeige' },
      ar: { label: 'النتيجة' },
    },
  },
  {
    slug: 'loading-bar',
    name: 'LoadingBar',
    family: 'E',
    tier: 'base',
    purpose: 'Shows page-level loading progress as a thin bar pinned to the viewport start edge.',
    scenarios: ['Indicate route transition progress', 'Show initial data load', 'Mirror long task progress'],
    props: {
      value: { type: 'number', required: false, description: 'Progress 0-100; omit for indeterminate.' },
      label: { type: 'string', required: false, description: 'Accessible label for the progress bar.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Determinate progress.' },
      { name: 'indeterminate', description: 'Unknown duration; animated bar.' },
    ],
    composition: {
      allowedParents: ['app-shell', 'page'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use a loading bar for local component loading; use Spinner or Skeleton.',
      'Do not show determinate progress without a real measurable total.',
    ],
    a11y: {
      role: 'progressbar',
      keyboard: [],
      focus: 'Not focusable; status announced via role.',
      labeling: 'aria-label names the loading process; aria-valuenow set when determinate.',
      wcag: ['4.1.3'],
    },
    responsive: {
      strategy: 'Full viewport width at all breakpoints; pinned to the block-start edge.',
      breakpoints: { compact: 'Full width.', medium: 'Full width.', large: 'Full width.' },
    },
    dataAi: { role: 'loading-bar', states: ['default', 'indeterminate'] },
    messages: {
      en: { label: 'Loading' },
      'zh-CN': { label: '加载' },
      de: { label: 'Ladeanzeige aktiv' },
      ar: { label: 'تحميل' },
    },
  },
)

// === F family (Phase 6) ===
SPECS.push(
  {
    slug: 'chart',
    name: 'Chart',
    family: 'F',
    tier: 'heavy',
    purpose: 'Unified chart wrapper rendering bar, line, and area series as SVG with theme colors consumed only from tokens.',
    scenarios: ['Show monthly revenue as bars', 'Display latency as a line series', 'Compare two metrics as areas'],
    props: {
      type: { type: 'enum', required: false, description: 'Series rendering mode.', values: ['bar', 'line', 'area'], default: 'line' },
      series: { type: 'string', required: true, description: 'Array of { name, data: number[] } series.' },
      labels: { type: 'string', required: false, description: 'Category labels for the x axis.' },
      label: { type: 'string', required: true, description: 'Accessible chart description.' },
      emptyLabel: { type: 'string', required: false, description: 'Text shown when no series has data.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [{ name: 'type', values: ['bar', 'line', 'area'], default: 'line', description: 'Series rendering mode.' }],
    states: [
      { name: 'default', description: 'Chart rendered with data.' },
      { name: 'empty', description: 'No data to plot.' },
    ],
    composition: {
      allowedParents: ['card', 'kpi-dashboard', 'page', 'app-shell'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not hardcode hex colors; series paint comes from tokens.',
      'Do not render more than eight series in one chart.',
    ],
    a11y: {
      role: 'img',
      keyboard: [],
      focus: 'Chart is not focusable; provide a data table alternative for screen readers.',
      labeling: 'aria-label summarizes the chart; a visually hidden table may mirror the data.',
      wcag: ['1.1.1', '1.4.1'],
    },
    responsive: {
      strategy: 'SVG scales to container width via viewBox; height keeps a 2:1 ratio.',
      breakpoints: { compact: 'Full width, reduced padding.', medium: 'Full width.', large: 'Full width.' },
    },
    dataAi: { role: 'chart', states: ['default', 'empty', 'bar', 'line', 'area'] },
    messages: {
      en: { label: 'Chart', series: 'Series', empty: 'No data' },
      'zh-CN': { label: '图表', series: '数据系列', empty: '暂无数据' },
      de: { label: 'Diagrammansicht', series: 'Datenreihe', empty: 'Keine Daten vorhanden' },
      ar: { label: 'مخطط', series: 'سلسلة البيانات', empty: 'لا توجد بيانات' },
    },
  },
  {
    slug: 'kpi-dashboard',
    name: 'KpiDashboard',
    family: 'F',
    tier: 'base',
    purpose: 'Arranges a set of key performance indicators in a responsive metric grid.',
    scenarios: ['Executive overview row', 'Operations health board', 'Marketing campaign summary'],
    props: {
      items: { type: 'string', required: true, description: 'Array of { id, label, value, trend? } metrics.' },
      label: { type: 'string', required: false, description: 'Accessible label for the dashboard region.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Grid populated with metrics.' },
      { name: 'empty', description: 'No metrics provided.' },
    ],
    composition: {
      allowedParents: ['page', 'app-shell', 'card'],
      allowedChildren: ['statistic'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not exceed eight KPI tiles in one dashboard.',
      'Do not mix unrelated units without labeling each tile.',
    ],
    a11y: {
      role: 'region',
      keyboard: [],
      focus: 'Tiles are not focusable unless they contain actions.',
      labeling: 'Region label names the dashboard; each metric is a group.',
      wcag: ['1.3.1'],
    },
    responsive: {
      strategy: 'Grid collapses from four columns to two to one.',
      breakpoints: { compact: 'Single column.', medium: 'Two columns.', large: 'Four columns.' },
    },
    dataAi: { role: 'kpi-dashboard', states: ['default', 'empty'] },
    messages: {
      en: { label: 'KPI dashboard' },
      'zh-CN': { label: '指标看板' },
      de: { label: 'Kennzahlenübersicht' },
      ar: { label: 'لوحة المؤشرات' },
    },
  },
  {
    slug: 'ticker',
    name: 'Ticker',
    family: 'F',
    tier: 'base',
    purpose: 'Shows a horizontally scrolling strip of compact market or status items.',
    scenarios: ['Stock price strip', 'Live system status feed', 'Exchange rate ribbon'],
    props: {
      items: { type: 'string', required: true, description: 'Array of { id, label, value, trend? } ticker entries.' },
      label: { type: 'string', required: false, description: 'Accessible label for the ticker region.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Ticker populated with items.' },
      { name: 'empty', description: 'No items provided.' },
    ],
    composition: {
      allowedParents: ['page', 'app-shell'],
      allowedChildren: ['text'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not animate the strip without honoring reduced motion.',
      'Do not place interactive controls inside ticker items.',
    ],
    a11y: {
      role: 'region',
      keyboard: [],
      focus: 'Not focusable; items are presentational.',
      labeling: 'Region label names the feed; trend arrows have text alternatives.',
      wcag: ['1.1.1', '2.2.2'],
    },
    responsive: {
      strategy: 'Horizontal scroll strip at all breakpoints.',
      breakpoints: { compact: 'Scrollable strip.', medium: 'Scrollable strip.', large: 'Scrollable strip.' },
    },
    dataAi: { role: 'ticker', states: ['default', 'empty'] },
    messages: {
      en: { label: 'Ticker' },
      'zh-CN': { label: '滚动行情' },
      de: { label: 'Kurslaufband' },
      ar: { label: 'شريط الأخبار' },
    },
  },
  {
    slug: 'sparkline',
    name: 'Sparkline',
    family: 'F',
    tier: 'base',
    purpose: 'Renders a miniature trend line for inline placement beside metrics.',
    scenarios: ['Trend beside a KPI value', 'Inline table cell trend', 'Compact performance hint'],
    props: {
      data: { type: 'string', required: true, description: 'Array of numeric samples in order.' },
      label: { type: 'string', required: true, description: 'Accessible description of the trend.' },
      width: { type: 'number', required: false, description: 'SVG viewport width in px.', default: 96 },
      height: { type: 'number', required: false, description: 'SVG viewport height in px.', default: 28 },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Trend line rendered.' },
      { name: 'empty', description: 'No samples provided.' },
    ],
    composition: {
      allowedParents: ['statistic', 'kpi-dashboard', 'table', 'card'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not add axes or legends to a sparkline; use Chart.',
      'Do not render a sparkline with fewer than two samples.',
    ],
    a11y: {
      role: 'img',
      keyboard: [],
      focus: 'Not focusable.',
      labeling: 'aria-label summarizes the trend direction.',
      wcag: ['1.1.1'],
    },
    responsive: {
      strategy: 'Fixed intrinsic size; does not stretch.',
      breakpoints: { compact: 'Intrinsic size.', medium: 'Intrinsic size.', large: 'Intrinsic size.' },
    },
    dataAi: { role: 'sparkline', states: ['default', 'empty'] },
    messages: {
      en: { label: 'Sparkline' },
      'zh-CN': { label: '迷你趋势' },
      de: { label: 'Miniaturverlauf' },
      ar: { label: 'مخطط مصغر' },
    },
  },
  {
    slug: 'heatmap',
    name: 'Heatmap',
    family: 'F',
    tier: 'base',
    purpose: 'Renders a matrix of values as color-intensity cells over a token-derived scale.',
    scenarios: ['Commit activity calendar', 'Hour-by-day traffic matrix', 'Risk severity grid'],
    props: {
      rows: { type: 'string', required: true, description: 'Row labels in order.' },
      columns: { type: 'string', required: true, description: 'Column labels in order.' },
      values: { type: 'string', required: true, description: 'Row-major matrix of numbers matching rows x columns.' },
      label: { type: 'string', required: true, description: 'Accessible description of the matrix.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Matrix rendered.' },
      { name: 'empty', description: 'No values provided.' },
    ],
    composition: {
      allowedParents: ['card', 'page', 'app-shell'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not rely on color alone; cells expose their numeric value.',
      'Do not render matrices larger than 60x24 without pagination.',
    ],
    a11y: {
      role: 'grid',
      keyboard: [],
      focus: 'Cells are not focusable; values are available to screen readers via text.',
      labeling: 'aria-label summarizes the matrix; each cell exposes its value.',
      wcag: ['1.1.1', '1.4.1'],
    },
    responsive: {
      strategy: 'Cells shrink to a minimum size; container scrolls horizontally beyond that.',
      breakpoints: { compact: 'Horizontal scroll.', medium: 'Fit container.', large: 'Fit container.' },
    },
    dataAi: { role: 'heatmap', states: ['default', 'empty'] },
    messages: {
      en: { label: 'Heatmap' },
      'zh-CN': { label: '热力图' },
      de: { label: 'Heatmap-Matrix' },
      ar: { label: 'خريطة حرارية' },
    },
  },
  {
    slug: 'gauge',
    name: 'Gauge',
    family: 'F',
    tier: 'base',
    purpose: 'Shows a single value on a semicircular dial against a maximum.',
    scenarios: ['CPU utilization dial', 'Score against target', 'Capacity usage indicator'],
    props: {
      value: { type: 'number', required: true, description: 'Current value.' },
      max: { type: 'number', required: false, description: 'Maximum value.', default: 100 },
      label: { type: 'string', required: true, description: 'Accessible description of the gauge.' },
      valueLabel: { type: 'string', required: false, description: 'Formatted value text shown in the dial.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [{ name: 'default', description: 'Dial rendered with the current value.' }],
    composition: {
      allowedParents: ['card', 'kpi-dashboard', 'page'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use a gauge for negative ranges.',
      'Do not place multiple gauges in a row without aligned max values.',
    ],
    a11y: {
      role: 'meter',
      keyboard: [],
      focus: 'Not focusable.',
      labeling: 'role=meter with aria-valuemin/max/now exposes the value.',
      wcag: ['1.1.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Fixed intrinsic size that scales down on compact.',
      breakpoints: { compact: 'Scaled down dial.', medium: 'Intrinsic size.', large: 'Intrinsic size.' },
    },
    dataAi: { role: 'gauge', states: ['default'] },
    messages: {
      en: { label: 'Gauge', value: 'Value' },
      'zh-CN': { label: '仪表盘', value: '数值' },
      de: { label: 'Instrumentenanzeige', value: 'Messwert' },
      ar: { label: 'مقياس', value: 'القيمة' },
    },
  },
)

// === H family (Phase 6) ===
SPECS.push(
  {
    slug: 'editor',
    name: 'Editor',
    family: 'H',
    tier: 'heavy',
    purpose: 'Rich text editor with a minimal self-contained contentEditable kernel and a formatting toolbar.',
    scenarios: ['Compose a support reply', 'Edit a release note', 'Draft a comment with emphasis'],
    props: {
      label: { type: 'string', required: true, description: 'Accessible label for the editable region.' },
      placeholder: { type: 'string', required: false, description: 'Hint text shown while empty.' },
      initialHtml: { type: 'string', required: false, description: 'Initial sanitized HTML content.' },
      onChange: { type: 'event', required: false, description: 'Called with the current HTML on every edit.' },
      boldLabel: { type: 'string', required: false, description: 'Accessible label for the bold command.' },
      italicLabel: { type: 'string', required: false, description: 'Accessible label for the italic command.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Editor ready with content.' },
      { name: 'empty', description: 'Editor ready and empty; placeholder visible.' },
    ],
    composition: {
      allowedParents: ['form', 'card', 'page', 'comment-thread'],
      allowedChildren: ['text'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not inject unsanitized HTML into the editable region.',
      'Do not use the editor as a code editor; use CodeBlock or a dedicated control.',
    ],
    a11y: {
      role: 'textbox',
      keyboard: ['Ctrl+B toggles bold', 'Ctrl+I toggles italic'],
      focus: 'Editable region is focusable with aria-multiline; toolbar buttons precede it.',
      labeling: 'aria-label names the editor; toolbar buttons expose command names.',
      wcag: ['2.1.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Full width editing surface; toolbar wraps on compact.',
      breakpoints: { compact: 'Toolbar wraps to two rows.', medium: 'Single toolbar row.', large: 'Single toolbar row.' },
    },
    dataAi: { role: 'editor', states: ['default', 'empty'] },
    messages: {
      en: { label: 'Rich text editor', bold: 'Bold', italic: 'Italic', placeholder: 'Write something' },
      'zh-CN': { label: '富文本编辑器', bold: '加粗', italic: '斜体', placeholder: '请输入内容' },
      de: { label: 'Formatierter Texteditor', bold: 'Fett formatieren', italic: 'Kursiv formatieren', placeholder: 'Geben Sie hier Ihren Text ein' },
      ar: { label: 'محرر نصوص', bold: 'غامق', italic: 'مائل', placeholder: 'اكتب شيئًا' },
    },
  },
  {
    slug: 'markdown-renderer',
    name: 'MarkdownRenderer',
    family: 'H',
    tier: 'base',
    purpose: 'Renders Markdown text to semantic elements without raw HTML injection; friendly to streamed input.',
    scenarios: ['Render an AI assistant reply', 'Display changelog entries', 'Show formatted documentation excerpts'],
    props: {
      markdown: { type: 'string', required: true, description: 'Markdown source text.' },
      label: { type: 'string', required: false, description: 'Accessible label for the rendered region.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Rendered content.' },
      { name: 'empty', description: 'Empty source renders nothing.' },
    ],
    composition: {
      allowedParents: ['chat-bubble', 'article-card', 'card', 'page'],
      allowedChildren: ['code-block', 'link', 'text'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not pass raw HTML through; only the supported Markdown subset renders.',
      'Do not use it as an editor; it is read-only.',
    ],
    a11y: {
      role: 'document',
      keyboard: [],
      focus: 'Links inside the output stay in document order.',
      labeling: 'Semantic headings and lists preserve document structure.',
      wcag: ['1.3.1'],
    },
    responsive: {
      strategy: 'Flows with the parent measure; code blocks scroll horizontally.',
      breakpoints: { compact: 'Narrow measure, scrollable code.', medium: 'Default measure.', large: 'Default measure.' },
    },
    dataAi: { role: 'markdown-renderer', states: ['default', 'empty'] },
    messages: {
      en: { label: 'Markdown content' },
      'zh-CN': { label: 'Markdown 内容' },
      de: { label: 'Markdown-formatierter Inhalt' },
      ar: { label: 'محتوى Markdown' },
    },
  },
  {
    slug: 'comment-thread',
    name: 'CommentThread',
    family: 'H',
    tier: 'base',
    purpose: 'Displays a nested thread of comments with author, timestamp, and reply affordance.',
    scenarios: ['Discussion under a document', 'Review comments on a design', 'Issue conversation view'],
    props: {
      comments: { type: 'string', required: true, description: 'Array of { id, author, time, text, replies? } in order.' },
      label: { type: 'string', required: false, description: 'Accessible label for the thread region.' },
      replyLabel: { type: 'string', required: false, description: 'Accessible label for reply buttons.' },
      onReply: { type: 'event', required: false, description: 'Called with the comment id when reply is activated.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Thread with comments.' },
      { name: 'empty', description: 'No comments yet.' },
    ],
    composition: {
      allowedParents: ['page', 'card', 'article-card'],
      allowedChildren: ['avatar', 'button', 'editor'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not nest replies deeper than three levels.',
      'Do not render comments without an author label.',
    ],
    a11y: {
      role: 'list',
      keyboard: ['Tab moves through reply buttons'],
      focus: 'Reply buttons are real buttons in tab order.',
      labeling: 'Nested lists convey reply depth; author and time label each comment.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Reply indentation shrinks on compact.',
      breakpoints: { compact: 'Reduced indentation.', medium: 'Default indentation.', large: 'Default indentation.' },
    },
    dataAi: { role: 'comment-thread', states: ['default', 'empty'] },
    messages: {
      en: { label: 'Comments', reply: 'Reply' },
      'zh-CN': { label: '评论', reply: '回复' },
      de: { label: 'Kommentarbereich', reply: 'Antworten' },
      ar: { label: 'تعليقات', reply: 'رد' },
    },
  },
  {
    slug: 'chat-bubble',
    name: 'ChatBubble',
    family: 'H',
    tier: 'base',
    purpose: 'Presents a single chat message aligned and styled by its author role.',
    scenarios: ['User prompt in an AI chat', 'Assistant answer with markdown body', 'System notice between turns'],
    props: {
      role: { type: 'enum', required: false, description: 'Author role driving alignment and tone.', values: ['user', 'assistant', 'system'], default: 'assistant' },
      children: { type: 'node', required: true, description: 'Message body content.' },
      time: { type: 'string', required: false, description: 'Timestamp text.' },
      label: { type: 'string', required: false, description: 'Accessible label override.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [{ name: 'role', values: ['user', 'assistant', 'system'], default: 'assistant', description: 'Author role.' }],
    states: [{ name: 'default', description: 'Message bubble rendered.' }],
    composition: {
      allowedParents: ['page', 'card', 'app-shell'],
      allowedChildren: ['markdown-renderer', 'text', 'code-block'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use a chat bubble outside conversational UI.',
      'Do not place interactive forms inside a system bubble.',
    ],
    a11y: {
      role: 'article',
      keyboard: [],
      focus: 'Interactive children keep document order.',
      labeling: 'Author role is exposed as text for screen readers.',
      wcag: ['1.3.1'],
    },
    responsive: {
      strategy: 'Bubble max measure shrinks on compact.',
      breakpoints: { compact: 'Near full width.', medium: 'Constrained measure.', large: 'Constrained measure.' },
    },
    dataAi: { role: 'chat-bubble', states: ['default', 'user', 'assistant', 'system'] },
    messages: {
      en: { label: 'Chat message' },
      'zh-CN': { label: '对话消息' },
      de: { label: 'Chat-Nachrichtenblase' },
      ar: { label: 'رسالة محادثة' },
    },
  },
  {
    slug: 'code-block',
    name: 'CodeBlock',
    family: 'H',
    tier: 'base',
    purpose: 'Presents formatted source code with language label and a copy action.',
    scenarios: ['API usage snippet in docs', 'Error log excerpt', 'Configuration example'],
    props: {
      code: { type: 'string', required: true, description: 'Source text to display.' },
      language: { type: 'string', required: false, description: 'Language identifier shown as a label.' },
      copyLabel: { type: 'string', required: false, description: 'Accessible label for the copy button.' },
      copiedLabel: { type: 'string', required: false, description: 'Text shown briefly after copying.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Code shown; copy available.' },
      { name: 'copied', description: 'Copy just succeeded; confirmation visible.' },
    ],
    composition: {
      allowedParents: ['markdown-renderer', 'article-card', 'card', 'page'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not execute code from the block.',
      'Do not truncate code without a scroll affordance.',
    ],
    a11y: {
      role: 'figure',
      keyboard: ['Tab reaches the copy button'],
      focus: 'Copy button is in tab order; code region itself is not focusable.',
      labeling: 'Language label plus pre semantics describe the block.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Horizontal scroll for long lines at all breakpoints.',
      breakpoints: { compact: 'Scrollable region.', medium: 'Scrollable region.', large: 'Scrollable region.' },
    },
    dataAi: { role: 'code-block', states: ['default', 'copied'] },
    messages: {
      en: { label: 'Code block', copy: 'Copy code', copied: 'Copied' },
      'zh-CN': { label: '代码块', copy: '复制代码', copied: '已复制' },
      de: { label: 'Quellcode-Block', copy: 'Code kopieren', copied: 'In Zwischenablage kopiert' },
      ar: { label: 'كتلة تعليمات', copy: 'نسخ التعليمات', copied: 'تم النسخ' },
    },
  },
  {
    slug: 'article-card',
    name: 'ArticleCard',
    family: 'H',
    tier: 'base',
    purpose: 'Presents an article teaser with cover, title, excerpt, metadata, and read action.',
    scenarios: ['Blog listing grid', 'Knowledge base results', 'News feed entry'],
    props: {
      title: { type: 'string', required: true, description: 'Article headline.' },
      excerpt: { type: 'string', required: false, description: 'Short summary text.' },
      author: { type: 'string', required: false, description: 'Author display name.' },
      date: { type: 'string', required: false, description: 'Formatted publication date.' },
      coverSrc: { type: 'string', required: false, description: 'Cover image URL.' },
      coverAlt: { type: 'string', required: false, description: 'Cover image alt text.' },
      href: { type: 'string', required: false, description: 'Target URL for the read action.' },
      readLabel: { type: 'string', required: false, description: 'Accessible label for the read action.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [{ name: 'default', description: 'Teaser card rendered.' }],
    composition: {
      allowedParents: ['grid', 'list', 'page', 'carousel'],
      allowedChildren: ['badge', 'text'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not link the whole card and a nested read action at once.',
      'Do not clip the excerpt mid-word.',
    ],
    a11y: {
      role: 'article',
      keyboard: ['Enter activates the read action'],
      focus: 'Read action is the single tab stop.',
      labeling: 'Title labels the article; metadata is plain text.',
      wcag: ['1.3.1', '2.4.4'],
    },
    responsive: {
      strategy: 'Cover stacks above text on compact; side-by-side on large.',
      breakpoints: { compact: 'Stacked layout.', medium: 'Stacked layout.', large: 'Optional side-by-side.' },
    },
    dataAi: { role: 'article-card', states: ['default'] },
    messages: {
      en: { label: 'Article', readMore: 'Read article' },
      'zh-CN': { label: '文章', readMore: '阅读全文' },
      de: { label: 'Artikelkarte', readMore: 'Artikel weiterlesen' },
      ar: { label: 'مقالة', readMore: 'اقرأ المقال' },
    },
  },
  {
    slug: 'share-panel',
    name: 'SharePanel',
    family: 'H',
    tier: 'base',
    purpose: 'Offers share targets and a copyable link for the current content.',
    scenarios: ['Share a dashboard view', 'Share a market listing', 'Copy a deep link'],
    props: {
      title: { type: 'string', required: true, description: 'Panel headline.' },
      url: { type: 'string', required: true, description: 'Canonical URL to share.' },
      targets: { type: 'string', required: false, description: 'Subset of x | linkedin | email | copy targets to show.' },
      copyLabel: { type: 'string', required: false, description: 'Accessible label for the copy action.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Panel with targets.' },
      { name: 'copied', description: 'Link copy just succeeded.' },
    ],
    composition: {
      allowedParents: ['dialog', 'popover', 'card', 'page'],
      allowedChildren: ['button'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not open share targets without user activation.',
      'Do not list targets the current platform cannot open.',
    ],
    a11y: {
      role: 'group',
      keyboard: ['Tab moves across target buttons'],
      focus: 'All targets are buttons in tab order.',
      labeling: 'Panel title labels the group; each target button is named.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Targets wrap on compact.',
      breakpoints: { compact: 'Wrapped targets.', medium: 'Single row.', large: 'Single row.' },
    },
    dataAi: { role: 'share-panel', states: ['default', 'copied'] },
    messages: {
      en: { label: 'Share', copyLink: 'Copy link' },
      'zh-CN': { label: '分享', copyLink: '复制链接' },
      de: { label: 'Teilen-Panel', copyLink: 'Link kopieren' },
      ar: { label: 'مشاركة', copyLink: 'نسخ الرابط' },
    },
  },
)

// === G family (Phase 6) ===
SPECS.push(
  {
    slug: 'canvas-base',
    name: 'Canvas',
    family: 'G',
    tier: 'heavy',
    purpose: 'Zoomable and pannable canvas base with minimap and grid snapping; Canvas 2D grid backend with a DOM node layer.',
    scenarios: ['Host a flow editor', 'Pan across a large diagram', 'Zoom into a dense graph with minimap orientation'],
    props: {
      children: { type: 'node', required: false, description: 'Canvas items rendered inside the transformed world layer.' },
      label: { type: 'string', required: true, description: 'Accessible label for the canvas region.' },
      initialZoom: { type: 'number', required: false, description: 'Initial zoom factor.', default: 1 },
      minZoom: { type: 'number', required: false, description: 'Smallest zoom factor.', default: 0.25 },
      maxZoom: { type: 'number', required: false, description: 'Largest zoom factor.', default: 2 },
      gridSize: { type: 'number', required: false, description: 'Grid cell size in world px.', default: 24 },
      snapToGrid: { type: 'boolean', required: false, description: 'Snap world coordinates to the grid.', default: false },
      showMinimap: { type: 'boolean', required: false, description: 'Render the minimap overview.', default: false },
      onViewportChange: { type: 'event', required: false, description: 'Called with { zoom, offsetX, offsetY } on every pan or zoom.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Canvas idle at rest.' },
      { name: 'panning', description: 'User is dragging the viewport.' },
    ],
    composition: {
      allowedParents: ['page', 'app-shell'],
      allowedChildren: ['flow-node', 'edge', 'canvas-toolbar'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not nest one canvas inside another.',
      'Do not claim WebGL or worker rendering; the backend is Canvas 2D plus DOM.',
    ],
    a11y: {
      role: 'application',
      keyboard: ['Arrow keys pan the viewport', 'Plus and minus keys zoom'],
      focus: 'Canvas region is focusable; interactive nodes keep their own tab order.',
      labeling: 'aria-label names the canvas; zoom level is announced via aria-description.',
      wcag: ['2.1.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Fills the parent region; minimap hides on compact.',
      breakpoints: { compact: 'No minimap; touch pan only.', medium: 'Minimap visible.', large: 'Minimap visible.' },
    },
    dataAi: { role: 'canvas', states: ['default', 'panning'] },
    messages: {
      en: { label: 'Canvas', resetView: 'Reset view' },
      'zh-CN': { label: '画布', resetView: '重置视图' },
      de: { label: 'Zeichenfläche', resetView: 'Ansicht zurücksetzen' },
      ar: { label: 'لوحة الرسم', resetView: 'إعادة ضبط العرض' },
    },
  },
  {
    slug: 'flow-node',
    name: 'FlowNode',
    family: 'G',
    tier: 'base',
    purpose: 'A positioned node card for flow diagrams with input and output ports.',
    scenarios: ['Step in a workflow canvas', 'Task in an automation graph', 'State in a state machine view'],
    props: {
      id: { type: 'string', required: true, description: 'Stable node id.' },
      x: { type: 'number', required: true, description: 'World x position in px.' },
      y: { type: 'number', required: true, description: 'World y position in px.' },
      title: { type: 'string', required: true, description: 'Node headline.' },
      status: { type: 'enum', required: false, description: 'Node status tone.', values: ['default', 'active', 'success', 'failed'], default: 'default' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [{ name: 'status', values: ['default', 'active', 'success', 'failed'], default: 'default', description: 'Node status tone.' }],
    states: [{ name: 'default', description: 'Node rendered at its position.' }],
    composition: {
      allowedParents: ['canvas', 'mind-map', 'pipeline-view'],
      allowedChildren: ['text', 'badge', 'icon'],
      requiredContext: ['canvas'],
    },
    antiPatterns: [
      'Do not position flow nodes with physical left/right CSS.',
      'Do not render a flow node outside a canvas context.',
    ],
    a11y: {
      role: 'group',
      keyboard: [],
      focus: 'Node is focusable when it carries actions.',
      labeling: 'Title labels the node; status has a text equivalent.',
      wcag: ['1.3.1'],
    },
    responsive: {
      strategy: 'Fixed world size; scales with the canvas zoom.',
      breakpoints: { compact: 'Scales with zoom.', medium: 'Scales with zoom.', large: 'Scales with zoom.' },
    },
    dataAi: { role: 'flow-node', states: ['default', 'active', 'success', 'failed'] },
    messages: {
      en: { label: 'Flow node' },
      'zh-CN': { label: '流程节点' },
      de: { label: 'Prozessablauf-Knoten' },
      ar: { label: 'عقدة التدفق' },
    },
  },
  {
    slug: 'edge',
    name: 'Edge',
    family: 'G',
    tier: 'base',
    purpose: 'Draws a connection line between two canvas points with an optional label.',
    scenarios: ['Link two flow nodes', 'Show dependency direction', 'Annotate a connection'],
    props: {
      x1: { type: 'number', required: true, description: 'Start x in world px.' },
      y1: { type: 'number', required: true, description: 'Start y in world px.' },
      x2: { type: 'number', required: true, description: 'End x in world px.' },
      y2: { type: 'number', required: true, description: 'End y in world px.' },
      variant: { type: 'enum', required: false, description: 'Path shape.', values: ['bezier', 'straight'], default: 'bezier' },
      label: { type: 'string', required: false, description: 'Text rendered at the path midpoint.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [{ name: 'variant', values: ['bezier', 'straight'], default: 'bezier', description: 'Path shape.' }],
    states: [{ name: 'default', description: 'Edge rendered.' }],
    composition: {
      allowedParents: ['canvas', 'mind-map', 'graph-view', 'pipeline-view'],
      allowedChildren: [],
      requiredContext: ['canvas'],
    },
    antiPatterns: [
      'Do not use edges for decorative dividers.',
      'Do not draw edges without both endpoints resolved.',
    ],
    a11y: {
      role: 'img',
      keyboard: [],
      focus: 'Not focusable; relationships are described by node labels.',
      labeling: 'Optional midpoint label is real text.',
      wcag: ['1.1.1'],
    },
    responsive: {
      strategy: 'Vector path scales with the canvas zoom.',
      breakpoints: { compact: 'Scales with zoom.', medium: 'Scales with zoom.', large: 'Scales with zoom.' },
    },
    dataAi: { role: 'edge', states: ['default'] },
    messages: {
      en: { label: 'Edge' },
      'zh-CN': { label: '连线' },
      de: { label: 'Verbindungskante' },
      ar: { label: 'حافة' },
    },
  },
  {
    slug: 'mind-map',
    name: 'MindMap',
    family: 'G',
    tier: 'base',
    purpose: 'Lays out a topic tree as a deterministic left-to-right mind map on the canvas base.',
    scenarios: ['Brainstorm outline', 'Table of contents map', 'Decision tree sketch'],
    props: {
      root: { type: 'string', required: true, description: 'Root node { id, label, children? }.' },
      label: { type: 'string', required: true, description: 'Accessible label for the map region.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Map rendered.' },
      { name: 'empty', description: 'No root provided.' },
    ],
    composition: {
      allowedParents: ['page', 'app-shell', 'card'],
      allowedChildren: ['flow-node', 'edge'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use a mind map for cyclic graphs; use GraphView.',
      'Do not exceed six levels of depth in one map.',
    ],
    a11y: {
      role: 'tree',
      keyboard: [],
      focus: 'Node labels are exposed in document order.',
      labeling: 'Region label names the map; hierarchy mirrors the data tree.',
      wcag: ['1.3.1'],
    },
    responsive: {
      strategy: 'Layout is world-based; container scrolls on compact.',
      breakpoints: { compact: 'Scrollable canvas.', medium: 'Fits container.', large: 'Fits container.' },
    },
    dataAi: { role: 'mind-map', states: ['default', 'empty'] },
    messages: {
      en: { label: 'Mind map' },
      'zh-CN': { label: '思维导图' },
      de: { label: 'Mindmap-Ansicht' },
      ar: { label: 'خريطة ذهنية' },
    },
  },
  {
    slug: 'graph-view',
    name: 'GraphView',
    family: 'G',
    tier: 'base',
    purpose: 'Renders nodes and links as a deterministic ring-layout relationship diagram.',
    scenarios: ['Service dependency overview', 'Entity relationship preview', 'Team network snapshot'],
    props: {
      nodes: { type: 'string', required: true, description: 'Array of { id, label } graph nodes.' },
      links: { type: 'string', required: true, description: 'Array of { source, target } id pairs.' },
      label: { type: 'string', required: true, description: 'Accessible label for the graph region.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Graph rendered.' },
      { name: 'empty', description: 'No nodes provided.' },
    ],
    composition: {
      allowedParents: ['page', 'app-shell', 'card'],
      allowedChildren: ['flow-node', 'edge'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use the ring layout for graphs over 40 nodes.',
      'Do not claim force simulation; layout is deterministic.',
    ],
    a11y: {
      role: 'img',
      keyboard: [],
      focus: 'Node labels are listed in a companion list for screen readers.',
      labeling: 'aria-label summarizes node and link counts.',
      wcag: ['1.1.1', '1.3.1'],
    },
    responsive: {
      strategy: 'Scales to container via viewBox.',
      breakpoints: { compact: 'Scaled down.', medium: 'Fits container.', large: 'Fits container.' },
    },
    dataAi: { role: 'graph-view', states: ['default', 'empty'] },
    messages: {
      en: { label: 'Graph view' },
      'zh-CN': { label: '关系图' },
      de: { label: 'Beziehungsgraphansicht' },
      ar: { label: 'عرض الرسم البياني' },
    },
  },
  {
    slug: 'pipeline-view',
    name: 'PipelineView',
    family: 'G',
    tier: 'base',
    purpose: 'Shows CI/CD stages as an ordered flow with per-stage status.',
    scenarios: ['Build pipeline status', 'Release train stages', 'ETL job overview'],
    props: {
      stages: { type: 'string', required: true, description: 'Array of { id, name, status } stages in order.' },
      label: { type: 'string', required: true, description: 'Accessible label for the pipeline region.' },
      statusLabels: { type: 'string', required: false, description: 'Localized status label map.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Pipeline rendered.' },
      { name: 'empty', description: 'No stages provided.' },
    ],
    composition: {
      allowedParents: ['page', 'app-shell', 'card'],
      allowedChildren: ['badge', 'button'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not reorder stages by status; keep pipeline order.',
      'Do not show duration without a real measurement source.',
    ],
    a11y: {
      role: 'list',
      keyboard: [],
      focus: 'Stage actions are buttons in order.',
      labeling: 'Stage name plus status text labels each stage.',
      wcag: ['1.3.1', '1.4.1'],
    },
    responsive: {
      strategy: 'Stages scroll horizontally on compact.',
      breakpoints: { compact: 'Horizontal scroll.', medium: 'Inline row.', large: 'Inline row.' },
    },
    dataAi: { role: 'pipeline-view', states: ['default', 'empty', 'pending', 'running', 'success', 'failed'] },
    messages: {
      en: { label: 'Pipeline', statusPending: 'Pending', statusRunning: 'Running', statusSuccess: 'Succeeded', statusFailed: 'Failed' },
      'zh-CN': { label: '流水线', statusPending: '等待中', statusRunning: '运行中', statusSuccess: '已成功', statusFailed: '已失败' },
      de: { label: 'Pipeline-Ansicht', statusPending: 'Ausstehend', statusRunning: 'Wird ausgeführt', statusSuccess: 'Erfolgreich abgeschlossen', statusFailed: 'Fehlgeschlagen' },
      ar: { label: 'خط الأنابيب', statusPending: 'قيد الانتظار', statusRunning: 'قيد التشغيل', statusSuccess: 'ناجح', statusFailed: 'فاشل' },
    },
  },
  {
    slug: 'canvas-toolbar',
    name: 'CanvasToolbar',
    family: 'G',
    tier: 'base',
    purpose: 'Toolbar with zoom in, zoom out, reset, and fit actions for a canvas.',
    scenarios: ['Flow editor chrome', 'Diagram navigation controls', 'Map zoom affordances'],
    props: {
      label: { type: 'string', required: true, description: 'Accessible label for the toolbar.' },
      zoomInLabel: { type: 'string', required: true, description: 'Accessible label for zoom in.' },
      zoomOutLabel: { type: 'string', required: true, description: 'Accessible label for zoom out.' },
      resetLabel: { type: 'string', required: true, description: 'Accessible label for reset.' },
      onAction: { type: 'event', required: true, description: 'Called with zoom-in | zoom-out | reset | fit.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [{ name: 'default', description: 'Toolbar rendered.' }],
    composition: {
      allowedParents: ['canvas', 'page'],
      allowedChildren: ['button', 'icon'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not add non-viewport actions to the canvas toolbar.',
      'Do not hide the toolbar behind a hover-only reveal on touch.',
    ],
    a11y: {
      role: 'toolbar',
      keyboard: ['Tab moves across controls', 'Enter or Space activates'],
      focus: 'All controls are buttons in tab order.',
      labeling: 'role=toolbar with aria-label; each button is named.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Docks to the inline-end corner; enlarges targets on compact.',
      breakpoints: { compact: 'Large touch targets.', medium: 'Default size.', large: 'Default size.' },
    },
    dataAi: { role: 'canvas-toolbar', states: ['default'] },
    messages: {
      en: { label: 'Canvas toolbar', zoomIn: 'Zoom in', zoomOut: 'Zoom out', resetView: 'Reset view' },
      'zh-CN': { label: '画布工具栏', zoomIn: '放大', zoomOut: '缩小', resetView: '重置视图' },
      de: { label: 'Werkzeugleiste der Zeichenfläche', zoomIn: 'Ansicht vergrößern', zoomOut: 'Ansicht verkleinern', resetView: 'Ansicht zurücksetzen' },
      ar: { label: 'شريط أدوات اللوحة', zoomIn: 'تكبير', zoomOut: 'تصغير', resetView: 'إعادة ضبط العرض' },
    },
  },
)

// === C family additions (Phase 6) ===
SPECS.push(
  {
    slug: 'password-input',
    name: 'PasswordInput',
    family: 'C',
    tier: 'base',
    purpose: 'Password field with a visibility toggle and the same states as Input.',
    scenarios: ['Login form credential entry', 'Account password change', 'API secret entry'],
    props: {
      value: { type: 'string', required: true, description: 'Current password value.' },
      onChange: { type: 'event', required: true, description: 'Called with the new value on edit.' },
      label: { type: 'string', required: true, description: 'Field label.' },
      showLabel: { type: 'string', required: true, description: 'Accessible label for revealing the password.' },
      hideLabel: { type: 'string', required: true, description: 'Accessible label for concealing the password.' },
      disabled: { type: 'boolean', required: false, description: 'Disable the field.', default: false },
      invalid: { type: 'boolean', required: false, description: 'Mark the field invalid.', default: false },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Masked input.' },
      { name: 'revealed', description: 'Plain text input.' },
      { name: 'invalid', description: 'Validation failure styling.' },
    ],
    composition: {
      allowedParents: ['form', 'card', 'dialog', 'page'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not log or mirror the password value.',
      'Do not reveal the password by default.',
    ],
    a11y: {
      role: 'textbox',
      keyboard: ['Tab moves between field and toggle'],
      focus: 'Toggle is a button after the input in tab order.',
      labeling: 'Field label associates via the field primitive; toggle state uses aria-pressed.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Full width field at all breakpoints.',
      breakpoints: { compact: 'Full width.', medium: 'Full width.', large: 'Full width.' },
    },
    dataAi: { role: 'password-input', states: ['default', 'revealed', 'invalid', 'disabled'] },
    messages: {
      en: { label: 'Password', show: 'Show password', hide: 'Hide password' },
      'zh-CN': { label: '密码', show: '显示密码', hide: '隐藏密码' },
      de: { label: 'Passworteingabe', show: 'Passwort sichtbar anzeigen', hide: 'Passwort verbergen' },
      ar: { label: 'كلمة المرور', show: 'إظهار كلمة المرور', hide: 'إخفاء كلمة المرور' },
    },
  },
  {
    slug: 'otp-input',
    name: 'OtpInput',
    family: 'C',
    tier: 'base',
    purpose: 'Segmented one-time-code entry with automatic focus advance and paste support.',
    scenarios: ['Two-factor sign-in', 'Phone number verification', 'Device pairing code'],
    props: {
      value: { type: 'string', required: true, description: 'Current code; shorter than length while incomplete.' },
      onChange: { type: 'event', required: true, description: 'Called with the joined code on every edit.' },
      length: { type: 'number', required: false, description: 'Number of code cells.', default: 6 },
      label: { type: 'string', required: true, description: 'Accessible group label.' },
      digitLabel: { type: 'string', required: false, description: 'Accessible label pattern per cell.' },
      disabled: { type: 'boolean', required: false, description: 'Disable all cells.', default: false },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Partially filled.' },
      { name: 'complete', description: 'All cells filled.' },
    ],
    composition: {
      allowedParents: ['form', 'dialog', 'card', 'page'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not accept non-digit characters.',
      'Do not submit automatically without an explicit user action prop.',
    ],
    a11y: {
      role: 'group',
      keyboard: ['Arrow keys move between cells', 'Backspace moves to the previous cell'],
      focus: 'Each cell is a text input; focus advances after entry.',
      labeling: 'Group label plus per-cell labels describe the code.',
      wcag: ['2.1.1', '3.3.1'],
    },
    responsive: {
      strategy: 'Cells shrink on compact while staying tappable.',
      breakpoints: { compact: 'Compact cells.', medium: 'Default cells.', large: 'Default cells.' },
    },
    dataAi: { role: 'otp-input', states: ['default', 'complete', 'disabled'] },
    messages: {
      en: { label: 'One-time code', digit: 'Digit' },
      'zh-CN': { label: '一次性验证码', digit: '数字' },
      de: { label: 'Einmal-Code eingeben', digit: 'Ziffer eingeben' },
      ar: { label: 'رمز لمرة واحدة', digit: 'رقم' },
    },
  },
  {
    slug: 'multi-select',
    name: 'MultiSelect',
    family: 'C',
    tier: 'base',
    purpose: 'Selects multiple options from a listbox and shows the selection as removable chips.',
    scenarios: ['Choose tags for an article', 'Filter by several teams', 'Assign multiple reviewers'],
    props: {
      options: { type: 'string', required: true, description: 'Array of { value, label } options.' },
      values: { type: 'string', required: true, description: 'Currently selected option values.' },
      onChange: { type: 'event', required: true, description: 'Called with the next values array.' },
      label: { type: 'string', required: true, description: 'Field label.' },
      selectedLabel: { type: 'string', required: false, description: 'Accessible suffix announcing selected options.' },
      clearLabel: { type: 'string', required: false, description: 'Accessible label for clearing all selections.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Closed with selection summary.' },
      { name: 'open', description: 'Listbox expanded.' },
    ],
    composition: {
      allowedParents: ['form', 'card', 'page'],
      allowedChildren: ['chip', 'checkbox'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use multi-select for a single choice; use Select or Radio.',
      'Do not hide the current selection when the listbox is closed.',
    ],
    a11y: {
      role: 'listbox',
      keyboard: ['Enter toggles an option', 'Escape closes the listbox'],
      focus: 'Trigger is a button; options use aria-selected.',
      labeling: 'Field label names the control; chips expose removal.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Chips wrap; listbox matches trigger width.',
      breakpoints: { compact: 'Full width.', medium: 'Full width.', large: 'Full width.' },
    },
    dataAi: { role: 'multi-select', states: ['default', 'open', 'empty'] },
    messages: {
      en: { label: 'Multi select', selected: 'selected', clear: 'Clear all' },
      'zh-CN': { label: '多选', selected: '已选', clear: '清除全部' },
      de: { label: 'Mehrfachauswahlliste', selected: 'bereits ausgewählt', clear: 'Alle entfernen' },
      ar: { label: 'اختيار متعدد', selected: 'محدد', clear: 'مسح الكل' },
    },
  },
  {
    slug: 'rating',
    name: 'Rating',
    family: 'C',
    tier: 'base',
    purpose: 'Captures or displays a star rating from one to a configurable maximum.',
    scenarios: ['Product review score', 'Service feedback widget', 'Read-only average rating'],
    props: {
      value: { type: 'number', required: true, description: 'Current rating from 0 to max.' },
      onChange: { type: 'event', required: false, description: 'Called with the new rating; omit for read-only.' },
      max: { type: 'number', required: false, description: 'Number of stars.', default: 5 },
      label: { type: 'string', required: true, description: 'Accessible label for the rating group.' },
      starLabel: { type: 'string', required: false, description: 'Accessible label pattern per star.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Interactive rating.' },
      { name: 'readonly', description: 'Display-only rating.' },
    ],
    composition: {
      allowedParents: ['form', 'card', 'comment-thread', 'page'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not use rating for non-ordered scales.',
      'Do not show fractional stars without a text equivalent.',
    ],
    a11y: {
      role: 'radiogroup',
      keyboard: ['Arrow keys change the rating', 'Enter confirms'],
      focus: 'Star buttons form one radio-style group.',
      labeling: 'Group label plus per-star labels announce the scale.',
      wcag: ['2.1.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Star size stays constant; wraps never.',
      breakpoints: { compact: 'Touch-sized stars.', medium: 'Default stars.', large: 'Default stars.' },
    },
    dataAi: { role: 'rating', states: ['default', 'readonly'] },
    messages: {
      en: { label: 'Rating', star: 'Star' },
      'zh-CN': { label: '评分', star: '星' },
      de: { label: 'Bewertung', star: 'Stern vergeben' },
      ar: { label: 'تقييم', star: 'نجمة' },
    },
  },
  {
    slug: 'date-picker',
    name: 'DatePicker',
    family: 'C',
    tier: 'base',
    purpose: 'Picks a calendar date through an input with a month-grid popover; formatting uses Intl.',
    scenarios: ['Choose a delivery date', 'Set a report start date', 'Book an appointment'],
    props: {
      value: { type: 'string', required: true, description: 'ISO date string yyyy-mm-dd or empty.' },
      onChange: { type: 'event', required: true, description: 'Called with the ISO date on selection.' },
      label: { type: 'string', required: true, description: 'Field label.' },
      locale: { type: 'string', required: false, description: 'BCP 47 locale for Intl formatting.', default: 'en' },
      previousMonthLabel: { type: 'string', required: false, description: 'Accessible label for previous month.' },
      nextMonthLabel: { type: 'string', required: false, description: 'Accessible label for next month.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'closed', description: 'Input only.' },
      { name: 'open', description: 'Month grid visible.' },
    ],
    composition: {
      allowedParents: ['form', 'card', 'page'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not hand-format dates; use Intl.DateTimeFormat.',
      'Do not allow keyboard-inaccessible day cells.',
    ],
    a11y: {
      role: 'dialog',
      keyboard: ['Escape closes the grid', 'Tab moves through day buttons'],
      focus: 'Day cells are buttons; focus returns to the input on close.',
      labeling: 'Field label names the input; month and year headline the grid.',
      wcag: ['2.1.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Grid matches input width on compact; fixed measure on larger screens.',
      breakpoints: { compact: 'Full width grid.', medium: 'Fixed measure.', large: 'Fixed measure.' },
    },
    dataAi: { role: 'date-picker', states: ['closed', 'open'] },
    messages: {
      en: { label: 'Date', previousMonth: 'Previous month', nextMonth: 'Next month' },
      'zh-CN': { label: '日期', previousMonth: '上个月', nextMonth: '下个月' },
      de: { label: 'Datumswahl', previousMonth: 'Zum vorherigen Monat', nextMonth: 'Nächster Monat' },
      ar: { label: 'التاريخ', previousMonth: 'الشهر السابق', nextMonth: 'الشهر التالي' },
    },
  },
  {
    slug: 'time-picker',
    name: 'TimePicker',
    family: 'C',
    tier: 'base',
    purpose: 'Picks a wall-clock time via hour and minute controls formatted with Intl.',
    scenarios: ['Set a reminder time', 'Schedule a publish slot', 'Choose a meeting start'],
    props: {
      value: { type: 'string', required: true, description: 'Time string HH:mm or empty.' },
      onChange: { type: 'event', required: true, description: 'Called with the HH:mm string on change.' },
      label: { type: 'string', required: true, description: 'Field label.' },
      hourLabel: { type: 'string', required: false, description: 'Accessible label for the hour control.' },
      minuteLabel: { type: 'string', required: false, description: 'Accessible label for the minute control.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [{ name: 'default', description: 'Time controls rendered.' }],
    composition: {
      allowedParents: ['form', 'card', 'page'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not hand-pad time strings; use Intl-aware formatting helpers.',
      'Do not mix 12h and 24h presentation in one form.',
    ],
    a11y: {
      role: 'group',
      keyboard: ['Arrow keys step values in the selects'],
      focus: 'Hour and minute selects are in tab order.',
      labeling: 'Group label plus per-select labels describe the time.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Inline controls wrap on very narrow screens.',
      breakpoints: { compact: 'Wrapped controls.', medium: 'Inline controls.', large: 'Inline controls.' },
    },
    dataAi: { role: 'time-picker', states: ['default'] },
    messages: {
      en: { label: 'Time', hour: 'Hour', minute: 'Minute' },
      'zh-CN': { label: '时间', hour: '时', minute: '分' },
      de: { label: 'Uhrzeitwahl', hour: 'Stundenwahl', minute: 'Minutenwahl' },
      ar: { label: 'الوقت', hour: 'ساعة', minute: 'دقيقة' },
    },
  },
  {
    slug: 'calendar',
    name: 'Calendar',
    family: 'C',
    tier: 'base',
    purpose: 'Shows a navigable month grid with selectable days; weekday and month names come from Intl.',
    scenarios: ['Availability overview', 'Content schedule view', 'Date range anchor'],
    props: {
      value: { type: 'string', required: false, description: 'Selected ISO date string.' },
      onSelect: { type: 'event', required: false, description: 'Called with the ISO date when a day is picked.' },
      locale: { type: 'string', required: false, description: 'BCP 47 locale for Intl formatting.', default: 'en' },
      label: { type: 'string', required: true, description: 'Accessible label for the calendar.' },
      previousMonthLabel: { type: 'string', required: false, description: 'Accessible label for previous month.' },
      nextMonthLabel: { type: 'string', required: false, description: 'Accessible label for next month.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [{ name: 'default', description: 'Month grid rendered.' }],
    composition: {
      allowedParents: ['card', 'page', 'popover', 'date-picker'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not render weekday names by hand; derive them from Intl.',
      'Do not make days focusable without a selection action.',
    ],
    a11y: {
      role: 'grid',
      keyboard: ['Tab moves through day buttons', 'Enter selects a day'],
      focus: 'Day cells are buttons inside a grid.',
      labeling: 'Month and year headline the grid; weekday headers use column headers.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Fixed cell measure that shrinks slightly on compact.',
      breakpoints: { compact: 'Compact cells.', medium: 'Default cells.', large: 'Default cells.' },
    },
    dataAi: { role: 'calendar', states: ['default'] },
    messages: {
      en: { label: 'Calendar', previousMonth: 'Previous month', nextMonth: 'Next month' },
      'zh-CN': { label: '日历', previousMonth: '上个月', nextMonth: '下个月' },
      de: { label: 'Kalenderansicht', previousMonth: 'Zum vorherigen Monat', nextMonth: 'Nächster Monat' },
      ar: { label: 'التقويم', previousMonth: 'الشهر السابق', nextMonth: 'الشهر التالي' },
    },
  },
  {
    slug: 'color-picker',
    name: 'ColorPicker',
    family: 'C',
    tier: 'base',
    purpose: 'Picks a color from a swatch grid or by entering a hex value.',
    scenarios: ['Choose a theme accent', 'Tag color assignment', 'Chart series color override'],
    props: {
      value: { type: 'string', required: true, description: 'Current hex color like #2563eb.' },
      onChange: { type: 'event', required: true, description: 'Called with the next hex value.' },
      swatches: { type: 'string', required: false, description: 'Hex swatch list; defaults to a token-derived set.' },
      label: { type: 'string', required: true, description: 'Accessible label for the picker.' },
      hexLabel: { type: 'string', required: false, description: 'Accessible label for the hex input.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [{ name: 'default', description: 'Picker rendered.' }],
    composition: {
      allowedParents: ['form', 'popover', 'card', 'page'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not accept invalid hex without an error state.',
      'Do not rely on swatch color alone; expose the hex text.',
    ],
    a11y: {
      role: 'listbox',
      keyboard: ['Tab moves across swatches', 'Enter selects'],
      focus: 'Swatches are buttons; hex input follows in tab order.',
      labeling: 'Swatch buttons expose their hex value as the accessible name.',
      wcag: ['1.1.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Swatch grid wraps; fixed swatch size.',
      breakpoints: { compact: 'Wrapped grid.', medium: 'Wrapped grid.', large: 'Wrapped grid.' },
    },
    dataAi: { role: 'color-picker', states: ['default'] },
    messages: {
      en: { label: 'Color', hexValue: 'Hex value' },
      'zh-CN': { label: '颜色', hexValue: '十六进制值' },
      de: { label: 'Farbauswahl', hexValue: 'Hexadezimalwert' },
      ar: { label: 'اللون', hexValue: 'القيمة الست عشرية' },
    },
  },
  {
    slug: 'search-bar',
    name: 'SearchBar',
    family: 'C',
    tier: 'base',
    purpose: 'Search input with submit and clear controls inside a search landmark.',
    scenarios: ['Filter a component catalog', 'Search documentation', 'Query a market listing'],
    props: {
      value: { type: 'string', required: true, description: 'Current query.' },
      onChange: { type: 'event', required: true, description: 'Called with the query on edit.' },
      onSubmit: { type: 'event', required: false, description: 'Called with the query on submit.' },
      label: { type: 'string', required: true, description: 'Accessible label for the search field.' },
      placeholder: { type: 'string', required: false, description: 'Input placeholder.' },
      clearLabel: { type: 'string', required: false, description: 'Accessible label for the clear control.' },
      submitLabel: { type: 'string', required: false, description: 'Accessible label for the submit control.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Idle search field.' },
      { name: 'filled', description: 'Query present; clear control visible.' },
    ],
    composition: {
      allowedParents: ['app-shell', 'page', 'card', 'form'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not auto-submit on every keystroke without debounce.',
      'Do not remove the text label in favor of placeholder-only naming.',
    ],
    a11y: {
      role: 'search',
      keyboard: ['Enter submits', 'Escape clears when filled'],
      focus: 'Input, clear, and submit controls are in tab order.',
      labeling: 'Search landmark plus field label name the control.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Full width at all breakpoints.',
      breakpoints: { compact: 'Full width.', medium: 'Full width.', large: 'Full width.' },
    },
    dataAi: { role: 'search-bar', states: ['default', 'filled'] },
    messages: {
      en: { label: 'Search', placeholder: 'Search', clear: 'Clear', submit: 'Submit search' },
      'zh-CN': { label: '搜索', placeholder: '搜索…', clear: '清除', submit: '提交搜索' },
      de: { label: 'Suchleiste', placeholder: 'Suchbegriff eingeben', clear: 'Eingabe löschen', submit: 'Suche jetzt ausführen' },
      ar: { label: 'بحث', placeholder: 'ابحث…', clear: 'مسح', submit: 'إرسال البحث' },
    },
  },
  {
    slug: 'upload',
    name: 'Upload',
    family: 'C',
    tier: 'base',
    purpose: 'Complete upload control with drag and drop, paste, multi-file list, and per-file progress.',
    scenarios: ['Attach documents to a ticket', 'Batch image upload', 'Import a CSV file'],
    props: {
      label: { type: 'string', required: true, description: 'Accessible label for the drop zone.' },
      dropzoneLabel: { type: 'string', required: false, description: 'Visible hint inside the drop zone.' },
      browseLabel: { type: 'string', required: false, description: 'Label for the browse button.' },
      multiple: { type: 'boolean', required: false, description: 'Allow more than one file.', default: true },
      files: { type: 'string', required: false, description: 'Controlled list of { name, size, progress? } entries; progress is measured by the caller, never simulated.' },
      onFiles: { type: 'event', required: false, description: 'Called with the File array when files arrive.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Drop zone idle.' },
      { name: 'dragover', description: 'Files dragged over the zone.' },
      { name: 'uploading', description: 'At least one file in flight.' },
    ],
    composition: {
      allowedParents: ['form', 'card', 'dialog', 'page'],
      allowedChildren: ['progress', 'button'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not upload without explicit user consent.',
      'Do not accept files beyond the declared accept list.',
    ],
    a11y: {
      role: 'button',
      keyboard: ['Enter opens the file picker', 'Paste adds clipboard files'],
      focus: 'Drop zone and browse button are focusable.',
      labeling: 'Drop zone label plus browse button describe the control.',
      wcag: ['2.1.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Full width drop zone; file list stacks.',
      breakpoints: { compact: 'Full width.', medium: 'Full width.', large: 'Full width.' },
    },
    dataAi: { role: 'upload', states: ['default', 'dragover', 'uploading'] },
    messages: {
      en: { label: 'Upload', dropzone: 'Drag files here', browse: 'Browse files' },
      'zh-CN': { label: '上传', dropzone: '拖拽文件到此处', browse: '浏览文件' },
      de: { label: 'Hochladen', dropzone: 'Dateien hierher ziehen', browse: 'Dateien durchsuchen' },
      ar: { label: 'تحميل', dropzone: 'اسحب الملفات هنا', browse: 'استعرض الملفات' },
    },
  },
  {
    slug: 'data-grid',
    name: 'DataGrid',
    family: 'D',
    tier: 'heavy',
    purpose: 'Virtualized data grid rendering tens of thousands of rows in a windowed viewport with a replaceable virtualization engine.',
    scenarios: ['Browse 10k log entries', 'Audit a large transaction table', 'Scroll a telemetry feed'],
    props: {
      columns: { type: 'string', required: true, description: 'Array of { key, header, width?, render? } column definitions.' },
      rows: { type: 'string', required: true, description: 'Array of row data objects; tested at 10k entries.' },
      rowHeight: { type: 'number', required: false, description: 'Fixed row height in px.', default: 36 },
      height: { type: 'number', required: false, description: 'Viewport height in px.', default: 420 },
      overscan: { type: 'number', required: false, description: 'Extra rows rendered beyond the viewport.', default: 6 },
      label: { type: 'string', required: true, description: 'Accessible label for the grid.' },
      getRowId: { type: 'string', required: false, description: 'Row id accessor for stable keys.' },
      className: { type: 'string', required: false, description: 'Additional CSS classes.' },
    },
    variants: [],
    states: [
      { name: 'default', description: 'Windowed rows rendered.' },
      { name: 'empty', description: 'No rows provided.' },
    ],
    composition: {
      allowedParents: ['page', 'app-shell', 'card'],
      allowedChildren: ['tag', 'badge', 'button'],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not render all rows at once; keep virtualization on.',
      'Do not use variable row heights with the fixed-height engine.',
    ],
    a11y: {
      role: 'grid',
      keyboard: ['Page keys move the viewport', 'Tab moves through cell actions'],
      focus: 'Row cells expose aria-rowindex against the full row count.',
      labeling: 'aria-label names the grid; aria-rowcount reflects total rows.',
      wcag: ['1.3.1', '4.1.2'],
    },
    responsive: {
      strategy: 'Viewport height stays fixed; columns scroll horizontally on compact.',
      breakpoints: { compact: 'Horizontal column scroll.', medium: 'Fit container.', large: 'Fit container.' },
    },
    dataAi: { role: 'data-grid', states: ['default', 'empty'] },
    messages: {
      en: { label: 'Data grid', rows: 'rows' },
      'zh-CN': { label: '数据网格', rows: '行' },
      de: { label: 'Datenrasteransicht', rows: 'Zeilen' },
      ar: { label: 'شبكة البيانات', rows: 'صفوف' },
    },
  },
)

// === BATCH APPEND POINT ===

export { SPECS }

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

async function main() {
  const failures = []
  for (const spec of SPECS) {
    failures.push(...expansionFailures(spec))
  }
  if (failures.length > 0) {
    console.error(`[scaffold-phase6] locale failures:\n${failures.join('\n')}`)
    process.exitCode = 1
    return
  }

  for (const spec of SPECS) {
    const directory = path.join(srcRoot, spec.slug)
    const localeDir = path.join(directory, 'locales')
    await mkdir(localeDir, { recursive: true })

    for (const locale of ['en', 'zh-CN', 'de', 'ar', ...PLACEHOLDER_LOCALES]) {
      const messages = PLACEHOLDER_LOCALES.includes(locale) ? spec.messages.en : spec.messages[locale]
      await writeJson(path.join(localeDir, `${locale}.json`), { [spec.slug]: messages })
    }

    await writeJson(path.join(directory, 'contract.json'), contractFor(spec))
  }

  console.log(`[scaffold-phase6] wrote ${SPECS.length} component contract(s) + ${SPECS.length * 21} locale file(s)`)
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isDirectRun) {
  await main()
}
