import antBlueMeta from '@chameleon-ui/themes/ant-blue/meta'
import antBlueRules from '@chameleon-ui/themes/ant-blue/design-rules'
import antBlueTokens from '@chameleon-ui/themes/ant-blue/tokens'
import corsaMeta from '@chameleon-ui/themes/corsa/meta'
import corsaRules from '@chameleon-ui/themes/corsa/design-rules'
import corsaTokens from '@chameleon-ui/themes/corsa/tokens'
import cupertinoMeta from '@chameleon-ui/themes/cupertino/meta'
import cupertinoRules from '@chameleon-ui/themes/cupertino/design-rules'
import cupertinoTokens from '@chameleon-ui/themes/cupertino/tokens'
import lineMeta from '@chameleon-ui/themes/line/meta'
import lineRules from '@chameleon-ui/themes/line/design-rules'
import lineTokens from '@chameleon-ui/themes/line/tokens'
import silverArrowMeta from '@chameleon-ui/themes/silver-arrow/meta'
import silverArrowRules from '@chameleon-ui/themes/silver-arrow/design-rules'
import silverArrowTokens from '@chameleon-ui/themes/silver-arrow/tokens'
import sirenMeta from '@chameleon-ui/themes/siren/meta'
import sirenRules from '@chameleon-ui/themes/siren/design-rules'
import sirenTokens from '@chameleon-ui/themes/siren/tokens'
import stuttgartMeta from '@chameleon-ui/themes/stuttgart/meta'
import stuttgartRules from '@chameleon-ui/themes/stuttgart/design-rules'
import stuttgartTokens from '@chameleon-ui/themes/stuttgart/tokens'
import wechatMeta from '@chameleon-ui/themes/wechat/meta'
import wechatRules from '@chameleon-ui/themes/wechat/design-rules'
import wechatTokens from '@chameleon-ui/themes/wechat/tokens'
import type { DesignRules, ThemeId, ThemeMeta } from '@chameleon-ui/themes'

export interface ThemeBundle {
  id: ThemeId
  meta: ThemeMeta
  tokens: Record<string, unknown>
  designRules: DesignRules
}

function bundle(
  id: ThemeId,
  meta: ThemeMeta,
  tokens: Record<string, unknown>,
  designRules: DesignRules,
): ThemeBundle {
  return { id, meta, tokens, designRules }
}

export const themeBundles: Record<ThemeId, ThemeBundle> = {
  line: bundle('line', lineMeta as ThemeMeta, lineTokens, lineRules as DesignRules),
  'silver-arrow': bundle(
    'silver-arrow',
    silverArrowMeta as ThemeMeta,
    silverArrowTokens,
    silverArrowRules as DesignRules,
  ),
  stuttgart: bundle(
    'stuttgart',
    stuttgartMeta as ThemeMeta,
    stuttgartTokens,
    stuttgartRules as DesignRules,
  ),
  corsa: bundle('corsa', corsaMeta as ThemeMeta, corsaTokens, corsaRules as DesignRules),
  cupertino: bundle(
    'cupertino',
    cupertinoMeta as ThemeMeta,
    cupertinoTokens,
    cupertinoRules as DesignRules,
  ),
  siren: bundle('siren', sirenMeta as ThemeMeta, sirenTokens, sirenRules as DesignRules),
  wechat: bundle('wechat', wechatMeta as ThemeMeta, wechatTokens, wechatRules as DesignRules),
  'ant-blue': bundle(
    'ant-blue',
    antBlueMeta as ThemeMeta,
    antBlueTokens,
    antBlueRules as DesignRules,
  ),
}

export function cloneRules(rules: DesignRules): DesignRules {
  return structuredClone(rules)
}
