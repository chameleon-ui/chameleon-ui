import { Button, Card, Checkbox, Form, Input, PasswordInput, Typography } from '@chameleon-ui/components'
import { useState, type FormEvent } from 'react'
import { createBlockCopy } from '../copy.js'
import { loginLocaleTrees } from './locale-map.js'
import './styles.css'

export interface LoginSubmitValues {
  email: string
  password: string
  remember: boolean
}

export interface LoginProps {
  locale?: string
  onSubmit?: (values: LoginSubmitValues) => void
  onRegisterClick?: () => void
  className?: string
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function Login({ locale = 'en', onSubmit, onRegisterClick, className }: LoginProps) {
  const { t } = createBlockCopy(loginLocaleTrees, locale)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const classes = ['cu-block-login', className].filter(Boolean).join(' ')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError(t('login.errorRequired'))
      return
    }
    if (!isEmail(email.trim())) {
      setError(t('login.errorInvalid'))
      return
    }
    setError(null)
    onSubmit?.({ email: email.trim(), password, remember })
  }

  return (
    <section
      className={classes}
      data-ai-role="login"
      data-ai-intent="authenticate"
      data-ai-state={error ? 'invalid' : 'default'}
    >
      <Card className="cu-block-login__card" padding="lg" variant="outlined">
        <Typography variant="heading-1">{t('login.title')}</Typography>
        <Typography variant="body">{t('login.subtitle')}</Typography>
        <p className="cu-block-login__meta">{t('login.sessionCount', { count: remember ? 1 : 0 })}</p>
        {error ? (
          <p className="cu-block-login__error" role="alert">
            {error}
          </p>
        ) : null}
        <Form onSubmit={handleSubmit} submitLabel={t('login.submit')}>
          <Input
            autoComplete="email"
            invalid={Boolean(error)}
            label={t('login.emailLabel')}
            onChange={setEmail}
            type="email"
            value={email}
          />
          <PasswordInput
            hideLabel={t('login.hidePassword')}
            invalid={Boolean(error)}
            label={t('login.passwordLabel')}
            onChange={setPassword}
            showLabel={t('login.showPassword')}
            value={password}
          />
          <Checkbox checked={remember} label={t('login.rememberLabel')} onChange={setRemember} />
        </Form>
        <div className="cu-block-login__register">
          <Typography variant="caption">{t('login.registerPrompt')}</Typography>
          <Button onClick={onRegisterClick} type="button" variant="outline">
            {t('login.registerAction')}
          </Button>
        </div>
      </Card>
    </section>
  )
}
