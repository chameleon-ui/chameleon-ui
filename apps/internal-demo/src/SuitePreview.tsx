import {
  AppShell,
  Button,
  Checkbox,
  Dialog,
  Icon,
  Input,
  Select,
  Spinner,
  Stack,
  Tabs,
  Typography,
} from '@chameleon-ui/components'

const common10 = [
  'button',
  'icon',
  'typography',
  'input',
  'select',
  'checkbox',
  'dialog',
  'tabs',
  'stack',
  'spinner',
] as const

interface SuitePreviewProps {
  t: (key: string, values?: Record<string, string | number>) => string
}

export function SuitePreview({ t }: SuitePreviewProps) {
  return (
    <div data-vr-suite="appshell-common10">
      <AppShell
        className="cu-demo-suite"
        header={
          <Stack align="center" direction="row" gap="2" justify="between">
            <Typography variant="heading-2">{t('demo.suiteHeading')}</Typography>
            <Typography variant="caption">{t('demo.kicker')}</Typography>
          </Stack>
        }
        sidebar={
          <nav aria-label={t('appShell.sidebar')}>
            <ul className="cu-demo-nav">
              {common10.map((slug) => (
                <li key={slug}>{slug}</li>
              ))}
            </ul>
          </nav>
        }
        sidebarLabel={t('appShell.sidebar')}
      >
        <Stack gap="3">
          <Typography variant="body">{t('appShell.main')}</Typography>
          <Stack align="center" direction="row" gap="2">
            <Button>{t('button.submit')}</Button>
            <Button size="sm" variant="outline">
              {t('button.cancel')}
            </Button>
            <Icon label={t('icon.back')} mode="mirror" />
            <Spinner label={t('spinner.loading')} />
          </Stack>
          <Typography variant="heading-2">{t('typography.heading')}</Typography>
          <Typography variant="body">{t('typography.body')}</Typography>
          <Input label={t('input.label')} value="Chameleon" onChange={() => undefined} />
          <Select
            label={t('select.label')}
            options={[
              { value: 'a', label: t('demo.selectOptionA') },
              { value: 'b', label: t('demo.selectOptionB') },
            ]}
            placeholder={t('select.placeholder')}
            value="a"
            onChange={() => undefined}
          />
          <Checkbox checked label={t('checkbox.agree')} onChange={() => undefined} />
          <Dialog
            closeLabel={t('dialog.close')}
            description={t('dialog.description')}
            title={t('dialog.title')}
            triggerLabel={t('dialog.trigger')}
          />
          <Tabs
            defaultValue="account"
            items={[
              { value: 'account', label: t('tabs.account'), content: t('typography.body') },
              { value: 'security', label: t('tabs.security'), content: t('stack.label') },
            ]}
          />
          <Stack direction="row" gap="2">
            <Button size="sm">{t('stack.label')}</Button>
          </Stack>
        </Stack>
      </AppShell>
    </div>
  )
}
