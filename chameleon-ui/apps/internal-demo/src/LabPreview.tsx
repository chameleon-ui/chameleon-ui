import {
  ActionSheet,
  AppShell,
  Dialog,
  Navigation,
  SafeArea,
  Sidebar,
  Stack,
  TabBar,
  Table,
  Typography,
} from '@chameleon-ui/components'
import { useMemo } from 'react'
import type { LabCase } from './messages'

interface LabPreviewProps {
  t: (key: string, values?: Record<string, string | number>) => string
  labCase: LabCase
}

const tableColumns = (t: LabPreviewProps['t']) => [
  { key: 'name', header: t('table.name') },
  { key: 'status', header: t('table.status') },
]

export function LabPreview({ t, labCase }: LabPreviewProps) {
  const overlay = useMemo(() => new URLSearchParams(window.location.search).get('overlay'), [])
  const navItems = [
    { value: 'home', label: t('tabs.account') },
    { value: 'search', label: t('tabs.security') },
    { value: 'settings', label: t('stack.label') },
  ]

  return (
    <div data-vr-lab="container-driven" data-lab-case={labCase}>
      <div className={`cu-lab-host cu-lab-host--${labCase}`} data-lab-host>
        <section data-lab-slot="app-shell">
          <AppShell
            header={<Typography variant="heading-2">{t('demo.labHeading')}</Typography>}
            navigation={<Navigation label={t('navigation.label')} items={navItems} />}
          >
            <Stack gap="3">
              <Typography variant="body">{t('appShell.main')}</Typography>
              <Table
                caption={t('table.caption')}
                columns={tableColumns(t)}
                rows={[
                  { name: t('demo.selectOptionA'), status: t('demo.tableActive') },
                  { name: t('demo.selectOptionB'), status: t('demo.tablePaused') },
                ]}
              />
            </Stack>
          </AppShell>
        </section>

        <section className="cu-lab-sidebar-slot" data-lab-slot="sidebar-rail">
          <Sidebar
            label={t('sidebar.label')}
            items={navItems}
            collapsible
            collapseLabel={t('sidebar.collapse')}
            expandLabel={t('sidebar.expand')}
          />
        </section>

        <section className="cu-lab-safe-area-slot" data-lab-slot="safe-area">
          <SafeArea top bottom start end>
            <Typography variant="body">{t('safeArea.label')}</Typography>
          </SafeArea>
        </section>

        <section data-lab-slot="overlays">
          <Stack direction="row" gap="2">
            <Dialog
              closeLabel={t('dialog.close')}
              description={t('dialog.description')}
              title={t('dialog.title')}
              triggerLabel={t('dialog.trigger')}
              defaultOpen={overlay === 'dialog'}
            >
              <p>{t('dialog.body')}</p>
            </Dialog>
            <ActionSheet
              triggerLabel={t('actionSheet.label')}
              title={t('actionSheet.label')}
              cancelLabel={t('actionSheet.cancel')}
              open={overlay === 'sheet'}
              actions={[
                { value: 'share', label: t('demo.selectOptionA') },
                { value: 'delete', label: t('demo.selectOptionB') },
              ]}
            />
          </Stack>
        </section>
        <section className="cu-lab-tab-bar-slot" data-lab-slot="tab-bar">
          <TabBar label={t('tabBar.label')} items={navItems} />
        </section>
      </div>
    </div>
  )
}
