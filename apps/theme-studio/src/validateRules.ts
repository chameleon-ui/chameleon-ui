import designRulesSchema from '@chameleon-ui/contract/design-rules.schema.json'
import Ajv2020 from 'ajv/dist/2020.js'
import type { ErrorObject } from 'ajv'

const ajv = new Ajv2020({ allErrors: true, strict: true, validateFormats: false })
const validate = ajv.compile(designRulesSchema)

export interface ValidationIssue {
  path: string
  message: string
}

export function validateDesignRules(document: unknown): ValidationIssue[] {
  const valid = validate(document)
  if (valid) return []

  return (validate.errors ?? []).map((error: ErrorObject) => ({
    path: error.instancePath || '/',
    message: error.message ?? 'schema rule failed',
  }))
}

export function formatValidationIssues(issues: ValidationIssue[]): string {
  if (issues.length === 0) return 'Valid'
  return issues.map((issue) => `${issue.path}: ${issue.message}`).join('\n')
}
