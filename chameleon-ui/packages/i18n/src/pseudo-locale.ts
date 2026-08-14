import IntlMessageFormat from 'intl-messageformat'
import { printAST } from '@formatjs/icu-messageformat-parser/printer.js'

type MessageAst = ReturnType<IntlMessageFormat['getAst']>

export interface PseudoLocaleIssue {
  key: string
  path: string
  englishLength: number
  pseudoLength: number
  minimumLength: number
}

function countGraphemes(value: string) {
  return [...value].length
}

function expandLiteral(value: string, minimumLength: number, allowLeadingPadding = true) {
  if (value.length === 0) return value
  const paddingLength = Math.max(0, minimumLength - countGraphemes(value))
  if (paddingLength === 0) return value
  if (!allowLeadingPadding) return `${value}${'~'.repeat(paddingLength)}`

  const leadingLength = Math.floor(paddingLength / 2)
  return `${'~'.repeat(leadingLength)}${value}${'~'.repeat(paddingLength - leadingLength)}`
}

function expandElements(
  englishElements: MessageAst,
  pseudoElements: MessageAst,
  expansion: number,
  isBranch = false,
): MessageAst {
  const englishLiteralLength = englishElements.reduce(
    (total, element) =>
      total +
      (element.type === 0 ? countGraphemes(element.value) : 0) +
      (element.type === 7 ? 1 : 0),
    0,
  )
  const minimumLiteralLength = Math.ceil(englishLiteralLength * expansion)
  const pseudoPoundLength = pseudoElements.reduce(
    (total, element) => total + (element.type === 7 ? 1 : 0),
    0,
  )
  let lastPseudoLiteralIndex = -1
  for (let index = 0; index < pseudoElements.length; index += 1) {
    if (pseudoElements[index].type === 0) lastPseudoLiteralIndex = index
  }

  return pseudoElements.map((element, index) => {
    if (element.type === 0) {
      return {
        ...element,
        value: expandLiteral(
          element.value,
          index === lastPseudoLiteralIndex
            ? countGraphemes(element.value) +
                Math.max(
                  0,
                  minimumLiteralLength -
                    pseudoPoundLength -
                    pseudoElements.reduce(
                      (total, candidate) =>
                        total + (candidate.type === 0 ? countGraphemes(candidate.value) : 0),
                      0,
                    ),
                )
            : countGraphemes(element.value),
          !isBranch,
        ),
      }
    }
    if ('options' in element) {
      const englishWithOptions = englishElements.find(
        (candidate) => 'options' in candidate && candidate.value === element.value,
      )
      if (!englishWithOptions || !('options' in englishWithOptions)) {
        throw new Error(`Pseudo ICU selector ${element.value} is missing from English`)
      }
      return {
        ...element,
        options: Object.fromEntries(
          Object.entries(element.options).map(([branch, option]) => [
            branch,
            {
              ...option,
              value: expandElements(
                englishWithOptions.options[branch]?.value ?? [],
                option.value,
                expansion,
                true,
              ),
            },
          ]),
        ),
      }
    }
    if ('children' in element) {
      const englishWithChildren = englishElements.find(
        (candidate) => 'children' in candidate && candidate.value === element.value,
      )
      if (!englishWithChildren || !('children' in englishWithChildren)) {
        throw new Error(`Pseudo ICU tag ${element.value} is missing from English`)
      }
      return {
        ...element,
        children: expandElements(englishWithChildren.children, element.children, expansion),
      }
    }
    return element
  })
}

/**
 * Pads ICU literal nodes only, preserving selectors, branch keys, and values.
 * Never uses object-level replaceAll on the source message map.
 *
 * @complexity time O(n + c) | space O(n) | c = emitted padding characters
 * @guarantees deterministic ICU output with at least the requested literal expansion
 * @phase-1 migrated from poc/ark-ui; default expansion is 140%
 */
export function expandPseudoMessage(
  englishMessage: string,
  pseudoMessage: string,
  expansion = 1.4,
) {
  const englishAst = new IntlMessageFormat(englishMessage, 'en').getAst()
  const pseudoAst = new IntlMessageFormat(pseudoMessage, 'en').getAst()
  return printAST(expandElements(englishAst, pseudoAst, expansion))
}

/**
 * Expands each checked-in pseudo message relative to its English counterpart.
 * English text never replaces pseudo glyphs; it only sets the target length.
 *
 * @complexity time O(n + c) | space O(n) | n = total ICU AST nodes
 * @guarantees deterministic per-message output whose visible literals reach the target
 */
export function expandPseudoMessages(
  englishMessages: Record<string, string>,
  pseudoMessages: Record<string, string>,
  expansion = 1.4,
) {
  const output: Record<string, string> = {}

  for (const [key, englishMessage] of Object.entries(englishMessages)) {
    const pseudoMessage = pseudoMessages[key]
    if (pseudoMessage === undefined) continue
    output[key] = expandPseudoMessage(englishMessage, pseudoMessage, expansion)
  }

  return output
}

function literalLengths(elements: MessageAst, path = '$', output = new Map<string, number>()) {
  let length = output.get(path) ?? 0

  for (const element of elements) {
    if (element.type === 0) {
      length += countGraphemes(element.value)
    }
    if (element.type === 7) {
      length += 1
    }
    if ('options' in element) {
      for (const [branch, option] of Object.entries(element.options)) {
        literalLengths(option.value, `${path}/${element.value}:${branch}`, output)
      }
    }
    if ('children' in element) {
      literalLengths(element.children, `${path}/tag:${element.value}`, output)
    }
  }

  output.set(path, length)
  return output
}

/**
 * Validates only user-visible ICU literal nodes; syntax, argument names, and
 * selectors cannot inflate the score. Branches are checked independently.
 *
 * @complexity time O(n) | space O(d) | n = total ICU AST nodes, d = branch paths
 * @guarantees every non-empty pseudo branch is at least the requested expansion
 */
export function validatePseudoExpansion(
  englishMessages: Record<string, string>,
  pseudoMessages: Record<string, string>,
  expansion = 1.4,
) {
  const issues: PseudoLocaleIssue[] = []

  for (const [key, englishMessage] of Object.entries(englishMessages)) {
    const pseudoMessage = pseudoMessages[key]
    if (pseudoMessage === undefined) {
      issues.push({ key, path: '$', englishLength: 0, pseudoLength: 0, minimumLength: 1 })
      continue
    }

    const englishLengths = literalLengths(new IntlMessageFormat(englishMessage, 'en').getAst())
    const pseudoLengths = literalLengths(new IntlMessageFormat(pseudoMessage, 'en').getAst())

    for (const [path, englishLength] of englishLengths) {
      if (englishLength === 0) continue
      const pseudoLength = pseudoLengths.get(path) ?? 0
      const minimumLength = Math.ceil(englishLength * expansion)

      if (pseudoLength < minimumLength) {
        issues.push({ key, path, englishLength, pseudoLength, minimumLength })
      }
    }
  }

  return issues
}
