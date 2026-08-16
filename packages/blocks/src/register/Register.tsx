import { Button, Card, Checkbox, Form, Input, PasswordInput, Typography } from '@chameleon-ui/components-react'
import { useState, type FormEvent } from 'react'
import { createBlockCopy } from '../copy.js'
import { registerLocaleTrees } from './locale-map.js'
import './styles.css'

export interface RegisterSubmitValues {
  name: string
  email: string
  password: string
  terms: boolean
}

export interface RegisterProps {
  locale?: string
  onSubmit?: (values: RegisterSubmitValues) => void
  onLoginClick?: () => void
  className?: string
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function Register({ locale = 'en', onSubmit, onLoginClick, className }: RegisterProps) {
  const { t } = createBlockCopy(registerLocaleTrees, locale)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [terms, setTerms] = useState(false)
  const [created, setCreated] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const classes = ['cu-block-register', className].filter(Boolean).join(' ')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError(t('register.errorRequired'))
      return
    }
    if (!isEmail(email.trim())) {
      setError(t('register.errorInvalid'))
      return
    }
    if (password !== confirm) {
      setError(t('register.errorMismatch'))
      return
    }
    if (!terms) {
      setError(t('register.errorTerms'))
      return
    }
    setError(null)
    setCreated((count) => count + 1)
    onSubmit?.({ name: name.trim(), email: email.trim(), password, terms })
  }

  return (
    <section
      className={classes}
      data-ai-role="register"
      data-ai-intent="create-account"
      data-ai-state={error ? 'invalid' : 'default'}
    >
      <Card className="cu-block-register__card" padding="lg" variant="outlined">
        <Typography variant="heading-1">{t('register.title')}</Typography>
        <Typography variant="body">{t('register.subtitle')}</Typography>
        <p className="cu-block-register__meta">{t('register.accountCount', { count: created })}</p>
        {error ? (
          <p className="cu-block-register__error" role="alert">
            {error}
          </p>
        ) : null}
        <Form onSubmit={handleSubmit} submitLabel={t('register.submit')}>
          <Input autoComplete="name" invalid={Boolean(error)} label={t('register.nameLabel')} onChange={setName} value={name} />
          <Input
            autoComplete="email"
            invalid={Boolean(error)}
            label={t('register.emailLabel')}
            onChange={setEmail}
            type="email"
            value={email}
          />
          <PasswordInput
            hideLabel={t('register.hidePassword')}
            invalid={Boolean(error)}
            label={t('register.passwordLabel')}
            onChange={setPassword}
            showLabel={t('register.showPassword')}
            value={password}
          />
          <PasswordInput
            hideLabel={t('register.hidePassword')}
            invalid={Boolean(error)}
            label={t('register.confirmLabel')}
            onChange={setConfirm}
            showLabel={t('register.showPassword')}
            value={confirm}
          />
          <Checkbox checked={terms} label={t('register.termsLabel')} onChange={setTerms} />
        </Form>
        <div className="cu-block-register__login">
          <Typography variant="caption">{t('register.loginPrompt')}</Typography>
          <Button onClick={onLoginClick} type="button" variant="outline">
            {t('register.loginAction')}
          </Button>
        </div>
      </Card>
    </section>
  )
}
