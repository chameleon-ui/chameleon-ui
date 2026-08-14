import { Button } from '@chameleon-ui/components'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useState } from 'react'
import { installCommand } from '../install'
import { getTranslator } from '../messages'
import { InstallCta } from './ComponentPage'

export default function InstallBlock({ slug = 'button', locale }: { slug?: string; locale?: string }) {
  const { i18n } = useDocusaurusContext()
  const { t } = getTranslator(locale ?? i18n?.currentLocale ?? 'zh-CN')
  return (
    <InstallCta
      command={installCommand(slug)}
      copyLabel={t('docs.copy')}
      copiedLabel={t('docs.copied')}
      heading={t('docs.installCta')}
      hint={t('docs.installHint')}
    />
  )
}

export function CopyLine({ code, locale }: { code: string; locale?: string }) {
  const { i18n } = useDocusaurusContext()
  const { t } = getTranslator(locale ?? i18n?.currentLocale ?? 'zh-CN')
  const [copied, setCopied] = useState(false)
  return (
    <div className="cu-docs-codeline">
      <pre className="cu-docs-code">{code}</pre>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await navigator.clipboard.writeText(code)
          setCopied(true)
        }}
      >
        {copied ? t('docs.copied') : t('docs.copy')}
      </Button>
    </div>
  )
}
