import {
  Accordion,
  ActionSheet,
  Alert,
  AppShell,
  ArticleCard,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Canvas,
  CanvasToolbar,
  Card,
  Carousel,
  Chart,
  ChatBubble,
  Checkbox,
  Chip,
  CodeBlock,
  Collapse,
  ColorPicker,
  Combobox,
  CommandPalette,
  CommentThread,
  ConfirmDialog,
  Container,
  DataGrid,
  DatePicker,
  DescriptionList,
  Dialog,
  Divider,
  Drawer,
  Edge,
  Editor,
  EmptyState,
  FileInput,
  FlowNode,
  Form,
  Gauge,
  GraphView,
  Grid,
  Heading,
  Heatmap,
  HoverCard,
  Icon,
  Image,
  InlineAlert,
  Input,
  Kbd,
  KpiDashboard,
  Label,
  Link,
  List,
  LoadingBar,
  MarkdownRenderer,
  Masonry,
  Menu,
  MindMap,
  MultiSelect,
  Navbar,
  Navigation,
  NavigationBar,
  Notification,
  NumberInput,
  OtpInput,
  Pagination,
  PasswordInput,
  PipelineView,
  Popover,
  Progress,
  Radio,
  RadioCard,
  Rating,
  Result,
  SafeArea,
  SearchBar,
  Select,
  Separator,
  SharePanel,
  Sheet,
  Sidebar,
  Skeleton,
  Slider,
  Space,
  Sparkline,
  Spinner,
  Stack,
  Statistic,
  Steps,
  Switch,
  TabBar,
  Table,
  Tabs,
  Tag,
  Textarea,
  Ticker,
  TimePicker,
  Timeline,
  Toast,
  Tooltip,
  Tree,
  Typography,
  Upload,
} from '@chameleon-ui/components'
import { useMemo, useState, type FormEvent, type ReactNode } from 'react'

export type DemoT = (key: string, values?: Record<string, string | number>) => string

type Preview = (t: DemoT) => ReactNode

/** Overlay body is portaled / unmounted while closed; section still uses the real component. */
export const OVERLAY_SLUGS = new Set([
  'dialog',
  'tooltip',
  'popover',
  'drawer',
  'sheet',
  'action-sheet',
  'confirm-dialog',
  'hover-card',
  'menu',
])

/** Real component, but needs a labeled host (non-visual or absolutely positioned). */
export const STUB_SLUGS = new Set(['space', 'edge', 'flow-node'])

const PIXEL_GIF =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

function noop() {
  return undefined
}

function ButtonPreview({ t }: { t: DemoT }) {
  const [actions, setActions] = useState(1)
  return (
    <Stack direction="row" gap="2" align="center">
      <Button onClick={() => setActions((count) => count + 1)}>{t('button.submit')}</Button>
      <Button size="sm" variant="outline">
        {t('button.cancel')}
      </Button>
      <output>{t('button.count', { count: actions })}</output>
    </Stack>
  )
}

function InputPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('Chameleon')
  const invalid = value.length > 0 && value.length < 3
  return (
    <Input
      errorMessage={t('input.invalid')}
      invalid={invalid}
      label={t('input.label')}
      placeholder={t('input.placeholder')}
      value={value}
      onChange={setValue}
    />
  )
}

function TextareaPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('Inner demo notes')
  const invalid = value.length > 0 && value.length < 10
  return (
    <Textarea
      errorMessage={t('textarea.invalid')}
      invalid={invalid}
      label={t('textarea.label')}
      value={value}
      onChange={setValue}
    />
  )
}

function SelectPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('a')
  return (
    <Select
      label={t('select.label')}
      options={[
        { value: 'a', label: t('demo.selectOptionA') },
        { value: 'b', label: t('demo.selectOptionB') },
      ]}
      placeholder={t('select.placeholder')}
      value={value}
      onChange={setValue}
    />
  )
}

function CheckboxPreview({ t }: { t: DemoT }) {
  const [checked, setChecked] = useState(true)
  return <Checkbox checked={checked} label={t('checkbox.agree')} onChange={setChecked} />
}

function RadioPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('card')
  return (
    <Radio
      label={t('radio.payment')}
      options={[
        { value: 'card', label: t('radio.optionCard') },
        { value: 'bank', label: t('radio.optionBank') },
      ]}
      value={value}
      onChange={setValue}
    />
  )
}

function SwitchPreview({ t }: { t: DemoT }) {
  const [checked, setChecked] = useState(true)
  return <Switch checked={checked} label={t('switch.notifications')} onChange={setChecked} />
}

function FormPreview({ t }: { t: DemoT }) {
  const [name, setName] = useState('Chameleon')
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }
  return (
    <Form submitLabel={t('form.submit')} onSubmit={onSubmit}>
      <Input label={t('input.label')} value={name} onChange={setName} />
    </Form>
  )
}

function ToastPreview({ t }: { t: DemoT }) {
  const [open, setOpen] = useState(true)
  return (
    <Stack gap="2">
      <Button variant="outline" onClick={() => setOpen(true)}>
        {t('demo.toastShow')}
      </Button>
      <Toast
        closeLabel={t('toast.close')}
        description={t('toast.savedDescription')}
        open={open}
        status="success"
        title={t('toast.saved')}
        onOpenChange={setOpen}
      />
    </Stack>
  )
}

function ComboboxPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('')
  return (
    <Combobox
      options={[t('demo.selectOptionA'), t('demo.selectOptionB')]}
      placeholder={t('combobox.placeholder')}
      value={value}
      onChange={setValue}
    />
  )
}

function NumberInputPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState(3)
  return <NumberInput label={t('number-input.label')} value={value} onChange={setValue} />
}

function PaginationPreview() {
  const [page, setPage] = useState(1)
  return <Pagination currentPage={page} totalPages={3} onChange={setPage} />
}

function RadioCardPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('a')
  return (
    <RadioCard
      name="gallery-radio-card"
      options={[t('demo.selectOptionA'), t('demo.selectOptionB')]}
      value={value}
      onChange={setValue}
    />
  )
}

function SliderPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState<number | readonly [number, number]>(40)
  return <Slider label={t('slider.label')} value={value} onChange={setValue} />
}

function FileInputPreview({ t }: { t: DemoT }) {
  return <FileInput label={t('file-input.label')} onChange={noop} />
}

function ColorPickerPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('#2563eb')
  return (
    <ColorPicker hexLabel={t('color-picker.hexValue')} label={t('color-picker.label')} value={value} onChange={setValue} />
  )
}

function DatePickerPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('2026-08-15')
  return (
    <DatePicker
      label={t('date-picker.label')}
      nextMonthLabel={t('date-picker.nextMonth')}
      previousMonthLabel={t('date-picker.previousMonth')}
      value={value}
      onChange={setValue}
    />
  )
}

function TimePickerPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('09:30')
  return (
    <TimePicker
      hourLabel={t('time-picker.hour')}
      label={t('time-picker.label')}
      minuteLabel={t('time-picker.minute')}
      value={value}
      onChange={setValue}
    />
  )
}

function MultiSelectPreview({ t }: { t: DemoT }) {
  const [values, setValues] = useState(['a'])
  return (
    <MultiSelect
      clearLabel={t('multi-select.clear')}
      label={t('multi-select.label')}
      options={[
        { value: 'a', label: t('demo.selectOptionA') },
        { value: 'b', label: t('demo.selectOptionB') },
      ]}
      selectedLabel={t('multi-select.selected')}
      values={values}
      onChange={setValues}
    />
  )
}

function OtpInputPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('12')
  return <OtpInput digitLabel={t('otp-input.digit')} label={t('otp-input.label')} value={value} onChange={setValue} />
}

function PasswordInputPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('secret')
  return (
    <PasswordInput
      hideLabel={t('password-input.hide')}
      label={t('password-input.label')}
      showLabel={t('password-input.show')}
      value={value}
      onChange={setValue}
    />
  )
}

function RatingPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState(3)
  return <Rating label={t('rating.label')} starLabel={t('rating.star')} value={value} onChange={setValue} />
}

function SearchBarPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('')
  return (
    <SearchBar
      clearLabel={t('search-bar.clear')}
      label={t('search-bar.label')}
      placeholder={t('search-bar.placeholder')}
      submitLabel={t('search-bar.submit')}
      value={value}
      onChange={setValue}
    />
  )
}

function CommandPalettePreview({ t }: { t: DemoT }) {
  const [open, setOpen] = useState(false)
  return (
    <Stack gap="2">
      <Button variant="outline" onClick={() => setOpen(true)}>
        {t('command-palette.label')}
      </Button>
      <CommandPalette
        closeLabel={t('command-palette.close')}
        commands={[
          { value: 'save', label: t('button.submit') },
          { value: 'cancel', label: t('button.cancel') },
        ]}
        emptyLabel={t('command-palette.empty')}
        label={t('command-palette.label')}
        open={open}
        placeholder={t('command-palette.placeholder')}
        onOpenChange={setOpen}
        onSelect={() => setOpen(false)}
      />
    </Stack>
  )
}

function CalendarPreview({ t }: { t: DemoT }) {
  const [value, setValue] = useState('2026-08-15')
  return (
    <Calendar
      label={t('calendar.label')}
      nextMonthLabel={t('calendar.nextMonth')}
      previousMonthLabel={t('calendar.previousMonth')}
      value={value}
      onSelect={setValue}
    />
  )
}

function DataGridPreview({ t }: { t: DemoT }) {
  const rows = useMemo(
    () => Array.from({ length: 10_000 }, (_, index) => ({ id: String(index + 1), name: `Row ${index + 1}` })),
    [],
  )
  return (
    <div data-demo="data-grid-10k">
      <DataGrid
        columns={[
          { key: 'id', header: t('table.name'), width: 96 },
          { key: 'name', header: t('table.status'), width: 240 },
        ]}
        getRowId={(row) => row.id}
        height={280}
        label={t('data-grid.label')}
        rows={rows}
      />
    </div>
  )
}

function CanvasPreview({ t }: { t: DemoT }) {
  return (
    <div className="cu-demo-canvas-stage">
      <CanvasToolbar
        fitLabel={t('canvas-toolbar.fitView')}
        label={t('canvas-toolbar.label')}
        resetLabel={t('canvas-toolbar.resetView')}
        zoomInLabel={t('canvas-toolbar.zoomIn')}
        zoomOutLabel={t('canvas-toolbar.zoomOut')}
        onAction={noop}
      />
      <Canvas gridSize={24} label={t('canvas-base.label')} showMinimap snapToGrid>
        <FlowNode id="gallery-start" status="active" title={t('flow-node.label')} x={32} y={48} />
        <FlowNode id="gallery-next" status="success" title={t('demo.selectOptionB')} x={200} y={48} />
        <Edge label={t('edge.label')} x1={132} x2={200} y1={64} y2={64} />
      </Canvas>
    </div>
  )
}

const PREVIEWS: Record<string, Preview> = {
  button: (t) => <ButtonPreview t={t} />,
  icon: (t) => (
    <Stack direction="row" gap="2" align="center">
      <Icon label={t('icon.back')} mode="mirror" />
      <Icon label={t('icon.menu')} mode="preserve" />
    </Stack>
  ),
  typography: (t) => (
    <Stack gap="1">
      <Typography variant="heading-2">{t('typography.heading')}</Typography>
      <Typography variant="body">{t('typography.body')}</Typography>
    </Stack>
  ),
  input: (t) => <InputPreview t={t} />,
  textarea: (t) => <TextareaPreview t={t} />,
  select: (t) => <SelectPreview t={t} />,
  checkbox: (t) => <CheckboxPreview t={t} />,
  radio: (t) => <RadioPreview t={t} />,
  switch: (t) => <SwitchPreview t={t} />,
  form: (t) => <FormPreview t={t} />,
  dialog: (t) => (
    <Dialog
      closeLabel={t('dialog.close')}
      description={t('dialog.description')}
      title={t('dialog.title')}
      triggerLabel={t('dialog.trigger')}
    >
      <p>{t('dialog.body')}</p>
    </Dialog>
  ),
  toast: (t) => <ToastPreview t={t} />,
  alert: (t) => <Alert description={t('demo.alertBody')} status="success" title={t('alert.success')} />,
  tooltip: (t) => <Tooltip content={t('tooltip.hint')} trigger={<Button variant="outline">{t('tooltip.shortcut')}</Button>} />,
  popover: (t) => (
    <Popover
      closeLabel={t('popover.close')}
      description={t('demo.popoverBody')}
      title={t('popover.filters')}
      trigger={<Button variant="outline">{t('popover.filters')}</Button>}
    />
  ),
  tabs: (t) => (
    <Tabs
      defaultValue="account"
      items={[
        { value: 'account', label: t('tabs.account'), content: t('typography.body') },
        { value: 'security', label: t('tabs.security'), content: t('form.required') },
      ]}
    />
  ),
  table: (t) => (
    <Table
      caption={t('table.caption')}
      columns={[
        { key: 'name', header: t('table.name') },
        { key: 'status', header: t('table.status') },
      ]}
      rows={[
        { name: t('demo.selectOptionA'), status: t('demo.tableActive') },
        { name: t('demo.selectOptionB'), status: t('demo.tablePaused') },
      ]}
    />
  ),
  'app-shell': (t) => (
    <AppShell
      header={<Typography variant="heading-2">{t('demo.title')}</Typography>}
      navigation={
        <Navigation
          label={t('navigation.label')}
          items={[
            { value: 'account', label: t('tabs.account') },
            { value: 'security', label: t('tabs.security') },
          ]}
        />
      }
    >
      <Typography variant="body">{t('appShell.main')}</Typography>
    </AppShell>
  ),
  stack: (t) => (
    <Stack direction="row" gap="2">
      <Button size="sm">{t('button.submit')}</Button>
      <Button size="sm" variant="outline">
        {t('button.cancel')}
      </Button>
    </Stack>
  ),
  spinner: (t) => <Spinner label={t('spinner.loading')} />,
  accordion: (t) => (
    <Accordion
      items={[
        { title: t('tabs.account'), content: t('typography.body') },
        { title: t('tabs.security'), content: t('form.required') },
      ]}
    />
  ),
  avatar: (t) => <Avatar fallback="CU" alt={t('avatar.label')} />,
  badge: (t) => <Badge>{t('badge.label')}</Badge>,
  breadcrumb: (t) => (
    <Breadcrumb
      items={[
        { label: t('breadcrumb.label'), href: '#' },
        { label: t('tabs.account') },
      ]}
    />
  ),
  card: (t) => (
    <Card>
      <Typography variant="heading-2" as="h3">
        {t('card.label')}
      </Typography>
      <Typography variant="body">{t('typography.body')}</Typography>
    </Card>
  ),
  chip: (t) => <Chip>{t('chip.label')}</Chip>,
  collapse: (t) => (
    <Collapse defaultOpen title={t('collapse.label')}>
      <Typography variant="body">{t('typography.body')}</Typography>
    </Collapse>
  ),
  combobox: (t) => <ComboboxPreview t={t} />,
  'description-list': (t) => (
    <DescriptionList
      items={[
        { term: t('table.name'), description: t('demo.selectOptionA') },
        { term: t('table.status'), description: t('demo.tableActive') },
      ]}
    />
  ),
  divider: () => <Divider />,
  drawer: (t) => (
    <Drawer closeLabel={t('dialog.close')} title={t('drawer.label')} triggerLabel={t('drawer.label')}>
      <Typography variant="body">{t('typography.body')}</Typography>
    </Drawer>
  ),
  'empty-state': (t) => <EmptyState title={t('empty-state.label')} description={t('typography.body')} />,
  'file-input': (t) => <FileInputPreview t={t} />,
  grid: (t) => (
    <Grid columns={2} gap="sm">
      <Typography variant="body">{t('grid.label')}</Typography>
      <Typography variant="caption">{t('typography.body')}</Typography>
    </Grid>
  ),
  heading: (t) => <Heading level="level-3">{t('heading.label')}</Heading>,
  'hover-card': (t) => (
    <HoverCard trigger={<Button variant="outline">{t('hover-card.label')}</Button>}>
      <Typography variant="body">{t('typography.body')}</Typography>
    </HoverCard>
  ),
  'inline-alert': (t) => <InlineAlert status="info">{t('inline-alert.label')}</InlineAlert>,
  kbd: (t) => <Kbd>{t('kbd.label')}</Kbd>,
  label: (t) => <Label>{t('label.label')}</Label>,
  link: (t) => <Link href="#gallery">{t('link.label')}</Link>,
  list: (t) => <List items={[t('demo.selectOptionA'), t('demo.selectOptionB')]} />,
  menu: (t) => (
    <Menu
      items={[
        { label: t('button.submit'), onClick: noop },
        { label: t('button.cancel'), onClick: noop },
      ]}
      triggerLabel={t('menu.label')}
    />
  ),
  'number-input': (t) => <NumberInputPreview t={t} />,
  pagination: () => <PaginationPreview />,
  progress: () => <Progress value={64} />,
  'radio-card': (t) => <RadioCardPreview t={t} />,
  separator: () => <Separator />,
  sheet: (t) => (
    <Sheet closeLabel={t('dialog.close')} title={t('sheet.label')} triggerLabel={t('sheet.label')}>
      <Typography variant="body">{t('typography.body')}</Typography>
    </Sheet>
  ),
  skeleton: () => <Skeleton />,
  slider: (t) => <SliderPreview t={t} />,
  'action-sheet': (t) => (
    <ActionSheet
      actions={[
        { value: 'submit', label: t('button.submit') },
        { value: 'cancel', label: t('button.cancel') },
      ]}
      cancelLabel={t('actionSheet.cancel')}
      title={t('actionSheet.label')}
      triggerLabel={t('actionSheet.label')}
    />
  ),
  'tab-bar': (t) => (
    <TabBar
      label={t('tabBar.label')}
      items={[
        { value: 'account', label: t('tabs.account') },
        { value: 'security', label: t('tabs.security') },
      ]}
    />
  ),
  'safe-area': (t) => (
    <SafeArea top bottom start end>
      <Typography variant="body">{t('safeArea.label')}</Typography>
    </SafeArea>
  ),
  sidebar: (t) => (
    <Sidebar
      collapseLabel={t('sidebar.collapse')}
      expandLabel={t('sidebar.expand')}
      items={[
        { value: 'account', label: t('tabs.account') },
        { value: 'security', label: t('tabs.security') },
      ]}
      label={t('sidebar.label')}
    />
  ),
  'article-card': (t) => (
    <ArticleCard excerpt={t('typography.body')} readLabel={t('article-card.readMore')} title={t('article-card.label')} />
  ),
  calendar: (t) => <CalendarPreview t={t} />,
  'canvas-base': (t) => <CanvasPreview t={t} />,
  'canvas-toolbar': (t) => (
    <CanvasToolbar
      fitLabel={t('canvas-toolbar.fitView')}
      label={t('canvas-toolbar.label')}
      resetLabel={t('canvas-toolbar.resetView')}
      zoomInLabel={t('canvas-toolbar.zoomIn')}
      zoomOutLabel={t('canvas-toolbar.zoomOut')}
      onAction={noop}
    />
  ),
  carousel: (t) => (
    <Carousel
      items={[<p key="a">{t('demo.selectOptionA')}</p>, <p key="b">{t('demo.selectOptionB')}</p>]}
      label={t('carousel.label')}
      nextLabel={t('carousel.nextSlide')}
      previousLabel={t('carousel.previousSlide')}
    />
  ),
  chart: (t) => (
    <Chart
      emptyLabel={t('chart.empty')}
      label={t('chart.label')}
      series={[
        { name: t('chart.series'), data: [2, 4, 3, 6] },
      ]}
    />
  ),
  'chat-bubble': (t) => <ChatBubble label={t('chat-bubble.label')}>{t('typography.body')}</ChatBubble>,
  'code-block': (t) => (
    <CodeBlock code="const a = 1" copiedLabel={t('code-block.copied')} copyLabel={t('code-block.copy')} language="ts" />
  ),
  'color-picker': (t) => <ColorPickerPreview t={t} />,
  'comment-thread': (t) => (
    <CommentThread
      comments={[{ id: '1', author: t('table.name'), time: '10:00', text: t('typography.body') }]}
      label={t('comment-thread.label')}
      replyLabel={t('comment-thread.reply')}
    />
  ),
  'confirm-dialog': (t) => (
    <ConfirmDialog
      cancelLabel={t('confirm-dialog.cancel')}
      confirmLabel={t('confirm-dialog.confirm')}
      description={t('dialog.description')}
      title={t('confirm-dialog.label')}
      triggerLabel={t('confirm-dialog.label')}
    />
  ),
  'data-grid': (t) => <DataGridPreview t={t} />,
  'date-picker': (t) => <DatePickerPreview t={t} />,
  edge: (t) => (
    <div className="cu-demo-canvas-host">
      <Edge label={t('edge.label')} x1={16} x2={200} y1={40} y2={40} />
    </div>
  ),
  editor: (t) => (
    <Editor
      boldLabel={t('editor.bold')}
      italicLabel={t('editor.italic')}
      label={t('editor.label')}
      placeholder={t('editor.placeholder')}
    />
  ),
  'flow-node': (t) => (
    <div className="cu-demo-canvas-host">
      <FlowNode id="gallery-node" title={t('flow-node.label')} x={16} y={16} />
    </div>
  ),
  gauge: (t) => <Gauge label={t('gauge.label')} value={64} valueLabel={t('gauge.value')} />,
  'graph-view': (t) => (
    <GraphView
      label={t('graph-view.label')}
      links={[{ source: 'a', target: 'b' }]}
      nodes={[
        { id: 'a', label: t('demo.selectOptionA') },
        { id: 'b', label: t('demo.selectOptionB') },
      ]}
    />
  ),
  heatmap: (t) => (
    <Heatmap
      columns={['A', 'B']}
      label={t('heatmap.label')}
      rows={['1', '2']}
      values={[
        [1, 3],
        [2, 4],
      ]}
    />
  ),
  image: (t) => <Image alt={t('image.label')} errorLabel={t('image.loadError')} src={PIXEL_GIF} />,
  'kpi-dashboard': (t) => (
    <KpiDashboard
      items={[{ id: '1', label: t('statistic.label'), value: '42', trend: 'up' }]}
      label={t('kpi-dashboard.label')}
    />
  ),
  'loading-bar': (t) => <LoadingBar label={t('loading-bar.label')} value={40} />,
  'markdown-renderer': (t) => <MarkdownRenderer label={t('markdown-renderer.label')} markdown={`**${t('typography.heading')}**`} />,
  'mind-map': (t) => (
    <MindMap
      label={t('mind-map.label')}
      root={{
        id: 'root',
        label: t('mind-map.label'),
        children: [
          { id: 'a', label: t('demo.selectOptionA') },
          { id: 'b', label: t('demo.selectOptionB') },
        ],
      }}
    />
  ),
  'multi-select': (t) => <MultiSelectPreview t={t} />,
  notification: (t) => (
    <Notification
      dismissLabel={t('notification.dismiss')}
      message={t('typography.body')}
      title={t('notification.label')}
    />
  ),
  'otp-input': (t) => <OtpInputPreview t={t} />,
  'password-input': (t) => <PasswordInputPreview t={t} />,
  'pipeline-view': (t) => (
    <PipelineView
      label={t('pipeline-view.label')}
      stages={[
        { id: '1', name: t('demo.selectOptionA'), status: 'success' },
        { id: '2', name: t('demo.selectOptionB'), status: 'running' },
      ]}
      statusLabels={{
        pending: t('pipeline-view.statusPending'),
        running: t('pipeline-view.statusRunning'),
        success: t('pipeline-view.statusSuccess'),
        failed: t('pipeline-view.statusFailed'),
      }}
    />
  ),
  rating: (t) => <RatingPreview t={t} />,
  result: (t) => <Result status="success" title={t('result.label')} description={t('typography.body')} />,
  'search-bar': (t) => <SearchBarPreview t={t} />,
  'share-panel': (t) => (
    <SharePanel copyLabel={t('share-panel.copyLink')} title={t('share-panel.label')} url="https://example.invalid" />
  ),
  sparkline: (t) => <Sparkline data={[1, 3, 2, 5]} label={t('sparkline.label')} />,
  statistic: (t) => <Statistic label={t('statistic.label')} trend="up" trendLabel={t('statistic.trend')} value="42" />,
  tag: (t) => <Tag label={t('tag.label')} />,
  ticker: (t) => (
    <Ticker items={[{ id: '1', label: t('ticker.label'), value: '42', trend: 'up' }]} label={t('ticker.label')} />
  ),
  'time-picker': (t) => <TimePickerPreview t={t} />,
  timeline: (t) => (
    <Timeline
      emptyLabel={t('timeline.empty')}
      items={[{ id: '1', title: t('timeline.label'), description: t('typography.body'), time: '10:00' }]}
    />
  ),
  tree: (t) => (
    <Tree
      defaultExpandedIds={['root']}
      nodes={[{ id: 'root', label: t('tree.label'), children: [{ id: 'child', label: t('demo.selectOptionA') }] }]}
      toggleLabel={t('tree.toggleNode')}
    />
  ),
  upload: (t) => (
    <Upload browseLabel={t('upload.browse')} dropzoneLabel={t('upload.dropzone')} label={t('upload.label')} />
  ),
  'command-palette': (t) => <CommandPalettePreview t={t} />,
  container: (t) => (
    <Container>
      <Typography variant="body">{t('container.label')}</Typography>
    </Container>
  ),
  masonry: (t) => (
    <Masonry columns={2}>
      <Typography variant="body">{t('masonry.label')}</Typography>
      <Typography variant="caption">{t('typography.body')}</Typography>
    </Masonry>
  ),
  navigation: (t) => (
    <Navigation
      collapseLabel={t('navigation.collapse')}
      expandLabel={t('navigation.expand')}
      items={[
        { value: 'account', label: t('tabs.account') },
        { value: 'security', label: t('tabs.security') },
      ]}
      label={t('navigation.label')}
    />
  ),
  'navigation-bar': (t) => (
    <NavigationBar
      backLabel={t('navigationBar.back')}
      onBack={() => undefined}
      title={t('tabs.account')}
    />
  ),
  navbar: (t) => (
    <Navbar
      activeValue="home"
      brand={t('navbar.label')}
      items={[
        { value: 'home', label: t('tabs.account') },
        { value: 'next', label: t('tabs.security') },
      ]}
      label={t('navbar.label')}
    />
  ),
  space: () => (
    <div className="cu-demo-space-host">
      <Space axis="block" size="lg" />
    </div>
  ),
  steps: (t) => (
    <Steps
      currentValue="plan"
      items={[
        { value: 'plan', label: t('demo.selectOptionA') },
        { value: 'build', label: t('demo.selectOptionB') },
      ]}
      label={t('steps.label')}
    />
  ),
}

export const GALLERY_PREVIEW_SLUGS = Object.keys(PREVIEWS)

export function previewKind(slug: string): 'live' | 'stub' | 'missing' {
  if (!(slug in PREVIEWS)) return 'missing'
  if (STUB_SLUGS.has(slug)) return 'stub'
  return 'live'
}

export function renderGalleryPreview(slug: string, t: DemoT): ReactNode {
  const preview = PREVIEWS[slug]
  if (!preview) {
    return <p data-demo-missing={slug}>No preview registered for {slug}.</p>
  }
  return preview(t)
}
