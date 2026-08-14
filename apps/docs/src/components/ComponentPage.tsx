import { Stack, Typography } from '@chameleon-ui/components'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useState, type ReactNode } from 'react'
import type { ContractDoc } from '../contracts'
import { getContract } from '../contracts'
import {
  agentRecipe,
  componentName,
  inferEventPayload,
  listedExports,
  mechanicsParagraphs,
  splitProps,
  usageSnippet,
  usageSteps,
} from '../contract-docs'
import { installCommand } from '../install'
import { getTranslator } from '../messages'
import { getExample } from '../playgrounds'

type T = (key: string, values?: Record<string, string | number>) => string

/**
 * Per-component doc renderer. Implements the template in
 * `docs/project/docs-standard.md`. API / events / agent / mechanics / usage
 * come from `contract.json` (or are synthesized from it). Never hand-copy props.
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

  const snippets = example?.snippets ?? []
  const generatedUsage = usageSnippet(contract)

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

      <MechanicsSection contract={contract} t={t} />
      <UsageSection contract={contract} t={t} generatedUsage={generatedUsage} />

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

      {includePlayground ? (
        <section data-docs="code">
          <Typography variant="heading-2">{t('docs.codeHeading')}</Typography>
          <Stack gap="3">
            {snippets.length ? (
              snippets.map((snippet) => (
                <CodeBlock
                  key={snippet.id}
                  title={t(snippet.labelKey)}
                  code={snippet.code}
                  copyLabel={t('docs.copy')}
                  copiedLabel={t('docs.copied')}
                />
              ))
            ) : (
              <CodeBlock
                title={t('docs.exMinimal')}
                code={generatedUsage}
                copyLabel={t('docs.copy')}
                copiedLabel={t('docs.copied')}
              />
            )}
          </Stack>
        </section>
      ) : null}

      <ApiTables contract={contract} t={t} />
      <CompositionSection contract={contract} t={t} />
      <AgentSection contract={contract} t={t} />

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

      {contract.platforms ? (
        <section data-docs="platforms">
          <Typography variant="heading-2">{t('docs.platformsHeading')}</Typography>
          <table className="cu-docs-table">
            <thead>
              <tr>
                <th>web</th>
                <th>React</th>
                <th>Vue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>{contract.platforms.web ?? '—'}</code>
                </td>
                <td>
                  <code>{contract.platforms.react ?? '—'}</code>
                </td>
                <td>
                  <code>{contract.platforms.vue ?? '—'}</code>
                </td>
              </tr>
            </tbody>
          </table>
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

function MechanicsSection({ contract, t }: { contract: ContractDoc; t: T }) {
  const paragraphs = mechanicsParagraphs(contract)
  if (!paragraphs.length) return null
  return (
    <section data-docs="mechanics">
      <Typography variant="heading-2">{t('docs.mechanicsHeading')}</Typography>
      {paragraphs.map((paragraph) => (
        <Typography key={paragraph.slice(0, 48)} variant="body">
          {paragraph}
        </Typography>
      ))}
    </section>
  )
}

function UsageSection({
  contract,
  t,
  generatedUsage,
}: {
  contract: ContractDoc
  t: T
  generatedUsage: string
}) {
  const name = componentName(contract)
  const steps = usageSteps(contract)
  return (
    <section data-docs="usage">
      <Typography variant="heading-2">{t('docs.usageHeading')}</Typography>
      <Typography variant="heading-2" as="h3">
        {t('docs.importHeading')}
      </Typography>
      <CodeLine
        code={`import { ${name} } from '@chameleon-ui/components'`}
        copyLabel={t('docs.copy')}
        copiedLabel={t('docs.copied')}
      />
      <CodeBlock
        title={t('docs.exMinimal')}
        code={generatedUsage}
        copyLabel={t('docs.copy')}
        copiedLabel={t('docs.copied')}
      />
      {steps.length ? (
        <>
          <Typography variant="heading-2" as="h3">
            {t('docs.usageStepsHeading')}
          </Typography>
          <ol className="cu-docs-steps">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </>
      ) : null}
      {contract.scenarios?.length || contract.antiPatterns?.length ? (
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
      ) : null}
    </section>
  )
}

export function ApiTables({ contract, t }: { contract: ContractDoc; t: T }) {
  const { attrs, events } = splitProps(contract)
  const exported = listedExports(contract)
  return (
    <section data-docs="api">
      <Typography variant="heading-2">{t('docs.apiHeading')}</Typography>
      {attrs.length ? (
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
              {attrs.map(([name, spec]) => (
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

      <Typography variant="heading-2" as="h3">
        {t('docs.eventsHeading')}
      </Typography>
      {events.length ? (
        <table className="cu-docs-table" data-docs="events">
          <thead>
            <tr>
              <th>{t('docs.eventName')}</th>
              <th>{t('docs.eventPayload')}</th>
              <th>{t('docs.eventDescription')}</th>
            </tr>
          </thead>
          <tbody>
            {events.map(([name, spec]) => (
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
                  <code>{inferEventPayload(name, spec)}</code>
                </td>
                <td>{spec.description ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="cu-docs-note" data-docs="events">
          {t('docs.noEvents')}
        </p>
      )}

      <Typography variant="heading-2" as="h3">
        {t('docs.exportsHeading')}
      </Typography>
      <table className="cu-docs-table" data-docs="exports">
        <thead>
          <tr>
            <th>{t('docs.exportName')}</th>
            <th>{t('docs.exportKind')}</th>
            <th>{t('docs.exportSignature')}</th>
            <th>{t('docs.exportDescription')}</th>
          </tr>
        </thead>
        <tbody>
          {exported.map((item) => (
            <tr key={`${item.kind}-${item.name}`}>
              <td>
                <code>{item.name}</code>
              </td>
              <td>
                <code>{item.kind}</code>
              </td>
              <td>
                <code>{item.signature}</code>
              </td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

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

function CompositionSection({ contract, t }: { contract: ContractDoc; t: T }) {
  if (
    !contract.composition ||
    !(
      contract.composition.allowedParents?.length ||
      contract.composition.allowedChildren?.length ||
      contract.composition.requiredContext?.length
    )
  ) {
    return null
  }
  return (
    <section data-docs="composition">
      <Typography variant="heading-2">{t('docs.compositionHeading')}</Typography>
      <dl className="cu-docs-defs">
        {contract.composition.allowedParents?.length ? (
          <Def
            term={t('docs.allowedParents')}
            value={contract.composition.allowedParents.map((item) => (
              <code key={item} className="cu-docs-chip">
                {item}
              </code>
            ))}
          />
        ) : null}
        {contract.composition.allowedChildren?.length ? (
          <Def
            term={t('docs.allowedChildren')}
            value={contract.composition.allowedChildren.map((item) => (
              <code key={item} className="cu-docs-chip">
                {item}
              </code>
            ))}
          />
        ) : null}
        {contract.composition.requiredContext?.length ? (
          <Def
            term={t('docs.requiredContext')}
            value={contract.composition.requiredContext.map((item) => (
              <code key={item} className="cu-docs-chip">
                {item}
              </code>
            ))}
          />
        ) : null}
      </dl>
    </section>
  )
}

function AgentSection({ contract, t }: { contract: ContractDoc; t: T }) {
  return (
    <section data-docs="agent">
      <Typography variant="heading-2">{t('docs.agentHeading')}</Typography>
      <Typography variant="body">{t('docs.agentLead')}</Typography>
      <Typography variant="heading-2" as="h3">
        {t('docs.agentMcp')}
      </Typography>
      <CodeBlock
        title={t('docs.agentEmit')}
        code={agentRecipe(contract)}
        copyLabel={t('docs.copy')}
        copiedLabel={t('docs.copied')}
      />
      {contract.dataAi?.role ? (
        <div data-docs="data-ai">
          <Typography variant="heading-2" as="h3">
            {t('docs.dataAiHeading')}
          </Typography>
          <Typography variant="body">{t('docs.dataAiLead')}</Typography>
          <dl className="cu-docs-defs">
            <Def term="data-ai-role" value={<code>{contract.dataAi.role}</code>} />
            {contract.dataAi.states?.length ? (
              <Def
                term="data-ai-state"
                value={contract.dataAi.states.map((item) => (
                  <code key={item} className="cu-docs-chip">
                    {item}
                  </code>
                ))}
              />
            ) : null}
            {contract.dataAi.intents?.length ? (
              <Def
                term="data-ai-intent"
                value={contract.dataAi.intents.map((item) => (
                  <code key={item} className="cu-docs-chip">
                    {item}
                  </code>
                ))}
              />
            ) : null}
          </dl>
        </div>
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
