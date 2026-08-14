import { useState } from 'react'
import {
  AppShell,
  Button,
  Card,
  Navigation,
  NavigationBar,
  Stack,
  ToastProvider,
  useTabStacks,
  useToast,
} from '@chameleon-ui/components'

const tabs = [
  { value: 'home', title: 'Home' },
  { value: 'inbox', title: 'Inbox' },
]

export function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  )
}

function Shell() {
  const stacks = useTabStacks(tabs)
  const screen = stacks.current.id === 'detail' ? <Detail /> : stacks.tab === 'inbox' ? <Inbox /> : <Home onOpen={() => stacks.push({ id: 'detail', title: 'Detail' })} />

  return (
    <AppShell
      header={
        <NavigationBar
          backLabel={stacks.previous?.title}
          onBack={stacks.canPop ? stacks.pop : undefined}
          title={stacks.current.title}
        />
      }
      navigation={
        <Navigation
          activeValue={stacks.tab}
          items={tabs.map((item) => ({ value: item.value, label: item.title }))}
          label="Main"
          onSelect={stacks.selectTab}
        />
      }
    >
      {screen}
    </AppShell>
  )
}

function Home({ onOpen }: { onOpen: () => void }) {
  const toast = useToast()
  const [saving, setSaving] = useState(false)

  return (
    <Card>
      <Stack gap="2">
      <p>Official external Vite template. Do not compose Sidebar + TabBar.</p>
      <Button
        loading={saving}
        onClick={() => {
          setSaving(true)
          window.setTimeout(() => {
            setSaving(false)
            toast.push({
              title: 'Saved',
              description: 'Queued toast from ToastProvider.',
              status: 'success',
            })
          }, 400)
        }}
      >
        Save
      </Button>
      <Button onClick={onOpen} variant="outline">
        Open stack
      </Button>
      <Button
        onClick={() => toast.push({ title: 'Delete?', status: 'warning' })}
        tone="danger"
        variant="ghost"
      >
        Danger ghost
      </Button>
      </Stack>
    </Card>
  )
}

function Detail() {
  return <Card>Pushed screen. Back pops this tab stack.</Card>
}

function Inbox() {
  return <Card>Switching tabs does not push.</Card>
}
