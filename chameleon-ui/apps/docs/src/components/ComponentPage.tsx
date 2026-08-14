import { Stack, Typography } from '@chameleon-ui/components'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useState, type ReactNode } from 'react'
import type { ContractDoc } from '../contracts'
import { getContract } from '../contracts'
import { installCommand } from '../install'
import { getTranslator } from '../messages'
import { getExample } from '../playgrounds'

type T = (key: string, values?: Record<string, string | number>) => string

/**
 * Per-component doc renderer. Implements the 9-section template defined in
 * `docs/project/docs-standard.md`. Sections marked SSOT are rendered entirely
 * from `contract.json` — never hand-duplicated — so docs and contract stay in
 * sync by construction.
 */
export default function ComponentPage({
  slug,
  includePlayground = true,
  t: tProp,
}: {
  slug: string
  includePlayground?: boolean
  t?: T
}) {
  const { i18n } = useDocusaurusContext()
  const locale = i18n?.currentLocale ?? 'zh-CN'
  const { t } = tProp ? { t: tProp } : getTranslator(locale)
  const contract = getContract(slug)
  const example = getExample(slug)

  if (!contract) {
    return <p>{t('docs.notFound')}</p>
  }

  return (
    <Stack gap="3">
      {locale === 'zh-CN' || locale === 'zh-HK' ? (
        <p className="cu-docs-note" data-docs="contract-en">
          {locale === 'zh-HK' ? '契約正文為英文（LEGACY-2026-017）。' : '契约正文为英文（LEGACY-2026-017）。'}
        </p>
      ) : null}

      {contract.purpose ? (
        <Typography variant="body">{contract.purpose}</Typography>
      ) : null}

      {contract.scenarios?.length || contract.antiPatterns?.length ? (
        <section data-docs="usage">
          <Typography variant="heading-2">{t('docs.usageHeading')}</Typography>
          <div className="cu-docs-two-col">
            {contract.scenarios?.length ? (
              <div>
                <Typography variant="heading-2" as="h3">
                  {t('docs.whenToUse')}
                </Typography>
                <ul className="cu-docs-list">
                  {contract.scenarios.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {contract.antiPatterns?.length ? (
              <div>
                <Typography variant="heading-2" as="h3">
                  {t('docs.whenNotToUse')}
                </Typography>
                <ul className="cu-docs-list">
                  {contract.antiPatterns.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {includePlayground ? (
        <section data-docs="examples">
          <Typography variant="heading-2">{t('docs.examplesHeading')}</Typography>
          {example ? (
            <div data-docs-preview={slug}>{example.live()}</div>
          ) : (
            <p className="cu-docs-note" data-docs="preview-pending">
              {t('docs.previewPending')}
            </p>
          )}
        </section>
      ) : null}

      {includePlayground && example?.snippets.length ? (
        <section data-docs="code">
          <Typography variant="heading-2">{t('docs.codeHeading')}</Typography>
          <Stack gap="3">
            {example.snippets.map((snippet) => (
              <CodeBlock
                key={snippet.id}
                title={t(snippet.labelKey)}
                code={snippet.code}
                copyLabel={t('docs.copy')}
                copiedLabel={t('docs.copied')}
              />
            ))}
          </Stack>
        </section>
      ) : null}

      <ApiTables contract={contract} t={t} />

      {contract.a11y ? (
        <section data-docs="a11y">
          <Typography variant="heading-2">{t('docs.a11y')}</Typography>
          <dl className="cu-docs-defs">
            {contract.a11y.role ? <Def term="role" value={<code>{contract.a11y.role}</code>} /> : null}
            {contract.a11y.keyboard?.length ? (
              <Def
                term={t('docs.a11yKeyboard')}
                value={
                  <ul className="cu-docs-list">
                    {contract.a11y.keyboard.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                }
              />
            ) : null}
            {contract.a11y.focus ? <Def term={t('docs.a11yFocus')} value={contract.a11y.focus} /> : null}
            {contract.a11y.labeling ? <Def term={t('docs.a11yLabeling')} value={contract.a11y.labeling} /> : null}
            {contract.a11y.wcag?.length ? (
              <Def
                term="WCAG"
                value={contract.a11y.wcag.map((id) => (
                  <code key={id} className="cu-docs-chip">
                    {id}
                  </code>
                ))}
              />
            ) : null}
          </dl>
        </section>
      ) : null}

      {contract.responsive ? (
        <section data-docs="responsive">
          <Typography variant="heading-2">{t('docs.responsiveHeading')}</Typography>
          {contract.responsive.strategy ? <Typography variant="body">{contract.responsive.strategy}</Typography> : null}
          {contract.responsive.breakpoints ? (
            <table className="cu-docs-table">
              <thead>
                <tr>
                  <th>{t('docs.breakpoint')}</th>
                  <th>{t('docs.behavior')}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(contract.responsive.breakpoints).map(([bp, behavior]) => (
                  <tr key={bp}>
                    <td>
                      <code>{bp}</code>
                    </td>
                    <td>{behavior}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </section>
      ) : null}

      {contract.rtl ? (
        <section data-docs="rtl">
          <Typography variant="heading-2">{t('docs.rtl')}</Typography>
          <Typography variant="body">{contract.rtl.strategy}</Typography>
          {contract.rtl.mirroredValues?.length ? (
            <Typography variant="caption">
              {t('docs.rtlMirrored')}: {contract.rtl.mirroredValues.join(', ')}
            </Typography>
          ) : null}
        </section>
      ) : null}

      <section data-docs="tokens">
        <Typography variant="heading-2">{t('docs.tokensHeading')}</Typography>
        <Typography variant="body">{t('docs.tokensLead')}</Typography>
        <p>
          <code>--cu-color-*</code> · <code>--cu-space-*</code>
        </p>
      </section>

      <InstallCta
        command={installCommand(slug)}
        copyLabel={t('docs.copy')}
        copiedLabel={t('docs.copied')}
        heading={t('docs.installCta')}
        hint={t('docs.installHint')}
      />
    </Stack>
  )
}

export function ApiTables({ contract, t }: { contract: ContractDoc; t: T }) {
  const props = Object.entries(contract.props ?? {})
  return (
    <section data-docs="api">
      <Typography variant="heading-2">{t('docs.apiHeading')}</Typography>
      {props.length ? (
        <>
          <Typography variant="heading-2" as="h3">
            {t('docs.props')}
          </Typography>
          <table className="cu-docs-table" data-docs="props-table">
            <thead>
              <tr>
                <th>{t('docs.propName')}</th>
                <th>{t('docs.propType')}</th>
                <th>{t('docs.propDefault')}</th>
                <th>{t('docs.propDescription')}</th>
              </tr>
            </thead>
            <tbody>
              {props.map(([name, spec]) => (
                <tr key={name}>
                  <td>
                    <code>{name}</code>
                    {spec.required ? (
                      <span className="cu-docs-required" title={t('docs.required')}>
                        *
                      </span>
                    ) : null}
                  </td>
                  <td>
                    <code>{spec.values ? spec.values.map((v) => `'${v}'`).join(' | ') : (spec.type ?? '—')}</code>
                  </td>
                  <td>{spec.default === undefined ? '—' : <code>{String(spec.default)}</code>}</td>
                  <td>{spec.description ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      {contract.variants?.length ? (
        <>
          <Typography variant="heading-2" as="h3">
            {t('docs.variants')}
          </Typography>
          <table className="cu-docs-table">
            <thead>
              <tr>
                <th>{t('docs.propName')}</th>
                <th>{t('docs.values')}</th>
                <th>{t('docs.propDefault')}</th>
              </tr>
            </thead>
            <tbody>
              {contract.variants.map((variant) => (
                <tr key={variant.name}>
                  <td>
                    <code>{variant.name}</code>
                  </td>
                  <td>{variant.values.join(' · ')}</td>
                  <td>{variant.default ? <code>{variant.default}</code> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      {contract.states?.length ? (
        <>
          <Typography variant="heading-2" as="h3">
            {t('docs.states')}
          </Typography>
          <ul className="cu-docs-list">
            {contract.states.map((state) => (
              <li key={state.name}>
                <code>{state.name}</code>
                {state.description ? ` — ${state.description}` : ''}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  )
}

export function InstallCta({
  command,
  copyLabel,
  copiedLabel,
  heading,
  hint,
}: {
  command: string
  copyLabel: string
  copiedLabel: string
  heading: string
  hint: string
}) {
  return (
    <section data-docs="install-cta">
      <Typography variant="heading-2">{heading}</Typography>
      <CodeLine code={command} copyLabel={copyLabel} copiedLabel={copiedLabel} />
      <Typography variant="caption">{hint}</Typography>
    </section>
  )
}

function CodeLine({ code, copyLabel, copiedLabel }: { code: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="cu-docs-codeline">
      <pre className="cu-docs-code">{code}</pre>
      <button
        type="button"
        className="cu-docs-link"
        onClick={async () => {
          await navigator.clipboard.writeText(code)
          setCopied(true)
        }}
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  )
}

function CodeBlock({
  title,
  code,
  copyLabel,
  copiedLabel,
}: {
  title: string
  code: string
  copyLabel: string
  copiedLabel: string
}) {
  const [copied, setCopied] = useState(false)
  return (
    <figure className="cu-docs-snippet">
      <figcaption className="cu-docs-snippet-head">
        <span>{title}</span>
        <button
          type="button"
          className="cu-docs-link"
          onClick={async () => {
            await navigator.clipboard.writeText(code)
            setCopied(true)
          }}
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </figcaption>
      <pre className="cu-docs-code">
        <code>{code}</code>
      </pre>
    </figure>
  )
}

function Def({ term, value }: { term: ReactNode; value: ReactNode }) {
  return (
    <div className="cu-docs-def">
      <dt>{term}</dt>
      <dd>{value}</dd>
    </div>
  )
}
