import { Accordion, Button, Card, Typography } from '@chameleon-ui/components'
import { createBlockCopy } from '../copy.js'
import { marketingSiteLocaleTrees } from './locale-map.js'
import './styles.css'

export interface MarketingSiteProps {
  locale?: string
  onCta?: (plan: 'starter' | 'pro' | 'team' | 'hero') => void
  className?: string
}

export function MarketingSite({ locale = 'en', onCta, className }: MarketingSiteProps) {
  const { t } = createBlockCopy(marketingSiteLocaleTrees, locale)
  const classes = ['cu-block-marketing-site', className].filter(Boolean).join(' ')
  const plans = [
    { id: 'starter' as const, name: t('marketing.planFree'), price: t('marketing.priceFree'), body: t('marketing.planFreeBody') },
    { id: 'pro' as const, name: t('marketing.planPro'), price: t('marketing.pricePro'), body: t('marketing.planProBody') },
    { id: 'team' as const, name: t('marketing.planTeam'), price: t('marketing.priceTeam'), body: t('marketing.planTeamBody') },
  ]

  return (
    <article
      className={classes}
      data-ai-role="marketing-site"
      data-ai-intent="browse-pricing"
      data-ai-state="default"
    >
      <section className="cu-block-marketing-site__hero">
        <Typography variant="heading-1">{t('marketing.heroTitle')}</Typography>
        <Typography variant="body">{t('marketing.heroBody')}</Typography>
        <Button onClick={() => onCta?.('hero')} type="button">
          {t('marketing.heroCta')}
        </Button>
      </section>
      <section aria-label={t('marketing.pricingTitle')} className="cu-block-marketing-site__pricing">
        <Typography as="h2" variant="heading-2">
          {t('marketing.pricingTitle')}
        </Typography>
        <p className="cu-block-marketing-site__meta">{t('marketing.planCount', { count: plans.length })}</p>
        <div className="cu-block-marketing-site__plans">
          {plans.map((plan) => (
            <Card key={plan.id} padding="lg" variant="outlined">
              <Typography variant="heading-2">{plan.name}</Typography>
              <Typography variant="body">{plan.price}</Typography>
              <Typography variant="body">{plan.body}</Typography>
              <Button onClick={() => onCta?.(plan.id)} type="button" variant="outline">
                {t('marketing.ctaStart')}
              </Button>
            </Card>
          ))}
        </div>
      </section>
      <section aria-label={t('marketing.faqTitle')} className="cu-block-marketing-site__faq">
        <Typography as="h2" variant="heading-2">
          {t('marketing.faqTitle')}
        </Typography>
        <Accordion
          items={[
            { title: t('marketing.faq1Title'), content: t('marketing.faq1Body') },
            { title: t('marketing.faq2Title'), content: t('marketing.faq2Body') },
            { title: t('marketing.faq3Title'), content: t('marketing.faq3Body') },
          ]}
        />
      </section>
    </article>
  )
}
