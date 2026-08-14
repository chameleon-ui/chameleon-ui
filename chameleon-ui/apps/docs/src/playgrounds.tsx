import {
  Alert,
  AppShell,
  Button,
  Canvas,
  Card,
  Chart,
  Checkbox,
  Dialog,
  Editor,
  Form,
  Icon,
  Input,
  MarkdownRenderer,
  Popover,
  Radio,
  Select,
  Space,
  Sparkline,
  Spinner,
  Stack,
  Steps,
  Switch,
  Table,
  Tabs,
  Textarea,
  Toast,
  Tooltip,
  Typography,
} from '@chameleon-ui/components'
import { useState, type ReactNode } from 'react'

/**
 * Live examples + code snippets per component.
 *
 * Every entry renders REAL components from `@chameleon-ui/components` (never a
 * static placeholder) and ships a copyable code snippet whose props match the
 * component's real API. Gold-standard batch (button, input, select, dialog,
 * table, tabs, form, card) gets a variant playground plus minimal + common
 * snippets; the rest get a live preview + one snippet until batch 2.
 */
export interface ComponentExample {
  /** Live, interactive preview (variant/size/state playground where defined). */
  live: () => ReactNode
  /** Copyable snippets. `minimal` is required for the gold batch. */
  snippets: Array<{ id: string; labelKey: string; code: string }>
}

export function getExample(slug: string): ComponentExample | null {
  return EXAMPLES[slug] ?? null
}

export function hasExample(slug: string): boolean {
  return slug in EXAMPLES
}

const SNIP_MIN = 'docs.exMinimal'
const SNIP_COMBO = 'docs.exCommon'

const EXAMPLES: Record<string, ComponentExample> = {
  button: {
    live: ButtonPlayground,
    snippets: [
      {
        id: 'minimal',
        labelKey: SNIP_MIN,
        code: `import { Button } from '@chameleon-ui/components'\n\n<Button>Save changes</Button>`,
      },
      {
        id: 'common',
        labelKey: SNIP_COMBO,
        code: `<Stack direction="row" gap="2" align="center">\n  <Button variant="solid">Confirm</Button>\n  <Button variant="outline">Cancel</Button>\n  <Button size="sm" variant="outline">Compact</Button>\n  <Button disabled>Disabled</Button>\n</Stack>`,
      },
    ],
  },
  input: {
    live: InputPlayground,
    snippets: [
      {
        id: 'minimal',
        labelKey: SNIP_MIN,
        code: `import { Input } from '@chameleon-ui/components'\n\nconst [value, setValue] = useState('')\n\n<Input label="Project name" value={value} onChange={setValue} />`,
      },
      {
        id: 'common',
        labelKey: SNIP_COMBO,
        code: `<Input\n  label="Email"\n  value={email}\n  onChange={setEmail}\n  invalid={!email.includes('@')}\n  errorMessage="Enter a valid email address"\n/>`,
      },
    ],
  },
  select: {
    live: SelectPlayground,
    snippets: [
      {
        id: 'minimal',
        labelKey: SNIP_MIN,
        code: `import { Select } from '@chameleon-ui/components'\n\nconst [value, setValue] = useState('a')\n\n<Select\n  label="Status"\n  value={value}\n  onChange={setValue}\n  options={[\n    { value: 'a', label: 'Active' },\n    { value: 'b', label: 'Paused' },\n  ]}\n/>`,
      },
    ],
  },
  dialog: {
    live: DialogPlayground,
    snippets: [
      {
        id: 'minimal',
        labelKey: SNIP_MIN,
        code: `import { Dialog } from '@chameleon-ui/components'\n\n<Dialog\n  triggerLabel="Open settings"\n  title="Settings"\n  description="Review before continuing."\n  closeLabel="Close"\n/>`,
      },
    ],
  },
  table: {
    live: TablePreview,
    snippets: [
      {
        id: 'minimal',
        labelKey: SNIP_MIN,
        code: `import { Table } from '@chameleon-ui/components'\n\n<Table\n  caption="Deployments"\n  columns={[\n    { key: 'name', header: 'Name' },\n    { key: 'state', header: 'State' },\n  ]}\n  rows={[\n    { name: 'Alpha', state: 'Active' },\n    { name: 'Beta', state: 'Paused' },\n  ]}\n/>`,
      },
    ],
  },
  tabs: {
    live: TabsPreview,
    snippets: [
      {
        id: 'minimal',
        labelKey: SNIP_MIN,
        code: `import { Tabs } from '@chameleon-ui/components'\n\n<Tabs\n  defaultValue="one"\n  items={[\n    { value: 'one', label: 'Overview', content: 'First panel' },\n    { value: 'two', label: 'Specs', content: 'Second panel' },\n  ]}\n/>`,
      },
    ],
  },
  form: {
    live: FormPreview,
    snippets: [
      {
        id: 'minimal',
        labelKey: SNIP_MIN,
        code: `import { Form, Input } from '@chameleon-ui/components'\n\n<Form submitLabel="Save" onSubmit={(event) => event.preventDefault()}>\n  <Input label="Name" value={name} onChange={setName} />\n</Form>`,
      },
    ],
  },
  card: {
    live: CardPlayground,
    snippets: [
      {
        id: 'minimal',
        labelKey: SNIP_MIN,
        code: `import { Card } from '@chameleon-ui/components'\n\n<Card>\n  <Typography variant="heading-2" as="h3">Plan</Typography>\n  <Typography variant="body">Group related content and actions.</Typography>\n</Card>`,
      },
      {
        id: 'common',
        labelKey: SNIP_COMBO,
        code: `<Card variant="elevated" padding="lg">\n  <Typography variant="heading-2" as="h3">Metric</Typography>\n  <Typography variant="body">42</Typography>\n  <Button size="sm" variant="outline">Details</Button>\n</Card>`,
      },
    ],
  },

  // Live previews (single snippet) for the previously-shipped set �?batch 2 adds
  // playgrounds + full snippet sets.
  icon: {
    live: () => (
      <Stack direction="row" gap="2" align="center">
        <Icon label="Back" mode="mirror" />
        <Icon label="Menu" mode="preserve" />
      </Stack>
    ),
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Icon label="Back" mode="mirror" />` }],
  },
  typography: {
    live: () => (
      <Stack gap="1">
        <Typography variant="heading-2">Heading</Typography>
        <Typography variant="body">Body copy from the official package.</Typography>
      </Stack>
    ),
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Typography variant="body">Body copy</Typography>` }],
  },
  textarea: {
    live: StatefulTextarea,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Textarea label="Notes" value={value} onChange={setValue} />` }],
  },
  checkbox: {
    live: StatefulCheckbox,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Checkbox checked={checked} onChange={setChecked} label="Agree" />` }],
  },
  radio: {
    live: StatefulRadio,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Radio label="Payment" value={value} onChange={setValue} options={options} />` }],
  },
  switch: {
    live: StatefulSwitch,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Switch checked={checked} onChange={setChecked} label="Notify" />` }],
  },
  toast: {
    live: StatefulToast,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Toast open={open} title="Saved" description="Done." closeLabel="Close" onOpenChange={setOpen} />` }],
  },
  alert: {
    live: () => <Alert title="Alert" description="Semantic color comes from the active theme tokens." />,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Alert title="Alert" description="Semantic color from tokens." />` }],
  },
  tooltip: {
    live: () => <Tooltip trigger={<Button variant="outline">Hover</Button>} content="Tooltip" />,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Tooltip trigger={<Button variant="outline">Hover</Button>} content="Tooltip" />` }],
  },
  popover: {
    live: () => (
      <Popover
        trigger={<Button variant="outline">Open popover</Button>}
        title="Popover"
        description="Follows document direction."
        closeLabel="Close"
      />
    ),
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Popover trigger={<Button variant="outline">Open</Button>} title="Popover" description="�? closeLabel="Close" />` }],
  },
  'app-shell': {
    live: () => (
      <div className="cu-docs-mini-shell">
        <AppShell header={<span>Header</span>} sidebar={<span>Nav</span>} sidebarLabel="Preview">
          Main
        </AppShell>
      </div>
    ),
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<AppShell header={…} sidebar={…} sidebarLabel="Nav">�?/AppShell>` }],
  },
  stack: {
    live: () => (
      <Stack direction="row" gap="2">
        <Button size="sm">A</Button>
        <Button size="sm" variant="outline">
          B
        </Button>
      </Stack>
    ),
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Stack direction="row" gap="2">�?/Stack>` }],
  },
  spinner: {
    live: () => <Spinner label="Loading" />,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Spinner label="Loading" />` }],
  },
  chart: {
    live: () => (
      <Chart
        type="bar"
        label="Revenue"
        labels={['Q1', 'Q2', 'Q3', 'Q4']}
        series={[{ name: 'Revenue', data: [4, 8, 6, 10] }]}
      />
    ),
    snippets: [
      {
        id: 'minimal',
        labelKey: SNIP_MIN,
        code: `<Chart type="bar" label="Revenue" series={[{ name: 'Q', data: [4, 8, 6, 10] }]} />`,
      },
    ],
  },
  sparkline: {
    live: () => <Sparkline label="Trend" data={[2, 4, 3, 6, 5, 8]} />,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Sparkline label="Trend" data={[2, 4, 3, 6]} />` }],
  },
  'canvas-base': {
    live: () => <Canvas label="Canvas 2D" showMinimap snapToGrid />,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Canvas label="Canvas" showMinimap snapToGrid />` }],
  },
  editor: {
    live: () => <Editor label="Editor" initialHtml="<p>Hello</p>" />,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Editor label="Editor" />` }],
  },
  'markdown-renderer': {
    live: () => <MarkdownRenderer markdown={'**Hello** from markdown.'} />,
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<MarkdownRenderer markdown="**Hello**" />` }],
  },
  space: {
    live: () => (
      <div>
        Above
        <Space size="md" />
        Below
      </div>
    ),
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Space size="md" />` }],
  },
  steps: {
    live: () => (
      <Steps
        label="Steps"
        currentValue="build"
        items={[
          { value: 'plan', label: 'Plan' },
          { value: 'build', label: 'Build' },
        ]}
      />
    ),
    snippets: [{ id: 'minimal', labelKey: SNIP_MIN, code: `<Steps label="Steps" currentValue="plan" items={items} />` }],
  },
}

/* ------------------------------ playgrounds ------------------------------ */

function PlaygroundFrame({ children }: { children: ReactNode }) {
  return <div className="cu-docs-playground-stage">{children}</div>
}

export function ButtonPlayground() {
  const [variant, setVariant] = useState<'solid' | 'outline'>('solid')
  const [size, setSize] = useState<'sm' | 'md'>('md')
  const [disabled, setDisabled] = useState(false)
  return (
    <Playground
      controls={
        <>
          <Control label="variant" value={variant} options={['solid', 'outline']} onChange={(v) => setVariant(v as 'solid' | 'outline')} />
          <Control label="size" value={size} options={['sm', 'md']} onChange={(v) => setSize(v as 'sm' | 'md')} />
          <Toggle label="disabled" checked={disabled} onChange={setDisabled} />
        </>
      }
    >
      <Button variant={variant} size={size} disabled={disabled}>
        Action
      </Button>
    </Playground>
  )
}

export function InputPlayground() {
  const [value, setValue] = useState('Chameleon')
  const [disabled, setDisabled] = useState(false)
  const [invalid, setInvalid] = useState(false)
  return (
    <Playground
      controls={
        <>
          <Toggle label="disabled" checked={disabled} onChange={setDisabled} />
          <Toggle label="invalid" checked={invalid} onChange={setInvalid} />
        </>
      }
    >
      <Input
        label="Name"
        value={value}
        onChange={setValue}
        disabled={disabled}
        invalid={invalid}
        errorMessage={invalid ? 'Enter at least 3 characters' : undefined}
      />
    </Playground>
  )
}

export function SelectPlayground() {
  const [value, setValue] = useState('a')
  const [disabled, setDisabled] = useState(false)
  return (
    <Playground controls={<Toggle label="disabled" checked={disabled} onChange={setDisabled} />}>
      <Select
        label="Status"
        value={value}
        onChange={setValue}
        disabled={disabled}
        options={[
          { value: 'a', label: 'Active' },
          { value: 'b', label: 'Paused' },
        ]}
      />
    </Playground>
  )
}

export function DialogPlayground() {
  return (
    <PlaygroundFrame>
      <Dialog
        triggerLabel="Open dialog"
        title="Dialog"
        description="Official Dialog from @chameleon-ui/components."
        closeLabel="Close"
      />
    </PlaygroundFrame>
  )
}

export function TablePreview() {
  return (
    <PlaygroundFrame>
      <Table
        caption="Sample"
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'state', header: 'State' },
        ]}
        rows={[
          { name: 'Alpha', state: 'Active' },
          { name: 'Beta', state: 'Paused' },
        ]}
      />
    </PlaygroundFrame>
  )
}

export function TabsPreview() {
  return (
    <PlaygroundFrame>
      <Tabs
        defaultValue="one"
        items={[
          { value: 'one', label: 'One', content: 'First panel' },
          { value: 'two', label: 'Two', content: 'Second panel' },
        ]}
      />
    </PlaygroundFrame>
  )
}

export function FormPreview() {
  return (
    <PlaygroundFrame>
      <Form submitLabel="Save" onSubmit={(event) => event.preventDefault()}>
        <Input label="Name" value="Chameleon" onChange={() => undefined} />
      </Form>
    </PlaygroundFrame>
  )
}

export function CardPlayground() {
  const [variant, setVariant] = useState<'default' | 'outlined' | 'elevated'>('default')
  const [padding, setPadding] = useState<'sm' | 'md' | 'lg'>('md')
  return (
    <Playground
      controls={
        <>
          <Control label="variant" value={variant} options={['default', 'outlined', 'elevated']} onChange={(v) => setVariant(v as 'default' | 'outlined' | 'elevated')} />
          <Control label="padding" value={padding} options={['sm', 'md', 'lg']} onChange={(v) => setPadding(v as 'sm' | 'md' | 'lg')} />
        </>
      }
    >
      <Card variant={variant} padding={padding}>
        <Typography variant="heading-2" as="h3">Card title</Typography>
        <Typography variant="body">Groups related content and actions.</Typography>
      </Card>
    </Playground>
  )
}

/* ------------------------------ primitives ------------------------------- */

function Playground({ controls, children }: { controls: ReactNode; children: ReactNode }) {
  return (
    <div className="cu-docs-playground">
      <div className="cu-docs-playground-stage">{children}</div>
      <div className="cu-docs-playground-controls">{controls}</div>
    </div>
  )
}

function Control({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="cu-docs-control">
      <span className="cu-docs-control-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <label className="cu-docs-control cu-docs-control-inline">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.currentTarget.checked)} />
      <span className="cu-docs-control-label">{label}</span>
    </label>
  )
}

function StatefulTextarea() {
  const [value, setValue] = useState('Notes for the public docs site.')
  return <Textarea label="Notes" value={value} onChange={setValue} />
}

function StatefulCheckbox() {
  const [checked, setChecked] = useState(true)
  return <Checkbox checked={checked} onChange={setChecked} label="Agree" />
}

function StatefulRadio() {
  const [value, setValue] = useState('card')
  return (
    <Radio
      label="Payment"
      value={value}
      onChange={setValue}
      options={[
        { value: 'card', label: 'Card' },
        { value: 'cash', label: 'Cash' },
      ]}
    />
  )
}

function StatefulSwitch() {
  const [checked, setChecked] = useState(true)
  return <Switch checked={checked} onChange={setChecked} label="Notify" />
}

function StatefulToast() {
  const [open, setOpen] = useState(false)
  return (
    <Stack gap="2">
      <Button onClick={() => setOpen(true)}>Show toast</Button>
      <Toast
        open={open}
        title="Saved"
        description="Toast from the official package."
        closeLabel="Close"
        onOpenChange={setOpen}
      />
    </Stack>
  )
}
